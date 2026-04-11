/**
 * Capacitor plugin bridge for on-device LLM inference.
 * Native implementation: OnDeviceLLMPlugin.java (MediaPipe tasks-genai)
 * Only functional on Android. Web fallback returns safe no-ops.
 */
import { registerPlugin } from '@capacitor/core';

export interface DownloadProgressEvent {
  progress: number;    // 0–100
  downloaded: number;  // bytes so far
  total: number;       // total bytes (-1 if unknown)
}

export interface OnDeviceLLMPlugin {
  isModelDownloaded(): Promise<{ downloaded: boolean }>;
  downloadModel(): Promise<{ done: boolean }>;
  cancelModelDownload(): Promise<void>;
  deleteModel(): Promise<{ deleted: boolean }>;
  generate(options: { prompt: string }): Promise<{ text: string }>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (data: DownloadProgressEvent) => void,
  ): Promise<{ remove: () => void }>;
  removeAllListeners(): Promise<void>;
}

export const OnDeviceLLM = registerPlugin<OnDeviceLLMPlugin>('OnDeviceLLM', {
  web: () =>
    ({
      isModelDownloaded: async () => ({ downloaded: false }),
      downloadModel: async () => { throw new Error('On-device AI not available on web'); },
      cancelModelDownload: async () => {},
      deleteModel: async () => ({ deleted: false }),
      generate: async () => { throw new Error('On-device AI not available on web'); },
      addListener: async () => ({ remove: () => {} }),
      removeAllListeners: async () => {},
    } as OnDeviceLLMPlugin),
});
