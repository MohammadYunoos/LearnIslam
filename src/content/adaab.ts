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
    { text: 'Give salam even if the house is empty: “Assalamu ‘alaina wa ‘ala ‘ibadillahis-salihin”.', refs: [{ source: "Qur'an 24:61" }] },
    { text: 'Use the miswak on entering the home, as was the Prophet’s ﷺ habit.', refs: [{ source: 'Sahih Muslim — Aisha' }] },
    { text: 'Help the household with chores — the Prophet ﷺ served his family.', refs: [{ source: 'Sahih al-Bukhari — Aisha' }] },
    { text: 'Recite Surah Al-Baqarah in the home; Shaytan flees from a house in which it is recited.', refs: [{ source: 'Sahih Muslim — Abu Hurayrah' }] },
    { text: 'At nightfall close the doors, cover the vessels and mention Allah’s name.', refs: [{ source: 'Bukhari & Muslim — Jabir' }] },
    { text: 'Do not keep pictures of living beings or a dog (except for guarding/farming) in the home.', refs: [{ source: 'Bukhari & Muslim — Abu Talha' }] },
    { text: 'Keep the home clean and remove anything harmful from the path/entrance.' },
    { text: 'Do not return to the family suddenly late at night without notice.', refs: [{ source: 'Bukhari & Muslim — Jabir' }] },
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
    { text: 'Walk to the masjid calmly and with dignity; do not run, even if the prayer has started.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Do not disturb others’ prayer or raise the voice in recitation over them.', refs: [{ source: 'Sunan Abu Dawud — Abu Sa‘id' }] },
    { text: 'Do not announce lost property in the masjid.', refs: [{ source: 'Sahih Muslim — Abu Hurayrah' }] },
    { text: 'Seek the front rows — there is great virtue in the first row.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Pray towards a sutrah (barrier) and do not let anyone pass directly in front.', refs: [{ source: 'Bukhari & Muslim — Abu Sa‘id' }] },
    { text: 'While waiting for salah you are “in prayer”, and the angels send blessings upon you.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Women’s rows are behind the men’s; maintain modesty and order.', refs: [{ source: 'Sahih Muslim — Abu Hurayrah' }] },
    { text: 'Straighten and fill the rows, closing gaps for the congregation.', refs: [{ source: 'Bukhari & Muslim — Anas' }] },
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
    { text: 'Always keep the awrah covered — men from navel to knee, women all but the face and hands.', refs: [{ source: "Qur'an 24:31" }] },
    { text: 'White garments are recommended, and keep clothes clean.', refs: [{ source: 'Tirmidhi / Abu Dawud — Ibn Abbas' }] },
    { text: 'Avoid clothing worn for fame or show (libas ash-shuhrah).', refs: [{ source: 'Sunan Abu Dawud — Ibn Umar' }] },
    { text: 'Wear both shoes or neither; put on the right first, take off the left first.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Women must not wear tight, transparent clothing, nor perfume before non-mahram.', gender: 'female', refs: [{ source: 'Sahih Muslim — Abu Hurayrah' }] },
    { text: 'Men should keep the beard and trim the moustache (fitrah).', gender: 'male', refs: [{ source: 'Bukhari & Muslim — Ibn Umar' }] },
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
    { text: 'Travel in company; a single rider is a devil, two are devils, three are a travelling party.', refs: [{ source: 'Tirmidhi / Abu Dawud — Amr ibn Shu‘ayb' }] },
    { text: 'When three set out, they should appoint one of them as amir (leader).', refs: [{ source: 'Sunan Abu Dawud — Abu Sa‘id' }] },
    { text: 'Make plentiful du’a — the traveller’s supplication is accepted.', refs: [{ source: 'Tirmidhi — Abu Hurayrah' }] },
    { text: 'Bid farewell to loved ones: “Astawdi‘ullaha dinaka wa amanataka wa khawatima ‘amalika”.', refs: [{ source: 'Tirmidhi — Ibn Umar' }] },
    { text: 'A traveller may combine and shorten prayers as permitted.', refs: [{ source: 'Sahih Muslim — Ibn Abbas' }] },
    { text: 'On returning, it is Sunnah to first go to the masjid and pray two rak’ah.', refs: [{ source: 'Sahih al-Bukhari — Ka‘b ibn Malik' }] },
    { text: 'Do not arrive home unannounced late at night.', refs: [{ source: 'Bukhari & Muslim — Jabir' }] },
  ],
}

const gatherings: AdaabTopic = {
  slug: 'gatherings',
  title: 'Gatherings (Majlis)',
  arabic: 'آداب المجلس',
  icon: '👥',
  items: [
    { text: 'Give salam when arriving at a gathering and when leaving it.', refs: [{ source: 'Tirmidhi / Abu Dawud — Abu Hurayrah' }] },
    { text: 'Make room for others; do not make anyone rise to take his seat.', refs: [{ source: "Qur'an 58:11" }, { source: 'Bukhari & Muslim — Ibn Umar' }] },
    { text: 'Sit where there is space; do not sit between two people without their permission.', refs: [{ source: 'Sunan Abu Dawud — Amr ibn Shu‘ayb' }] },
    { text: 'Do not whisper between two people while excluding a third.', refs: [{ source: 'Bukhari & Muslim — Ibn Mas‘ud' }] },
    { text: 'Speak good or remain silent; avoid backbiting and idle talk.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Lower the gaze and be humble; do not dominate the gathering.' },
    { text: 'Recite the du’a on leaving (kaffarah al-majlis): “Subhanaka Allahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk”.', refs: [{ source: 'Tirmidhi — Abu Hurayrah' }] },
    { text: 'Honour the guest and the elder; begin serving from the right.', refs: [{ source: 'Bukhari & Muslim — Anas' }] },
  ],
}

const parents: AdaabTopic = {
  slug: 'parents',
  title: 'Parents & Elders',
  arabic: 'بر الوالدين',
  icon: '👴',
  items: [
    { text: 'Be kind and obedient to parents; lower the wing of humility to them.', refs: [{ source: "Qur'an 17:23-24" }] },
    { text: 'Never say “uff” to them nor rebuke them; speak a gracious word.', refs: [{ source: "Qur'an 17:23" }] },
    { text: 'Seek their pleasure — Allah’s pleasure lies in the pleasure of the parents.', refs: [{ source: 'Tirmidhi — Abdullah ibn Amr' }] },
    { text: 'Serve them, spend on them, and make du’a: “Rabbir-hamhuma kama rabbayani saghira”.', refs: [{ source: "Qur'an 17:24" }] },
    { text: 'Respect elders and show mercy to the young.', refs: [{ source: 'Sunan Abu Dawud / Tirmidhi — Ibn Amr' }] },
    { text: 'Maintain kindness after their death — du’a, charity, and keeping ties with their friends.', refs: [{ source: 'Sahih Muslim — Ibn Umar' }] },
    { text: 'Keep ties of kinship (silah rahm); do not sever relations.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
  ],
}

const speech: AdaabTopic = {
  slug: 'speech',
  title: 'Speech & the Tongue',
  arabic: 'آداب الكلام',
  icon: '🗣️',
  items: [
    { text: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', refs: [{ source: 'Bukhari & Muslim — Abu Hurayrah' }] },
    { text: 'Be truthful; truthfulness leads to righteousness and to Paradise.', refs: [{ source: 'Bukhari & Muslim — Ibn Mas‘ud' }] },
    { text: 'Avoid backbiting (gheebah) and tale-carrying (nameemah).', refs: [{ source: "Qur'an 49:12" }] },
    { text: 'Lower your voice; the harshest of voices is the braying of a donkey.', refs: [{ source: "Qur'an 31:19" }] },
    { text: 'Do not argue even when you are right; abandon lying even in jest.', refs: [{ source: 'Sunan Abu Dawud — Abu Umamah' }] },
    { text: 'Fulfil promises and speak with justice, even against oneself.', refs: [{ source: "Qur'an 6:152" }] },
    { text: 'Do not mock, insult, or call others by offensive nicknames.', refs: [{ source: "Qur'an 49:11" }] },
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
  gatherings,
  parents,
  speech,
]

export function getAdaab(slug: string): AdaabTopic | undefined {
  return ADAAB_TOPICS.find((t) => t.slug === slug)
}
