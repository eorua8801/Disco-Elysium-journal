package com.discojounal.app

import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.ai.edge.litertlm.Backend
import com.google.ai.edge.litertlm.Engine
import com.google.ai.edge.litertlm.EngineConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.atomic.AtomicBoolean

/**
 * On-device LLM inference via Google LiteRT-LM.
 * Downloads Gemma 4 E2B (~2.58 GB) on first use; subsequent calls run fully offline.
 *
 * Model: litert-community/gemma-4-E2B-it-litert-lm on HuggingFace
 * API:   com.google.ai.edge.litertlm (replaces deprecated mediapipe:tasks-genai)
 */
@CapacitorPlugin(name = "OnDeviceLLM")
class OnDeviceLLMPlugin : Plugin() {

    companion object {
        private const val TAG = "OnDeviceLLM"
        private const val MODEL_FILENAME = "gemma-4-E2B-it.litertlm"
        private const val MODEL_URL =
            "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it.litertlm"
    }

    private var engine: Engine? = null
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val cancelDownload = AtomicBoolean(false)

    private fun modelFile() = File(context.filesDir, MODEL_FILENAME)

    // -------------------------------------------------------------------------

    @PluginMethod
    fun isModelDownloaded(call: PluginCall) {
        call.resolve(JSObject().apply { put("downloaded", modelFile().exists()) })
    }

    @PluginMethod
    fun downloadModel(call: PluginCall) {
        call.setKeepAlive(true)
        cancelDownload.set(false)

        scope.launch {
            val modelFile = modelFile()
            if (modelFile.exists()) {
                call.resolve(JSObject().apply { put("done", true) })
                return@launch
            }

            val tempFile = File(context.filesDir, "$MODEL_FILENAME.tmp")
            try {
                val conn = (URL(MODEL_URL).openConnection() as HttpURLConnection).apply {
                    connectTimeout = 30_000
                    readTimeout   = 60_000
                    setRequestProperty("User-Agent", "DiscoJournal/1.0")
                    connect()
                }

                val fileSize = conn.contentLengthLong

                conn.inputStream.use { input ->
                    FileOutputStream(tempFile).use { output ->
                        val buffer = ByteArray(131_072) // 128 KB
                        var downloaded = 0L
                        var lastPercent = -1
                        var n: Int
                        while (input.read(buffer).also { n = it } != -1) {
                            if (cancelDownload.get()) {
                                tempFile.delete()
                                call.reject("cancelled")
                                return@launch
                            }
                            output.write(buffer, 0, n)
                            downloaded += n
                            val percent = if (fileSize > 0) (downloaded * 100L / fileSize).toInt() else -1
                            if (percent in 0..100 && percent != lastPercent) {
                                lastPercent = percent
                                notifyListeners("downloadProgress", JSObject().apply {
                                    put("progress",   percent)
                                    put("downloaded", downloaded)
                                    put("total",      fileSize)
                                })
                            }
                        }
                    }
                }

                if (!tempFile.renameTo(modelFile)) {
                    tempFile.delete()
                    call.reject("Failed to save model file")
                    return@launch
                }

                call.resolve(JSObject().apply { put("done", true) })

            } catch (e: Exception) {
                Log.e(TAG, "Download failed", e)
                tempFile.delete()
                call.reject("Download failed: ${e.message}")
            }
        }
    }

    @PluginMethod
    fun cancelModelDownload(call: PluginCall) {
        cancelDownload.set(true)
        call.resolve()
    }

    @PluginMethod
    fun deleteModel(call: PluginCall) {
        try { engine?.close() } catch (_: Exception) {}
        engine = null
        call.resolve(JSObject().apply { put("deleted", modelFile().delete()) })
    }

    @PluginMethod
    fun generate(call: PluginCall) {
        val prompt = call.getString("prompt")
        if (prompt.isNullOrEmpty()) {
            call.reject("prompt required")
            return
        }

        scope.launch {
            try {
                // Lazy-init — keep Engine alive between calls (model loading ~5-10 s)
                if (engine == null) {
                    val file = modelFile()
                    if (!file.exists()) {
                        call.reject("Model not downloaded")
                        return@launch
                    }
                    // Try GPU first; fall back to CPU if hardware support is unavailable
                    engine = try {
                        Engine(EngineConfig(
                            modelPath = file.absolutePath,
                            backend   = Backend.GPU(),
                            cacheDir  = context.cacheDir.path,
                        )).also { it.initialize() }
                    } catch (gpuErr: Exception) {
                        Log.w(TAG, "GPU backend unavailable, retrying with CPU: ${gpuErr.message}")
                        Engine(EngineConfig(
                            modelPath = file.absolutePath,
                            backend   = Backend.CPU(),
                            cacheDir  = context.cacheDir.path,
                        )).also { it.initialize() }
                    }
                    Log.i(TAG, "LiteRT-LM engine ready (Gemma 4 E2B)")
                }

                // New conversation per call — no multi-turn state needed for skill voices
                val response = StringBuilder()
                engine!!.createConversation().use { conversation ->
                    conversation.sendMessageAsync(prompt).collect { token ->
                        response.append(token)
                    }
                }

                call.resolve(JSObject().apply { put("text", response.toString().trim()) })

            } catch (e: Exception) {
                Log.e(TAG, "Generate failed", e)
                call.reject("Generate failed: ${e.message}")
            }
        }
    }
}
