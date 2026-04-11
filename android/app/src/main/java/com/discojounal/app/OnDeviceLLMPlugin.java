package com.discojounal.app;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.mediapipe.tasks.genai.llminference.LlmInference;
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * On-device LLM inference via Google MediaPipe tasks-genai.
 * Downloads Gemma 3 1B INT4 (~700 MB) on first use; subsequent
 * calls run fully offline using the cached model file.
 *
 * Model URL: update MODEL_URL below if Google changes the hosting path.
 * Verified source: https://huggingface.co/google/gemma-3-1b-it-litert-lm
 */
@CapacitorPlugin(name = "OnDeviceLLM")
public class OnDeviceLLMPlugin extends Plugin {

    private static final String TAG = "OnDeviceLLM";
    private static final String MODEL_FILENAME = "gemma3-1b-it-int4.task";
    // Gemma 3 1B IT INT4 (≈ 700 MB) — update version path if a newer release is preferred
    private static final String MODEL_URL =
        "https://huggingface.co/google/gemma-3-1b-it-litert-lm/resolve/main/gemma3_1b_it_int4.task";

    private LlmInference llmInference = null;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final AtomicBoolean cancelDownload = new AtomicBoolean(false);

    // -------------------------------------------------------------------------

    private File getModelFile() {
        return new File(getContext().getFilesDir(), MODEL_FILENAME);
    }

    // -------------------------------------------------------------------------
    // Plugin methods
    // -------------------------------------------------------------------------

    @PluginMethod
    public void isModelDownloaded(PluginCall call) {
        JSObject result = new JSObject();
        result.put("downloaded", getModelFile().exists());
        call.resolve(result);
    }

    @PluginMethod
    public void downloadModel(PluginCall call) {
        // Keep the call alive so we can stream progress events before resolving.
        call.setKeepAlive(true);
        cancelDownload.set(false);

        executor.execute(() -> {
            File modelFile = getModelFile();
            if (modelFile.exists()) {
                JSObject result = new JSObject();
                result.put("done", true);
                call.resolve(result);
                return;
            }

            File tempFile = new File(getContext().getFilesDir(), MODEL_FILENAME + ".tmp");
            try {
                URL url = new URL(MODEL_URL);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(30_000);
                conn.setReadTimeout(60_000);
                conn.setRequestProperty("User-Agent", "DiscoJournal/1.0");
                conn.connect();

                long fileSize = conn.getContentLengthLong();

                try (InputStream in = conn.getInputStream();
                     FileOutputStream out = new FileOutputStream(tempFile)) {

                    byte[] buffer = new byte[131_072]; // 128 KB chunks
                    long downloaded = 0;
                    int n;
                    int lastPercent = -1;

                    while ((n = in.read(buffer)) != -1) {
                        if (cancelDownload.get()) {
                            tempFile.delete();
                            call.reject("cancelled");
                            return;
                        }
                        out.write(buffer, 0, n);
                        downloaded += n;
                        int percent = fileSize > 0 ? (int) (downloaded * 100L / fileSize) : -1;
                        if (percent >= 0 && percent != lastPercent) {
                            lastPercent = percent;
                            JSObject progress = new JSObject();
                            progress.put("progress", percent);
                            progress.put("downloaded", downloaded);
                            progress.put("total", fileSize);
                            notifyListeners("downloadProgress", progress);
                        }
                    }
                }

                if (!tempFile.renameTo(modelFile)) {
                    tempFile.delete();
                    call.reject("Failed to save model file");
                    return;
                }

                JSObject result = new JSObject();
                result.put("done", true);
                call.resolve(result);

            } catch (Exception e) {
                Log.e(TAG, "Download failed", e);
                tempFile.delete();
                call.reject("Download failed: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void cancelModelDownload(PluginCall call) {
        cancelDownload.set(true);
        call.resolve();
    }

    @PluginMethod
    public void deleteModel(PluginCall call) {
        if (llmInference != null) {
            try { llmInference.close(); } catch (Exception ignored) {}
            llmInference = null;
        }
        boolean deleted = getModelFile().delete();
        JSObject result = new JSObject();
        result.put("deleted", deleted);
        call.resolve(result);
    }

    @PluginMethod
    public void generate(PluginCall call) {
        String prompt = call.getString("prompt");
        if (prompt == null || prompt.isEmpty()) {
            call.reject("prompt required");
            return;
        }

        executor.execute(() -> {
            try {
                // Lazy-initialise the inference engine; keep it alive between calls
                if (llmInference == null) {
                    File modelFile = getModelFile();
                    if (!modelFile.exists()) {
                        call.reject("Model not downloaded");
                        return;
                    }
                    LlmInferenceOptions options = LlmInferenceOptions.builder()
                        .setModelPath(modelFile.getAbsolutePath())
                        .setMaxTokens(128)
                        .setTopK(40)
                        .setTemperature(0.85f)
                        .setRandomSeed(0)
                        .build();
                    llmInference = LlmInference.createFromOptions(getContext(), options);
                    Log.i(TAG, "LlmInference engine loaded from " + modelFile.getAbsolutePath());
                }

                String text = llmInference.generateResponse(prompt);
                JSObject result = new JSObject();
                result.put("text", text.trim());
                call.resolve(result);

            } catch (Exception e) {
                Log.e(TAG, "Generate failed", e);
                // Do NOT close llmInference on failure — it may recover.
                call.reject("Generate failed: " + e.getMessage());
            }
        });
    }
}
