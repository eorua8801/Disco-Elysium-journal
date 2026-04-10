import type { DiceCheck } from '../types';
import { DIFFICULTY_LABELS } from '../data/skills';

export function rollDie(): number {
  return Math.ceil(Math.random() * 6);
}

export function roll2d6(): [number, number] {
  return [rollDie(), rollDie()] as [number, number];
}

export function createCheck(
  skillId: string,
  difficulty: number,
  description: string,
  roll?: [number, number],
): DiceCheck {
  const actualRoll = roll ?? roll2d6();
  const total = actualRoll[0] + actualRoll[1];
  return {
    id: crypto.randomUUID(),
    skillId,
    difficulty,
    roll: actualRoll,
    total,
    passed: total >= difficulty,
    description,
    createdAt: new Date().toISOString(),
  };
}

export function getDifficultyLabel(difficulty: number): string {
  // Round to nearest known difficulty
  const known = [6, 8, 10, 12, 14, 16];
  const nearest = known.reduce((prev, curr) =>
    Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev
  );
  return DIFFICULTY_LABELS[nearest] ?? `${difficulty}`;
}

export function getResultDescription(check: DiceCheck): string {
  const margin = check.total - check.difficulty;
  if (check.passed) {
    if (margin >= 6) return 'Extraordinary Success';
    if (margin >= 3) return 'Success';
    return 'Narrow Success';
  } else {
    if (margin <= -6) return 'Catastrophic Failure';
    if (margin <= -3) return 'Failure';
    return 'Narrow Failure';
  }
}

// Difficulty suggestions based on common life situations
export const DIFFICULTY_PRESETS = [
  { label: 'Trivial (6)', value: 6, description: 'Almost certain to succeed' },
  { label: 'Easy (8)', value: 8, description: 'Routine with a small chance of failure' },
  { label: 'Medium (10)', value: 10, description: 'Requires real effort' },
  { label: 'Hard (12)', value: 12, description: 'A genuine challenge' },
  { label: 'Formidable (14)', value: 14, description: 'Near the edge of human capability' },
  { label: 'Legendary (16)', value: 16, description: 'Only the most remarkable achieve this' },
] as const;
