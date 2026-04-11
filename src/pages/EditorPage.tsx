import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournalStore } from '../store/journalStore';
import { useDiceStore } from '../store/diceStore';
import { playClick } from '../utils/sounds';
import { useT } from '../i18n';
import type { MoodTag as Mood } from '../types';
import './EditorPage.css';

const MOOD_VALUES: Mood[] = ['hopeful', 'neutral', 'troubled', 'numb'];
const MOOD_COLORS: Partial<Record<Mood, string>> = {
  hopeful:  '#27ae60',
  neutral:  '#7a7060',
  troubled: '#d4a843',
  numb:     '#2e86ab',
};

export function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { entries, createEntry, updateEntry } = useJournalStore();
  const { openModal } = useDiceStore();
  const T = useT();

  const existing = id ? entries.find(e => e.id === id) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [mood, setMood] = useState<Mood | undefined>(existing?.mood ?? undefined);
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
          {T.editor.cancel}
        </button>

        <div className="editor-header__meta">
          {wordCount > 0 && (
            <span className="editor-word-count">{T.editor.words(wordCount)}</span>
          )}
        </div>

        <div className="editor-header__actions">
          <button
            className="editor-header__dice"
            onClick={handleDiceRoll}
            title={T.editor.rollCheck}
          >
            ⚄
          </button>
          <button
            className={`editor-header__save ${saving ? 'editor-header__save--saving' : ''}`}
            onClick={handleSave}
            disabled={saving || !content.trim()}
          >
            {saving ? T.editor.saving : T.editor.save}
          </button>
        </div>
      </header>

      <div className="editor-body">
        {/* Mood selector */}
        <div className="editor-mood">
          {MOOD_VALUES.map(m => (
            <button
              key={m}
              className={`mood-btn ${mood === m ? 'mood-btn--active' : ''}`}
              style={{ '--mood-color': MOOD_COLORS[m] } as React.CSSProperties}
              onClick={() => setMood(prev => prev === m ? undefined : m)}
            >
              {T.editor.moods[m]}
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
          placeholder={T.editor.placeholder}
          autoFocus={!existing}
        />
      </div>

      <button
        className="editor-float-dice"
        onClick={handleDiceRoll}
        aria-label={T.editor.rollCheck}
        title={T.editor.rollCheck}
      >
        ⚄
      </button>
    </div>
  );
}
