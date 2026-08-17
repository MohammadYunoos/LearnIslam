// src/content/i18n/ui.i18n.ts
// Curated Urdu + Roman-Urdu for hardcoded UI chrome (nav, menus, headers,
// buttons, empty/loading states). Strings copied from the page/component JSX.
import type { Tr } from './types'

export const UI_I18N: Tr[] = [
  // ── Bottom nav ────────────────────────────────────────
  { en: 'Home', ur: 'ہوم', roman: 'Home' },
  { en: 'Maqtab', ur: 'مکتب', roman: 'Maqtab' },
  { en: 'Hifz', ur: 'حفظ', roman: 'Hifz' },
  { en: 'Ulema', ur: 'علماء', roman: 'Ulema' },
  { en: 'Messages', ur: 'پیغامات', roman: 'paighaam' },
  { en: 'Muhasaba', ur: 'محاسبہ', roman: 'Muhasaba' },

  // ── Home ──────────────────────────────────────────────
  { en: 'Assalamu Alaikum', ur: 'السلام علیکم', roman: 'Assalamu Alaikum' },
  { en: 'What would you like to learn?', ur: 'آپ کیا سیکھنا چاہیں گے؟', roman: 'aap kya seekhna chahenge?' },
  { en: 'Hadees of the day', ur: 'آج کی حدیث', roman: 'aaj ki hadees' },
  { en: 'Ameen, continue', ur: 'آمین، جاری رکھیں', roman: 'Ameen, jari rakhein' },
  { en: 'Maqtab progress', ur: 'مکتب کی پیش رفت', roman: 'Maqtab ki paish-raft' },
  { en: 'lessons done', ur: 'اسباق مکمل', roman: 'asbaaq mukammal' },

  // ── Home menu items ───────────────────────────────────
  { en: 'Masail', ur: 'مسائل', roman: 'Masail' },
  { en: 'Adaab', ur: 'آداب', roman: 'Adaab' },
  { en: 'Islamic Q & A', ur: 'اسلامی سوال و جواب', roman: 'Islami sawal o jawab' },
  { en: 'Detoxify', ur: 'تزکیۂ نفس', roman: 'tazkiya-e-nafs' },
  { en: 'Masnoon Dua & Zikr', ur: 'مسنون دعا اور ذکر', roman: 'Masnoon dua aur zikr' },
  { en: 'Ask Ulema', ur: 'علماء سے پوچھیں', roman: 'Ulema se poochein' },
  { en: 'Gusl · Wudu · Tayammum · Namaaz · more', ur: 'غسل · وضو · تیمم · نماز · مزید', roman: 'ghusl · wuzu · tayammum · namaz · mazeed' },
  { en: 'Daily etiquette', ur: 'روزمرہ کے آداب', roman: 'rozmarra ke aadaab' },
  { en: 'Question & answer volumes', ur: 'سوال و جواب کی جلدیں', roman: 'sawal o jawab ki jildein' },
  { en: 'Learning journey', ur: 'سیکھنے کا سفر', roman: 'seekhne ka safar' },
  { en: 'Surah memorisation', ur: 'سورتوں کا حفظ', roman: 'surton ka hifz' },
  { en: 'Heart and Akhlaq', ur: 'دل اور اخلاق', roman: 'dil aur akhlaq' },
  { en: 'Duas · Kalimas · Tasbih', ur: 'دعائیں · کلمے · تسبیح', roman: 'duaein · kalme · tasbeeh' },
  { en: 'Send your masail to scholars', ur: 'اپنے مسائل علماء کو بھیجیں', roman: 'apne masail Ulema ko bhejein' },

  // ── Common headers / subtitles ────────────────────────
  { en: 'Etiquettes of daily life', ur: 'روزمرہ زندگی کے آداب', roman: 'rozmarra zindagi ke aadaab' },
  { en: 'Your progress', ur: 'آپ کی پیش رفت', roman: 'aap ki paish-raft' },
  { en: 'Purify the heart · Tazkiyah', ur: 'دل کی صفائی · تزکیہ', roman: 'dil ki safai · tazkiyah' },
  { en: 'Step-by-step Islamic practice', ur: 'قدم بہ قدم اسلامی عمل', roman: 'qadam ba qadam Islami amal' },
  { en: 'Steps', ur: 'مراحل', roman: 'marahil' },
  { en: 'Listen · learn · memorise', ur: 'سنیں · سیکھیں · یاد کریں', roman: 'sunein · seekhein · yaad karein' },
  { en: 'Quiz', ur: 'کوئز', roman: 'quiz' },
  { en: 'Your learning journey', ur: 'آپ کا سیکھنے کا سفر', roman: 'aap ka seekhne ka safar' },
  { en: 'Lesson', ur: 'سبق', roman: 'sabaq' },
  { en: 'Settings', ur: 'ترتیبات', roman: 'settings' },
  { en: 'Plans', ur: 'پلانز', roman: 'plans' },
  { en: 'Choose your plan', ur: 'اپنا پلان منتخب کریں', roman: 'apna plan muntakhab karein' },
  { en: 'Inspired by the famous book Taleem ul Islam', ur: 'مشہور کتاب تعلیم الاسلام سے ماخوذ', roman: 'mashhoor kitaab Taleem ul Islam se maakhooz' },
  { en: 'Zikr', ur: 'ذکر', roman: 'zikr' },
  { en: 'Tap the circle to count', ur: 'گننے کے لیے دائرے کو ٹیپ کریں', roman: 'ginne ke liye daayre ko tap karein' },
  { en: 'Surah', ur: 'سورت', roman: 'surat' },
  { en: 'Not found', ur: 'نہیں ملا', roman: 'nahin mila' },

  // ── Guide / topic ─────────────────────────────────────
  { en: 'Sections', ur: 'حصے', roman: 'hisse' },
  { en: 'Sections + step-by-step animation', ur: 'حصے + قدم بہ قدم اینیمیشن', roman: 'hisse + qadam ba qadam animation' },
  { en: 'Play step-by-step', ur: 'قدم بہ قدم چلائیں', roman: 'qadam ba qadam chalayein' },
  { en: 'Content coming soon, In sha Allah.', ur: 'مواد جلد آ رہا ہے، ان شاء اللہ۔', roman: 'content jald aa raha hai, In sha Allah.' },
  { en: 'Content is for learning and is pending final review by a qualified Alim — for a verified ruling, consult your local Alim.', ur: 'یہ مواد سیکھنے کے لیے ہے اور کسی مستند عالم کی حتمی نظرثانی کا منتظر ہے — تصدیق شدہ مسئلے کے لیے اپنے مقامی عالم سے رجوع کریں۔', roman: 'yeh content seekhne ke liye hai aur kisi mustanad aalim ki hatmi nazar-e-saani ka muntazir hai — tasdeeq-shuda masle ke liye apne maqami aalim se rujoo karein.' },
  { en: 'Following the', ur: 'اس مسلک کے مطابق', roman: 'is maslak ke mutabiq' },
  { en: 'maslak.', ur: 'مسلک۔', roman: 'maslak.' },
  { en: 'This section is coming soon in a future update, In sha Allah.', ur: 'یہ حصہ آئندہ اپڈیٹ میں جلد آ رہا ہے، ان شاء اللہ۔', roman: 'yeh hissa aainda update me jald aa raha hai, In sha Allah.' },

  // ── Step player ───────────────────────────────────────
  { en: 'Narration On', ur: 'آواز آن', roman: 'narration on' },
  { en: 'Narration Off', ur: 'آواز آف', roman: 'narration off' },
  { en: 'Voice', ur: 'آواز', roman: 'awaz' },
  { en: 'Replay', ur: 'دوبارہ چلائیں', roman: 'dobara chalayein' },
  { en: 'Prev', ur: 'پچھلا', roman: 'pichhla' },
  { en: 'Next', ur: 'اگلا', roman: 'agla' },
  { en: 'Step', ur: 'مرحلہ', roman: 'marhala' },
  { en: 'of', ur: 'میں سے', roman: 'me se' },
  { en: 'Narration not supported on this device', ur: 'اس ڈیوائس پر آواز کی سہولت نہیں', roman: 'is device par narration ki sahulat nahin' },

  // ── Hifz ──────────────────────────────────────────────
  { en: 'surahs memorised', ur: 'سورتیں یاد ہو گئیں', roman: 'surtein yaad ho gayin' },
  { en: 'ayah', ur: 'آیت', roman: 'ayat' },
  { en: 'Not started', ur: 'شروع نہیں ہوا', roman: 'shuru nahin hua' },
  { en: 'In progress', ur: 'جاری ہے', roman: 'jari hai' },
  { en: 'Completed', ur: 'مکمل', roman: 'mukammal' },
  { en: 'Memorised', ur: 'یاد ہو گیا', roman: 'yaad ho gaya' },
  { en: 'Audio could not load. Check the storage bucket/path config.', ur: 'آڈیو لوڈ نہ ہو سکی۔ اسٹوریج بکٹ/پاتھ کنفگ چیک کریں۔', roman: 'audio load na ho saki. storage bucket/path config check karein.' },
  { en: 'Mark as memorised', ur: 'یاد شدہ کے طور پر نشان لگائیں', roman: 'yaad-shuda ke taur par nishaan lagayein' },
  { en: 'Surah completed', ur: 'سورت مکمل', roman: 'surat mukammal' },
  { en: 'Mark surah as completed', ur: 'سورت کو مکمل کے طور پر نشان لگائیں', roman: 'surat ko mukammal ke taur par nishaan lagayein' },
  { en: 'Stop', ur: 'روکیں', roman: 'rokein' },
  { en: 'Play surah', ur: 'سورت چلائیں', roman: 'surat chalayein' },
  { en: 'Repeat', ur: 'دہرائیں', roman: 'dohrayein' },

  // ── Maqtab / Lesson / Quiz chrome ─────────────────────
  { en: 'Overall progress', ur: 'مجموعی پیش رفت', roman: 'majmooi paish-raft' },
  { en: 'Chapter', ur: 'باب', roman: 'baab' },
  { en: 'min', ur: 'منٹ', roman: 'minute' },
  { en: 'Loading lessons…', ur: 'اسباق لوڈ ہو رہے ہیں…', roman: 'asbaaq load ho rahe hain…' },
  { en: 'No lessons found. Check your Supabase content.', ur: 'کوئی سبق نہیں ملا۔ اپنا Supabase مواد چیک کریں۔', roman: 'koi sabaq nahin mila. apna Supabase content check karein.' },
  { en: 'Take the quiz', ur: 'کوئز دیں', roman: 'quiz dein' },
  { en: 'Loading quiz…', ur: 'کوئز لوڈ ہو رہا ہے…', roman: 'quiz load ho raha hai…' },
  { en: 'No quiz for this lesson yet.', ur: 'اس سبق کے لیے ابھی کوئز نہیں۔', roman: 'is sabaq ke liye abhi quiz nahin.' },
  { en: 'Back to Maqtab', ur: 'مکتب پر واپس', roman: 'Maqtab par wapas' },
  { en: 'Lesson completed', ur: 'سبق مکمل', roman: 'sabaq mukammal' },
  { en: 'Saving progress…', ur: 'پیش رفت محفوظ ہو رہی ہے…', roman: 'paish-raft mehfooz ho rahi hai…' },
  { en: 'Submit answers', ur: 'جوابات جمع کریں', roman: 'jawabaat jama karein' },
  { en: 'Try again', ur: 'دوبارہ کوشش کریں', roman: 'dobara koshish karein' },
  { en: 'Back', ur: 'واپس', roman: 'wapas' },
  { en: 'Finish → Back to Maqtab', ur: 'ختم کریں → مکتب پر واپس', roman: 'khatam karein → Maqtab par wapas' },
  { en: 'Mashallah!', ur: 'ماشاءاللہ!', roman: 'Mashallah!' },
  { en: 'Good job — all answers correct!', ur: 'بہت خوب — سب جوابات درست!', roman: 'bahut khoob — sab jawabaat durust!' },
  { en: 'Alhamdulillah, continue →', ur: 'الحمد للہ، جاری رکھیں →', roman: 'Alhamdulillah, jari rakhein →' },
  { en: 'Review answers', ur: 'جوابات کا جائزہ لیں', roman: 'jawabaat ka jaiza lein' },
  { en: 'correct', ur: 'درست', roman: 'durust' },

  // ── Wajifa / Masnoon list ─────────────────────────────
  { en: 'Masnoon Duas', ur: 'مسنون دعائیں', roman: 'Masnoon duaein' },
  { en: 'Zikr & Wajifa', ur: 'ذکر اور وظیفہ', roman: 'zikr aur wazifa' },
  { en: 'Tap any zikr to open the counter for your daily wird.', ur: 'اپنے روزانہ ورد کے لیے کاؤنٹر کھولنے کو کسی بھی ذکر پر ٹیپ کریں۔', roman: 'apne rozana wird ke liye counter kholne ko kisi bhi zikr par tap karein.' },

  // ── Masail (coming soon) ──────────────────────────────
  { en: 'Ask your Masail to the Ulema', ur: 'اپنے مسائل علماء سے پوچھیں', roman: 'apne masail Ulema se poochein' },
  { en: 'Soon you will be able to send your questions (masail) directly to qualified Ulema and receive verified answers, In sha Allah. This feature is being built.', ur: 'جلد آپ اپنے سوالات (مسائل) براہِ راست مستند علماء کو بھیج کر تصدیق شدہ جوابات حاصل کر سکیں گے، ان شاء اللہ۔ یہ سہولت بنائی جا رہی ہے۔', roman: 'jald aap apne sawalat (masail) baraah-e-raast mustanad Ulema ko bhej kar tasdeeq-shuda jawabaat haasil kar sakenge, In sha Allah. yeh sahulat banai ja rahi hai.' },
  { en: 'For now, please consult your local Alim for rulings.', ur: 'فی الحال، مسائل کے لیے براہ کرم اپنے مقامی عالم سے رجوع کریں۔', roman: 'filhaal, masail ke liye barah-e-karam apne maqami aalim se rujoo karein.' },

  // ── Plans ─────────────────────────────────────────────
  { en: 'Coming soon', ur: 'جلد آ رہا ہے', roman: 'jald aa raha hai' },
  { en: 'Premium is not available during alpha testing.', ur: 'الفا ٹیسٹنگ کے دوران پریمیم دستیاب نہیں۔', roman: 'alpha testing ke douran Premium dastyaab nahin.' },
  { en: 'Free', ur: 'مفت', roman: 'muft' },
  { en: 'Premium', ur: 'پریمیم', roman: 'Premium' },
  { en: 'Basic Maqtab lessons', ur: 'بنیادی مکتب اسباق', roman: 'buniyadi Maqtab asbaaq' },
  { en: 'Basic Hifz surahs', ur: 'بنیادی حفظ سورتیں', roman: 'buniyadi Hifz surtein' },
  { en: '5 Masail questions / month', ur: 'ماہانہ 5 مسائل سوالات', roman: 'maahana 5 masail sawalat' },
  { en: 'Progress tracking', ur: 'پیش رفت کی نگرانی', roman: 'paish-raft ki nigrani' },
  { en: 'All Maqtab lessons', ur: 'تمام مکتب اسباق', roman: 'tamam Maqtab asbaaq' },
  { en: 'Full Hifz library', ur: 'مکمل حفظ لائبریری', roman: 'mukammal Hifz library' },
  { en: 'Unlimited Masail questions', ur: 'لامحدود مسائل سوالات', roman: 'laamehdood masail sawalat' },
  { en: 'Direct Ulema messaging', ur: 'براہِ راست علماء سے پیغام رسانی', roman: 'baraah-e-raast Ulema se paighaam-rasani' },

  // ── Analyzer / Muhasaba ───────────────────────────────
  { en: 'You have a surah in progress that has not been revised in 5+ days. Time for a quick revision!', ur: 'آپ کی ایک سورت زیرِ عمل ہے جسے 5+ دن سے دہرایا نہیں گیا۔ ایک مختصر دہرائی کا وقت ہے!', roman: 'aap ki ek surat zer-e-amal hai jise 5+ din se dohraya nahin gaya. ek mukhtasar dohrai ka waqt hai!' },
  { en: 'Day streak', ur: 'مسلسل دن', roman: 'musalsal din' },
  { en: 'Lessons completed', ur: 'مکمل اسباق', roman: 'mukammal asbaaq' },
  { en: 'Basic Hifz done', ur: 'بنیادی حفظ مکمل', roman: 'buniyadi Hifz mukammal' },
  { en: 'Recent activities', ur: 'حالیہ سرگرمیاں', roman: 'haaliya sargarmiyan' },
  { en: 'Recent activity', ur: 'حالیہ سرگرمی', roman: 'haaliya sargarmi' },
  { en: 'No activity yet. Start a lesson!', ur: 'ابھی کوئی سرگرمی نہیں۔ کوئی سبق شروع کریں!', roman: 'abhi koi sargarmi nahin. koi sabaq shuru karein!' },

  // ── Settings ──────────────────────────────────────────
  { en: 'member', ur: 'رکن', roman: 'rukn' },
  { en: 'Age', ur: 'عمر', roman: 'umr' },
  { en: 'Gender', ur: 'جنس', roman: 'jins' },
  { en: 'Madhab', ur: 'مذہب', roman: 'mazhab' },
  { en: 'Language', ur: 'زبان', roman: 'zabaan' },
  { en: 'View plans', ur: 'پلانز دیکھیں', roman: 'plans dekhein' },
  { en: 'Log out (clear this device)', ur: 'لاگ آؤٹ (اس ڈیوائس کو صاف کریں)', roman: 'logout (is device ko saaf karein)' },
  { en: 'Male', ur: 'مرد', roman: 'mard' },
  { en: 'Female', ur: 'عورت', roman: 'aurat' },

  // ── Ulema / Messages ──────────────────────────────────
  { en: 'Alim profile', ur: 'عالم کا پروفائل', roman: 'aalim ka profile' },
  { en: 'Ask the Ulema', ur: 'علماء سے پوچھیں', roman: 'Ulema se poochein' },
  { en: 'Connect with scholars', ur: 'علماء سے رابطہ کریں', roman: 'Ulema se raabta karein' },
  { en: 'Conversation', ur: 'گفتگو', roman: 'guftagu' },

  // ── Admin chrome ──────────────────────────────────────
  { en: 'Feedback', ur: 'فیڈبیک', roman: 'feedback' },
  { en: 'Ulema / tester review', ur: 'علماء / ٹیسٹر جائزہ', roman: 'Ulema / tester jaiza' },
  { en: 'Translations', ur: 'ترجمے', roman: 'tarjume' },
  { en: 'Curate Urdu / Roman wording', ur: 'اردو / رومن الفاظ کی تصحیح', roman: 'Urdu / Roman alfaaz ki tasheeh' },
  { en: 'Urdu (script)', ur: 'اردو (رسم الخط)', roman: 'Urdu (script)' },
  { en: 'Roman Urdu', ur: 'رومن اردو', roman: 'Roman Urdu' },
  { en: 'Hindi', ur: 'ہندی', roman: 'Hindi' },
]
