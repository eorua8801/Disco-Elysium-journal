// Types for the skill system
export type StatGroup = 'Intellect' | 'Psyche' | 'Physique' | 'Motorics';

export type MoodTag = 'hopeful' | 'neutral' | 'troubled' | 'numb' | 'angry' | 'nostalgic' | 'anxious' | 'determined';

export interface Skill {
  id: string;
  name: string;
  stat: StatGroup;
  color: string;
  bgColor: string;
  description: string;
  voiceTone: string;
  keywords: string[];
  triggerMoods: MoodTag[];
  templates: string[];
  successLines: string[];
  failureLines: string[];
}

export interface SkillComment {
  id: string;
  skillId: string;
  text: string;
  source: 'template' | 'ollama';
  triggeredAt: string;
}

export interface DiceCheck {
  id: string;
  skillId: string;
  difficulty: number;
  difficultyLabel: string;
  die1: number;
  die2: number;
  total: number;
  passed: boolean;
  description: string;
  narrativeResult: string;
  createdAt: string;
}

export type CheckOutcome = 'success' | 'failure' | 'critical-success' | 'critical-failure';

export type DicePhase = 'idle' | 'setup' | 'rolling' | 'resolving' | 'revealed' | 'done';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodTag | null;
  tags: string[];
  skillComments: SkillComment[];
  checks: DiceCheck[];
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export interface AppSettings {
  ollamaEnabled: boolean;
  ollamaUrl: string;
  ollamaModel: string;
  activeSkillIds: string[];
  scanlinesEnabled: boolean;
  locale: 'en' | 'ko';
}
