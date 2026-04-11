import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useDiceStore } from '../../store/diceStore';
import { useJournalStore } from '../../store/journalStore';
import { FilmStrip } from './FilmStrip';
import { SKILLS, SKILLS_BY_ID, DIFFICULTY_LABELS } from '../../data/skills';
import { createCheck, DIFFICULTY_PRESETS, getResultDescription } from '../../utils/diceEngine';
import { suggestCheckParameters } from '../../utils/skillMatcher';
import { playClick, startFilmWind, stopFilmWind, playShutter } from '../../utils/sounds';
import { useT } from '../../i18n';
import './DiceModal.css';

export function DiceModal() {
  const {
    isOpen, phase, skillId, difficulty, roll, total, passed,
    pendingEntryId, closeModal, setSetup, startRoll, finishRoll, reset,
  } = useDiceStore();

  const { attachCheck } = useJournalStore();

  const [localDesc, setLocalDesc] = useState('');
  const [localSkill, setLocalSkill] = useState(skillId);
  const [localDiff, setLocalDiff] = useState(difficulty);
  const [rollKey, setRollKey] = useState(0);
  const stripsDoneRef = useRef(0);
  const T = useT();

  // Start/stop film wind sound with rolling phase
  useEffect(() => {
    if (phase === 'rolling') {
      startFilmWind();
    }
    return () => {
      if (phase === 'rolling') stopFilmWind();
    };
  }, [phase]);

  // Auto-suggest skill when description changes
  useEffect(() => {
    if (localDesc.length > 10) {
      const { skillId: sId, difficulty: diff } = suggestCheckParameters(localDesc);
      setLocalSkill(sId);
      setLocalDiff(diff);
    }
  }, [localDesc]);

  const handleRoll = () => {
    playClick();
    stripsDoneRef.current = 0;
    setRollKey(k => k + 1);
    setSetup(localSkill, localDiff, localDesc);
    startRoll();
  };

  // Each FilmStrip calls this when its animation ends.
  // Wait for both, then snap to done phase with shutter sound.
  const handleStripDone = () => {
    stripsDoneRef.current += 1;
    if (stripsDoneRef.current >= 2) {
      stopFilmWind();
      playShutter();
      setTimeout(() => finishRoll(), 80);
    }
  };

  const handleConfirm = async () => {
    playClick();
    if (pendingEntryId && phase === 'done') {
      const check = createCheck(localSkill, localDiff, localDesc, roll);
      await attachCheck(pendingEntryId, check);
    }
    reset();
    closeModal();
  };

  const skill = SKILLS_BY_ID[localSkill];

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="dice-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget && phase === 'done') handleConfirm();
        }}
      >
        <motion.div
          className={`dice-modal ${phase === 'done' ? (passed ? 'dice-modal--success' : 'dice-modal--failure') : ''}`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
          {/* ── Setup phase ── */}
          {phase === 'setup' && (
            <div className="dice-modal__setup">
              <h2 className="dice-modal__title">{T.dice.title}</h2>

              <div className="dice-setup__field">
                <label>{T.dice.whatAttempting}</label>
                <textarea
                  value={localDesc}
                  onChange={e => setLocalDesc(e.target.value)}
                  placeholder={T.dice.placeholder}
                  rows={2}
                  autoFocus
                />
              </div>

              <div className="dice-setup__field">
                <label>{T.dice.skillLabel}</label>
                <select
                  value={localSkill}
                  onChange={e => setLocalSkill(e.target.value)}
                  style={{ '--skill-color': skill?.color } as React.CSSProperties}
                >
                  {SKILLS.map(s => (
                    <option key={s.id} value={s.id}>
                      {T.skills.names[s.id] ?? s.name} ({s.stat})
                    </option>
                  ))}
                </select>
              </div>

              <div className="dice-setup__field">
                <label>{T.dice.difficultyLabel}</label>
                <div className="dice-setup__difficulty">
                  {DIFFICULTY_PRESETS.map(p => (
                    <button
                      key={p.value}
                      className={`diff-btn ${localDiff === p.value ? 'diff-btn--active' : ''}`}
                      onClick={() => setLocalDiff(p.value)}
                    >
                      {p.value}
                      <span>{T.dice.difficulties[p.value] ?? DIFFICULTY_LABELS[p.value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="dice-modal__actions">
                <button className="btn-secondary" onClick={() => { playClick(); reset(); closeModal(); }}>
                  {T.dice.cancel}
                </button>
                <button
                  className="btn-primary"
                  onClick={handleRoll}
                  disabled={!localDesc.trim()}
                >
                  {T.dice.roll}
                </button>
              </div>
            </div>
          )}

          {/* ── Rolling phase — film strips ── */}
          {phase === 'rolling' && (
            <div className="dice-modal__rolling">
              <div className="dice-rolling__skill" style={{ color: skill?.color }}>
                {skill?.name.toUpperCase()}
              </div>
              <div className="dice-rolling__desc">{localDesc}</div>

              <div className="film-strips-row">
                <FilmStrip
                  key={`d1-${rollKey}`}
                  finalValue={roll[0]}
                  active={true}
                  onDone={handleStripDone}
                />
                <span className="film-strips__plus">+</span>
                <FilmStrip
                  key={`d2-${rollKey}`}
                  finalValue={roll[1]}
                  active={true}
                  onDone={handleStripDone}
                />
              </div>

              <div className="dice-rolling__vs">
                <span className="dice-rolling__total" style={{ color: 'var(--text-muted)' }}>?</span>
                <span className="dice-rolling__sep">vs</span>
                <span className="dice-rolling__diff">{localDiff}</span>
              </div>
            </div>
          )}

          {/* ── Done phase ── */}
          {phase === 'done' && (
            <motion.div
              className="dice-modal__result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className={`result-banner ${passed ? 'result-banner--success' : 'result-banner--failure'}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.05 }}
              >
                {getResultDescription({ skillId: localSkill, difficulty: localDiff, roll, total, passed } as any)}
              </motion.div>

              {/* Result dice: plain number boxes */}
              <div className="dice-result__dice">
                <div className="dice-result__face">{roll[0]}</div>
                <div className="dice-result__face">{roll[1]}</div>
              </div>

              <div className="dice-result__score">
                <span className="dice-result__total" style={{ color: passed ? 'var(--amber)' : 'var(--accent-red)' }}>
                  {total}
                </span>
                <span className="dice-result__vs">
                  {T.dice.vsLabel} {localDiff} ({T.dice.difficulties[localDiff] ?? DIFFICULTY_LABELS[localDiff] ?? localDiff})
                </span>
              </div>

              <div className="dice-result__desc">{localDesc}</div>

              <div className="dice-result__skill" style={{ color: skill?.color }}>
                {T.skills.names[localSkill] ?? skill?.name} — {skill?.stat}
              </div>

              <button className="btn-primary dice-result__confirm" onClick={handleConfirm}>
                {pendingEntryId ? T.dice.saveToEntry : T.dice.close}
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
