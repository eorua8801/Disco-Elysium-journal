import { SKILLS, SKILLS_BY_ID, type Skill } from '../data/skills';
import type { DiceCheck } from '../types';
import { useSettingsStore } from '../store/settingsStore';

// Score a skill's relevance to the given text (0–100)
function scoreSkill(skill: Skill, text: string): number {
  const lower = text.toLowerCase();
  let score = 0;

  for (const keyword of skill.keywords) {
    if (lower.includes(keyword)) {
      score += keyword.length > 5 ? 15 : 10;
    }
  }

  return Math.min(score, 100);
}

// Extract a "topic" phrase from text for template substitution
export function extractTopic(text: string): string {
  // Strip very short texts
  if (text.length < 20) return text.trim() || 'this';

  // Find the first sentence
  const firstSentence = text.split(/[.!?]/)[0].trim();
  if (firstSentence.length < 60) return firstSentence.toLowerCase();

  // Fall back to first ~40 chars
  const words = firstSentence.split(' ').slice(0, 6).join(' ');
  return words.toLowerCase();
}

function fillTemplate(template: string, topic: string): string {
  return template.replace(/\{\{topic\}\}/g, topic);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Determine which skills to activate for a given entry text
export function matchSkills(
  text: string,
  checks: DiceCheck[],
  count: number = 3,
): Skill[] {
  const { activeSkills } = useSettingsStore.getState();
  const pool = activeSkills.length > 0
    ? SKILLS.filter(s => activeSkills.includes(s.id))
    : SKILLS;

  // Skills already featured in checks get priority
  const checkSkillIds = new Set(checks.map(c => c.skillId));

  const scored = pool.map(skill => ({
    skill,
    score: scoreSkill(skill, text) + (checkSkillIds.has(skill.id) ? 30 : 0),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Always include at least one skill even if no keywords match
  const top = scored.filter(s => s.score > 0).slice(0, count);
  if (top.length === 0 && pool.length > 0) {
    // Pick a random skill if nothing matched
    const rand = pool[Math.floor(Math.random() * pool.length)];
    return [rand];
  }

  return top.map(s => s.skill);
}

// Pick a comment template based on check results
export function pickComment(
  skill: Skill,
  text: string,
  checks: DiceCheck[],
): string {
  const topic = extractTopic(text);
  const skillChecks = checks.filter(c => c.skillId === skill.id);

  let template: string;

  if (skillChecks.length > 0) {
    // Use the result of the most recent check
    const lastCheck = skillChecks[skillChecks.length - 1];
    template = lastCheck.passed
      ? pickRandom(skill.successTemplates)
      : pickRandom(skill.failureTemplates);
  } else {
    // No check → neutral comment
    template = pickRandom(skill.neutralTemplates);
  }

  return fillTemplate(template, topic);
}

// Full matching: returns { skillId, text } for each matched skill
export function generateTemplateComments(
  text: string,
  checks: DiceCheck[],
  count: number = 3,
): Array<{ skillId: string; text: string }> {
  const skills = matchSkills(text, checks, count);
  return skills.map(skill => ({
    skillId: skill.id,
    text: pickComment(skill, text, checks),
  }));
}

// Suggest a skill and difficulty for a free-text check description
export function suggestCheckParameters(description: string): {
  skillId: string;
  difficulty: number;
} {
  const scored = SKILLS.map(skill => ({
    skill,
    score: scoreSkill(skill, description),
  }));
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0].score > 0 ? scored[0].skill : SKILLS_BY_ID['logic'];

  // Difficulty heuristics based on keywords
  const lower = description.toLowerCase();
  let difficulty = 10;
  if (/impossible|never|can't|couldn't|hardest|extremely/i.test(lower)) difficulty = 14;
  else if (/difficult|hard|struggle|challenge/i.test(lower)) difficulty = 12;
  else if (/easy|simple|just|quick|small/i.test(lower)) difficulty = 8;
  else if (/trivial|obvious|instant/i.test(lower)) difficulty = 6;

  return { skillId: best.id, difficulty };
}
