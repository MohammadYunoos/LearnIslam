// src/services/quranText.ts
// Fetches per-ayah translations in the user's language from alquran.cloud.
// Cached in localStorage so it works offline after the first load.
const EDITION: Record<string, string> = {
  en: 'en.sahih',
  ur: 'ur.jalandhry',
  hi: 'hi.hindi',
  bn: 'bn.bengali',
  ms: 'ms.basmeih',
  id: 'id.indonesian',
}

const mem: Record<string, string[]> = {}

export function editionFor(lang?: string): string {
  return EDITION[lang ?? 'en'] ?? 'en.sahih'
}

// Roman-script pronunciation (e.g. "Min sharri maa khalaq").
export async function getSurahTransliteration(surahNumber: number): Promise<string[] | null> {
  return fetchEdition(surahNumber, 'en.transliteration')
}

// Returns an array of ayah translations (index 0 = ayah 1), or null on failure.
export async function getSurahTranslation(
  surahNumber: number,
  lang?: string
): Promise<string[] | null> {
  return fetchEdition(surahNumber, editionFor(lang))
}

async function fetchEdition(surahNumber: number, edition: string): Promise<string[] | null> {
  const key = `mymaqtab_tr_${surahNumber}_${edition}`
  if (mem[key]) return mem[key]

  const cached = localStorage.getItem(key)
  if (cached) {
    try {
      const arr = JSON.parse(cached) as string[]
      mem[key] = arr
      return arr
    } catch {
      /* refetch below */
    }
  }

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`)
    const json = await res.json()
    const arr: string[] | undefined = json?.data?.ayahs?.map((a: { text: string }) => a.text)
    if (arr && arr.length) {
      mem[key] = arr
      try {
        localStorage.setItem(key, JSON.stringify(arr))
      } catch {
        /* storage full — ignore */
      }
      return arr
    }
    return null
  } catch {
    return null
  }
}
