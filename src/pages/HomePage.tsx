import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournalStore } from '../store/journalStore';
import { EntryCard } from '../components/journal/EntryCard';
import { PageHeader } from '../components/layout/PageHeader';
import { useT } from '../i18n';
import './HomePage.css';

export function HomePage() {
  const { entries, loading, loadEntries } = useJournalStore();
  const navigate = useNavigate();
  const T = useT();

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.createdAt).toDateString() === today);
  const olderEntries = entries.filter(e => new Date(e.createdAt).toDateString() !== today);

  return (
    <div className="home-page animate-page-in">
      <PageHeader
        title={T.home.title}
        icon="◈"
        subtitle={entries.length > 0 ? T.home.entries(entries.length) : undefined}
        actions={
          <button className="home-page__new-btn btn-primary" onClick={() => navigate('/new')}>
            {T.home.newBtn}
          </button>
        }
      />

      <div className="home-page__content">
        {loading && (
          <div className="home-page__loading">{T.home.loading}</div>
        )}

        {!loading && entries.length === 0 && (
          <motion.div
            className="home-page__empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="home-page__empty-title">{T.home.emptyTitle}</p>
            <p className="home-page__empty-sub">
              {T.home.emptySub.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>
            <button className="btn-primary" onClick={() => navigate('/new')}>
              {T.home.writeFirst}
            </button>
          </motion.div>
        )}

        {todayEntries.length > 0 && (
          <section className="home-page__section">
            <h3 className="home-page__section-title">{T.home.today}</h3>
            <div className="home-page__list">
              {todayEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <EntryCard entry={entry} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {olderEntries.length > 0 && (
          <section className="home-page__section">
            {todayEntries.length > 0 && (
              <h3 className="home-page__section-title">{T.home.earlier}</h3>
            )}
            <div className="home-page__list">
              {olderEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + todayEntries.length) * 0.05 }}
                >
                  <EntryCard entry={entry} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
