import { motion } from 'framer-motion';
import './DiceFace.css';

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
};

interface DiceFaceProps {
  value: number;
  rolling?: boolean;
  size?: number;
}

export function DiceFace({ value, rolling = false, size = 80 }: DiceFaceProps) {
  const safeValue = Math.max(1, Math.min(6, value));
  const dots = DOT_POSITIONS[safeValue];

  return (
    <motion.div
      className={`dice-face ${rolling ? 'dice-face--rolling' : ''}`}
      style={{ width: size, height: size }}
      animate={rolling ? {
        rotateX: [0, 180, 360, 540, 720],
        rotateY: [0, 90, 180, 270, 360],
      } : {}}
      transition={rolling ? {
        duration: 0.5,
        repeat: Infinity,
        ease: 'linear',
      } : { type: 'spring', stiffness: 300, damping: 20 }}
    >
      {dots.map(([x, y], i) => (
        <div
          key={i}
          className="dice-dot"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </motion.div>
  );
}
