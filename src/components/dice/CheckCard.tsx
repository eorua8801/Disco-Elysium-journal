import { SKILLS_BY_ID } from '../../data/skills';
import { getDifficultyLabel, getResultDescription } from '../../utils/diceEngine';
import type { DiceCheck } from '../../types';
import './CheckCard.css';

interface CheckCardProps {
  check: DiceCheck;
}

export function CheckCard({ check }: CheckCardProps) {
  const skill = SKILLS_BY_ID[check.skillId];

  return (
    <div className={`check-card ${check.passed ? 'check-card--pass' : 'check-card--fail'}`}
      style={{ '--skill-color': skill?.color } as React.CSSProperties}
    >
      <div className="check-card__header">
        <span className="check-card__skill" style={{ color: skill?.color }}>
          {skill?.name ?? check.skillId}
        </span>
        <span className="check-card__result">
          {getResultDescription(check)}
        </span>
      </div>

      <div className="check-card__body">
      <div className="check-card__desc">{check.description}</div>

      <div className="check-card__roll">
        <span className="check-card__dice">
          [{check.roll[0]}] + [{check.roll[1]}]
        </span>
        <span className={`check-card__total ${check.passed ? 'check-card__total--pass' : 'check-card__total--fail'}`}>
          = {check.total}
        </span>
        <span className="check-card__vs">
          vs {check.difficulty} ({getDifficultyLabel(check.difficulty)})
        </span>
      </div>
      </div>
    </div>
  );
}
