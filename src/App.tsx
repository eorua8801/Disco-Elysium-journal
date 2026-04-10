import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { EntryPage } from './pages/EntryPage';
import { SkillsPage } from './pages/SkillsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useSettingsStore } from './store/settingsStore';

function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<EditorPage />} />
        <Route path="/edit/:id" element={<EditorPage />} />
        <Route path="/entry/:id" element={<EntryPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  const { loadSettings, scanlines } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Apply scanlines setting on mount
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--scanline-opacity',
      scanlines ? '0.025' : '0'
    );
  }, [scanlines]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
