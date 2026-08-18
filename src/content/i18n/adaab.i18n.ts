// src/content/adaab.i18n.ts
// Curated Urdu + Roman-Urdu wording for the Adaab section (proof batch).
//
// WHY: machine translation produces awkward religious wording. These lines are
// hand-authored (Hanafi / Deobandi idiom) so the app serves natural phrasing.
// `en` is copied BYTE-EXACT from src/content/adaab.ts (curly quotes “ ” ‘ ’, the
// ﷺ glyph and em-dashes must match) — the /translate lookup hashes on it.
// Quoted du‘a / transliteration inside a line is kept verbatim; only the
// surrounding instruction is rendered into Urdu.
//
// Edit any line here (or in the in-app admin editor) and re-run
// scripts/gen-adaab-translations.mjs to regenerate the seed SQL.

export interface AdaabTr {
  en: string
  ur: string // Urdu script
  roman: string // Roman Urdu (English letters), e.g. "pakizgi aadha imaan hai"
}

export const ADAAB_I18N: AdaabTr[] = [
  // ── Topic titles ──────────────────────────────────────
  { en: 'Eating', ur: 'کھانے کے آداب', roman: 'khane ke adaab' },
  { en: 'Drinking', ur: 'پانی پینا', roman: 'pani peena' },
  { en: 'Sleeping', ur: 'سونا', roman: 'sona' },
  { en: 'Toilet & Istinja', ur: 'بیت الخلاء اور استنجا', roman: 'baitul khala aur istinja' },
  { en: 'Salam & Greeting', ur: 'سلام اور مصافحہ', roman: 'salam aur mulaqat' },
  { en: 'Entering / Leaving Home', ur: 'گھر میں داخل ہونا اور نکلنا', roman: 'ghar me dakhil hona aur nikalna' },
  { en: 'The Masjid', ur: 'مسجد', roman: 'masjid' },
  { en: 'Sneezing & Yawning', ur: 'چھینک اور جمائی', roman: 'chheenk aur jamahi' },
  { en: 'Clothing & Dressing', ur: 'لباس اور پہناوا', roman: 'libaas aur pehnawa' },
  { en: 'Travel', ur: 'سفر', roman: 'safar' },
  { en: 'Gatherings (Majlis)', ur: 'مجلس', roman: 'majlis' },
  { en: 'Parents & Elders', ur: 'والدین اور بزرگ', roman: 'walidain aur buzurg' },
  { en: 'Speech & the Tongue', ur: 'گفتگو اور زبان', roman: 'guftagu aur zabaan' },

  // ── Intros ────────────────────────────────────────────
  { en: 'Manners of eating food.', ur: 'کھانا کھانے کے آداب۔', roman: 'khana khane ke aadaab.' },

  // ── Eating ────────────────────────────────────────────
  { en: 'Wash both hands before and after eating.', ur: 'کھانے سے پہلے اور بعد میں دونوں ہاتھ دھوئیں۔', roman: 'khane se pehle aur baad me dono haath dho lein.' },
  { en: 'Say “Bismillah” before starting. If forgotten, say “Bismillahi awwalahu wa akhirahu”.', ur: 'شروع کرنے سے پہلے “Bismillah” کہیں۔ اگر بھول جائیں تو “Bismillahi awwalahu wa akhirahu” کہیں۔', roman: 'shuru karne se pehle “Bismillah” kahein. agar bhool jayein to “Bismillahi awwalahu wa akhirahu” kahein.' },
  { en: 'Eat with the right hand, and eat from what is directly in front of you.', ur: 'دائیں ہاتھ سے کھائیں، اور اپنے سامنے سے کھائیں۔', roman: 'dayein haath se khayein, aur apne saamne se khayein.' },
  { en: 'Sit and eat; do not eat while leaning back.', ur: 'بیٹھ کر کھائیں؛ ٹیک لگا کر نہ کھائیں۔', roman: 'baith kar khayein; tek laga kar mat khayein.' },
  { en: 'Eat from the sides of the dish, not from the middle — blessing descends in the middle.', ur: 'برتن کے کناروں سے کھائیں، بیچ سے نہیں — برکت بیچ میں نازل ہوتی ہے۔', roman: 'bartan ke kinaron se khayein, beech se nahin — barkat beech me nazil hoti hai.' },
  { en: 'Do not find fault with food; eat it if you like it, otherwise leave it.', ur: 'کھانے میں عیب نہ نکالیں؛ پسند ہو تو کھائیں، ورنہ چھوڑ دیں۔', roman: 'khane me aib mat nikalein; pasand ho to khayein, warna chhod dein.' },
  { en: 'Eat with three fingers and clean the fingers and the plate when finished.', ur: 'تین انگلیوں سے کھائیں اور فارغ ہو کر انگلیاں اور پلیٹ صاف کریں۔', roman: 'teen ungliyon se khayein aur khatam kar ke ungliyan aur plate saaf karein.' },
  { en: 'Eat and drink in moderation; do not overfill the stomach.', ur: 'اعتدال سے کھائیں پئیں؛ پیٹ بھر کر زیادہ نہ کھائیں۔', roman: 'itedaal se khayein piyein; pet zaroorat se zyada mat bharein.' },
  { en: 'Do not use gold or silver utensils.', ur: 'سونے یا چاندی کے برتن استعمال نہ کریں۔', roman: 'sone ya chandi ke bartan istemaal mat karein.' },
  { en: 'Praise Allah when finished: “Alhamdulillahil-ladhi at‘amana wa saqana wa ja‘alana muslimin”.', ur: 'فارغ ہو کر اللہ کی حمد کریں: “Alhamdulillahil-ladhi at‘amana wa saqana wa ja‘alana muslimin”۔', roman: 'khatam kar ke Allah ki hamd karein: “Alhamdulillahil-ladhi at‘amana wa saqana wa ja‘alana muslimin”.' },
  { en: 'If a morsel falls, pick it up, remove any dirt and eat it; do not leave it for Shaytan.', ur: 'اگر لقمہ گر جائے تو اٹھا لیں، مٹی صاف کر کے کھا لیں؛ اسے شیطان کے لیے نہ چھوڑیں۔', roman: 'agar luqma gir jaye to utha lein, mitti saaf kar ke kha lein; ise shaytan ke liye mat chhodein.' },
  { en: 'Do not blow on hot food or drink; wait for it to cool.', ur: 'گرم کھانے یا پینے کی چیز پر پھونک نہ ماریں؛ ٹھنڈا ہونے کا انتظار کریں۔', roman: 'garam khane ya peene par phoonk mat maarein; thanda hone ka intezaar karein.' },
  { en: 'Eat together, not separately — there is blessing in eating in a group.', ur: 'مل کر کھائیں، الگ الگ نہیں — مل کر کھانے میں برکت ہے۔', roman: 'mil kar khayein, alag alag nahin — mil kar khane me barkat hai.' },
  { en: 'The food of two suffices three, and the food of three suffices four.', ur: 'دو کا کھانا تین کے لیے کافی ہوتا ہے، اور تین کا کھانا چار کے لیے۔', roman: 'do ka khana teen ke liye kaafi hai, aur teen ka khana chaar ke liye.' },
  { en: 'Lick the fingers and wipe the plate clean; you do not know in which part the blessing lies.', ur: 'انگلیاں چاٹ لیں اور پلیٹ صاف کر لیں؛ آپ نہیں جانتے کس حصے میں برکت ہے۔', roman: 'ungliyan chaat lein aur plate saaf kar lein; aap nahin jaante kis hisse me barkat hai.' },
  { en: 'Do not waste food; honour it and give any surplus to others.', ur: 'کھانا ضائع نہ کریں؛ اس کی قدر کریں اور جو بچے وہ دوسروں کو دے دیں۔', roman: 'khana zaya mat karein; iski qadar karein aur jo bache wo doosron ko de dein.' },
  { en: 'Make du’a for the one who feeds you: “Allahumma at‘im man at‘amani…”.', ur: 'جو آپ کو کھلائے اس کے لیے دعا کریں: “Allahumma at‘im man at‘amani…”۔', roman: 'jo aap ko khilaye uske liye dua karein: “Allahumma at‘im man at‘amani…”.' },

  // ── Drinking ──────────────────────────────────────────
  { en: 'Say “Bismillah” and drink with the right hand.', ur: '“Bismillah” کہیں اور دائیں ہاتھ سے پئیں۔', roman: '“Bismillah” kahein aur dayein haath se piyein.' },
  { en: 'Sit while drinking (preferred); drink in three breaths, not one gulp.', ur: 'بیٹھ کر پئیں (افضل ہے)؛ ایک ہی سانس میں نہیں بلکہ تین سانس میں پئیں۔', roman: 'baith kar piyein (behtar hai); ek hi saans me nahin balki teen saans me piyein.' },
  { en: 'Do not breathe into the vessel while drinking.', ur: 'پیتے وقت برتن میں سانس نہ لیں۔', roman: 'peete waqt bartan me saans mat lein.' },
  { en: 'Look at the water before drinking; do not drink from a cracked or broken edge.', ur: 'پینے سے پہلے پانی کو دیکھ لیں؛ چٹخے یا ٹوٹے ہوئے کنارے سے نہ پئیں۔', roman: 'peene se pehle pani ko dekh lein; chatke ya toote hue kinare se mat piyein.' },
  { en: 'When sharing, pass to the one on the right.', ur: 'مل کر پیتے وقت دائیں طرف والے کو دیں۔', roman: 'mil kar peete waqt dayein taraf wale ko dein.' },
  { en: 'The one who pours/serves drinks last.', ur: 'جو پلاتا یا خدمت کرتا ہے وہ سب سے آخر میں پیے۔', roman: 'jo pilata ya khidmat karta hai wo sab se aakhir me piye.' },
  { en: 'Do not drink directly from the mouth of a water-skin or large vessel.', ur: 'مشکیزے یا بڑے برتن کے منہ سے سیدھا نہ پئیں۔', roman: 'mashkeeze ya bade bartan ke munh se seedha mat piyein.' },
  { en: 'When given milk, say: “Allahumma barik lana fihi wa zidna minhu”.', ur: 'جب دودھ ملے تو کہیں: “Allahumma barik lana fihi wa zidna minhu”۔', roman: 'jab doodh mile to kahein: “Allahumma barik lana fihi wa zidna minhu”.' },
  { en: 'Do not throw away leftover water; give it to others or an animal.', ur: 'بچا ہوا پانی پھینکیں نہیں؛ دوسروں کو یا کسی جانور کو دے دیں۔', roman: 'bacha hua pani phenkein nahin; doosron ko ya kisi jaanwar ko de dein.' },
  { en: 'Say “Alhamdulillah” after drinking.', ur: 'پینے کے بعد “Alhamdulillah” کہیں۔', roman: 'peene ke baad “Alhamdulillah” kahein.' },

  // ── Sleeping ──────────────────────────────────────────
  { en: 'Perform wudu before going to sleep.', ur: 'سونے سے پہلے وضو کر لیں۔', roman: 'sone se pehle wuzu kar lein.' },
  { en: 'Dust off the bed three times before lying down.', ur: 'لیٹنے سے پہلے بستر کو تین بار جھاڑ لیں۔', roman: 'letne se pehle bistar ko teen baar jhaad lein.' },
  { en: 'Sleep on the right side, hand under the cheek.', ur: 'دائیں کروٹ پر سوئیں، ہاتھ گال کے نیچے رکھ کر۔', roman: 'dayein karwat par soyein, haath gaal ke neeche rakh kar.' },
  { en: 'Recite Ayat al-Kursi, the last two ayahs of Surah Al-Baqarah, and Surah Al-Mulk.', ur: 'آیت الکرسی، سورۃ البقرہ کی آخری دو آیات، اور سورۃ الملک پڑھیں۔', roman: 'Ayatul Kursi, Surah Al-Baqarah ki aakhri do ayatein, aur Surah Al-Mulk padhein.' },
  { en: 'Recite the three Quls (Ikhlas, Falaq, Nas), blow into the palms and wipe over the body three times.', ur: 'تینوں قل (اخلاص، فلق، ناس) پڑھ کر ہتھیلیوں میں پھونکیں اور تین بار پورے جسم پر پھیریں۔', roman: 'teenon Qul (Ikhlas, Falaq, Naas) padh kar hatheliyon me phoonkein aur teen baar poore jism par pherein.' },
  { en: 'Say the sleeping du’a: “Allahumma bismika amutu wa ahya”.', ur: 'سوتے وقت کی دعا پڑھیں: “Allahumma bismika amutu wa ahya”۔', roman: 'sote waqt ki dua padhein: “Allahumma bismika amutu wa ahya”.' },
  { en: 'On waking say: “Alhamdulillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur”.', ur: 'بیدار ہو کر کہیں: “Alhamdulillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur”۔', roman: 'jaag kar kahein: “Alhamdulillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur”.' },
  { en: 'Do not sleep on the stomach — this posture is disliked.', ur: 'پیٹ کے بل نہ سوئیں — یہ طریقہ ناپسندیدہ ہے۔', roman: 'pet ke bal mat soyein — yeh tareeqa napasand hai.' },
  { en: 'Recite Tasbih-e-Fatima before sleeping — SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34.', ur: 'سونے سے پہلے تسبیحِ فاطمہ پڑھیں — SubhanAllah 33، Alhamdulillah 33، Allahu Akbar 34۔', roman: 'sone se pehle Tasbeeh-e-Fatima padhein — SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34.' },
  { en: 'Sleep early after Isha; avoid staying up needlessly.', ur: 'عشاء کے بعد جلدی سو جائیں؛ بلا ضرورت جاگنے سے بچیں۔', roman: 'Isha ke baad jaldi so jayein; bila zaroorat jaagne se bachein.' },
  { en: 'Cover food and drink vessels and put out any open flame before sleeping.', ur: 'سونے سے پہلے کھانے پینے کے برتن ڈھانپ دیں اور کھلی آگ بجھا دیں۔', roman: 'sone se pehle khane peene ke bartan dhaanp dein aur khuli aag bujha dein.' },
  { en: 'On a bad dream, seek refuge in Allah, spit lightly to the left three times, change side, and do not tell anyone.', ur: 'برا خواب دیکھیں تو اللہ کی پناہ مانگیں، بائیں طرف تین بار ہلکا تھوکیں، کروٹ بدل لیں، اور کسی کو نہ بتائیں۔', roman: 'bura khwab dekhein to Allah ki panah maangein, bayein taraf teen baar halka thookein, karwat badal lein, aur kisi ko mat batayein.' },
  { en: 'Sleep with a clean heart — forgive others before sleeping.', ur: 'صاف دل کے ساتھ سوئیں — سونے سے پہلے دوسروں کو معاف کر دیں۔', roman: 'saaf dil ke saath soyein — sone se pehle doosron ko maaf kar dein.' },

  // ── Toilet & Istinja ──────────────────────────────────
  { en: 'Enter with the left foot, saying “Allahumma inni a‘udhu bika minal khubuthi wal khaba’ith”.', ur: 'بائیں پاؤں سے داخل ہوں اور کہیں “Allahumma inni a‘udhu bika minal khubuthi wal khaba’ith”۔', roman: 'bayein paon se dakhil hon aur kahein “Allahumma inni a‘udhu bika minal khubuthi wal khaba’ith”.' },
  { en: 'Leave with the right foot, saying “Ghufranaka”.', ur: 'دائیں پاؤں سے نکلیں اور کہیں “Ghufranaka”۔', roman: 'dayein paon se niklein aur kahein “Ghufranaka”.' },
  { en: 'Do not face the Qibla or turn the back towards it while relieving oneself.', ur: 'قضائے حاجت کے وقت نہ قبلہ کی طرف منہ کریں نہ پیٹھ۔', roman: 'qaza-e-haajat ke waqt na Qibla ki taraf munh karein na peeth.' },
  { en: 'Use the left hand for istinja (cleaning); do not use the right hand.', ur: 'استنجا (صفائی) کے لیے بایاں ہاتھ استعمال کریں؛ دایاں ہاتھ استعمال نہ کریں۔', roman: 'istinja (safai) ke liye baya haath istemaal karein; daya haath istemaal mat karein.' },
  { en: 'Clean thoroughly with water (or stones/tissue where water is unavailable).', ur: 'پانی سے اچھی طرح صفائی کریں (اور جہاں پانی نہ ہو وہاں ڈھیلے یا ٹشو سے)۔', roman: 'pani se achhi tarah safai karein (aur jahan pani na ho wahan dhele ya tissue se).' },
  { en: 'Do not carry anything bearing the name of Allah or Qur’an unnecessarily, and avoid talking inside.', ur: 'بلا ضرورت اللہ کے نام یا قرآن والی کوئی چیز اندر نہ لے جائیں، اور اندر بات کرنے سے بچیں۔', roman: 'bila zaroorat Allah ke naam ya Quran wali koi cheez andar mat le jayein, aur andar baat karne se bachein.' },
  { en: 'Choose a concealed place and do not expose the satr before others.', ur: 'چھپی ہوئی جگہ منتخب کریں اور ستر کسی کے سامنے نہ کھولیں۔', roman: 'chhupi hui jagah chunein aur satar kisi ke saamne mat kholein.' },
  { en: 'Do not face or expose oneself towards the sun or moon while relieving oneself.', ur: 'قضائے حاجت کے وقت سورج یا چاند کی طرف منہ یا ستر نہ کھولیں۔', roman: 'qaza-e-haajat ke waqt sooraj ya chaand ki taraf munh ya satar mat kholein.' },
  { en: 'Do not relieve oneself in still water, on pathways, or where people rest.', ur: 'ٹھہرے ہوئے پانی میں، راستوں پر، یا جہاں لوگ بیٹھتے ہوں وہاں قضائے حاجت نہ کریں۔', roman: 'thehre hue pani me, raaston par, ya jahan log baithte hon wahan qaza-e-haajat mat karein.' },
  { en: 'Remove any impurity and make wudu afterwards for prayer.', ur: 'ہر نجاست دور کریں اور نماز کے لیے بعد میں وضو کر لیں۔', roman: 'har najasat door karein aur namaz ke liye baad me wuzu kar lein.' },

  // ── Salam & Greeting ──────────────────────────────────
  { en: 'Spread the salam among one another — it increases love.', ur: 'آپس میں سلام پھیلائیں — اس سے محبت بڑھتی ہے۔', roman: 'aapas me salam phailayein — is se mohabbat badhti hai.' },
  { en: 'The full greeting: “Assalamu alaikum wa rahmatullahi wa barakatuh”.', ur: 'مکمل سلام: “Assalamu alaikum wa rahmatullahi wa barakatuh”۔', roman: 'mukammal salam: “Assalamu alaikum wa rahmatullahi wa barakatuh”.' },
  { en: 'Reply with an equal or better greeting.', ur: 'جواب اسی جیسے یا اس سے بہتر الفاظ میں دیں۔', roman: 'jawab isi jaisa ya is se behtar alfaaz me dein.' },
  { en: 'The rider greets the walker, the walker greets the sitting, and the smaller group greets the larger.', ur: 'سوار پیدل کو سلام کرے، پیدل بیٹھے ہوئے کو، اور چھوٹی جماعت بڑی جماعت کو سلام کرے۔', roman: 'sawar paidal ko salam kare, paidal baithe hue ko, aur chhoti jamaat badi jamaat ko salam kare.' },
  { en: 'Give salam when entering a gathering and when leaving it.', ur: 'مجلس میں آتے وقت اور جاتے وقت سلام کریں۔', roman: 'majlis me aate waqt aur jaate waqt salam karein.' },
  { en: 'Respond to a sneezer, visit the sick, and fulfil promises — rights of a Muslim.', ur: 'چھینکنے والے کا جواب دیں، بیمار کی عیادت کریں، اور وعدے پورے کریں — یہ مسلمان کے حقوق ہیں۔', roman: 'chheenkne wale ka jawab dein, beemar ki iyadat karein, aur waade poore karein — yeh musalman ke huqooq hain.' },

  // ── Entering / Leaving Home ───────────────────────────
  { en: 'Enter with the right foot, say “Bismillah”, and greet the household with salam.', ur: 'دائیں پاؤں سے داخل ہوں، “Bismillah” کہیں، اور گھر والوں کو سلام کریں۔', roman: 'dayein paon se dakhil hon, “Bismillah” kahein, aur ghar walon ko salam karein.' },
  { en: 'Mention Allah’s name when entering and when eating — it keeps Shaytan out.', ur: 'داخل ہوتے اور کھاتے وقت اللہ کا نام لیں — اس سے شیطان دور رہتا ہے۔', roman: 'dakhil hote aur khate waqt Allah ka naam lein — is se shaytan door rehta hai.' },
  { en: 'When leaving say: “Bismillahi tawakkaltu ‘alallah, la hawla wa la quwwata illa billah”.', ur: 'نکلتے وقت کہیں: “Bismillahi tawakkaltu ‘alallah, la hawla wa la quwwata illa billah”۔', roman: 'nikalte waqt kahein: “Bismillahi tawakkaltu ‘alallah, la hawla wa la quwwata illa billah”.' },
  { en: 'Seek permission (isti’dhan) before entering others’ homes, up to three times.', ur: 'دوسروں کے گھر میں داخل ہونے سے پہلے اجازت (استیذان) لیں، تین بار تک۔', roman: 'doosron ke ghar me dakhil hone se pehle ijaazat (istizaan) lein, teen baar tak.' },
  { en: 'Give salam even if the house is empty: “Assalamu ‘alaina wa ‘ala ‘ibadillahis-salihin”.', ur: 'گھر خالی ہو تب بھی سلام کریں: “Assalamu ‘alaina wa ‘ala ‘ibadillahis-salihin”۔', roman: 'ghar khali ho tab bhi salam karein: “Assalamu ‘alaina wa ‘ala ‘ibadillahis-salihin”.' },
  { en: 'Use the miswak on entering the home, as was the Prophet’s ﷺ habit.', ur: 'گھر میں داخل ہوتے وقت مسواک کریں، جیسا کہ نبی ﷺ کی عادت تھی۔', roman: 'ghar me dakhil hote waqt miswak karein, jaisa ke Nabi ﷺ ki aadat thi.' },
  { en: 'Help the household with chores — the Prophet ﷺ served his family.', ur: 'گھر کے کاموں میں گھر والوں کی مدد کریں — نبی ﷺ اپنے گھر والوں کے کام کرتے تھے۔', roman: 'ghar ke kaamon me ghar walon ki madad karein — Nabi ﷺ apne ghar walon ke kaam karte the.' },
  { en: 'Recite Surah Al-Baqarah in the home; Shaytan flees from a house in which it is recited.', ur: 'گھر میں سورۃ البقرہ پڑھیں؛ جس گھر میں یہ پڑھی جائے شیطان وہاں سے بھاگتا ہے۔', roman: 'ghar me Surah Al-Baqarah padhein; jis ghar me yeh padhi jaye shaytan wahan se bhaagta hai.' },
  { en: 'At nightfall close the doors, cover the vessels and mention Allah’s name.', ur: 'رات ہوتے ہی دروازے بند کر دیں، برتن ڈھانپ دیں اور اللہ کا نام لیں۔', roman: 'raat hote hi darwaze band kar dein, bartan dhaanp dein aur Allah ka naam lein.' },
  { en: 'Do not keep pictures of living beings or a dog (except for guarding/farming) in the home.', ur: 'گھر میں جانداروں کی تصویریں یا کتا نہ رکھیں (سوائے حفاظت یا کھیتی کے لیے)۔', roman: 'ghar me jaandaron ki tasveerein ya kutta mat rakhein (siwaye hifazat ya kheti ke liye).' },
  { en: 'Keep the home clean and remove anything harmful from the path/entrance.', ur: 'گھر کو صاف رکھیں اور راستے یا دروازے سے ہر تکلیف دہ چیز ہٹا دیں۔', roman: 'ghar ko saaf rakhein aur raaste ya darwaze se har takleef deh cheez hata dein.' },
  { en: 'Do not return to the family suddenly late at night without notice.', ur: 'بغیر اطلاع کے رات گئے اچانک گھر والوں کے پاس نہ لوٹیں۔', roman: 'bagair ittila ke raat gaye achanak ghar walon ke paas mat lautein.' },

  // ── The Masjid ────────────────────────────────────────
  { en: 'Enter with the right foot, saying “Allahumma iftah li abwaba rahmatik”.', ur: 'دائیں پاؤں سے داخل ہوں اور کہیں “Allahumma iftah li abwaba rahmatik”۔', roman: 'dayein paon se dakhil hon aur kahein “Allahumma iftah li abwaba rahmatik”.' },
  { en: 'Leave with the left foot, saying “Allahumma inni as’aluka min fadlik”.', ur: 'بائیں پاؤں سے نکلیں اور کہیں “Allahumma inni as’aluka min fadlik”۔', roman: 'bayein paon se niklein aur kahein “Allahumma inni as’aluka min fadlik”.' },
  { en: 'Pray two rak’ah (Tahiyyat al-Masjid) before sitting down.', ur: 'بیٹھنے سے پہلے دو رکعت (تحیۃ المسجد) پڑھیں۔', roman: 'baithne se pehle do rakat (Tahiyyatul Masjid) padhein.' },
  { en: 'Come in a state of wudu, in clean clothes, without the smell of raw onion/garlic.', ur: 'وضو کی حالت میں، صاف کپڑوں کے ساتھ، اور کچی پیاز یا لہسن کی بو کے بغیر آئیں۔', roman: 'wuzu ki halat me, saaf kapdon ke saath, aur kachi pyaz ya lehsan ki boo ke bagair aayein.' },
  { en: 'Keep the masjid clean and quiet; no worldly buying and selling inside.', ur: 'مسجد کو صاف اور پُرسکون رکھیں؛ اندر دنیاوی خرید و فروخت نہ کریں۔', roman: 'masjid ko saaf aur pursukoon rakhein; andar duniyavi khareed o farokht mat karein.' },
  { en: 'Walk to the masjid calmly and with dignity; do not run, even if the prayer has started.', ur: 'مسجد کی طرف سکون اور وقار سے چلیں؛ چاہے نماز شروع ہو چکی ہو، دوڑیں نہیں۔', roman: 'masjid ki taraf sukoon aur waqaar se chalein; chahe namaz shuru ho chuki ho, daudein nahin.' },
  { en: 'Do not disturb others’ prayer or raise the voice in recitation over them.', ur: 'دوسروں کی نماز میں خلل نہ ڈالیں اور تلاوت میں ان پر آواز بلند نہ کریں۔', roman: 'doosron ki namaz me khalal mat daalein aur tilawat me un par awaz buland mat karein.' },
  { en: 'Do not announce lost property in the masjid.', ur: 'مسجد میں گمشدہ چیز کا اعلان نہ کریں۔', roman: 'masjid me gumshuda cheez ka elaan mat karein.' },
  { en: 'Seek the front rows — there is great virtue in the first row.', ur: 'اگلی صفوں میں جگہ ڈھونڈیں — پہلی صف میں بڑی فضیلت ہے۔', roman: 'agli safon me jagah dhoondein — pehli saf me badi fazeelat hai.' },
  { en: 'Pray towards a sutrah (barrier) and do not let anyone pass directly in front.', ur: 'سترہ (آڑ) کی طرف نماز پڑھیں اور کسی کو اپنے بالکل سامنے سے گزرنے نہ دیں۔', roman: 'sutrah (aad) ki taraf namaz padhein aur kisi ko apne bilkul saamne se guzarne mat dein.' },
  { en: 'While waiting for salah you are “in prayer”, and the angels send blessings upon you.', ur: 'نماز کے انتظار میں آپ گویا “نماز میں” ہیں، اور فرشتے آپ پر رحمت بھیجتے ہیں۔', roman: 'namaz ke intezaar me aap goya “namaz me” hain, aur farishte aap par rehmat bhejte hain.' },
  { en: 'Women’s rows are behind the men’s; maintain modesty and order.', ur: 'عورتوں کی صفیں مردوں کے پیچھے ہوں؛ حیا اور ترتیب برقرار رکھیں۔', roman: 'auraton ki safein mardon ke peeche hon; haya aur tarteeb barqaraar rakhein.' },
  { en: 'Straighten and fill the rows, closing gaps for the congregation.', ur: 'صفیں سیدھی کریں اور بھر دیں، جماعت کے لیے خالی جگہیں پُر کریں۔', roman: 'safein seedhi karein aur bhar dein, jamaat ke liye khali jagahein pur karein.' },

  // ── Sneezing & Yawning ────────────────────────────────
  { en: 'When you sneeze, say “Alhamdulillah”, and lower the voice while covering the mouth.', ur: 'جب چھینک آئے تو “Alhamdulillah” کہیں، منہ ڈھانپ کر آواز پست رکھیں۔', roman: 'jab chheenk aaye to “Alhamdulillah” kahein, munh dhaank kar awaz pasht rakhein.' },
  { en: 'The one who hears it replies “Yarhamukallah”.', ur: 'سننے والا جواب میں “Yarhamukallah” کہے۔', roman: 'sunne wala jawab me “Yarhamukallah” kahe.' },
  { en: 'The sneezer then answers “Yahdikumullahu wa yuslihu balakum”.', ur: 'پھر چھینکنے والا جواب دے “Yahdikumullahu wa yuslihu balakum”۔', roman: 'phir chheenkne wala jawab de “Yahdikumullahu wa yuslihu balakum”.' },
  { en: 'Yawning is from Shaytan — suppress it as much as possible and cover the mouth with the hand.', ur: 'جمائی شیطان کی طرف سے ہے — جتنا ہو سکے اسے روکیں اور ہاتھ سے منہ ڈھانپ لیں۔', roman: 'jamahi shaytan ki taraf se hai — jitna ho sake ise rokein aur haath se munh dhaank lein.' },

  // ── Clothing & Dressing ───────────────────────────────
  { en: 'Begin with the right side when putting on clothes and shoes; begin with the left when removing.', ur: 'کپڑے اور جوتے پہنتے وقت دائیں طرف سے شروع کریں؛ اتارتے وقت بائیں طرف سے۔', roman: 'kapde aur joote pehente waqt dayein taraf se shuru karein; utaarte waqt bayein taraf se.' },
  { en: 'Recite the du’a for new clothes, thanking Allah for the covering.', ur: 'نئے کپڑوں کی دعا پڑھیں اور اللہ کا شکر ادا کریں کہ اس نے پردہ عطا کیا۔', roman: 'naye kapdon ki dua padhein aur Allah ka shukr ada karein ke usne parda ata kiya.' },
  { en: 'Men must not let the lower garment hang below the ankles (isbal) out of pride.', ur: 'مرد تکبر سے تہبند یا پائجامہ ٹخنوں سے نیچے نہ لٹکائیں (اسبال)۔', roman: 'mard takabbur se tehband ya paijama takhnon se neeche mat latkayein (isbaal).' },
  { en: 'Men must not wear silk or gold.', ur: 'مرد ریشم یا سونا نہ پہنیں۔', roman: 'mard resham ya sona mat pehnein.' },
  { en: 'Women should observe full, loose, modest covering (hijab) before non-mahram.', ur: 'عورتیں غیر محرم کے سامنے مکمل، ڈھیلا اور باحیا پردہ (حجاب) کریں۔', roman: 'auratein ghair-mehram ke saamne mukammal, dheela aur ba-haya parda (hijab) karein.' },
  { en: 'Dress modestly and cleanly; avoid imitating the opposite gender.', ur: 'باحیا اور صاف ستھرا لباس پہنیں؛ مخالف جنس کی مشابہت سے بچیں۔', roman: 'ba-haya aur saaf suthra libaas pehnein; mukhaalif jins ki mushabahat se bachein.' },
  { en: 'Always keep the awrah covered — men from navel to knee, women all but the face and hands.', ur: 'ستر ہمیشہ ڈھکا رکھیں — مرد ناف سے گھٹنے تک، عورتیں چہرے اور ہاتھوں کے سوا سب کچھ۔', roman: 'satar hamesha dhaka rakhein — mard naaf se ghutne tak, auratein chehre aur haathon ke siwa sab kuch.' },
  { en: 'White garments are recommended, and keep clothes clean.', ur: 'سفید کپڑے پہننا پسندیدہ ہے، اور کپڑے صاف رکھیں۔', roman: 'safed kapde pehanna pasandeeda hai, aur kapde saaf rakhein.' },
  { en: 'Avoid clothing worn for fame or show (libas ash-shuhrah).', ur: 'شہرت یا دکھاوے کے لیے پہنا جانے والا لباس (لباسِ شہرت) نہ پہنیں۔', roman: 'shohrat ya dikhawe ke liye pehna jane wala libaas (libaas-e-shuhrat) mat pehnein.' },
  { en: 'Wear both shoes or neither; put on the right first, take off the left first.', ur: 'یا تو دونوں جوتے پہنیں یا کوئی نہیں؛ پہلے دایاں پہنیں، پہلے بایاں اتاریں۔', roman: 'ya to dono joote pehnein ya koi nahin; pehle daya pehnein, pehle baya utaarein.' },
  { en: 'Women must not wear tight, transparent clothing, nor perfume before non-mahram.', ur: 'عورتیں تنگ یا باریک کپڑے نہ پہنیں، اور غیر محرم کے سامنے خوشبو نہ لگائیں۔', roman: 'auratein tang ya bareek kapde mat pehnein, aur ghair-mehram ke saamne khushbu mat lagayein.' },
  { en: 'Men should keep the beard and trim the moustache (fitrah).', ur: 'مرد داڑھی رکھیں اور مونچھیں پست رکھیں (فطرت میں سے ہے)۔', roman: 'mard daadhi rakhein aur moonchein pasht rakhein (fitrat me se hai).' },

  // ── Travel ────────────────────────────────────────────
  { en: 'Recite the travel du’a when setting out: “Subhanal-ladhi sakhkhara lana hadha…”.', ur: 'روانہ ہوتے وقت سفر کی دعا پڑھیں: “Subhanal-ladhi sakhkhara lana hadha…”۔', roman: 'rawana hote waqt safar ki dua padhein: “Subhanal-ladhi sakhkhara lana hadha…”.' },
  { en: 'Say “Allahu Akbar” when going up an incline and “Subhanallah” when going down.', ur: 'چڑھائی پر “Allahu Akbar” کہیں اور ڈھلان پر “Subhanallah” کہیں۔', roman: 'chadhai par “Allahu Akbar” kahein aur dhalaan par “Subhanallah” kahein.' },
  { en: 'Appoint a leader (amir) when three or more travel together.', ur: 'جب تین یا زیادہ لوگ مل کر سفر کریں تو ایک امیر مقرر کریں۔', roman: 'jab teen ya zyada log mil kar safar karein to ek ameer muqarrar karein.' },
  { en: 'A traveller may shorten (qasr) the four-rak’ah fard to two.', ur: 'مسافر چار رکعت فرض کو دو رکعت (قصر) کر سکتا ہے۔', roman: 'musafir chaar rakat farz ko do rakat (qasr) kar sakta hai.' },
  { en: 'Seek Allah’s protection and return promptly to the family once the need is met.', ur: 'اللہ سے حفاظت مانگیں اور کام پورا ہوتے ہی جلد گھر والوں کے پاس لوٹ آئیں۔', roman: 'Allah se hifazat maangein aur kaam poora hote hi jald ghar walon ke paas laut aayein.' },
  { en: 'Travel in company; a single rider is a devil, two are devils, three are a travelling party.', ur: 'ساتھ مل کر سفر کریں؛ اکیلا سوار شیطان ہے، دو شیطان ہیں، اور تین ایک قافلہ ہیں۔', roman: 'saath mil kar safar karein; akela sawar shaytan hai, do shaytan hain, aur teen ek qafila hain.' },
  { en: 'When three set out, they should appoint one of them as amir (leader).', ur: 'جب تین لوگ نکلیں تو ان میں سے ایک کو امیر مقرر کر لیں۔', roman: 'jab teen log niklein to un me se ek ko ameer muqarrar kar lein.' },
  { en: 'Make plentiful du’a — the traveller’s supplication is accepted.', ur: 'کثرت سے دعا کریں — مسافر کی دعا قبول ہوتی ہے۔', roman: 'kasrat se dua karein — musafir ki dua qabool hoti hai.' },
  { en: 'Bid farewell to loved ones: “Astawdi‘ullaha dinaka wa amanataka wa khawatima ‘amalika”.', ur: 'اپنے پیاروں کو رخصت کرتے وقت کہیں: “Astawdi‘ullaha dinaka wa amanataka wa khawatima ‘amalika”۔', roman: 'apne pyaron ko rukhsat karte waqt kahein: “Astawdi‘ullaha dinaka wa amanataka wa khawatima ‘amalika”.' },
  { en: 'A traveller may combine and shorten prayers as permitted.', ur: 'مسافر اجازت کے مطابق نمازیں جمع اور قصر کر سکتا ہے۔', roman: 'musafir ijaazat ke mutabiq namazein jama aur qasr kar sakta hai.' },
  { en: 'On returning, it is Sunnah to first go to the masjid and pray two rak’ah.', ur: 'واپسی پر سنت یہ ہے کہ پہلے مسجد جا کر دو رکعت پڑھیں۔', roman: 'wapsi par sunnat yeh hai ke pehle masjid ja kar do rakat padhein.' },
  { en: 'Do not arrive home unannounced late at night.', ur: 'رات گئے بغیر اطلاع کے گھر نہ پہنچیں۔', roman: 'raat gaye bagair ittila ke ghar mat pahunchein.' },

  // ── Gatherings (Majlis) ───────────────────────────────
  { en: 'Give salam when arriving at a gathering and when leaving it.', ur: 'مجلس میں پہنچتے وقت اور جاتے وقت سلام کریں۔', roman: 'majlis me pahunchte waqt aur jaate waqt salam karein.' },
  { en: 'Make room for others; do not make anyone rise to take his seat.', ur: 'دوسروں کے لیے جگہ بنائیں؛ کسی کو اٹھا کر اس کی جگہ نہ بیٹھیں۔', roman: 'doosron ke liye jagah banayein; kisi ko utha kar uski jagah mat baithein.' },
  { en: 'Sit where there is space; do not sit between two people without their permission.', ur: 'جہاں جگہ ہو وہاں بیٹھیں؛ دو آدمیوں کے درمیان ان کی اجازت کے بغیر نہ بیٹھیں۔', roman: 'jahan jagah ho wahan baithein; do aadmiyon ke darmiyaan unki ijaazat ke bagair mat baithein.' },
  { en: 'Do not whisper between two people while excluding a third.', ur: 'تیسرے کو چھوڑ کر دو آدمی آپس میں سرگوشی نہ کریں۔', roman: 'teesre ko chhod kar do aadmi aapas me sargoshi mat karein.' },
  { en: 'Speak good or remain silent; avoid backbiting and idle talk.', ur: 'اچھی بات کریں یا خاموش رہیں؛ غیبت اور فضول باتوں سے بچیں۔', roman: 'achhi baat karein ya khamosh rahein; gheebat aur fizool baaton se bachein.' },
  { en: 'Lower the gaze and be humble; do not dominate the gathering.', ur: 'نظریں نیچی رکھیں اور عاجزی اختیار کریں؛ مجلس پر چھا جانے کی کوشش نہ کریں۔', roman: 'nazrein neechi rakhein aur aajizi ikhtiyaar karein; majlis par chha jane ki koshish mat karein.' },
  { en: 'Recite the du’a on leaving (kaffarah al-majlis): “Subhanaka Allahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk”.', ur: 'اٹھتے وقت مجلس کی دعا (کفارۃ المجلس) پڑھیں: “Subhanaka Allahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk”۔', roman: 'uthte waqt majlis ki dua (kaffara-tul-majlis) padhein: “Subhanaka Allahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk”.' },
  { en: 'Honour the guest and the elder; begin serving from the right.', ur: 'مہمان اور بزرگ کی عزت کریں؛ خدمت دائیں طرف سے شروع کریں۔', roman: 'mehmaan aur buzurg ki izzat karein; khidmat dayein taraf se shuru karein.' },

  // ── Parents & Elders ──────────────────────────────────
  { en: 'Be kind and obedient to parents; lower the wing of humility to them.', ur: 'والدین کے ساتھ نرمی اور فرمانبرداری کریں؛ ان کے سامنے عاجزی سے جھکے رہیں۔', roman: 'walidain ke saath narmi aur farmabardaari karein; unke saamne aajizi se jhuke rahein.' },
  { en: 'Never say “uff” to them nor rebuke them; speak a gracious word.', ur: 'ان کو کبھی “اُف” تک نہ کہیں اور نہ جھڑکیں؛ ان سے نرم اور عزت والی بات کریں۔', roman: 'unko kabhi “uff” tak mat kahein aur na jhidkein; unse naram aur izzat wali baat karein.' },
  { en: 'Seek their pleasure — Allah’s pleasure lies in the pleasure of the parents.', ur: 'ان کی رضا حاصل کریں — اللہ کی رضا والدین کی رضا میں ہے۔', roman: 'unki raza haasil karein — Allah ki raza walidain ki raza me hai.' },
  { en: 'Serve them, spend on them, and make du’a: “Rabbir-hamhuma kama rabbayani saghira”.', ur: 'ان کی خدمت کریں، ان پر خرچ کریں، اور دعا کریں: “Rabbir-hamhuma kama rabbayani saghira”۔', roman: 'unki khidmat karein, un par kharch karein, aur dua karein: “Rabbir-hamhuma kama rabbayani saghira”.' },
  { en: 'Respect elders and show mercy to the young.', ur: 'بڑوں کی عزت کریں اور چھوٹوں پر شفقت کریں۔', roman: 'badon ki izzat karein aur chhoton par shafqat karein.' },
  { en: 'Maintain kindness after their death — du’a, charity, and keeping ties with their friends.', ur: 'ان کی وفات کے بعد بھی حسن سلوک جاری رکھیں — دعا، صدقہ، اور ان کے دوستوں سے تعلق نبھانا۔', roman: 'unki wafat ke baad bhi husn-e-sulook jari rakhein — dua, sadqa, aur unke doston se taalluq nibhana.' },
  { en: 'Keep ties of kinship (silah rahm); do not sever relations.', ur: 'صلہ رحمی قائم رکھیں؛ رشتہ داری نہ توڑیں۔', roman: 'sila-rehmi qaim rakhein; rishtedaari mat todein.' },

  // ── Speech & the Tongue ───────────────────────────────
  { en: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', ur: 'جو اللہ اور آخرت کے دن پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے۔', roman: 'jo Allah aur aakhirat ke din par imaan rakhta hai wo achhi baat kahe ya khamosh rahe.' },
  { en: 'Be truthful; truthfulness leads to righteousness and to Paradise.', ur: 'سچ بولیں؛ سچائی نیکی کی طرف اور جنت کی طرف لے جاتی ہے۔', roman: 'sach bolein; sachai neki ki taraf aur jannat ki taraf le jaati hai.' },
  { en: 'Avoid backbiting (gheebah) and tale-carrying (nameemah).', ur: 'غیبت اور چغل خوری (نمیمہ) سے بچیں۔', roman: 'gheebat aur chughal-khori (nameema) se bachein.' },
  { en: 'Lower your voice; the harshest of voices is the braying of a donkey.', ur: 'اپنی آواز پست رکھیں؛ سب سے بری آواز گدھے کی آواز ہے۔', roman: 'apni awaz pasht rakhein; sab se buri awaz gadhe ki awaz hai.' },
  { en: 'Do not argue even when you are right; abandon lying even in jest.', ur: 'حق پر ہوتے ہوئے بھی جھگڑا نہ کریں؛ مذاق میں بھی جھوٹ چھوڑ دیں۔', roman: 'haq par hote hue bhi jhagda mat karein; mazaq me bhi jhoot chhod dein.' },
  { en: 'Fulfil promises and speak with justice, even against oneself.', ur: 'وعدے پورے کریں اور انصاف کی بات کریں، چاہے اپنے ہی خلاف ہو۔', roman: 'waade poore karein aur insaaf ki baat karein, chahe apne hi khilaf ho.' },
  { en: 'Do not mock, insult, or call others by offensive nicknames.', ur: 'کسی کا مذاق نہ اڑائیں، گالی نہ دیں، اور برے القاب سے نہ پکاریں۔', roman: 'kisi ka mazaq mat udayein, gaali mat dein, aur bure alqaab se mat pukarein.' },
]
