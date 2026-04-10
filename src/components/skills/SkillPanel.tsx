import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillVoice } from './SkillVoice';
import type { SkillComment } from '../../types';
import './SkillPanel.css';

interface SkillPanelProps {
  comments: SkillComment[];
  animate?: boolean;
}

export function SkillPanel({ comments, animate = true }: SkillPanelProps) {
  const [expanded, setExpanded] = useState(true);

  if (comments.length === 0) return null;

  return (
    <div className="skill-panel">
      <button
        className="skill-panel__toggle"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <span className="skill-panel__toggle-label">
          INTERNAL MONOLOGUE
          <span className="skill-panel__count">{comments.length}</span>
        </span>
        <span className="skill-panel__toggle-icon">{expanded ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="panel-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="skill-panel__body"
          >
            {comments.map((comment, i) => (
              <SkillVoice
                key={`${comment.skillId}-${comment.triggeredAt}`}
                comment={comment}
                animate={animate}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
