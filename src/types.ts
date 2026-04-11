export type StatGroup = 'Intellect' | 'Psyche' | 'Physique' | 'Motorics';

export type MoodTag = 'hopeful' | 'neutral' | 'troubled' | 'numb' | 'angry' | 'nostalgic' | 'anxious' | 'determined';

// Backwards-compat alias
export type Mood = MoodTag;

export type DicePhase = 'idle' | 'setup' | 'rolling' | 'slowing' | 'revealing' | 'done';

// ── Task / quest extraction ──────────────────────────────────────────
export type SubTaskStatus = 'active' | 'success' | 'failure' | 'deferred';

export interface SubTask {
  title: string;
  status: SubTaskStatus;
}

export interface Task {
  title: string;
  description: string;
  subTasks: SubTask[];
}

// ── Characters mentioned in diary entries ────────────────────────────
export interface Character {
  name: string;
  description: string;
}

// ── Skill comment ────────────────────────────────────────────────────
export interface SkillComment {
  id: string;
  skillId: string;
  text: string;
  source: 'template' | 'ollama';
  triggeredAt: string;
}

// ── Dice check (persisted) ───────────────────────────────────────────
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

// ── Journal entry ────────────────────────────────────────────────────
export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  mood?: MoodTag | null;
  skillComments: SkillComment[];
  checks: DiceCheck[];
  tasks: Task[];
  characters: Character[];
  tags: string[];
}

// ── App settings ─────────────────────────────────────────────────────
export interface AppSettings {
  ollamaEnabled: boolean;
  ollamaUrl: string;
  ollamaModel: string;
  activeSkills: string[];
  locale: 'en' | 'ko';
  scanlines: boolean;
  onDeviceEnabled: boolean;
  geminiEnabled: boolean;
  geminiApiKey: string;
  geminiModel: string;
}

// ── Dice store transient state ────────────────────────────────────────
export interface DiceState {
  phase: DicePhase;
  skillId: string;
  difficulty: number;
  description: string;
  roll: [number, number];
  total: number;
  passed: boolean;
  pendingEntryId: string | null;
}

// ── Check outcome ─────────────────────────────────────────────────────
export type CheckOutcome = 'success' | 'failure' | 'critical-success' | 'critical-failure';
