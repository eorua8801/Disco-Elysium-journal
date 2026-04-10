import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useDiceStore } from '../../store/diceStore';
import { useJournalStore } from '../../store/journalStore';
import { DiceFace } from './DiceFace';
import { SKILLS, SKILLS_BY_ID, DIFFICULTY_LABELS } from '../../data/skills';
import { createCheck, DIFFICULTY_PRESETS, getResultDescription } from '../../utils/diceEngine';
import { suggestCheckParameters } from '../../utils/skillMatcher';
import './DiceModal.css';

export function DiceModal() {
  const {
    isOpen, phase, skillId, difficulty, roll, total, passed,
    pendingEntryId, closeModal, setSetup, startRoll, reset,
  } = useDiceStore();

  const { attachCheck } = useJournalStore();

  const [localDesc, setLocalDesc] = useState('');
  const [localSkill, setLocalSkill] = useState(skillId);
  const [localDiff, setLocalDiff] = useState(difficulty);
  const [displayDice, setDisplayDice] = useState<[number, number]>([1, 1]);

  // Cycle display dice during rolling
  useEffect(() => {
    if (phase !== 'rolling' && phase !== 'slowing') return;
    const interval = setInterval(() => {
      setDisplayDice([
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
      ] as [number, number]);
    }, phase === 'rolling' ? 80 : 160);
    return () => clearInterval(interval);
  }, [phase]);

  // Show final roll when revealing
  useEffect(() => {
    if (phase === 'revealing' || phase === 'done') {
      setDisplayDice(roll);
    }
  }, [phase, roll]);

  // Auto-suggest skill when description changes
  useEffect(() => {
    if (localDesc.length > 10) {
      const { skillId: sId, difficulty: diff } = suggestCheckParameters(localDesc);
      setLocalSkill(sId);
      setLocalDiff(diff);
    }
  }, [localDesc]);

  const handleRoll = () => {
    setSetup(localSkill, localDiff, localDesc);
    startRoll();
  };

  const handleConfirm = async () => {
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
          {/* Setup phase */}
          {phase === 'setup' && (
            <div className="dice-modal__setup">
              <h2 className="dice-modal__title">SKILL CHECK</h2>

              <div className="dice-setup__field">
                <label>What are you attempting?</label>
                <textarea
                  value={localDesc}
                  onChange={e => setLocalDesc(e.target.value)}
                  placeholder="I tried to apologize honestly..."
                  rows={2}
                  autoFocus
                />
              </div>

              <div className="dice-setup__field">
                <label>Skill</label>
                <select
                  value={localSkill}
                  onChange={e => setLocalSkill(e.target.value)}
                  style={{ '--skill-color': skill?.color } as React.CSSProperties}
                >
                  {SKILLS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.stat})</option>
                  ))}
                </select>
              </div>

              <div className="dice-setup__field">
                <label>Difficulty</label>
                <div className="dice-setup__difficulty">
                  {DIFFICULTY_PRESETS.map(p => (
                    <button
                      key={p.value}
                      className={`diff-btn ${localDiff === p.value ? 'diff-btn--active' : ''}`}
                      onClick={() => setLocalDiff(p.value)}
                    >
                      {p.value}
                      <span>{DIFFICULTY_LABELS[p.value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="dice-modal__actions">
                <button className="btn-secondary" onClick={() => { reset(); closeModal(); }}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleRoll}
                  disabled={!localDesc.trim()}
                >
                  Roll 2d6
                </button>
              </div>
            </div>
          )}

          {/* Rolling / Slowing / Revealing phases */}
          {(phase === 'rolling' || phase === 'slowing' || phase === 'revealing') && (
            <div className="dice-modal__rolling">
              <div className="dice-rolling__skill" style={{ color: skill?.color }}>
                {skill?.name.toUpperCase()}
              </div>
              <div className="dice-rolling__desc">{localDesc}</div>

              <div className="dice-rolling__dice">
                <DiceFace
                  value={displayDice[0]}
                  rolling={phase === 'rolling' || phase === 'slowing'}
                  size={88}
                />
                <DiceFace
                  value={displayDice[1]}
                  rolling={phase === 'rolling' || phase === 'slowing'}
                  size={88}
                />
              </div>

              <div className="dice-rolling__vs">
                <span className="dice-rolling__total">?</span>
                <span className="dice-rolling__sep">vs</span>
                <span className="dice-rolling__diff">{localDiff}</span>
              </div>
            </div>
          )}

          {/* Done phase */}
          {phase === 'done' && (
            <motion.div
              className="dice-modal__result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`result-banner ${passed ? 'result-banner--success' : 'result-banner--failure'}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              >
                {getResultDescription({ skillId: localSkill, difficulty: localDiff, roll, total, passed } as any)}
              </motion.div>

              <div className="dice-result__dice">
                <DiceFace value={roll[0]} size={72} />
                <DiceFace value={roll[1]} size={72} />
              </div>

              <div className="dice-result__score">
                <span className="dice-result__total" style={{ color: passed ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                  {total}
                </span>
                <span className="dice-result__vs">vs {localDiff} ({DIFFICULTY_LABELS[localDiff] ?? localDiff})</span>
              </div>

              <div className="dice-result__desc">{localDesc}</div>

              <div className="dice-result__skill" style={{ color: skill?.color }}>
                {skill?.name} — {skill?.stat}
              </div>

              <button className="btn-primary dice-result__confirm" onClick={handleConfirm}>
                {pendingEntryId ? 'Save to Entry' : 'Close'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
