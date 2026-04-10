import { create } from 'zustand';
import type { JournalEntry, DiceCheck } from '../types';
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
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  loading: false,

  loadEntries: async () => {
    set({ loading: true });
    const entries = await getAllEntries();
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
      ...data,
    };

    // Generate skill comments in background
    const comments = await generateSkillComments(entry.content, entry.checks);
    entry.skillComments = comments;

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

    // Regenerate comments if content changed
    if (data.content && data.content !== entry.content) {
      updated.skillComments = await generateSkillComments(updated.content, updated.checks);
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

    // Regenerate comments with new check context
    updated.skillComments = await generateSkillComments(updated.content, updated.checks);

    await saveEntry(updated);
    set(state => ({
      entries: state.entries.map(e => e.id === entryId ? updated : e),
    }));
  },

  regenerateComments: async (entryId) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (!entry) return;

    const comments = await generateSkillComments(entry.content, entry.checks);
    const updated: JournalEntry = { ...entry, skillComments: comments };

    await saveEntry(updated);
    set(state => ({
      entries: state.entries.map(e => e.id === entryId ? updated : e),
    }));
  },
}));
