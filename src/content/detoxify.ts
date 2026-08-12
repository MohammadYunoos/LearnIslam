// src/content/detoxify.ts
// Detoxify — tazkiyah (purifying the heart). Each topic links out to talks by
// well-known scholars. To avoid dead links we open a YouTube search scoped to
// the scholar + topic (always valid) rather than hardcoding video ids.

export interface HeartTopic {
  slug: string
  title: string
  arabic?: string
  desc: string
  keyword: string // search phrase for this disease of the heart
}

export const SCHOLARS = [
  'Mufti Menk',
  'Maulana Tariq Jameel',
  'Tariq Masood',
  'Nouman Ali Khan',
]

export function ytSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

export const HEART_TOPICS: HeartTopic[] = [
  { slug: 'anger', title: 'Anger', arabic: 'الغضب', desc: 'Controlling rage and responding with patience.', keyword: 'controlling anger in islam' },
  { slug: 'jealousy', title: 'Jealousy (Hasad)', arabic: 'الحسد', desc: 'Removing envy of what others have.', keyword: 'jealousy hasad islam' },
  { slug: 'pride', title: 'Pride & Attitude (Kibr)', arabic: 'الكبر', desc: 'Letting go of arrogance and ego.', keyword: 'pride arrogance kibr islam' },
  { slug: 'backbiting', title: 'Backbiting (Gheebah)', arabic: 'الغيبة', desc: 'Guarding the tongue from speaking ill of others.', keyword: 'backbiting gheebah islam' },
  { slug: 'greed', title: 'Greed & Love of Dunya', arabic: 'الحرص', desc: 'Freeing the heart from greed and worldly attachment.', keyword: 'greed love of dunya islam' },
  { slug: 'showing-off', title: 'Showing Off (Riya)', arabic: 'الرياء', desc: 'Purifying intentions and sincerity for Allah.', keyword: 'showing off riya sincerity islam' },
  { slug: 'grudge', title: 'Grudges & Hatred', arabic: 'الحقد', desc: 'Forgiving others and clearing hatred from the heart.', keyword: 'forgiveness removing grudge hatred islam' },
  { slug: 'hard-heart', title: 'Hard-heartedness', arabic: 'قسوة القلب', desc: 'Softening the heart through dhikr and the Qur’an.', keyword: 'softening the hard heart islam' },
  { slug: 'ingratitude', title: 'Ingratitude', arabic: 'كفران النعمة', desc: 'Building gratitude (shukr) for Allah’s blessings.', keyword: 'gratitude shukr islam' },
]

export function getHeartTopic(slug: string): HeartTopic | undefined {
  return HEART_TOPICS.find((t) => t.slug === slug)
}
