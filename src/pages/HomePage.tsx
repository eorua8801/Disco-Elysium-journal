import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournalStore } from '../store/journalStore';
import { EntryCard } from '../components/journal/EntryCard';
import { PageHeader } from '../components/layout/PageHeader';
import './HomePage.css';

export function HomePage() {
  const { entries, loading, loadEntries } = useJournalStore();
  const navigate = useNavigate();

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.createdAt).toDateString() === today);
  const olderEntries = entries.filter(e => new Date(e.createdAt).toDateString() !== today);

  return (
    <div className="home-page animate-page-in">
      <PageHeader
        title="Disco Journal"
        icon="◈"
        subtitle={entries.length > 0 ? `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}` : undefined}
        actions={
          <button className="home-page__new-btn btn-primary" onClick={() => navigate('/new')}>
            ⊕ New
          </button>
        }
      />

      <div className="home-page__content">
        {loading && (
          <div className="home-page__loading">Loading entries…</div>
        )}

        {!loading && entries.length === 0 && (
          <motion.div
            className="home-page__empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="home-page__empty-title">The journal is empty.</p>
            <p className="home-page__empty-sub">
              What happened today?<br />Your skills are waiting to weigh in.
            </p>
            <button className="btn-primary" onClick={() => navigate('/new')}>
              Write first entry ✦
            </button>
          </motion.div>
        )}

        {todayEntries.length > 0 && (
          <section className="home-page__section">
            <h3 className="home-page__section-title">◈ Today</h3>
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
              <h3 className="home-page__section-title">◎ Earlier</h3>
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
