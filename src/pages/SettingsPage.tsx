import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { PageHeader } from '../components/layout/PageHeader';
import './SettingsPage.css';

export function SettingsPage() {
  const {
    ollamaEnabled, ollamaUrl, ollamaModel, locale, scanlines,
    loadSettings, setOllamaEnabled, setOllamaUrl, setOllamaModel,
    setLocale, setScanlines,
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <div className="settings-page animate-page-in">
      <PageHeader title="Settings" subtitle="Configure the journal" />

      <div className="settings-page__body">

        {/* AI / Ollama */}
        <section className="settings-section">
          <h3 className="settings-section__title">AI Skill Voices</h3>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">Enable Ollama</span>
              <span className="settings-row__desc">
                Use a local LLM to generate dynamic skill comments instead of templates.
                Requires Ollama running at the configured URL.
              </span>
            </div>
            <button
              className={`settings-toggle ${ollamaEnabled ? 'settings-toggle--on' : ''}`}
              onClick={() => setOllamaEnabled(!ollamaEnabled)}
              aria-pressed={ollamaEnabled}
            >
              {ollamaEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {ollamaEnabled && (
            <>
              <div className="settings-row settings-row--field">
                <label className="settings-row__label">Ollama URL</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={e => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="settings-input"
                />
              </div>

              <div className="settings-row settings-row--field">
                <label className="settings-row__label">Model</label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={e => setOllamaModel(e.target.value)}
                  placeholder="phi3:mini"
                  className="settings-input"
                />
                <span className="settings-row__hint">
                  Recommended: phi3:mini, llama3.2:1b, mistral:7b
                </span>
              </div>
            </>
          )}

          {!ollamaEnabled && (
            <p className="settings-note">
              Skill voices will use hand-crafted templates.
              Enable Ollama for AI-generated commentary.
            </p>
          )}
        </section>

        {/* Display */}
        <section className="settings-section">
          <h3 className="settings-section__title">Display</h3>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">Scanlines</span>
              <span className="settings-row__desc">CRT scanline overlay effect</span>
            </div>
            <button
              className={`settings-toggle ${scanlines ? 'settings-toggle--on' : ''}`}
              onClick={() => setScanlines(!scanlines)}
              aria-pressed={scanlines}
            >
              {scanlines ? 'ON' : 'OFF'}
            </button>
          </div>
        </section>

        {/* Language */}
        <section className="settings-section">
          <h3 className="settings-section__title">Language</h3>

          <div className="settings-lang">
            <button
              className={`lang-btn ${locale === 'en' ? 'lang-btn--active' : ''}`}
              onClick={() => setLocale('en')}
            >
              English
            </button>
            <button
              className={`lang-btn ${locale === 'ko' ? 'lang-btn--active' : ''}`}
              onClick={() => setLocale('ko')}
              title="Korean localization coming soon"
            >
              한국어
              <span className="lang-btn__soon">Soon</span>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="settings-section">
          <h3 className="settings-section__title">About</h3>
          <p className="settings-note">
            Disco Journal — A journal app inspired by the skill system of Disco Elysium.
            All entries are stored locally in your browser's IndexedDB.
          </p>
          <p className="settings-note settings-note--dim">
            Disco Elysium is a game by ZA/UM. This is a fan project.
          </p>
        </section>

      </div>
    </div>
  );
}
