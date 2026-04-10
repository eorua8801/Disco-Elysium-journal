import { create } from 'zustand';
import type { AppSettings } from '../types';
import { getAllSettings, setSetting } from '../db/indexedDB';

interface SettingsStore extends AppSettings {
  loaded: boolean;
  loadSettings: () => Promise<void>;
  setOllamaEnabled: (v: boolean) => void;
  setOllamaUrl: (v: string) => void;
  setOllamaModel: (v: string) => void;
  setActiveSkills: (ids: string[]) => void;
  setLocale: (v: 'en' | 'ko') => void;
  setScanlines: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  loaded: false,
  ollamaEnabled: false,
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'phi3:mini',
  activeSkills: [],
  locale: 'en',
  scanlines: true,

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
}));
