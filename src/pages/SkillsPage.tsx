import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, SKILLS_BY_STAT, type StatGroup } from '../data/skills';
import { useSettingsStore } from '../store/settingsStore';
import { PageHeader } from '../components/layout/PageHeader';
import { useT } from '../i18n';
import './SkillsPage.css';

const STATS: StatGroup[] = ['Intellect', 'Psyche', 'Physique', 'Motorics'];

const STAT_META: Record<StatGroup, { color: string; bg: string; label: string }> = {
  Intellect: { color: '#3a8fd4', bg: '#1a4a7a', label: 'INT' },
  Psyche:    { color: '#8b4fd4', bg: '#4a1f7a', label: 'PSY' },
  Physique:  { color: '#d43a6a', bg: '#7a1a38', label: 'FYS' },
  Motorics:  { color: '#d4a024', bg: '#7a5a08', label: 'MOT' },
};

export function SkillsPage() {
  const { activeSkills, setActiveSkills } = useSettingsStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const T = useT();

  const isActive = (id: string) => activeSkills.length === 0 || activeSkills.includes(id);

  const toggleSkill = (id: string) => {
    if (activeSkills.length === 0) {
      setActiveSkills(SKILLS.map(s => s.id).filter(sid => sid !== id));
    } else if (activeSkills.includes(id)) {
      const next = activeSkills.filter(sid => sid !== id);
      setActiveSkills(next.length === SKILLS.length - 1 ? [] : next);
    } else {
      const next = [...activeSkills, id];
      setActiveSkills(next.length === SKILLS.length ? [] : next);
    }
  };

  const activateAll = () => setActiveSkills([]);
  const activeCount = activeSkills.length === 0 ? SKILLS.length : activeSkills.length;

  return (
    <div className="skills-page animate-page-in">
      <PageHeader
        title={T.skills.title}
        icon="⚄"
        subtitle={`${activeCount}/${SKILLS.length}`}
        actions={
          activeSkills.length > 0 ? (
            <button className="btn-secondary" style={{ fontSize: '0.6rem', padding: '3px 8px' }} onClick={activateAll}>
              {T.skills.allBtn}
            </button>
          ) : null
        }
      />

      {/* Stat score row */}
      <div className="skills-stat-row">
        {STATS.map(stat => {
          const meta = STAT_META[stat];
          const count = SKILLS_BY_STAT[stat]?.length ?? 0;
          return (
            <div
              key={stat}
              className="stat-score-box"
              style={{ '--stat-color': meta.color, '--stat-bg': meta.bg } as React.CSSProperties}
            >
              <span className="stat-score-box__num">{count}</span>
              <span className="stat-score-box__label">{meta.label}</span>
            </div>
          );
        })}
      </div>

      <div className="skills-page__body">
        {/* 4-column grid header */}
        <div className="skills-columns-header">
          {STATS.map(stat => (
            <div key={stat} className="skills-col-label" style={{ color: STAT_META[stat].color }}>
              {T.skills.stats[stat]}
            </div>
          ))}
        </div>

        {/* 4-column grid of cards */}
        <div className="skills-grid-4col">
          {STATS.map(stat => (
            <div key={stat} className="skills-col">
              {SKILLS_BY_STAT[stat]?.map((skill, i) => {
                const active = isActive(skill.id);
                const isExp = expanded === skill.id;
                const displayName = T.skills.names[skill.id] ?? skill.name;
                return (
                  <motion.div
                    key={skill.id}
                    className={`skill-card-v2 ${active ? '' : 'skill-card-v2--inactive'} ${isExp ? 'skill-card-v2--expanded' : ''}`}
                    style={{ '--skill-color': skill.color } as React.CSSProperties}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: active ? 1 : 0.4, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setExpanded(e => e === skill.id ? null : skill.id)}
                  >
                    <div className="skill-card-v2__face">
                      <div className="skill-card-v2__art" style={{ background: `linear-gradient(160deg, ${skill.color}22, #000 70%)` }}>
                        <span className="skill-card-v2__initial">{skill.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="skill-card-v2__badge">◇</span>
                      <button
                        className="skill-card-v2__toggle"
                        onClick={e => { e.stopPropagation(); toggleSkill(skill.id); }}
                        aria-label={active ? 'Deactivate' : 'Activate'}
                      >
                        {active ? '●' : '○'}
                      </button>
                    </div>

                    <div className="skill-card-v2__name">{displayName}</div>

                    <AnimatePresence>
                      {isExp && (
                        <motion.div
                          className="skill-card-v2__detail"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <p className="skill-card-v2__desc">{skill.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
