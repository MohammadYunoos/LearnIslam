// src/content/surahs.ts
// Hifz surahs — Arabic text + meaning per ayah, and per-ayah audio.
//
// AUDIO: files live in Supabase Storage, one mp3 per ayah in number order
// (1.mp3, 2.mp3, …) inside a folder per surah. Set AUDIO_BUCKET / AUDIO_PREFIX
// to match your storage, then each ayah's audio = `${folder}/${n}.mp3`.
import { supabase } from '../lib/supabase'

// Storage layout: LearnIslam/Hifz/<folder>/<3-digit surah><3-digit ayah>.mp3
// e.g. An-Nas (114) ayah 2 → Hifz/An_Nas/114002.mp3
export const AUDIO_BUCKET = 'LearnIslam'
export const AUDIO_PREFIX = 'Hifz/'

export interface Ayah {
  arabic: string
  translation: string
  noAudio?: boolean // true when no mp3 exists for this ayah
  audioFile?: string // override the derived filename (e.g. non-standard name)
}

export interface Surah {
  slug: string
  folder: string // exact storage folder name
  number: number // Qur'an surah number (used in the audio filename)
  name: string
  arabicName: string
  meaning: string
  ayahs: Ayah[]
}

const pad3 = (n: number) => String(n).padStart(3, '0')

// Audio for the given surah + ayah number (1-based). Returns null if no audio.
export function ayahAudioUrl(surah: Surah, ayahNo: number): string | null {
  const ayah = surah.ayahs[ayahNo - 1]
  if (ayah?.noAudio) return null
  const file = ayah?.audioFile ?? `${pad3(surah.number)}${pad3(ayahNo)}.mp3`
  const path = `${AUDIO_PREFIX}${surah.folder}/${file}`
  return supabase.storage.from(AUDIO_BUCKET).getPublicUrl(path).data.publicUrl
}

export const SURAHS: Surah[] = [
  {
    slug: 'al-fatiha',
    folder: 'Al_Fatiah',
    number: 1,
    name: 'Al-Fatiha',
    arabicName: 'الفاتحة',
    meaning: 'The Opening',
    ayahs: [
      { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful.', audioFile: '001001 (1).mp3' },
      { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'All praise is for Allah, Lord of all the worlds.' },
      { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Most Gracious, the Most Merciful.' },
      { arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Master of the Day of Judgment.' },
      { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'You alone we worship, and You alone we ask for help.' },
      { arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us along the straight path.' },
      { arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those You have blessed — not those who earned anger, nor those who went astray.' },
    ],
  },
  {
    slug: 'al-asr',
    folder: 'Al_Asr',
    number: 103,
    name: 'Al-Asr',
    arabicName: 'العصر',
    meaning: 'The Declining Day',
    ayahs: [
      { arabic: 'وَالْعَصْرِ', translation: 'By time,' },
      { arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', translation: 'Indeed, mankind is in loss,' },
      { arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', translation: 'Except those who believe, do righteous deeds, and urge one another to truth and to patience.' },
    ],
  },
  {
    slug: 'al-ikhlas',
    folder: 'Al_Ikhlas',
    number: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الإخلاص',
    meaning: 'Sincerity',
    ayahs: [
      { arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Say, He is Allah, the One.' },
      { arabic: 'اللَّهُ الصَّمَدُ', translation: 'Allah, the Eternal Refuge.' },
      { arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: 'He neither begets nor is born,' },
      { arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', translation: 'Nor is there to Him any equivalent.' },
    ],
  },
  {
    slug: 'al-falaq',
    folder: 'Al_Falaqh',
    number: 113,
    name: 'Al-Falaq',
    arabicName: 'الفلق',
    meaning: 'The Daybreak',
    ayahs: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', translation: 'Say, I seek refuge in the Lord of daybreak,' },
      { arabic: 'مِن شَرِّ مَا خَلَقَ', translation: 'From the evil of what He created,' },
      { arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'And from the evil of darkness when it settles,' },
      { arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', translation: 'And from the evil of the blowers in knots,' },
      { arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translation: 'And from the evil of an envier when he envies.' },
    ],
  },
  {
    slug: 'an-nas',
    folder: 'An_Nas',
    number: 114,
    name: 'An-Nas',
    arabicName: 'الناس',
    meaning: 'Mankind',
    ayahs: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translation: 'Say, I seek refuge in the Lord of mankind,' },
      { arabic: 'مَلِكِ النَّاسِ', translation: 'The King of mankind,' },
      { arabic: 'إِلَٰهِ النَّاسِ', translation: 'The God of mankind,' },
      { arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', translation: 'From the evil of the retreating whisperer,' },
      { arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', translation: 'Who whispers in the breasts of mankind,' },
      { arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', translation: 'From among jinn and mankind.' },
    ],
  },
  {
    slug: 'al-kawthar',
    folder: 'Al_Kausar',
    number: 108,
    name: 'Al-Kawthar',
    arabicName: 'الكوثر',
    meaning: 'Abundance',
    ayahs: [
      { arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', translation: 'Indeed, We have granted you al-Kawthar.' },
      { arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', translation: 'So pray to your Lord and sacrifice.' },
      { arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', translation: 'Indeed, your enemy is the one cut off.' },
    ],
  },
]

export function getSurah(slug: string): Surah | undefined {
  return SURAHS.find((s) => s.slug === slug)
}
