// src/i18n/contentLang.ts
// Maps the app language to the DB `language` column used by content tables
// (qa_volumes, maqtab_lessons). Only Roman Urdu has curated rows today;
// everything else falls back to the English row (then MT translates as usual).
export const CONTENT_DB_LANG: Record<string, string> = {
  'ur-roman': 'english-urdu',
}

export function contentDbLang(appLang: string): string {
  return CONTENT_DB_LANG[appLang] ?? 'english'
}
