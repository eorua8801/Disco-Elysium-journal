import { useNavigate } from 'react-router-dom';
import type { JournalEntry } from '../../types';
import './EntryCard.css';

const MOOD_COLORS: Record<string, string> = {
  hopeful:   '#27ae60',
  neutral:   '#7a7060',
  troubled:  '#c4782a',
  numb:      '#2e86ab',
  angry:     '#c0392b',
  nostalgic: '#8b4fd4',
  anxious:   '#d4a024',
  determined:'#3a8fd4',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function EntryCard({ entry }: { entry: JournalEntry }) {
  const navigate = useNavigate();
  const preview = entry.content.slice(0, 100).trim() + (entry.content.length > 100 ? '…' : '');
  const moodColor = entry.mood ? MOOD_COLORS[entry.mood] : undefined;

  return (
    <article
      className="entry-card"
      onClick={() => navigate(`/entry/${entry.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/entry/${entry.id}`)}
    >
      {/* Left mood strip */}
      {moodColor && (
        <span className="entry-card__mood-strip" style={{ background: moodColor }} />
      )}

      <div className="entry-card__body">
        {/* Top: date + time */}
        <div className="entry-card__meta">
          <span className="entry-card__date">{formatDate(entry.createdAt)}</span>
          <span className="entry-card__time">{formatTime(entry.createdAt)}</span>
        </div>

        {/* Title */}
        <h2 className="entry-card__title">{entry.title || 'Untitled Entry'}</h2>

        {/* Preview text */}
        {preview && <p className="entry-card__preview">{preview}</p>}
      </div>

      {/* Right: play button (amber square — like game's ▶ button) */}
      <div className="entry-card__play">
        <span>▶</span>
        {/* badges below play button */}
        <div className="entry-card__badges">
          {entry.skillComments.length > 0 && (
            <span className="entry-badge" title="Skill voices" style={{ color: 'var(--intellect)' }}>
              ◉{entry.skillComments.length}
            </span>
          )}
          {entry.checks.length > 0 && (
            <span className="entry-badge" title="Checks" style={{ color: entry.checks.some(c => !c.passed) ? 'var(--accent-red)' : 'var(--amber)' }}>
              ⚄{entry.checks.length}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
