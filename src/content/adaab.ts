// src/content/adaab.ts
// Adaab = the etiquettes (manners) of daily life in Islam. Maslak: Hanafi / Deobandi.
// Same reference policy as the guide: a reference is shown only where well established
// (Qur'an ayah, or a hadith with a known narrator/collection). Confirm with an Alim.
import { MASLAK } from './guide'
import type { GuideItem } from './guide'

export { MASLAK }

export interface AdaabTopic {
  slug: string
  title: string
  arabic?: string
  icon: string
  intro?: string
  items: GuideItem[]
}

const eating: AdaabTopic = {
  slug: 'eating',
  title: 'Eating',
  arabic: 'آداب الأكل',
  icon: '🍽️',
  intro: 'Manners of eating food.',
  items: [
    { text: 'Wash both hands before and after eating.' },
    { text: 'Say “Bismillah” before starting. If forgotten, say “Bismillahi awwalahu wa akhirahu”.', refs: [{ source: 'Tirmidhi / Abu Dawud — Aisha' }] },
    { text: 'Eat with the right hand, and eat from what is directly in front of you.', refs: [{ source: 'Bukhari & Muslim — Umar ibn Abi Salamah' }] },
    { text: 'Sit and eat; do not eat while leaning back.', refs: [{ source: 'Sahih al-Bukhari — Abu Juhayfah' }] },
    { text: 'Eat from the sides of the dish, not from the middle — blessing descends in the middle.', refs: [{ source: 'Tirmidhi / Abu Dawud — Ibn Abbas' }] },
    { text: 'Do not find fault with food; eat it if you like it, otherwise leave it.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Eat with three fingers and clean the fingers and the plate when finished.', refs: [{ source: 'Sahih Muslim — Ka‘b ibn Malik / Jabir' }] },
    { text: 'Eat and drink in moderation; do not overfill the stomach.', refs: [{ source: "Qur'an 7:31 — “eat and drink, but do not be excessive”" }] },
    { text: 'Do not use gold or silver utensils.', refs: [{ source: 'Bukhari & Muslim — Hudhayfah' }] },
    { text: 'Praise Allah when finished: “Alhamdulillahil-ladhi at‘amana wa saqana wa ja‘alana muslimin”.', refs: [{ source: 'Tirmidhi / Abu Dawud' }] },
    { text: 'If a morsel falls, pick it up, remove any dirt and eat it; do not leave it for Shaytan.', refs: [{ source: 'Sahih Muslim — Jabir' }] },
    { text: 'Do not blow on hot food or drink; wait for it to cool.', refs: [{ source: 'Tirmidhi / Abu Dawud — Ibn Abbas' }] },
    { text: 'Eat together, not separately — there is blessing in eating in a group.', refs: [{ source: 'Sunan Abu Dawud — Wahshi ibn Harb' }] },
    { text: 'The food of two suffices three, and the food of three suffices four.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Lick the fingers and wipe the plate clean; you do not know in which part the blessing lies.', refs: [{ source: 'Sahih Muslim — Jabir / Ibn Abbas' }] },
    { text: 'Do not waste food; honour it and give any surplus to others.', refs: [{ source: "Qur'an 6:141 — “do not be wasteful”" }] },
    { text: 'Make du’a for the one who feeds you: “Allahumma at‘im man at‘amani…”.', refs: [{ source: 'Sahih Muslim — Miqdad' }] },
  ],
}

const drinking: AdaabTopic = {
  slug: 'drinking',
  title: 'Drinking',
  arabic: 'آداب الشرب',
  icon: '🥛',
  items: [
    { text: 'Say “Bismillah” and drink with the right hand.', refs: [{ source: 'Bukhari & Muslim — Umar ibn Abi Salamah' }] },
    { text: 'Sit while drinking (preferred); drink in three breaths, not one gulp.', refs: [{ source: 'Sahih Muslim — Anas' }] },
    { text: 'Do not breathe into the vessel while drinking.', refs: [{ source: 'Bukhari & Muslim — Abu Qatadah' }] },
    { text: 'Look at the water before drinking; do not drink from a cracked or broken edge.' },
    { text: 'When sharing, pass to the one on the right.', refs: [{ source: 'Bukhari & Muslim — Anas' }] },
    { text: 'The one who pours/serves drinks last.', refs: [{ source: 'Sahih Muslim — Abu Qatadah' }] },
    { text: 'Do not drink directly from the mouth of a water-skin or large vessel.', refs: [{ source: 'Sahih al-Bukhari — Abu Hurayrah' }] },
    { text: 'When given milk, say: “Allahumma barik lana fihi wa zidna minhu”.', refs: [{ source: 'Tirmidhi / Abu Dawud — Ibn Abbas' }] },
    { text: 'Do not throw away leftover water; give it to others or an animal.' },
    { text: 'Say “Alhamdulillah” after drinking.' },
  ],
}

const sleeping: AdaabTopic = {
  slug: 'sleeping',
  title: 'Sleeping',
  arabic: 'آداب النوم',
  icon: '🌙',
  items: [
    { text: 'Perform wudu before going to sleep.', refs: [{ source: 'Bukhari & Muslim — Al-Bara ibn Azib' }] },
    { text: 'Dust off the bed three times before lying down.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Sleep on the right side, hand under the cheek.', refs: [{ source: 'Bukhari & Muslim — Al-Bara ibn Azib' }] },
    { text: 'Recite Ayat al-Kursi, the last two ayahs of Surah Al-Baqarah, and Surah Al-Mulk.', refs: [{ source: "Qur'an 2:255, 2:285-286" }, { source: 'Sahih al-Bukhari — Abu Hurayrah (Ayat al-Kursi)' }] },
    { text: 'Recite the three Quls (Ikhlas, Falaq, Nas), blow into the palms and wipe over the body three times.', refs: [{ source: 'Sahih al-Bukhari — Aisha' }] },
    { text: 'Say the sleeping du’a: “Allahumma bismika amutu wa ahya”.', refs: [{ source: 'Sahih al-Bukhari — Hudhayfah' }] },
    { text: 'On waking say: “Alhamdulillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur”.', refs: [{ source: 'Sahih al-Bukhari — Hudhayfah' }] },
    { text: 'Do not sleep on the stomach — this posture is disliked.', refs: [{ source: 'Tirmidhi / Abu Dawud — Ya‘ish / Abu Dharr' }] },
    { text: 'Recite Tasbih-e-Fatima before sleeping — SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34.', refs: [{ source: 'Bukhari & Muslim — Ali ibn Abi Talib' }] },
    { text: 'Sleep early after Isha; avoid staying up needlessly.', refs: [{ source: 'Sahih al-Bukhari — Abu Barzah' }] },
    { text: 'Cover food and drink vessels and put out any open flame before sleeping.', refs: [{ source: 'Bukhari & Muslim — Jabir' }] },
    { text: 'On a bad dream, seek refuge in Allah, spit lightly to the left three times, change side, and do not tell anyone.', refs: [{ source: 'Bukhari & Muslim — Abu Qatadah' }] },
    { text: 'Sleep with a clean heart — forgive others before sleeping.' },
  ],
}

const toilet: AdaabTopic = {
  slug: 'toilet',
  title: 'Toilet & Istinja',
  arabic: 'آداب قضاء الحاجة',
  icon: '🚽',
  items: [
    { text: 'Enter with the left foot, saying “Allahumma inni a‘udhu bika minal khubuthi wal khaba’ith”.', refs: [{ source: 'Bukhari & Muslim — Anas' }] },
    { text: 'Leave with the right foot, saying “Ghufranaka”.', refs: [{ source: 'Tirmidhi / Abu Dawud — Aisha' }] },
    { text: 'Do not face the Qibla or turn the back towards it while relieving oneself.', refs: [{ source: 'Bukhari & Muslim — Abu Ayyub al-Ansari' }] },
    { text: 'Use the left hand for istinja (cleaning); do not use the right hand.', refs: [{ source: 'Bukhari & Muslim — Abu Qatadah' }] },
    { text: 'Clean thoroughly with water (or stones/tissue where water is unavailable).' },
    { text: 'Do not carry anything bearing the name of Allah or Qur’an unnecessarily, and avoid talking inside.' },
    { text: 'Choose a concealed place and do not expose the satr before others.' },
    { text: 'Do not face or expose oneself towards the sun or moon while relieving oneself.' },
    { text: 'Do not relieve oneself in still water, on pathways, or where people rest.', refs: [{ source: 'Sahih Muslim — Abu Hurayrah' }] },
    { text: 'Remove any impurity and make wudu afterwards for prayer.' },
  ],
}

const salam: AdaabTopic = {
  slug: 'salam',
  title: 'Salam & Greeting',
  arabic: 'آداب السلام',
  icon: '🤝',
  items: [
    { text: 'Spread the salam among one another — it increases love.', refs: [{ source: 'Sahih Muslim — Abu Hurayrah' }] },
    { text: 'The full greeting: “Assalamu alaikum wa rahmatullahi wa barakatuh”.' },
    { text: 'Reply with an equal or better greeting.', refs: [{ source: "Qur'an 4:86" }] },
    { text: 'The rider greets the walker, the walker greets the sitting, and the smaller group greets the larger.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Give salam when entering a gathering and when leaving it.', refs: [{ source: 'Tirmidhi / Abu Dawud — Abu Hurayrah' }] },
    { text: 'Respond to a sneezer, visit the sick, and fulfil promises — rights of a Muslim.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
  ],
}

const home: AdaabTopic = {
  slug: 'home',
  title: 'Entering / Leaving Home',
  arabic: 'آداب دخول المنزل',
  icon: '🏠',
  items: [
    { text: 'Enter with the right foot, say “Bismillah”, and greet the household with salam.', refs: [{ source: "Qur'an 24:61" }] },
    { text: 'Mention Allah’s name when entering and when eating — it keeps Shaytan out.', refs: [{ source: 'Sahih Muslim — Jabir' }] },
    { text: 'When leaving say: “Bismillahi tawakkaltu ‘alallah, la hawla wa la quwwata illa billah”.', refs: [{ source: 'Tirmidhi / Abu Dawud — Anas' }] },
    { text: 'Seek permission (isti’dhan) before entering others’ homes, up to three times.', refs: [{ source: "Qur'an 24:27-28" }] },
  ],
}

const masjid: AdaabTopic = {
  slug: 'masjid',
  title: 'The Masjid',
  arabic: 'آداب المسجد',
  icon: '🕌',
  items: [
    { text: 'Enter with the right foot, saying “Allahumma iftah li abwaba rahmatik”.', refs: [{ source: 'Sahih Muslim — Abu Humaid / Abu Usaid' }] },
    { text: 'Leave with the left foot, saying “Allahumma inni as’aluka min fadlik”.', refs: [{ source: 'Sahih Muslim — Abu Humaid / Abu Usaid' }] },
    { text: 'Pray two rak’ah (Tahiyyat al-Masjid) before sitting down.', refs: [{ source: 'Bukhari & Muslim — Abu Qatadah' }] },
    { text: 'Come in a state of wudu, in clean clothes, without the smell of raw onion/garlic.', refs: [{ source: 'Bukhari & Muslim — Jabir' }] },
    { text: 'Keep the masjid clean and quiet; no worldly buying and selling inside.', refs: [{ source: 'Tirmidhi — Abu Hurayrah (trading in the masjid)' }] },
  ],
}

const sneezing: AdaabTopic = {
  slug: 'sneezing',
  title: 'Sneezing & Yawning',
  arabic: 'آداب العطاس',
  icon: '🤧',
  items: [
    { text: 'When you sneeze, say “Alhamdulillah”, and lower the voice while covering the mouth.', refs: [{ source: 'Sahih al-Bukhari — Abu Hurayrah' }] },
    { text: 'The one who hears it replies “Yarhamukallah”.', refs: [{ source: 'Sahih al-Bukhari — Abu Hurayrah' }] },
    { text: 'The sneezer then answers “Yahdikumullahu wa yuslihu balakum”.', refs: [{ source: 'Sahih al-Bukhari — Abu Hurayrah' }] },
    { text: 'Yawning is from Shaytan — suppress it as much as possible and cover the mouth with the hand.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
  ],
}

const clothing: AdaabTopic = {
  slug: 'clothing',
  title: 'Clothing & Dressing',
  arabic: 'آداب اللباس',
  icon: '👕',
  items: [
    { text: 'Begin with the right side when putting on clothes and shoes; begin with the left when removing.', refs: [{ source: 'Bukhari & Muslim — Aisha' }] },
    { text: 'Recite the du’a for new clothes, thanking Allah for the covering.', refs: [{ source: 'Tirmidhi / Abu Dawud — Abu Sa‘id' }] },
    { text: 'Men must not let the lower garment hang below the ankles (isbal) out of pride.', gender: 'male', refs: [{ source: 'Sahih al-Bukhari — Abu Hurayrah' }] },
    { text: 'Men must not wear silk or gold.', gender: 'male', refs: [{ source: 'Bukhari & Muslim — Umar / Ali' }] },
    { text: 'Women should observe full, loose, modest covering (hijab) before non-mahram.', gender: 'female', refs: [{ source: "Qur'an 33:59, 24:31" }] },
    { text: 'Dress modestly and cleanly; avoid imitating the opposite gender.', refs: [{ source: 'Sahih al-Bukhari — Ibn Abbas' }] },
  ],
}

const travel: AdaabTopic = {
  slug: 'travel',
  title: 'Travel',
  arabic: 'آداب السفر',
  icon: '🧳',
  items: [
    { text: 'Recite the travel du’a when setting out: “Subhanal-ladhi sakhkhara lana hadha…”.', refs: [{ source: "Qur'an 43:13-14" }, { source: 'Sahih Muslim — Ibn Umar' }] },
    { text: 'Say “Allahu Akbar” when going up an incline and “Subhanallah” when going down.', refs: [{ source: 'Sahih al-Bukhari — Jabir' }] },
    { text: 'Appoint a leader (amir) when three or more travel together.', refs: [{ source: 'Sunan Abu Dawud — Abu Hurayrah' }] },
    { text: 'A traveller may shorten (qasr) the four-rak’ah fard to two.', refs: [{ source: "Qur'an 4:101" }] },
    { text: 'Seek Allah’s protection and return promptly to the family once the need is met.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
  ],
}

export const ADAAB_TOPICS: AdaabTopic[] = [
  eating,
  drinking,
  sleeping,
  toilet,
  salam,
  home,
  masjid,
  sneezing,
  clothing,
  travel,
]

export function getAdaab(slug: string): AdaabTopic | undefined {
  return ADAAB_TOPICS.find((t) => t.slug === slug)
}
