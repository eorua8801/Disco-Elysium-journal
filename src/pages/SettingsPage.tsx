import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { PageHeader } from '../components/layout/PageHeader';
import { useT } from '../i18n';
import './SettingsPage.css';

export function SettingsPage() {
  const {
    ollamaEnabled, ollamaUrl, ollamaModel, locale, scanlines,
    loadSettings, setOllamaEnabled, setOllamaUrl, setOllamaModel,
    setLocale, setScanlines,
  } = useSettingsStore();
  const T = useT();

  useEffect(() => { loadSettings(); }, [loadSettings]);

  return (
    <div className="settings-page animate-page-in">
      <PageHeader title={T.settings.title} subtitle={T.settings.subtitle} />

      <div className="settings-page__body">

        {/* AI / Ollama */}
        <section className="settings-section">
          <h3 className="settings-section__title">{T.settings.aiTitle}</h3>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">{T.settings.enableOllama}</span>
              <span className="settings-row__desc">{T.settings.ollamaDesc}</span>
            </div>
            <button
              className={`settings-toggle ${ollamaEnabled ? 'settings-toggle--on' : ''}`}
              onClick={() => setOllamaEnabled(!ollamaEnabled)}
              aria-pressed={ollamaEnabled}
            >
              {ollamaEnabled ? T.settings.on : T.settings.off}
            </button>
          </div>

          {ollamaEnabled && (
            <>
              <div className="settings-row settings-row--field">
                <label className="settings-row__label">{T.settings.ollamaUrl}</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={e => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="settings-input"
                />
              </div>

              <div className="settings-row settings-row--field">
                <label className="settings-row__label">{T.settings.model}</label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={e => setOllamaModel(e.target.value)}
                  placeholder="gemma4:1b"
                  className="settings-input"
                />
                <span className="settings-row__hint">{T.settings.modelHint}</span>
              </div>
            </>
          )}

          {!ollamaEnabled && (
            <p className="settings-note">{T.settings.templatesNote}</p>
          )}
        </section>

        {/* Display */}
        <section className="settings-section">
          <h3 className="settings-section__title">{T.settings.displayTitle}</h3>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">{T.settings.scanlines}</span>
              <span className="settings-row__desc">{T.settings.scanlinesDesc}</span>
            </div>
            <button
              className={`settings-toggle ${scanlines ? 'settings-toggle--on' : ''}`}
              onClick={() => setScanlines(!scanlines)}
              aria-pressed={scanlines}
            >
              {scanlines ? T.settings.on : T.settings.off}
            </button>
          </div>
        </section>

        {/* Language */}
        <section className="settings-section">
          <h3 className="settings-section__title">{T.settings.langTitle}</h3>

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
            >
              한국어
            </button>
          </div>
        </section>

        {/* About */}
        <section className="settings-section">
          <h3 className="settings-section__title">{T.settings.aboutTitle}</h3>
          <p className="settings-note">{T.settings.aboutNote}</p>
          <p className="settings-note settings-note--dim">{T.settings.aboutFan}</p>
        </section>

      </div>
    </div>
  );
}
