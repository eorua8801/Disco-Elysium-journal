import { create } from 'zustand';
import type { DicePhase } from '../types';

interface DiceStore {
  isOpen: boolean;
  phase: DicePhase;
  skillId: string;
  difficulty: number;
  description: string;
  roll: [number, number];
  total: number;
  passed: boolean;
  pendingEntryId: string | null;

  // Actions
  openModal: (entryId: string) => void;
  closeModal: () => void;
  setSetup: (skillId: string, difficulty: number, description: string) => void;
  startRoll: () => void;
  resolveRoll: (roll: [number, number]) => void;
  reset: () => void;
}

const initialState = {
  isOpen: false,
  phase: 'idle' as DicePhase,
  skillId: 'logic',
  difficulty: 10,
  description: '',
  roll: [1, 1] as [number, number],
  total: 2,
  passed: false,
  pendingEntryId: null,
};

export const useDiceStore = create<DiceStore>((set, get) => ({
  ...initialState,

  openModal: (entryId) => {
    set({ isOpen: true, phase: 'setup', pendingEntryId: entryId });
  },

  closeModal: () => {
    set({ isOpen: false, phase: 'idle' });
  },

  setSetup: (skillId, difficulty, description) => {
    set({ skillId, difficulty, description });
  },

  startRoll: () => {
    set({ phase: 'rolling' });

    // Simulate roll timing
    setTimeout(() => {
      set({ phase: 'slowing' });
    }, 1200);

    setTimeout(() => {
      const d1 = Math.ceil(Math.random() * 6) as 1|2|3|4|5|6;
      const d2 = Math.ceil(Math.random() * 6) as 1|2|3|4|5|6;
      const total = d1 + d2;
      const { difficulty } = get();
      const passed = total >= difficulty;

      set({
        roll: [d1, d2],
        total,
        passed,
        phase: 'revealing',
      });

      setTimeout(() => {
        set({ phase: 'done' });
      }, 600);
    }, 1800);
  },

  resolveRoll: (roll) => {
    const total = roll[0] + roll[1];
    const { difficulty } = get();
    set({ roll, total, passed: total >= difficulty, phase: 'done' });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
