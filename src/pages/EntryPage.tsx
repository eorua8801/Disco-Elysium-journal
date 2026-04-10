import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournalStore } from '../store/journalStore';
import { useDiceStore } from '../store/diceStore';
import { PageHeader } from '../components/layout/PageHeader';
import { SkillPanel } from '../components/skills/SkillPanel';
import { CheckCard } from '../components/dice/CheckCard';
import './EntryPage.css';

const MOOD_COLORS: Record<string, string> = {
  hopeful: '#27ae60', neutral: '#7a7060', troubled: '#c4782a',
  numb: '#2e86ab', angry: '#c0392b', nostalgic: '#8b4fd4',
  anxious: '#d4a024', determined: '#3a8fd4',
};

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function EntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, deleteEntry, regenerateComments } = useJournalStore();
  const { openModal } = useDiceStore();
  const [regenerating, setRegenerating] = useState(false);

  const entry = entries.find(e => e.id === id);
  useEffect(() => { if (!entry && entries.length > 0) navigate('/'); }, [entry, entries.length, navigate]);
  if (!entry) return null;

  const handleDelete = async () => {
    if (confirm('Delete this entry?')) { await deleteEntry(entry.id); navigate('/'); }
  };
  const handleRegenerate = async () => {
    setRegenerating(true);
    await regenerateComments(entry.id);
    setRegenerating(false);
  };

  return (
    <div className="entry-page animate-page-in">
      <PageHeader
        title={entry.title || 'Untitled Entry'}
        icon="◈"
        backPath="/"
        actions={
          <div className="entry-page__header-actions">
            <button className="entry-action-btn" onClick={() => navigate(`/edit/${entry.id}`)} title="Edit">✎</button>
            <button className="entry-action-btn entry-action-btn--dice" onClick={() => openModal(entry.id)} title="Roll check">⚄</button>
            <button className="entry-action-btn entry-action-btn--danger" onClick={handleDelete} title="Delete">✕</button>
          </div>
        }
      />

      <div className="entry-page__body">
        {/* Meta fields — Case Files style */}
        <div className="entry-meta">
          <span className="entry-meta__date">{formatFullDate(entry.createdAt)}</span>
          {entry.mood && (
            <span className="entry-meta__mood" style={{ color: MOOD_COLORS[entry.mood] ?? 'var(--amber)' }}>
              {entry.mood}
            </span>
          )}
        </div>

        {/* Body content in amber-bordered box */}
        <motion.div
          className="entry-content-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <div className="entry-content-box__label">Entry</div>
          <div className="entry-content">
            {entry.content.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>
        </motion.div>

        {/* Skill Checks */}
        {entry.checks.length > 0 && (
          <section className="entry-section">
            <h3 className="entry-section__title">⚄ Skill Checks</h3>
            {entry.checks.map(check => <CheckCard key={check.id} check={check} />)}
          </section>
        )}

        {/* Skill Voices */}
        <SkillPanel comments={entry.skillComments} animate={false} />

        {/* Regenerate */}
        <div className="entry-regen">
          <button className="entry-regen__btn" onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? 'Generating…' : '↻ Regenerate voices'}
          </button>
        </div>
      </div>
    </div>
  );
}
