// src/services/hifzLocal.ts
// Local Hifz progress (no auth yet). Tracks per-surah status and which ayahs
// the user has marked memorised. Stored in localStorage keyed by surah slug.
export type HifzStatus = 'NotStarted' | 'InProgress' | 'Completed'

const STATUS_KEY = 'mymaqtab_hifz_status'
const MEMO_KEY = 'mymaqtab_hifz_memorised'

function read(key: string): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}')
  } catch {
    return {}
  }
}

export function getStatus(slug: string): HifzStatus {
  return (read(STATUS_KEY)[slug] as HifzStatus) ?? 'NotStarted'
}

export function setStatus(slug: string, status: HifzStatus): void {
  const all = read(STATUS_KEY)
  all[slug] = status
  localStorage.setItem(STATUS_KEY, JSON.stringify(all))
}

export function getMemorised(slug: string): number[] {
  const v = read(MEMO_KEY)[slug]
  return Array.isArray(v) ? v : []
}

export function toggleMemorised(slug: string, ayahNo: number): number[] {
  const all = read(MEMO_KEY)
  const set = new Set<number>(Array.isArray(all[slug]) ? all[slug] : [])
  if (set.has(ayahNo)) set.delete(ayahNo)
  else set.add(ayahNo)
  const arr = [...set].sort((a, b) => a - b)
  all[slug] = arr
  localStorage.setItem(MEMO_KEY, JSON.stringify(all))
  return arr
}
