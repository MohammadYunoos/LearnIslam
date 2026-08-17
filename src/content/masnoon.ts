// src/content/masnoon.ts
// Masnoon (Sunnah) duas + daily Zikr / Wajifa. Standard devotional texts.
// Each entry: Arabic + transliteration + English meaning.

export interface Dua {
  slug: string
  title: string
  arabic: string
  translit: string
  meaning: string
}

export interface Zikr {
  slug: string
  title: string
  arabic: string
  translit: string
  meaning: string
  target: number // suggested count for the counter
  ref?: string // hadith on its virtue (fada'il)
}

export const MASNOON_DUAS: Dua[] = [
  {
    slug: 'before-eating',
    title: 'Before eating',
    arabic: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ',
    translit: 'Bismillahi wa ‘ala barakatillah',
    meaning: 'In the name of Allah and with the blessings of Allah.',
  },
  {
    slug: 'after-eating',
    title: 'After eating',
    arabic: 'الْحَمْدُ لِلّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    translit: 'Alhamdulillahil-ladhi at‘amana wa saqana wa ja‘alana muslimin',
    meaning: 'All praise is for Allah who fed us, gave us drink, and made us Muslims.',
  },
  {
    slug: 'before-sleeping',
    title: 'Before sleeping',
    arabic: 'اللّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    translit: 'Allahumma bismika amutu wa ahya',
    meaning: 'O Allah, in Your name I die and I live.',
  },
  {
    slug: 'on-waking',
    title: 'On waking up',
    arabic: 'الْحَمْدُ لِلّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    translit: 'Alhamdulillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur',
    meaning: 'All praise is for Allah who gave us life after death, and to Him is the return.',
  },
  {
    slug: 'entering-toilet',
    title: 'Entering the toilet',
    arabic: 'اللّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    translit: 'Allahumma inni a‘udhu bika minal-khubuthi wal-khaba’ith',
    meaning: 'O Allah, I seek refuge in You from the male and female evil ones.',
  },
  {
    slug: 'leaving-toilet',
    title: 'Leaving the toilet',
    arabic: 'غُفْرَانَكَ',
    translit: 'Ghufranaka',
    meaning: 'I seek Your forgiveness.',
  },
  {
    slug: 'leaving-home',
    title: 'Leaving home',
    arabic: 'بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    translit: 'Bismillahi tawakkaltu ‘alallah, la hawla wa la quwwata illa billah',
    meaning: 'In the name of Allah, I place my trust in Allah; there is no power nor strength except with Allah.',
  },
  {
    slug: 'entering-masjid',
    title: 'Entering the masjid',
    arabic: 'اللّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    translit: 'Allahumma-ftah li abwaba rahmatik',
    meaning: 'O Allah, open for me the doors of Your mercy.',
  },
  {
    slug: 'leaving-masjid',
    title: 'Leaving the masjid',
    arabic: 'اللّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    translit: 'Allahumma inni as’aluka min fadlik',
    meaning: 'O Allah, I ask You from Your bounty.',
  },
  {
    slug: 'after-wudu',
    title: 'After wudu',
    arabic:
      'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translit: 'Ash-hadu an la ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan ‘abduhu wa rasuluh',
    meaning:
      'I bear witness that none is worthy of worship except Allah alone, with no partner, and that Muhammad is His servant and messenger.',
  },
  {
    slug: 'wearing-clothes',
    title: 'Wearing clothes',
    arabic: 'الْحَمْدُ لِلّهِ الَّذِي كَسَانِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    translit: 'Alhamdulillahil-ladhi kasani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah',
    meaning: 'All praise is for Allah who clothed me with this and provided it for me without any power or strength from me.',
  },
  {
    slug: 'travel',
    title: 'When travelling',
    arabic:
      'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
    translit: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun',
    meaning: 'Glory to Him who subjected this to us, and we could not have done it. And indeed, to our Lord we will return.',
  },
  {
    slug: 'distress',
    title: 'In distress',
    arabic: 'لَا إِلَٰهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ',
    translit: 'La ilaha illallahul-‘Azimul-Halim, la ilaha illallahu Rabbul-‘Arshil-‘Azim',
    meaning: 'There is no god but Allah, the Mighty, the Forbearing; there is no god but Allah, Lord of the Mighty Throne.',
  },
  {
    slug: 'seeking-knowledge',
    title: 'For knowledge',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    translit: 'Rabbi zidni ‘ilma',
    meaning: 'My Lord, increase me in knowledge.',
  },
  {
    slug: 'entering-home',
    title: 'Entering home',
    arabic: 'بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا',
    translit: 'Bismillahi walajna wa bismillahi kharajna wa ‘ala Rabbina tawakkalna',
    meaning: 'In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.',
  },
  {
    slug: 'anger',
    title: 'When angry',
    arabic: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    translit: 'A‘udhu billahi minash-shaytanir-rajim',
    meaning: 'I seek refuge in Allah from the accursed Satan.',
  },
  {
    slug: 'gratitude',
    title: 'When something pleases you',
    arabic: 'الْحَمْدُ لِلّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    translit: 'Alhamdulillahil-ladhi bini‘matihi tatimmus-salihat',
    meaning: 'All praise is for Allah by whose grace all good things are completed.',
  },
  {
    slug: 'sneezing',
    title: 'When you sneeze',
    arabic: 'الْحَمْدُ لِلّهِ',
    translit: 'Alhamdulillah',
    meaning: 'All praise is for Allah. (Listener replies “Yarhamukallah”, then you say “Yahdikumullahu wa yuslihu balakum”.)',
  },
  {
    slug: 'before-drinking',
    title: 'Before drinking',
    arabic: 'بِسْمِ اللهِ',
    translit: 'Bismillah',
    meaning: 'In the name of Allah. (Drink with the right hand, in three sips.)',
  },
  {
    slug: 'iftar',
    title: 'Breaking the fast (Iftar)',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللهُ',
    translit: 'Dhahaba-z-zama’u wa-btallatil-‘uruqu wa thabatal-ajru in sha’Allah',
    meaning: 'The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
  },
  {
    slug: 'rain',
    title: 'When it rains',
    arabic: 'اللّهُمَّ صَيِّبًا نَافِعًا',
    translit: 'Allahumma sayyiban nafi‘a',
    meaning: 'O Allah, (send) a beneficial rain.',
  },
  {
    slug: 'distress',
    title: 'In anxiety & grief',
    arabic:
      'اللّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ',
    translit: 'Allahumma inni a‘udhu bika minal-hammi wal-hazani wal-‘ajzi wal-kasal',
    meaning: 'O Allah, I seek refuge in You from worry, grief, incapacity and laziness.',
  },
  {
    slug: 'sick',
    title: 'Visiting the sick',
    arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللهُ',
    translit: 'La ba’sa tahurun in sha’Allah',
    meaning: 'No harm, (it is) a purification, if Allah wills.',
  },
  {
    slug: 'entering-market',
    title: 'Entering the market',
    arabic:
      'لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translit: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, yuhyi wa yumit, wa huwa hayyun la yamut, bi-yadihil-khayr, wa huwa ‘ala kulli shay’in qadir',
    meaning: 'There is no god but Allah alone… In His hand is all good and He is over all things competent. (Great reward for reciting on entering the market.)',
  },
  {
    slug: 'sayyidul-istighfar',
    title: 'Sayyidul Istighfar (best du’a for forgiveness)',
    arabic:
      'اللّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    translit: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana ‘abduka…',
    meaning: 'O Allah, You are my Lord… forgive me, for none forgives sins but You. (Whoever says it with certainty by day and dies that day is of the people of Paradise.)',
  },
]

export const ZIKR: Zikr[] = [
  // ── Sunnah Kalimas ──
  {
    slug: 'kalima-tayyaba',
    title: '1st Kalima — Tayyaba',
    arabic: 'لَا إِلَٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ',
    translit: 'La ilaha illallahu Muhammadur-Rasulullah',
    meaning: 'There is no god but Allah; Muhammad is the Messenger of Allah.',
    target: 100,
  },
  {
    slug: 'kalima-shahadat',
    title: '2nd Kalima — Shahadat',
    arabic:
      'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translit: 'Ash-hadu an la ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan ‘abduhu wa rasuluh',
    meaning:
      'I bear witness that none is worthy of worship but Allah alone, with no partner, and that Muhammad is His servant and messenger.',
    target: 100,
    ref: 'Sahih Muslim — ‘Ubadah ibn as-Samit: the eight gates of Paradise open for the one who testifies to it.',
  },
  {
    slug: 'kalima-tamjeed',
    title: '3rd Kalima — Tamjeed',
    arabic: 'سُبْحَانَ اللهِ وَالْحَمْدُ لِلّهِ وَلَا إِلَٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ',
    translit: 'SubhanAllahi wal-hamdulillahi wa la ilaha illallahu wallahu akbar',
    meaning: 'Glory be to Allah, all praise to Allah, there is no god but Allah, and Allah is the Greatest.',
    target: 100,
    ref: 'Sahih Muslim — Abu Hurayrah: the most beloved words to Allah.',
  },
  {
    slug: 'kalima-tawheed',
    title: '4th Kalima — Tawheed',
    arabic:
      'لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    translit: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa ‘ala kulli shay’in qadir',
    meaning:
      'There is no god but Allah alone, with no partner. His is the dominion and His is all praise, and He has power over everything.',
    target: 100,
    ref: 'Bukhari & Muslim — Abu Hurayrah: said 100× a day, equals freeing ten slaves.',
  },
  // ── Short Durood ──
  {
    slug: 'durood',
    title: 'Short Durood',
    arabic: 'اللّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    translit: 'Allahumma salli ‘ala Muhammadin wa ‘ala aali Muhammad',
    meaning: 'O Allah, send blessings upon Muhammad and the family of Muhammad.',
    target: 100,
    ref: 'Sahih Muslim — Abu Hurayrah: for each blessing on the Prophet, Allah sends ten upon you.',
  },
  // ── Astaghfar ──
  {
    slug: 'astaghfar',
    title: 'Astaghfar',
    arabic: 'أَسْتَغْفِرُ اللهَ',
    translit: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah.',
    target: 100,
    ref: 'Sunan Abu Dawud — Ibn Abbas: whoever persists in istighfar, Allah makes a way out of every distress.',
  },
  {
    slug: 'astaghfar-full',
    title: 'Astaghfar (full)',
    arabic: 'أَسْتَغْفِرُ اللهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ',
    translit: 'Astaghfirullaha Rabbi min kulli dhambin wa atubu ilayh',
    meaning: 'I seek forgiveness from Allah, my Lord, from every sin, and I turn to Him in repentance.',
    target: 33,
  },
  // ── Tasbih ──
  {
    slug: 'subhanallahi-wa-bihamdihi',
    title: 'SubhanAllahi wa bihamdihi',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    translit: 'SubhanAllahi wa bihamdih',
    meaning: 'Glory be to Allah and to Him is all praise.',
    target: 100,
    ref: 'Bukhari & Muslim — Abu Hurayrah: said 100× a day, sins are forgiven though like the foam of the sea.',
  },
  {
    slug: 'subhanallah',
    title: 'SubhanAllah',
    arabic: 'سُبْحَانَ اللهِ',
    translit: 'SubhanAllah',
    meaning: 'Glory be to Allah.',
    target: 33,
    ref: 'Bukhari & Muslim — Abu Hurayrah: Tasbih Fatima after every salah (33/33/34).',
  },
  {
    slug: 'alhamdulillah',
    title: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلّهِ',
    translit: 'Alhamdulillah',
    meaning: 'All praise is for Allah.',
    target: 33,
    ref: 'Bukhari & Muslim — Abu Hurayrah: Tasbih Fatima after every salah (33/33/34).',
  },
  {
    slug: 'allahu-akbar',
    title: 'Allahu Akbar',
    arabic: 'اللهُ أَكْبَرُ',
    translit: 'Allahu Akbar',
    meaning: 'Allah is the Greatest.',
    target: 34,
    ref: 'Bukhari & Muslim — Abu Hurayrah: Tasbih Fatima after every salah (33/33/34).',
  },
  // ── Wajifa (purpose-based wird) ──
  {
    slug: 'la-hawla',
    title: 'For strength — La hawla wa la quwwata illa billah',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    translit: 'La hawla wa la quwwata illa billah',
    meaning: 'There is no power nor strength except with Allah.',
    target: 100,
    ref: 'Bukhari & Muslim — Abu Musa: it is a treasure from the treasures of Paradise.',
  },
  {
    slug: 'subhanallah-azim',
    title: 'Beloved words — SubhanAllahi wa bihamdihi, SubhanAllahil-Azim',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ',
    translit: 'SubhanAllahi wa bihamdih, SubhanAllahil-‘Azim',
    meaning: 'Glory and praise to Allah; glory to Allah the Most Great.',
    target: 100,
    ref: 'Bukhari & Muslim — Abu Hurayrah: two words light on the tongue, heavy on the scale, beloved to the Most Merciful.',
  },
  {
    slug: 'rizq-istighfar',
    title: 'For rizq & barkat — Istighfar',
    arabic: 'أَسْتَغْفِرُ اللهَ رَبِّي وَأَتُوبُ إِلَيْهِ',
    translit: 'Astaghfirullaha Rabbi wa atubu ilayh',
    meaning: 'I seek forgiveness of Allah my Lord and turn to Him.',
    target: 100,
    ref: 'Sunan Abu Dawud — Ibn Abbas: whoever persists in istighfar, Allah grants relief, a way out, and provision from where he does not expect.',
  },
  {
    slug: 'dua-yunus',
    title: 'For relief from distress — Dua of Yunus',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    translit: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
    meaning: 'There is no god but You; glory be to You; indeed I was among the wrongdoers.',
    target: 100,
    ref: 'Tirmidhi — Sa‘d ibn Abi Waqqas: no Muslim supplicates with it in any matter but Allah answers him.',
  },
  {
    slug: 'hasbunallah',
    title: 'For reliance & protection — Hasbunallah',
    arabic: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ',
    translit: 'Hasbunallahu wa ni‘mal-wakil',
    meaning: 'Allah is sufficient for us and the best Disposer of affairs.',
    target: 100,
    ref: "Qur'an 3:173 — said by Ibrahim ﷺ in the fire and by the Prophet ﷺ; Allah turned harm away.",
  },
  {
    slug: 'salawat-need',
    title: 'For needs — Durood upon the Prophet ﷺ',
    arabic: 'اللّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ',
    translit: 'Allahumma salli wa sallim ‘ala nabiyyina Muhammad',
    meaning: 'O Allah, send blessings and peace upon our Prophet Muhammad.',
    target: 100,
    ref: 'Tirmidhi — Ubayy ibn Ka‘b: abundant durood brings the removal of worries and forgiveness of sins.',
  },
  {
    slug: 'tahlil-100',
    title: 'For great reward — La ilaha illallah…',
    arabic:
      'لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translit: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa ‘ala kulli shay’in qadir',
    meaning: 'There is no god but Allah alone… and He is over all things competent.',
    target: 100,
    ref: 'Bukhari & Muslim — Abu Hurayrah: said 100× a day equals freeing ten slaves and is a shield from Shaytan that day.',
  },
]

export function getZikr(slug: string): Zikr | undefined {
  return ZIKR.find((z) => z.slug === slug)
}
