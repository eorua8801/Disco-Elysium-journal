import { create } from 'zustand';
import { getAllSettings, setSetting } from '../db/indexedDB';

interface SettingsStore {
  // AppSettings fields (inlined to avoid Zustand 5.x type-inference issues with extends)
  ollamaEnabled: boolean;
  ollamaUrl: string;
  ollamaModel: string;
  activeSkills: string[];
  scanlines: boolean;
  locale: 'en' | 'ko';
  onDeviceEnabled: boolean;
  geminiEnabled: boolean;
  geminiApiKey: string;
  geminiModel: string;
  // Store-specific fields
  loaded: boolean;
  loadSettings: () => Promise<void>;
  setOllamaEnabled: (v: boolean) => void;
  setOllamaUrl: (v: string) => void;
  setOllamaModel: (v: string) => void;
  setActiveSkills: (ids: string[]) => void;
  setLocale: (v: 'en' | 'ko') => void;
  setScanlines: (v: boolean) => void;
  setOnDeviceEnabled: (v: boolean) => void;
  setGeminiEnabled: (v: boolean) => void;
  setGeminiApiKey: (v: string) => void;
  setGeminiModel: (v: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  loaded: false,
  ollamaEnabled: false,
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'gemma4:1b',
  activeSkills: [],
  locale: 'en',
  scanlines: true,
  onDeviceEnabled: false,
  geminiEnabled: false,
  geminiApiKey: '',
  geminiModel: 'gemini-2.0-flash',

  loadSettings: async () => {
    const s = await getAllSettings();
    set({ ...s, loaded: true });
  },

  setOllamaEnabled: (v) => {
    set({ ollamaEnabled: v });
    setSetting('ollamaEnabled', v);
  },

  setOllamaUrl: (v) => {
    set({ ollamaUrl: v });
    setSetting('ollamaUrl', v);
  },

  setOllamaModel: (v) => {
    set({ ollamaModel: v });
    setSetting('ollamaModel', v);
  },

  setActiveSkills: (ids) => {
    set({ activeSkills: ids });
    setSetting('activeSkills', ids);
  },

  setLocale: (v) => {
    set({ locale: v });
    setSetting('locale', v);
  },

  setScanlines: (v) => {
    set({ scanlines: v });
    setSetting('scanlines', v);
    // Apply immediately to root element
    document.documentElement.style.setProperty(
      '--scanline-opacity',
      v ? '0.025' : '0'
    );
  },

  setOnDeviceEnabled: (v) => {
    set({ onDeviceEnabled: v });
    setSetting('onDeviceEnabled', v);
  },

  setGeminiEnabled: (v) => {
    set({ geminiEnabled: v });
    setSetting('geminiEnabled', v);
  },

  setGeminiApiKey: (v) => {
    set({ geminiApiKey: v });
    setSetting('geminiApiKey', v);
  },

  setGeminiModel: (v) => {
    set({ geminiModel: v });
    setSetting('geminiModel', v);
  },
}));
