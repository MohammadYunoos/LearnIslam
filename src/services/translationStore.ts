// src/services/translationStore.ts
// Persistent offline cache of translations in IndexedDB. One object store keyed
// `${lang}|${source}` → translated text. Lets the app prime its in-memory map
// on startup so Roman-Urdu reads are instant and work offline.
import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'mymaqtab_tr'
const STORE = 'tr'
const VERSION = 1

let dbp: Promise<IDBPDatabase> | null = null
function db(): Promise<IDBPDatabase> {
  if (!dbp) {
    dbp = openDB(DB_NAME, VERSION, {
      upgrade(d) {
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE)
      },
    })
  }
  return dbp
}

const key = (lang: string, source: string) => `${lang}|${source}`

// All cached [source, translated] pairs for a language.
export async function idbGetAll(lang: string): Promise<[string, string][]> {
  try {
    const d = await db()
    const prefix = `${lang}|`
    const out: [string, string][] = []
    let cursor = await d.transaction(STORE).store.openCursor()
    while (cursor) {
      const k = String(cursor.key)
      if (k.startsWith(prefix)) out.push([k.slice(prefix.length), cursor.value as string])
      cursor = await cursor.continue()
    }
    return out
  } catch {
    return []
  }
}

// Bulk upsert translated rows for a language.
export async function idbBulkPut(
  lang: string,
  rows: { source_text: string; translated_text: string }[]
): Promise<void> {
  try {
    const d = await db()
    const tx = d.transaction(STORE, 'readwrite')
    for (const r of rows) {
      if (r?.source_text != null && r?.translated_text != null) {
        tx.store.put(r.translated_text, key(lang, r.source_text))
      }
    }
    await tx.done
  } catch {
    /* IndexedDB unavailable — ignore, fall back to network/localStorage */
  }
}
