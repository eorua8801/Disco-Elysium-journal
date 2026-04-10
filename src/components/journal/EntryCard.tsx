import { useNavigate } from 'react-router-dom';
import type { JournalEntry } from '../../types';
import './EntryCard.css';

const MOOD_COLORS = {
  hopeful: '#27ae60',
  neutral: '#7a7060',
  troubled: '#d4a843',
  numb: '#2e86ab',
};

const MOOD_LABELS = {
  hopeful: '◉ Hopeful',
  neutral: '◎ Neutral',
  troubled: '◈ Troubled',
  numb: '◌ Numb',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

interface EntryCardProps {
  entry: JournalEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const navigate = useNavigate();

  const preview = entry.content.slice(0, 120).trim() + (entry.content.length > 120 ? '…' : '');
  const passCount = entry.checks.filter(c => c.passed).length;
  const failCount = entry.checks.filter(c => !c.passed).length;

  return (
    <article
      className="entry-card"
      onClick={() => navigate(`/entry/${entry.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/entry/${entry.id}`)}
    >
      <div className="entry-card__meta">
        <span className="entry-card__date">{formatDate(entry.createdAt)}</span>
        <span className="entry-card__time">{formatTime(entry.createdAt)}</span>
      </div>

      <h2 className="entry-card__title">{entry.title || 'Untitled Entry'}</h2>

      {preview && <p className="entry-card__preview">{preview}</p>}

      <div className="entry-card__footer">
        {entry.mood && (
          <span
            className="entry-card__mood"
            style={{ color: MOOD_COLORS[entry.mood] }}
          >
            {MOOD_LABELS[entry.mood]}
          </span>
        )}

        <div className="entry-card__badges">
          {entry.skillComments.length > 0 && (
            <span className="entry-badge entry-badge--skill" title="Skill voices">
              ◉ {entry.skillComments.length}
            </span>
          )}
          {passCount > 0 && (
            <span className="entry-badge entry-badge--pass" title="Passed checks">
              ✓ {passCount}
            </span>
          )}
          {failCount > 0 && (
            <span className="entry-badge entry-badge--fail" title="Failed checks">
              ✗ {failCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
