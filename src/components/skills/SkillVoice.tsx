import { motion } from 'framer-motion';
import { SKILLS_BY_ID } from '../../data/skills';
import { TypewriterText } from '../common/TypewriterText';
import { useT } from '../../i18n';
import type { SkillComment } from '../../types';
import './SkillVoice.css';

interface SkillVoiceProps {
  comment: SkillComment;
  animate?: boolean;
  index?: number;
}

export function SkillVoice({ comment, animate = true, index = 0 }: SkillVoiceProps) {
  const skill = SKILLS_BY_ID[comment.skillId];
  const T = useT();
  if (!skill) return null;

  const displayName = (T.skills.names[skill.id] ?? skill.name).toUpperCase();

  return (
    <motion.div
      className="skill-voice"
      style={{ '--skill-color': skill.color } as React.CSSProperties}
      initial={animate ? { opacity: 0, x: -12 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.12 }}
    >
      <div className="skill-voice__header">
        <span className="skill-voice__name">{displayName}</span>
        <span className="skill-voice__stat">{skill.stat}</span>
        {comment.source === 'ollama' && (
          <span className="skill-voice__source" title="AI generated">✦</span>
        )}
      </div>
      <p className="skill-voice__text">
        {animate ? (
          <TypewriterText text={comment.text} speed={14} delay={index * 120} />
        ) : (
          comment.text
        )}
      </p>
    </motion.div>
  );
}
