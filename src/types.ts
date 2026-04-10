export type Mood = 'hopeful' | 'neutral' | 'troubled' | 'numb';

export type DicePhase = 'idle' | 'setup' | 'rolling' | 'slowing' | 'revealing' | 'done';

export interface SkillComment {
  skillId: string;
  text: string;
  source: 'template' | 'ollama';
  triggeredAt: string;
}

export interface DiceCheck {
  id: string;
  skillId: string;
  difficulty: number;
  roll: [number, number];
  total: number;
  passed: boolean;
  description: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  mood?: Mood;
  skillComments: SkillComment[];
  checks: DiceCheck[];
  tags: string[];
}

export interface AppSettings {
  ollamaEnabled: boolean;
  ollamaUrl: string;
  ollamaModel: string;
  activeSkills: string[];  // empty = all active
  locale: 'en' | 'ko';
  scanlines: boolean;
}

// Dice store state
export interface DiceState {
  phase: DicePhase;
  skillId: string;
  difficulty: number;
  description: string;
  roll: [number, number];
  total: number;
  passed: boolean;
  pendingEntryId: string | null;  // entry to attach the check to
}
