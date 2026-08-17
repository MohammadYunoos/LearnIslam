// src/content/i18n/types.ts
// Shared shape for every curated translation batch. `en` is copied BYTE-EXACT
// from the source content/UI string (curly quotes “ ” ‘ ’, ﷺ, em-dashes, …).
// `ur` = natural Urdu script; `roman` = Roman Urdu (English letters).
// Keep each entry on ONE line so scripts/gen-translations.mjs can parse it.
export interface Tr {
  en: string
  ur: string
  roman: string
}
