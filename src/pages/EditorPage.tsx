import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournalStore } from '../store/journalStore';
import { useDiceStore } from '../store/diceStore';
import { playClick } from '../utils/sounds';
import type { Mood } from '../types';
import './EditorPage.css';

const MOODS: { value: Mood; label: string; color: string }[] = [
  { value: 'hopeful', label: 'Hopeful', color: '#27ae60' },
  { value: 'neutral', label: 'Neutral', color: '#7a7060' },
  { value: 'troubled', label: 'Troubled', color: '#d4a843' },
  { value: 'numb', label: 'Numb', color: '#2e86ab' },
];

export function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { entries, createEntry, updateEntry } = useJournalStore();
  const { openModal } = useDiceStore();

  const existing = id ? entries.find(e => e.id === id) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [mood, setMood] = useState<Mood | undefined>(existing?.mood);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [content]);

  const handleSave = async () => {
    if (!content.trim()) return;
    playClick();
    setSaving(true);
    try {
      if (existing) {
        await updateEntry(existing.id, { title, content, mood });
        navigate(`/entry/${existing.id}`);
      } else {
        const entry = await createEntry({
          title: title || formatAutoTitle(),
          content,
          mood,
          tags: [],
        });
        navigate(`/entry/${entry.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDiceRoll = async () => {
    playClick();
    // Save as draft first if new entry, to have an ID to attach the check
    if (!existing && content.trim()) {
      setSaving(true);
      const entry = await createEntry({
        title: title || formatAutoTitle(),
        content,
        mood,
        tags: [],
      });
      setSavedId(entry.id);
      setSaving(false);
      openModal(entry.id);
    } else if (existing) {
      openModal(existing.id);
    } else {
      openModal('');
    }
  };

  function formatAutoTitle(): string {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="editor-page animate-page-in">
      <header className="editor-header">
        <button
          className="editor-header__cancel"
          onClick={() => {
            playClick();
            if (savedId) navigate(`/entry/${savedId}`);
            else if (existing) navigate(`/entry/${existing.id}`);
            else navigate('/');
          }}
        >
          ← Cancel
        </button>

        <div className="editor-header__meta">
          {wordCount > 0 && (
            <span className="editor-word-count">{wordCount} words</span>
          )}
        </div>

        <div className="editor-header__actions">
          <button
            className="editor-header__dice"
            onClick={handleDiceRoll}
            title="Roll a skill check"
          >
            ⚄
          </button>
          <button
            className={`editor-header__save ${saving ? 'editor-header__save--saving' : ''}`}
            onClick={handleSave}
            disabled={saving || !content.trim()}
          >
            {saving ? '…' : 'Save'}
          </button>
        </div>
      </header>

      <div className="editor-body">
        {/* Mood selector */}
        <div className="editor-mood">
          {MOODS.map(m => (
            <button
              key={m.value}
              className={`mood-btn ${mood === m.value ? 'mood-btn--active' : ''}`}
              style={{ '--mood-color': m.color } as React.CSSProperties}
              onClick={() => setMood(prev => prev === m.value ? undefined : m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <input
          className="editor-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={formatAutoTitle()}
        />

        <textarea
          ref={textareaRef}
          className="editor-content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What happened? What did you feel? What are you trying to understand?"
          autoFocus={!existing}
        />
      </div>

      {/* Floating dice button for quick access during writing */}
      <button
        className="editor-float-dice"
        onClick={handleDiceRoll}
        aria-label="Roll skill check"
        title="Roll a skill check"
      >
        ⚄
      </button>
    </div>
  );
}
