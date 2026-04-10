import { useState } from 'react';
import { motion } from 'framer-motion';
import { SKILLS, SKILLS_BY_STAT, STAT_COLORS, type StatGroup } from '../data/skills';
import { useSettingsStore } from '../store/settingsStore';
import { PageHeader } from '../components/layout/PageHeader';
import './SkillsPage.css';

const STATS: StatGroup[] = ['Intellect', 'Psyche', 'Physique', 'Motorics'];

export function SkillsPage() {
  const { activeSkills, setActiveSkills } = useSettingsStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const isActive = (id: string) => activeSkills.length === 0 || activeSkills.includes(id);

  const toggleSkill = (id: string) => {
    if (activeSkills.length === 0) {
      // Currently all active → deactivate this one
      setActiveSkills(SKILLS.map(s => s.id).filter(sid => sid !== id));
    } else if (activeSkills.includes(id)) {
      const next = activeSkills.filter(sid => sid !== id);
      // If all would be active, reset to empty (= all)
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
        title="Skill Roster"
        subtitle={`${activeCount} of ${SKILLS.length} active`}
        actions={
          activeSkills.length > 0 ? (
            <button className="skills-page__all-btn" onClick={activateAll}>
              Activate All
            </button>
          ) : null
        }
      />

      <div className="skills-page__body">
        <p className="skills-page__hint">
          Active skills may comment on your entries. Tap a skill to toggle it.
        </p>

        {STATS.map(stat => (
          <section key={stat} className="skills-section">
            <h3
              className="skills-section__title"
              style={{ color: STAT_COLORS[stat] }}
            >
              {stat}
            </h3>

            <div className="skills-grid">
              {SKILLS_BY_STAT[stat].map((skill, i) => {
                const active = isActive(skill.id);
                const isExp = expanded === skill.id;
                return (
                  <motion.div
                    key={skill.id}
                    className={`skill-card ${active ? 'skill-card--active' : 'skill-card--inactive'}`}
                    style={{ '--skill-color': skill.color } as React.CSSProperties}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="skill-card__top">
                      <button
                        className="skill-card__name"
                        onClick={() => setExpanded(e => e === skill.id ? null : skill.id)}
                      >
                        {skill.name}
                      </button>
                      <button
                        className={`skill-toggle ${active ? 'skill-toggle--on' : 'skill-toggle--off'}`}
                        onClick={() => toggleSkill(skill.id)}
                        aria-label={active ? 'Deactivate' : 'Activate'}
                      >
                        {active ? '●' : '○'}
                      </button>
                    </div>

                    {isExp && (
                      <motion.div
                        className="skill-card__detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <p className="skill-card__desc">{skill.description}</p>
                        <div className="skill-card__keywords">
                          {skill.keywords.slice(0, 6).map(k => (
                            <span key={k} className="skill-keyword">{k}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
