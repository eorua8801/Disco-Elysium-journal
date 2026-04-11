import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournalStore } from '../store/journalStore';
import { useDiceStore } from '../store/diceStore';
import { useSettingsStore } from '../store/settingsStore';
import { PageHeader } from '../components/layout/PageHeader';
import { SkillPanel } from '../components/skills/SkillPanel';
import { CheckCard } from '../components/dice/CheckCard';
import { useT } from '../i18n';
import type { SubTaskStatus } from '../types';
import './EntryPage.css';

const MOOD_COLORS: Record<string, string> = {
  hopeful: '#27ae60', neutral: '#7a7060', troubled: '#c4782a',
  numb: '#2e86ab', angry: '#c0392b', nostalgic: '#8b4fd4',
  anxious: '#d4a024', determined: '#3a8fd4',
};

function formatFullDate(iso: string, locale: 'en' | 'ko'): string {
  return new Date(iso).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function EntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, deleteEntry, regenerateComments, updateSubTaskStatus } = useJournalStore();
  const { openModal } = useDiceStore();
  const { locale } = useSettingsStore();
  const T = useT();
  const [regenerating, setRegenerating] = useState(false);

  const entry = entries.find(e => e.id === id);
  useEffect(() => { if (!entry && entries.length > 0) navigate('/'); }, [entry, entries.length, navigate]);
  if (!entry) return null;

  const handleDelete = async () => {
    if (confirm(T.entry.confirmDelete)) { await deleteEntry(entry.id); navigate('/'); }
  };
  const handleRegenerate = async () => {
    setRegenerating(true);
    await regenerateComments(entry.id);
    setRegenerating(false);
  };

  return (
    <div className="entry-page animate-page-in">
      <PageHeader
        title={entry.title || T.entry.untitled}
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
        <div className="entry-meta">
          <span className="entry-meta__date">{formatFullDate(entry.createdAt, locale)}</span>
          {entry.mood && (
            <span className="entry-meta__mood" style={{ color: MOOD_COLORS[entry.mood] ?? 'var(--amber)' }}>
              {T.editor.moods[entry.mood as keyof typeof T.editor.moods] ?? entry.mood}
            </span>
          )}
        </div>

        <motion.div
          className="entry-content-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <div className="entry-content-box__label">{T.entry.label}</div>
          <div className="entry-content">
            {entry.content.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>
        </motion.div>

        {entry.checks.length > 0 && (
          <section className="entry-section">
            <h3 className="entry-section__title">{T.entry.skillChecks}</h3>
            {entry.checks.map(check => <CheckCard key={check.id} check={check} />)}
          </section>
        )}

        {entry.tasks && entry.tasks.length > 0 && (
          <section className="entry-section entry-section--tasks">
            <h3 className="entry-section__title">{T.entry.tasks}</h3>
            {entry.tasks.map((task, ti) => (
              <div key={ti} className="entry-task">
                <div className="entry-task__header">
                  <span className="entry-task__title">{task.title}</span>
                </div>
                {task.description && (
                  <p className="entry-task__desc">{task.description}</p>
                )}
                {task.subTasks.length > 0 && (
                  <ul className="entry-task__subs">
                    {task.subTasks.map((sub, si) => (
                      <li key={si} className={`entry-subtask entry-subtask--${sub.status}`}>
                        <button
                          className="entry-subtask__status"
                          title={T.entry.subTaskStatus[sub.status]}
                          onClick={() => {
                            const cycle: SubTaskStatus[] = ['active', 'success', 'failure', 'deferred'];
                            const next = cycle[(cycle.indexOf(sub.status) + 1) % cycle.length];
                            updateSubTaskStatus(entry.id, ti, si, next);
                          }}
                        >
                          {sub.status === 'success'  ? '✓' :
                           sub.status === 'failure'  ? '✕' :
                           sub.status === 'deferred' ? '⊘' : '○'}
                        </button>
                        <span className="entry-subtask__title">{sub.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {entry.characters && entry.characters.length > 0 && (
          <section className="entry-section entry-section--characters">
            <h3 className="entry-section__title">{T.entry.characters}</h3>
            <div className="entry-characters">
              {entry.characters.map((char, ci) => (
                <div key={ci} className="entry-character">
                  <span className="entry-character__name">{char.name}</span>
                  <span className="entry-character__desc">{char.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <SkillPanel comments={entry.skillComments} animate={false} />

        <div className="entry-regen">
          <button className="entry-regen__btn" onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? T.entry.regenerating : T.entry.regenerate}
          </button>
        </div>
      </div>
    </div>
  );
}
