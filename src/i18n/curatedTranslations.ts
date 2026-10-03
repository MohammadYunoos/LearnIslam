import { ADAAB_I18N } from '../content/i18n/adaab.i18n'
import { DETOXIFY_I18N } from '../content/i18n/detoxify.i18n'
import { GUIDE_I18N } from '../content/i18n/guide.i18n'
import { MASNOON_I18N } from '../content/i18n/masnoon.i18n'
import { SURAHS_I18N } from '../content/i18n/surahs.i18n'
import { UI_I18N } from '../content/i18n/ui.i18n'
import type { Tr } from '../content/i18n/types'

const rows: Tr[] = [
  ...UI_I18N,
  ...ADAAB_I18N,
  ...DETOXIFY_I18N,
  ...GUIDE_I18N,
  ...MASNOON_I18N,
  ...SURAHS_I18N,
]

const curated = new Map(rows.map((row) => [row.en, row]))

export function curatedTranslation(text: string, lang: string): string | null {
  const row = curated.get(text) ?? curated.get(text.trim())
  if (!row) return null
  if (lang === 'ur-roman') return row.roman
  if (lang === 'ur') return row.ur
  return null
}
