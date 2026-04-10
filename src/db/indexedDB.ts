import { openDB, type IDBPDatabase } from 'idb';
import type { JournalEntry, AppSettings } from '../types';

const DB_NAME = 'disco-journal';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Entries store
        if (!db.objectStoreNames.contains('entries')) {
          const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
          entryStore.createIndex('createdAt', 'createdAt');
          entryStore.createIndex('updatedAt', 'updatedAt');
        }
        // Settings store (key-value)
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

// ─── Entries ──────────────────────────────────────────────────

export async function getAllEntries(): Promise<JournalEntry[]> {
  const db = await getDB();
  const entries = await db.getAllFromIndex('entries', 'createdAt');
  return entries.reverse(); // newest first
}

export async function getEntry(id: string): Promise<JournalEntry | undefined> {
  const db = await getDB();
  return db.get('entries', id);
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  const db = await getDB();
  await db.put('entries', entry);
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('entries', id);
}

// ─── Settings ─────────────────────────────────────────────────

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await getDB();
  const record = await db.get('settings', key);
  return record ? (record.value as T) : defaultValue;
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put('settings', { key, value });
}

export async function getAllSettings(): Promise<AppSettings> {
  const [ollamaEnabled, ollamaUrl, ollamaModel, activeSkills, locale, scanlines] =
    await Promise.all([
      getSetting('ollamaEnabled', false),
      getSetting('ollamaUrl', 'http://localhost:11434'),
      getSetting('ollamaModel', 'phi3:mini'),
      getSetting<string[]>('activeSkills', []),
      getSetting<'en' | 'ko'>('locale', 'en'),
      getSetting('scanlines', true),
    ]);
  return { ollamaEnabled, ollamaUrl, ollamaModel, activeSkills, locale, scanlines };
}
