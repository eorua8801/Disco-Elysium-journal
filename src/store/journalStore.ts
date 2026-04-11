import { create } from 'zustand';
import type { JournalEntry, DiceCheck, SubTaskStatus } from '../types';
import { getAllEntries, saveEntry, deleteEntry } from '../db/indexedDB';
import { generateSkillComments } from '../utils/aiComments';

interface JournalStore {
  entries: JournalEntry[];
  loading: boolean;
  loadEntries: () => Promise<void>;
  createEntry: (data: Pick<JournalEntry, 'title' | 'content' | 'mood' | 'tags'>) => Promise<JournalEntry>;
  updateEntry: (id: string, data: Partial<Pick<JournalEntry, 'title' | 'content' | 'mood' | 'tags'>>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  attachCheck: (entryId: string, check: DiceCheck) => Promise<void>;
  regenerateComments: (entryId: string) => Promise<void>;
  updateSubTaskStatus: (entryId: string, taskIdx: number, subIdx: number, status: SubTaskStatus) => Promise<void>;
}

/** Ensure backward-compat: old entries without tasks/characters get empty arrays */
function normalize(entry: JournalEntry): JournalEntry {
  return {
    ...entry,
    tasks:      (entry.tasks      as typeof entry.tasks      | undefined) ?? [],
    characters: (entry.characters as typeof entry.characters | undefined) ?? [],
  };
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  loading: false,

  loadEntries: async () => {
    set({ loading: true });
    const entries = (await getAllEntries()).map(normalize);
    set({ entries, loading: false });
  },

  createEntry: async (data) => {
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      skillComments: [],
      checks: [],
      tasks: [],
      characters: [],
      ...data,
    };

    const result = await generateSkillComments(entry.content, entry.checks);
    entry.skillComments = result.skillComments;
    entry.tasks        = result.tasks;
    entry.characters   = result.characters;

    await saveEntry(entry);
    set(state => ({ entries: [entry, ...state.entries] }));
    return entry;
  },

  updateEntry: async (id, data) => {
    const entry = get().entries.find(e => e.id === id);
    if (!entry) return;

    const updated: JournalEntry = {
      ...entry,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.content && data.content !== entry.content) {
      const result = await generateSkillComments(updated.content, updated.checks);
      updated.skillComments = result.skillComments;
      updated.tasks        = result.tasks;
      updated.characters   = result.characters;
    }

    await saveEntry(updated);
    set(state => ({
      entries: state.entries.map(e => e.id === id ? updated : e),
    }));
  },

  deleteEntry: async (id) => {
    await deleteEntry(id);
    set(state => ({
      entries: state.entries.filter(e => e.id !== id),
    }));
  },

  attachCheck: async (entryId, check) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (!entry) return;

    const updated: JournalEntry = {
      ...entry,
      checks: [...entry.checks, check],
      updatedAt: new Date().toISOString(),
    };

    const result = await generateSkillComments(updated.content, updated.checks);
    updated.skillComments = result.skillComments;
    updated.tasks        = result.tasks;
    updated.characters   = result.characters;

    await saveEntry(updated);
    set(state => ({
      entries: state.entries.map(e => e.id === entryId ? updated : e),
    }));
  },

  regenerateComments: async (entryId) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (!entry) return;

    const result = await generateSkillComments(entry.content, entry.checks);
    const updated: JournalEntry = {
      ...entry,
      skillComments: result.skillComments,
      tasks:         result.tasks,
      characters:    result.characters,
    };

    await saveEntry(updated);
    set(state => ({
      entries: state.entries.map(e => e.id === entryId ? updated : e),
    }));
  },

  updateSubTaskStatus: async (entryId, taskIdx, subIdx, status) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (!entry) return;

    const tasks = entry.tasks.map((task, ti) => {
      if (ti !== taskIdx) return task;
      return {
        ...task,
        subTasks: task.subTasks.map((sub, si) =>
          si === subIdx ? { ...sub, status } : sub
        ),
      };
    });

    const updated: JournalEntry = { ...entry, tasks, updatedAt: new Date().toISOString() };
    await saveEntry(updated);
    set(state => ({
      entries: state.entries.map(e => e.id === entryId ? updated : e),
    }));
  },
}));
