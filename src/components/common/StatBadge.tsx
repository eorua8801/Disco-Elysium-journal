import type { StatGroup } from '../../data/skills';
import { STAT_COLORS } from '../../data/skills';

interface StatBadgeProps {
  stat: StatGroup;
  size?: 'sm' | 'md';
}

export function StatBadge({ stat, size = 'sm' }: StatBadgeProps) {
  return (
    <span
      className={`stat-badge stat-badge--${size}`}
      style={{ '--stat-color': STAT_COLORS[stat] } as React.CSSProperties}
    >
      {stat}
    </span>
  );
}
