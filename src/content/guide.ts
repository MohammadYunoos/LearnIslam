// src/content/guide.ts
// My Guide content. Maslak: Hanafi / Deobandi.
//
// Rulings follow the standard Hanafi position (as in Nur al-Idah, Bahishti
// Zewar, Taleem-ul-Haqq). A reference is attached only where it is well
// established (Qur'an ayah, or a hadith with a known narrator/collection);
// otherwise no reference is shown. Even so, every ruling should be confirmed
// with a qualified Alim before release.

export type Audience = 'male' | 'female' // undefined = applies to everyone

export interface Reference {
  source: string
  text?: string
}

export interface GuideItem {
  text: string
  refs?: Reference[]
  gender?: Audience
}

export interface GuideSection {
  key: string
  title: string
  items: GuideItem[]
}

export interface GuideStep {
  title: string
  description: string
  icon?: string
  animationUrl?: string // full external image/GIF URL
  image?: string // storage path in the LearnIslam bucket, e.g. "Namaaz/ruku.png"
  refs?: Reference[]
  gender?: Audience
}

export type GuideGroup = 'purity' | 'salah' | 'more'

export interface GuideTopic {
  slug: string
  title: string
  arabic?: string
  icon: string
  group: GuideGroup
  maslak: string
  hasSteps: boolean
  stepsTitle?: string // heading shown on the step-by-step player
  sections: GuideSection[]
  steps?: GuideStep[]
}

export const MASLAK = 'Hanafi / Deobandi'

export const GROUP_LABELS: Record<GuideGroup, string> = {
  purity: 'Taharat — Purification',
  salah: 'Namaaz',
  more: 'More',
}

// Reusable, well-established references
const R = {
  wuduAyah: { source: "Qur'an 5:6" } as Reference,
  intention: { source: 'Bukhari & Muslim — Umar ibn al-Khattab: “Actions are but by intentions.”' } as Reference,
  miswak: { source: 'Bukhari & Muslim — Abu Hurayrah: miswak at every wudu/salah' } as Reference,
  tayammumAyah: { source: "Qur'an 4:43" } as Reference,
  fatiha: { source: 'Bukhari & Muslim — Ubadah ibn as-Samit: “No salah without Al-Fatiha.”' } as Reference,
  rukuSujudAyah: { source: "Qur'an 22:77" } as Reference,
  qibla: { source: "Qur'an 2:144" } as Reference,
  salahTimes: { source: "Qur'an 4:103" } as Reference,
  badPrayer: { source: 'Bukhari & Muslim — Abu Hurayrah: “the one who prayed badly” (ta’dil-e-arkan)' } as Reference,
  talking: { source: 'Sahih Muslim — Mu’awiyah ibn al-Hakam: talking invalidates salah' } as Reference,
  fastAyah: { source: "Qur'an 2:183, 2:185, 2:187" } as Reference,
  sehri: { source: 'Bukhari & Muslim — Anas: “Take sehri, for in it is blessing.”' } as Reference,
  iftar: { source: 'Bukhari & Muslim — Sahl ibn Sa’d: hasten the iftar' } as Reference,
  arafah: { source: 'Tirmidhi & Abu Dawud — Abd al-Rahman ibn Ya’mar: “Hajj is Arafah.”' } as Reference,
}

const wudu: GuideTopic = {
  slug: 'wudu',
  title: 'Wudu (Wadu)',
  arabic: 'الوضوء',
  icon: '💧',
  group: 'purity',
  maslak: MASLAK,
  hasSteps: true,
  sections: [
    {
      key: 'faraiz',
      title: 'Faraiz (Obligatory) — 4',
      items: [
        { text: 'Wash the whole face once — from the top of the forehead (hairline) to the bottom of the chin, and from one earlobe to the other.', refs: [R.wuduAyah] },
        { text: 'Wash both arms including the elbows once.', refs: [R.wuduAyah] },
        { text: 'Wipe (masah) at least one-quarter of the head once.', refs: [R.wuduAyah] },
        { text: 'Wash both feet including the ankles once.', refs: [R.wuduAyah] },
      ],
    },
    {
      key: 'sunan',
      title: 'Sunnah',
      items: [
        { text: 'Making the intention (niyyah) for wudu.', refs: [R.intention] },
        { text: 'Saying Bismillah at the beginning.' },
        { text: 'Washing both hands up to the wrists three times at the start.' },
        { text: 'Using the miswak (or finger if unavailable).', refs: [R.miswak] },
        { text: 'Rinsing the mouth three times (madmadah), gargling if not fasting.' },
        { text: 'Sniffing water into the nose three times (istinshaq).' },
        { text: 'Khilal of the beard and between the fingers and toes.' },
        { text: 'Washing each limb three times.' },
        { text: 'Masah of the whole head once, then the ears (inside with index fingers, outside with thumbs).' },
        { text: 'Maintaining the order (tartib) and washing continuously without pause (muwalat).', refs: [R.wuduAyah] },
        { text: 'Beginning each limb from the right, then the left.' },
      ],
    },
    {
      key: 'mustahab',
      title: 'Mustahab (Recommended)',
      items: [
        { text: 'Facing the Qibla during wudu.' },
        { text: 'Performing wudu on a raised, clean place.' },
        { text: 'Not taking help from others without need.' },
        { text: 'Reciting the Kalimah Shahadah and the du’a after wudu.' },
        { text: 'Not wasting water, even at a flowing river.' },
      ],
    },
    {
      key: 'makruhat',
      title: 'Makruhat (Disliked)',
      items: [
        { text: 'Wasting water or using excessively little.' },
        { text: 'Splashing water on the face forcefully.' },
        { text: 'Talking unnecessary worldly talk during wudu.' },
        { text: 'Performing wudu in an impure place.' },
      ],
    },
    {
      key: 'breakers',
      title: 'Break reasons (Nawaqid)',
      items: [
        { text: 'Anything exiting from the front or back passage — urine, stool, wind.', refs: [{ source: "Qur'an 5:6 — “…or one of you has come from the toilet”" }] },
        { text: 'Flowing blood, pus or fluid from a wound or the body.' },
        { text: 'Vomiting a mouthful (of food, water, bile or blood).' },
        { text: 'Sleeping lying down or reclining against a support.' },
        { text: 'Losing consciousness through fainting, intoxication or insanity.' },
        { text: 'Loud laughter (audible to oneself and neighbours) during a salah that has ruku and sujud — this breaks both the salah and the wudu.' },
        { text: 'Flow of mazi (pre-seminal fluid) or wadi.' },
      ],
    },
    {
      key: 'khuffain',
      title: 'Masah on the Khuffain (Leather socks)',
      items: [
        { text: 'A resident may wipe over valid leather socks for 24 hours, a traveller for 72 hours, counted from the first breaking of wudu after wearing them.' },
        { text: 'Condition: the socks were put on while in a state of wudu, cover the ankles, and are durable enough to walk in.' },
        { text: 'Masah is done once over the top of each foot with wet fingers.' },
        { text: 'Masah is invalidated by anything that breaks wudu, by removing the socks, or by the time expiring.' },
      ],
    },
  ],
  steps: [
    { title: 'Intention & Bismillah', description: 'Make the intention for wudu in your heart and say Bismillah.', icon: '🤲', refs: [R.intention] },
    { title: 'Wash hands', description: 'Wash both hands up to the wrists three times, doing khilal between the fingers.', icon: '🖐️' },
    { title: 'Rinse mouth', description: 'Rinse the mouth thoroughly three times (madmadah); use miswak first.', icon: '👄', refs: [R.miswak] },
    { title: 'Sniff nose', description: 'Draw water into the nose and clean it three times (istinshaq).', icon: '👃' },
    { title: 'Wash face', description: 'Wash the whole face three times, hairline to chin and ear to ear.', icon: '😊', refs: [R.wuduAyah] },
    { title: 'Wash right arm', description: 'Wash the right arm including the elbow three times.', icon: '💪', refs: [R.wuduAyah] },
    { title: 'Wash left arm', description: 'Wash the left arm including the elbow three times.', icon: '💪', refs: [R.wuduAyah] },
    { title: 'Wipe head (masah)', description: 'Wipe the whole head once with wet hands, then wipe the ears.', icon: '🧑', refs: [R.wuduAyah] },
    { title: 'Wash right foot', description: 'Wash the right foot including the ankle three times, khilal of the toes.', icon: '🦶', refs: [R.wuduAyah] },
    { title: 'Wash left foot', description: 'Wash the left foot including the ankle three times, khilal of the toes.', icon: '🦶', refs: [R.wuduAyah] },
  ],
}

const gusl: GuideTopic = {
  slug: 'gusl',
  title: 'Gusl (Ghusl)',
  arabic: 'الغسل',
  icon: '🚿',
  group: 'purity',
  maslak: MASLAK,
  hasSteps: true,
  sections: [
    {
      key: 'faraiz',
      title: 'Faraiz (Obligatory) — 3',
      items: [
        { text: 'Rinsing the whole mouth once so water reaches everywhere (gargle if not fasting).', refs: [{ source: "Qur'an 5:6" }] },
        { text: 'Sniffing water into the nose once, up to the soft bone.', refs: [{ source: "Qur'an 5:6" }] },
        { text: 'Pouring water over the entire body once so that no spot — even a hair’s breadth — is left dry.', refs: [{ source: "Qur'an 5:6 — “…if you are in janabah, purify yourselves.”" }] },
      ],
    },
    {
      key: 'when-farz',
      title: 'When Gusl becomes Farz',
      items: [
        { text: 'After janabah — emission of semen with desire, or marital relations (even without emission).', refs: [{ source: "Qur'an 5:6" }] },
        { text: 'On seeing wetness (semen) after waking, i.e. a wet dream.' },
        { text: 'At the end of haid (menstruation).', refs: [{ source: "Qur'an 2:222" }], gender: 'female' },
        { text: 'At the end of nifas (post-natal bleeding).', gender: 'female' },
      ],
    },
    {
      key: 'sunan',
      title: 'Sunnah (Method)',
      items: [
        { text: 'Intention (niyyah) for purification.', refs: [R.intention] },
        { text: 'Washing both hands up to the wrists.' },
        { text: 'Washing the private parts and removing any impurity from the body.' },
        { text: 'Performing a complete wudu (delaying the feet if standing in gathered water).' },
        { text: 'Pouring water over the whole body three times.' },
        { text: 'Beginning with the head, then the right shoulder, then the left.' },
        { text: 'Rubbing the body with the hand each time.' },
      ],
    },
    {
      key: 'sunnah-gusl',
      title: 'When Gusl is Sunnah / Mustahab',
      items: [
        { text: 'For Jumu’ah (Friday) prayer.' },
        { text: 'For the two Eid prayers.' },
        { text: 'When entering ihram for Hajj or Umrah.' },
        { text: 'On the day of Arafah for the pilgrim.' },
      ],
    },
    {
      key: 'makruhat',
      title: 'Makruhat',
      items: [
        { text: 'Wasting water.' },
        { text: 'Facing the Qibla while the private parts are exposed.' },
        { text: 'Bathing in stagnant / used water.' },
      ],
    },
  ],
  steps: [
    { title: 'Intention & wash hands', description: 'Make intention, say Bismillah, wash both hands to the wrists.', icon: '🤲', refs: [R.intention] },
    { title: 'Wash private parts', description: 'Wash the private parts and remove any impurity from the body.', icon: '🧼' },
    { title: 'Perform wudu', description: 'Perform a complete wudu (delay washing the feet if standing in water).', icon: '💧' },
    { title: 'Rinse mouth & nose', description: 'Gargle the mouth and sniff water into the nose thoroughly — both are obligatory in the Hanafi gusl.', icon: '👄', refs: [{ source: "Qur'an 5:6" }] },
    { title: 'Pour over head', description: 'Pour water over the head three times.', icon: '🚿' },
    { title: 'Right then left', description: 'Pour water over the right shoulder three times, then the left, rubbing the skin.', icon: '🧍' },
    { title: 'Whole body', description: 'Ensure water reaches every part — under the arms, navel, back — no dry spot remains.', icon: '✅', refs: [{ source: "Qur'an 5:6" }] },
  ],
}

const tayammum: GuideTopic = {
  slug: 'tayammum',
  title: 'Tayammum',
  arabic: 'التيمم',
  icon: '🌫️',
  group: 'purity',
  maslak: MASLAK,
  hasSteps: true,
  sections: [
    {
      key: 'faraiz',
      title: 'Faraiz (Obligatory) — 3',
      items: [
        { text: 'Intention (niyyah) for tayammum (for purification and permissibility of salah).', refs: [R.intention] },
        { text: 'Wiping the whole face once.', refs: [R.tayammumAyah, { source: "Qur'an 5:6" }] },
        { text: 'Wiping both arms up to and including the elbows.', refs: [R.tayammumAyah] },
      ],
    },
    {
      key: 'when',
      title: 'When Tayammum is permitted',
      items: [
        { text: 'No water is available within roughly one mile.', refs: [{ source: "Qur'an 4:43 / 5:6 — “…and you find no water”" }] },
        { text: 'Illness or a wound where using water would cause harm or delay recovery.', refs: [{ source: "Qur'an 4:43 — “if you are ill…”" }] },
        { text: 'Water is present but is needed for drinking (self, others, or animals).' },
        { text: 'Danger in reaching the water (enemy, beast, or fear of missing the funeral / Eid prayer with no time to make wudu).' },
      ],
    },
    {
      key: 'valid-earth',
      title: 'Valid surfaces for Tayammum',
      items: [
        { text: 'Pure earth, sand, stone, lime, clay, or a dusty wall — anything of the earth’s substance.' },
        { text: 'Not valid on wood, metal, glass, food, or cloth that carries no dust.' },
      ],
    },
    {
      key: 'sunan',
      title: 'Sunnah (Method)',
      items: [
        { text: 'Saying Bismillah.' },
        { text: 'Striking both palms on the clean surface.', refs: [{ source: "Qur'an 4:43" }] },
        { text: 'Moving the palms forward and back on the surface, then dusting off excess.' },
        { text: 'Keeping the order: face first, then the arms; and doing it continuously.' },
        { text: 'Khilal of the fingers and removing a ring when wiping the arms.' },
      ],
    },
    {
      key: 'breakers',
      title: 'Break reasons (Nawaqid)',
      items: [
        { text: 'Everything that breaks wudu also breaks tayammum.' },
        { text: 'Water becoming available (for one who did tayammum due to lack of water).' },
        { text: 'The ability to use water returning (for the sick person who recovers).' },
      ],
    },
  ],
  steps: [
    { title: 'Intention', description: 'Make the intention for tayammum and say Bismillah.', icon: '🤲', refs: [R.intention] },
    { title: 'Strike the earth', description: 'Strike both palms on clean earth, dust, stone or a dusty wall.', icon: '🪨', refs: [R.tayammumAyah] },
    { title: 'Wipe the face', description: 'Wipe the entire face once with both hands.', icon: '😊', refs: [{ source: "Qur'an 5:6" }] },
    { title: 'Strike again', description: 'Strike the palms on the surface a second time and dust off excess.', icon: '🪨' },
    { title: 'Wipe right arm', description: 'Wipe the right arm from the fingertips up to and including the elbow.', icon: '💪' },
    { title: 'Wipe left arm', description: 'Wipe the left arm from the fingertips up to and including the elbow.', icon: '💪' },
  ],
}

const namaaz: GuideTopic = {
  slug: 'namaaz',
  title: 'Namaaz (Salah)',
  arabic: 'الصلاة',
  icon: '🕌',
  group: 'salah',
  maslak: MASLAK,
  hasSteps: true,
  stepsTitle: 'Method to perform 2 Rakat Nafl Namaaz',
  sections: [
    {
      key: 'shurut',
      title: 'Pre-conditions (Shurut) — before salah',
      items: [
        { text: 'Taharat — purity of the body from hadath (needing wudu/gusl).' },
        { text: 'Purity of the clothes and the place of prayer from najasat.', refs: [{ source: "Qur'an 74:4 — “and purify your clothing”" }] },
        { text: 'Satr al-awrah — covering the body (men: navel to knee; women: whole body except face, hands and feet).', refs: [{ source: "Qur'an 7:31" }] },
        { text: 'Istiqbal al-Qibla — facing the Ka’bah.', refs: [R.qibla] },
        { text: 'Waqt — the prescribed time of that salah has entered.', refs: [R.salahTimes] },
        { text: 'Niyyah — intention of the specific salah.', refs: [R.intention] },
      ],
    },
    {
      key: 'faraiz',
      title: 'Faraiz — the pillars inside salah (Arkan)',
      items: [
        { text: 'Takbir-e-Tahrima — the opening “Allahu Akbar”.' },
        { text: 'Qiyam — standing (for one who is able) in fard and witr.', refs: [{ source: "Qur'an 2:238" }] },
        { text: 'Qira’at — reciting at least the prescribed amount of Qur’an.', refs: [{ source: "Qur'an 73:20" }] },
        { text: 'Ruku — bowing.', refs: [R.rukuSujudAyah] },
        { text: 'Sujud — two prostrations in each rak’ah.', refs: [R.rukuSujudAyah] },
        { text: 'Qa’dah Akhirah — sitting at the end for the length of the Tashahhud.' },
      ],
    },
    {
      key: 'wajibat',
      title: 'Wajibat (Necessary)',
      items: [
        { text: 'Reciting Surah Al-Fatiha in every rak’ah (of fard, and all of witr/nafl).', refs: [R.fatiha] },
        { text: 'Joining a surah or three short ayahs after Fatiha in the first two rak’ahs of fard, and every rak’ah of witr/nafl.' },
        { text: 'Ta’dil-e-arkan — performing ruku and sujud calmly, with a pause.', refs: [R.badPrayer] },
        { text: 'Qa’dah Ula — the first sitting after two rak’ahs.' },
        { text: 'Reciting the Tashahhud (At-tahiyyat) in both sittings.' },
        { text: 'Keeping the fard recitation and actions in order.' },
        { text: 'Reciting aloud in the loud prayers and silently in the silent prayers (for the imam).' },
        { text: 'The three takbirs and the du’a-e-Qunut of witr.' },
        { text: 'The additional takbirs of the two Eid prayers.' },
        { text: 'Ending the salah with the words of Salam.' },
        { text: 'Performing Sajdah Sahw when a wajib is missed or delayed.' },
      ],
    },
    {
      key: 'sunan',
      title: 'Sunnah',
      items: [
        { text: 'Reciting Thana (Subhanaka) after the opening takbir.' },
        { text: 'Ta’awwudh (A’udhu billah) and Tasmiyah (Bismillah) before Al-Fatiha.', refs: [{ source: "Qur'an 16:98" }] },
        { text: 'Saying Ameen quietly after Al-Fatiha.' },
        { text: 'Saying the takbirs when moving between postures.' },
        { text: 'Reciting the tasbih of ruku (“Subhana Rabbiyal Azeem”) and sujud (“Subhana Rabbiyal A’la”) at least three times.' },
        { text: 'Saying “Sami’Allahu liman hamidah” when rising, and “Rabbana lakal hamd”.' },
        { text: 'Reciting Durood Sharif and a du’a in the final sitting.' },
      ],
    },
    {
      key: 'posture-men',
      title: 'Posture — Men (Hanafi)',
      items: [
        { text: 'Raise the hands up to the ear-lobes for the opening takbir.', gender: 'male' },
        { text: 'Fold the hands below the navel, right over left, grasping the left wrist.', gender: 'male' },
        { text: 'In ruku, grasp the knees with the fingers spread and keep the back level.', gender: 'male' },
        { text: 'In sujud, keep the elbows raised off the ground and away from the sides, and the belly off the thighs.', gender: 'male' },
        { text: 'Sit with the left foot laid flat underneath and the right foot upright (iftirash).', gender: 'male' },
      ],
    },
    {
      key: 'posture-women',
      title: 'Posture — Women (Hanafi)',
      items: [
        { text: 'Raise the hands only up to the shoulders for the opening takbir.', gender: 'female' },
        { text: 'Fold the hands on the chest, right over left.', gender: 'female' },
        { text: 'In ruku, bend just enough to reach the knees, keeping the fingers together and the arms close to the body.', gender: 'female' },
        { text: 'In sujud, keep the body drawn together — forearms on the ground and the belly close to the thighs.', gender: 'female' },
        { text: 'Sit with both feet brought out to the right side (tawarruk).', gender: 'female' },
      ],
    },
    {
      key: 'mufsidat',
      title: 'Things that break salah (Mufsidat)',
      items: [
        { text: 'Talking intentionally, even a word or two.', refs: [R.talking] },
        { text: 'Eating or drinking, even a little.' },
        { text: 'Amal-e-kathir — excessive movement not part of salah.' },
        { text: 'Turning the chest away from the Qibla without excuse.' },
        { text: 'Loud laughter (in a salah with sujud — also breaks wudu).' },
        { text: 'Reciting so incorrectly that the meaning is corrupted.' },
        { text: 'Saying “Ameen” to a worldly request, or responding to someone with Qur’an intending conversation.' },
      ],
    },
    {
      key: 'makruhat',
      title: 'Makruhat (Disliked in salah)',
      items: [
        { text: 'Playing with clothes or the body, or cracking the fingers.' },
        { text: 'Looking around; the gaze should be at the place of sujud.' },
        { text: 'Praying while food is served and one is hungry, or while needing the toilet.' },
        { text: 'Covering the mouth, or letting the garment hang loose (sadl).' },
        { text: 'Praying in clothing bearing pictures of living beings.' },
      ],
    },
    {
      key: 'sajdah-sahw',
      title: 'When Sajdah Sahw is due',
      items: [
        { text: 'A wajib was left out or delayed unintentionally.' },
        { text: 'A fard was delayed (e.g. an extra ruku or missed sitting), without leaving a fard entirely.' },
        { text: 'Method: after the final Tashahhud, make one Salam to the right, then two sajdahs, then Tashahhud, Durood, du’a and Salam.' },
      ],
    },
  ],
  steps: [
    // ── Rak'ah 1 ──────────────────────────────────────────
    { title: 'Rak’ah 1 — Niyyah & Takbir', description: 'Intend two rak’ah nafl. Men raise the hands to the ears, women to the shoulders, say “Allahu Akbar”, then fold the hands (men below the navel, women on the chest).', icon: '🧍' },
    { title: 'Sana(Thana)', description: 'Recite the Sana(Thana): “Subhanakal-lahumma wa bihamdika, wa tabarakasmuka, wa ta’ala jadduka, wa la ilaha ghairuk.”', icon: '🤲' },
    { title: 'Qirat', description: 'Recite Ta’awwudh and Bismillah, then Surah Al-Fatiha, say Ameen quietly, then recite another surah (e.g. Al-Ikhlas).', icon: '📖', refs: [R.fatiha] },
    { title: 'Ruku', description: 'Say “Allahu Akbar” and bow; recite “Subhana Rabbiyal Azeem” three times.', icon: '🙇', refs: [R.rukuSujudAyah] },
    { title: 'Qawmah', description: 'Rise fully upright, saying “Sami’Allahu liman hamidah, Rabbana lakal hamd.”', icon: '🧍' },
    { title: 'Sajdah 1', description: 'Say “Allahu Akbar”, prostrate with forehead and nose on the ground; recite “Subhana Rabbiyal A’la” 3 or 5 or 7 times.', icon: '🧎', refs: [R.rukuSujudAyah] },
    { title: 'Jalsa', description: 'Say “Allahu Akbar” and sit up calmly for a moment between the two prostrations.', icon: '🪑' },
    { title: 'Sajdah 2', description: 'Say “Allahu Akbar” and prostrate a second time with the same tasbih.', icon: '🧎' },
    // ── Rak'ah 2 ──────────────────────────────────────────
    { title: 'Rak’ah 2 — Stand', description: 'Say “Allahu Akbar” and rise to stand for the second rak’ah, folding the hands. (No Sana(Thana) or Ta’awwudh this time.)', icon: '🧍' },
    { title: 'Qirat', description: 'Recite Bismillah, then Surah Al-Fatiha, Ameen, then another surah.', icon: '📖', refs: [R.fatiha] },
    { title: 'Ruku', description: 'Bow and recite “Subhana Rabbiyal Azeem” three times.', icon: '🙇', refs: [R.rukuSujudAyah] },
    { title: 'Qawmah', description: 'Rise upright saying “Sami’Allahu liman hamidah, Rabbana lakal hamd.”', icon: '🧍' },
    { title: 'Sajdah 1', description: 'Prostrate and recite “Subhana Rabbiyal A’la” three times.', icon: '🧎', refs: [R.rukuSujudAyah] },
    { title: 'Jalsa', description: 'Sit up calmly between the two prostrations.', icon: '🪑' },
    { title: 'Sajdah 2', description: 'Prostrate a second time with the same tasbih.', icon: '🧎' },
    // ── Final sitting ─────────────────────────────────────
    { title: 'Qa’dah — At-tahiyyat', description: 'Sit for the qa’dah. Recite At-tahiyyat: “At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu ‘alaika ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu ‘alaina wa ‘ala ‘ibadillahis-salihin, ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan ‘abduhu wa rasuluh.” At “la ilaha” raise the index finger and lower it at “illallah”.', icon: '🪑' },
    { title: 'Durood-e-Ibrahim', description: 'Then recite Durood-e-Ibrahim: “Allahumma salli ‘ala Muhammadiw wa ‘ala aali Muhammadin kama sallaita ‘ala Ibrahima wa ‘ala aali Ibrahima innaka Hamidum Majid. Allahumma barik ‘ala Muhammadiw wa ‘ala aali Muhammadin kama barakta ‘ala Ibrahima wa ‘ala aali Ibrahima innaka Hamidum Majid.”', icon: '🌿' },
    { title: 'Dua-e-Masura', description: 'Then recite Dua-e-Masura: “Allahumma inni zalamtu nafsi zulman kathira, wa la yaghfirudh-dhunuba illa anta, faghfir li maghfiratam min ‘indika warhamni, innaka antal-Ghafurur-Rahim.”', icon: '🤲' },
    { title: 'Salam', description: 'Turn the face to the right saying “Assalamu ‘alaikum wa rahmatullah”, then to the left with the same words. The two rak’ah nafl are complete.', icon: '👐' },
  ],
}

// Wudu step images: wudu/1.png … wudu/10.png (in order).
wudu.steps?.forEach((s, i) => {
  s.image = `wudu/${i + 1}.png`
})

// Map each namaaz step to a pose image in the LearnIslam bucket (Namaaz/<pose>.png).
// Upload one image per pose; steps that share a pose reuse the same image.
const NAMAAZ_POSES = [
  'takbeer', // 1 Niyyah & Takbir
  'qiyam', // 2 Thana
  'qirat', // 3 Qirat (Fatiha & Surah)
  'ruku', // 4 Ruku
  'qawmah', // 5 Qawmah
  'sajdah', // 6 Sajdah 1
  'jalsa', // 7 Jalsa
  'sajdah', // 8 Sajdah 2
  'qiyam', // 9 Rak'ah 2 — Stand
  'qirat', // 10 Qirat (Fatiha & Surah)
  'ruku', // 11 Ruku
  'qawmah', // 12 Qawmah
  'sajdah', // 13 Sajdah 1
  'jalsa', // 14 Jalsa
  'sajdah', // 15 Sajdah 2
  'qadah', // 16 Qa'dah — At-tahiyyat
  'qadah', // 17 Durood
  'qadah', // 18 Dua-e-Masura
  'salaam', // 19 Salam
]
namaaz.steps?.forEach((s, i) => {
  const pose = NAMAAZ_POSES[i]
  if (pose) s.image = `Namaaz/${pose}.png`
})

const roza: GuideTopic = {
  slug: 'roza',
  title: 'Roza (Sawm)',
  arabic: 'الصوم',
  icon: '🌙',
  group: 'more',
  maslak: MASLAK,
  hasSteps: false,
  sections: [
    {
      key: 'faraiz',
      title: 'Faraiz (Obligatory)',
      items: [
        { text: 'Niyyah (intention) — for Ramadan it may be made from the night up to before midday; a missed/qada or kaffarah fast needs the intention before Subah Sadiq.' },
        { text: 'Abstaining from eating, drinking and marital relations from Subah Sadiq (true dawn) until sunset.', refs: [R.fastAyah] },
      ],
    },
    {
      key: 'kaffarah',
      title: 'Things that break the fast — Qada + Kaffarah',
      items: [
        { text: 'Eating or drinking intentionally without a valid excuse.' },
        { text: 'Marital relations during the fast.', refs: [{ source: "Qur'an 2:187" }] },
        { text: 'Kaffarah = freeing a slave, or fasting 60 consecutive days, or feeding 60 poor persons — in addition to making up (qada) the day.' },
      ],
    },
    {
      key: 'qada-only',
      title: 'Things that break the fast — Qada only',
      items: [
        { text: 'Eating or drinking by mistake believing the fast was already broken.' },
        { text: 'Intentional vomiting of a mouthful.' },
        { text: 'Water reaching the throat while gargling, or medicine/drops entering the body cavity.' },
        { text: 'Swallowing something that is not normally eaten.' },
      ],
    },
    {
      key: 'not-break',
      title: 'Things that do NOT break the fast',
      items: [
        { text: 'Eating or drinking out of genuine forgetfulness.' },
        { text: 'Unintentional vomiting.' },
        { text: 'A wet dream, or dust / smoke entering the throat unavoidably.' },
        { text: 'Using miswak, and applying surma (kohl) or oil.' },
      ],
    },
    {
      key: 'mustahab',
      title: 'Sunnah & Mustahab',
      items: [
        { text: 'Eating Sehri and delaying it near to the end of its time.', refs: [R.sehri] },
        { text: 'Hastening the iftar immediately after sunset.', refs: [R.iftar] },
        { text: 'Opening the fast with dates or water and making the du’a of iftar.' },
        { text: 'Increasing in Qur’an recitation, charity and worship, especially in the last ten nights.' },
      ],
    },
    {
      key: 'exempt',
      title: 'Who may leave the fast (with qada / fidyah)',
      items: [
        { text: 'The traveller (musafir) and the genuinely sick — make qada later.', refs: [{ source: "Qur'an 2:184–185" }] },
        { text: 'The menstruating woman and the woman in nifas — fasting is not valid; make qada later.', gender: 'female' },
        { text: 'The pregnant or nursing woman who fears harm — make qada later.', gender: 'female' },
        { text: 'The very old or terminally ill who cannot fast — give fidyah (feed a poor person for each day).' },
      ],
    },
  ],
}

const hajj: GuideTopic = {
  slug: 'hajj',
  title: 'Hajj',
  arabic: 'الحج',
  icon: '🕋',
  group: 'more',
  maslak: MASLAK,
  hasSteps: false,
  sections: [
    {
      key: 'faraiz',
      title: 'Faraiz (Obligatory) — 3',
      items: [
        { text: 'Ihram — entering the state of ihram with intention and talbiyah.' },
        { text: 'Wuquf-e-Arafah — standing at Arafah between midday of the 9th Dhul-Hijjah and dawn of the 10th.', refs: [R.arafah] },
        { text: 'Tawaf-e-Ziyarah (Tawaf al-Ifadah) — the seven circuits of the Ka’bah after Arafah.', refs: [{ source: "Qur'an 22:29" }] },
      ],
    },
    {
      key: 'wajibat',
      title: 'Wajibat',
      items: [
        { text: 'Sa’i between Safa and Marwah (seven times).', refs: [{ source: "Qur'an 2:158" }] },
        { text: 'Staying at Muzdalifah on the night of the 10th.', refs: [{ source: "Qur'an 2:198" }] },
        { text: 'Rami — stoning the Jamarat on the appointed days.' },
        { text: 'Qurbani (dam) for those performing Qiran or Tamattu.', refs: [{ source: "Qur'an 2:196" }] },
        { text: 'Halq or Qasr — shaving or trimming the hair to leave ihram.', refs: [{ source: "Qur'an 48:27" }] },
        { text: 'Tawaf-e-Wida (farewell tawaf) for those not resident in Makkah.' },
      ],
    },
    {
      key: 'types',
      title: 'Types of Hajj',
      items: [
        { text: 'Ifrad — Hajj alone, without Umrah (no qurbani due for this reason).' },
        { text: 'Qiran — Umrah and Hajj in one ihram together (qurbani due).' },
        { text: 'Tamattu — Umrah then Hajj in separate ihrams in the same season (qurbani due).', refs: [{ source: "Qur'an 2:196" }] },
      ],
    },
    {
      key: 'ihram-prohibitions',
      title: 'Prohibitions in Ihram',
      items: [
        { text: 'For men: covering the head or face, and wearing sewn/fitted garments.', gender: 'male' },
        { text: 'For women: covering the face so cloth touches it (the face is left uncovered, though it may be screened away from the cloth).', gender: 'female' },
        { text: 'Applying perfume, or cutting the hair or nails.' },
        { text: 'Hunting land game, or marital relations and its preliminaries.', refs: [{ source: "Qur'an 2:197 — “no rafath, no fusuq, no jidal in Hajj”" }] },
      ],
    },
  ],
}

export const TOPICS: GuideTopic[] = [gusl, wudu, tayammum, namaaz, roza, hajj]

export function getTopic(slug: string): GuideTopic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

// Filter helper — hide gender-specific content that does not match the user.
export function itemsForGender<T extends { gender?: Audience }>(
  items: T[],
  gender?: Audience
): T[] {
  return items.filter((i) => !i.gender || i.gender === gender)
}
