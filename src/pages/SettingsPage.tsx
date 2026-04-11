import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { useSettingsStore } from '../store/settingsStore';
import { PageHeader } from '../components/layout/PageHeader';
import { useT } from '../i18n';
import { OnDeviceLLM } from '../plugins/OnDeviceLLM';
import './SettingsPage.css';

export function SettingsPage() {
  const {
    ollamaEnabled, ollamaUrl, ollamaModel, locale, scanlines, onDeviceEnabled,
    loadSettings, setOllamaEnabled, setOllamaUrl, setOllamaModel,
    setLocale, setScanlines, setOnDeviceEnabled,
  } = useSettingsStore();
  const T = useT();

  const isNative = Capacitor.isNativePlatform();
  const [modelDownloaded, setModelDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadPct, setDownloadPct] = useState(0);

  const checkModelStatus = useCallback(async () => {
    if (!isNative) return;
    try {
      const { downloaded } = await OnDeviceLLM.isModelDownloaded();
      setModelDownloaded(downloaded);
    } catch {}
  }, [isNative]);

  useEffect(() => {
    loadSettings();
    checkModelStatus();
  }, [loadSettings, checkModelStatus]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadPct(0);
    const listener = await OnDeviceLLM.addListener('downloadProgress', ({ progress }) => {
      setDownloadPct(progress);
    });
    try {
      await OnDeviceLLM.downloadModel();
      setModelDownloaded(true);
    } catch (e: unknown) {
      if ((e as Error)?.message !== 'cancelled') {
        alert('Download failed. Check your internet connection and try again.');
      }
    } finally {
      listener.remove();
      setIsDownloading(false);
    }
  };

  const handleCancelDownload = async () => {
    await OnDeviceLLM.cancelModelDownload();
    setIsDownloading(false);
  };

  const handleDeleteModel = async () => {
    if (!confirm('Delete the downloaded model? You will need to re-download it (~700 MB).')) return;
    await OnDeviceLLM.deleteModel();
    setModelDownloaded(false);
    if (onDeviceEnabled) setOnDeviceEnabled(false);
  };

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

          {!ollamaEnabled && !onDeviceEnabled && (
            <p className="settings-note">{T.settings.templatesNote}</p>
          )}
        </section>

        {/* On-Device AI (Android only) */}
        {isNative && (
          <section className="settings-section">
            <h3 className="settings-section__title">{T.settings.onDeviceTitle}</h3>

            <div className="settings-row">
              <div className="settings-row__info">
                <span className="settings-row__label">{T.settings.onDeviceDesc}</span>
              </div>
              <button
                className={`settings-toggle ${onDeviceEnabled ? 'settings-toggle--on' : ''}`}
                onClick={() => setOnDeviceEnabled(!onDeviceEnabled)}
                disabled={!modelDownloaded && !onDeviceEnabled}
                aria-pressed={onDeviceEnabled}
              >
                {onDeviceEnabled ? T.settings.on : T.settings.off}
              </button>
            </div>

            <div className="settings-row settings-row--model-status">
              <span className="settings-row__label">
                {modelDownloaded ? T.settings.modelStatusReady : T.settings.modelStatus}
              </span>

              {!modelDownloaded && !isDownloading && (
                <button className="settings-btn settings-btn--download" onClick={handleDownload}>
                  {T.settings.downloadModel}
                </button>
              )}

              {isDownloading && (
                <div className="settings-download-progress">
                  <div className="settings-download-bar">
                    <div className="settings-download-fill" style={{ width: `${downloadPct}%` }} />
                  </div>
                  <span className="settings-download-label">{T.settings.downloading(downloadPct)}</span>
                  <button className="settings-btn settings-btn--cancel" onClick={handleCancelDownload}>
                    {T.settings.cancelDownload}
                  </button>
                </div>
              )}

              {modelDownloaded && (
                <button className="settings-btn settings-btn--danger" onClick={handleDeleteModel}>
                  {T.settings.deleteModel}
                </button>
              )}
            </div>

            <p className="settings-note settings-note--dim">{T.settings.onDeviceNote}</p>
          </section>
        )}

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
