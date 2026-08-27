  // supabase/functions/api/index.ts
  // My Maqtab API — a single Edge Function exposing every app operation.
  // Deployed at: {SUPABASE_URL}/functions/v1/api/<route>
  //
  // Alpha: verify_jwt = false (see supabase/config.toml). The client sends the
  // user id via the `x-user-id` header (or `userId` in body/query). In production,
  // turn verify_jwt on and derive the user id from the JWT `sub` instead.
  import { Hono } from 'npm:hono@4'
  import { cors } from 'npm:hono@4/cors'
  import { createClient } from 'npm:@supabase/supabase-js@2'

  // Service-role key. Dashboard-created functions do NOT always auto-inject
  // SUPABASE_SERVICE_ROLE_KEY, so also accept a custom secret SERVICE_ROLE_KEY.
  // Without a service-role key the client only has anon rights and RLS blocks
  // all writes to the progress tables.
  const SERVICE_KEY =
    Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, SERVICE_KEY)

  const app = new Hono().basePath('/api')

  app.use('*', cors({ origin: '*', allowHeaders: ['Content-Type', 'Authorization', 'apikey', 'x-user-id'] }))

  // Extract the authenticated user id from the Supabase JWT (role=authenticated).
  function jwtSub(c: any): string | null {
    const auth = c.req.header('Authorization') || ''
    const token = auth.replace(/^Bearer\s+/i, '')
    if (!token || token.split('.').length !== 3) return null
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )
      if (payload.role === 'authenticated' && payload.sub) return payload.sub as string
      return null
    } catch {
      return null
    }
  }

  // Resolve the acting user id: signed-in JWT first, then guest header/body/query.
  function uid(c: any, bodyUserId?: string): string | null {
    return jwtSub(c) || bodyUserId || c.req.query('userId') || c.req.header('x-user-id') || null
  }

  async function sha256(text: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  async function logEvent(userId: string, eventType: string, data?: Record<string, unknown>) {
    await supabase.from('analytics_events').insert({
      user_id: userId,
      event_type: eventType,
      event_data: data ?? {},
    })
  }

  app.get('/health', (c) => c.json({ ok: true }))

  // Diagnostics: confirms whether a service-role key reached the function.
  // Never returns the key itself. Remove before production.
  app.get('/debug/env', (c) =>
    c.json({
      hasServiceKey: SERVICE_KEY.length > 0,
      serviceKeyLen: SERVICE_KEY.length,
      hasUrl: !!Deno.env.get('SUPABASE_URL'),
      hasAnthropic: !!Deno.env.get('ANTHROPIC_API_KEY'),
      hasGemini: !!Deno.env.get('GEMINI_API_KEY'),
      hasLocalizeSecret: !!Deno.env.get('LOCALIZE_SECRET'),
    })
  )

  // ── CONTENT (public reads) ──────────────────────────────
  app.get('/hadees/today', async (c) => {
    const { count } = await supabase.from('hadith').select('*', { count: 'exact', head: true })
    // Rotate through ALL rows by day-of-year (not getDay, which caps at 7).
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
    const index = dayOfYear % (count || 1)
    const { data } = await supabase.from('hadith').select('*').range(index, index).single()
    return c.json(data)
  })

  // A lesson (level + chapter_num + lesson_num) can exist in several languages.
  // Return one row per lesson: requested language if present, else English.
  app.get('/maqtab/chapters', async (c) => {
    const lang = c.req.query('lang') || 'english'
    const { data } = await supabase
      .from('maqtab_lessons')
      .select('id, chapter_num, title, duration_min, sort_order, level, lesson_num, language')
      .order('sort_order')
    const rows = data ?? []
    const key = (r: any) => `${r.level}-${r.chapter_num}-${r.lesson_num}`
    const byLesson = new Map<string, any>()
    for (const r of rows) {
      const k = key(r)
      const cur = byLesson.get(k)
      if (r.language === lang) byLesson.set(k, r) // exact match always wins
      else if (!cur) byLesson.set(k, r) // first-seen fallback
      else if (cur.language !== lang && r.language === 'english') byLesson.set(k, r) // prefer English fallback
    }
    const out = [...byLesson.values()].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return c.json(out)
  })

  app.get('/maqtab/lesson/:id', async (c) => {
    const { data } = await supabase.from('maqtab_lessons').select('*').eq('id', c.req.param('id')).single()
    return c.json(data)
  })

  // Lesson quiz — drawn from `beginner_exam_questions` for the lesson's chapter,
  // in the lesson's language (falls back to english). The client picks a random
  // subset per attempt and scores locally (question rows include correct_idx).
  app.get('/maqtab/quiz/:lessonId', async (c) => {
    const lessonId = c.req.param('lessonId')
    const { data: lesson } = await supabase
      .from('maqtab_lessons')
      .select('level, chapter_num, lesson_num, language')
      .eq('id', lessonId)
      .single()
    if (!lesson) return c.json([])
    const level = lesson.level || 'Beginner'
    const lang = lesson.language || 'english'
    const sel = 'id, question, options, correct_idx, explanation, sort_order, chapter_num, lesson_no'
    const fetchFor = async (language: string) => {
      const { data } = await supabase
        .from('beginner_exam_questions')
        .select(sel)
        .eq('level', level)
        .eq('language', language)
        .eq('chapter_num', lesson.chapter_num)
        .eq('lesson_no', lesson.lesson_num)
        .order('sort_order')
      return data ?? []
    }
    let rows = await fetchFor(lang)
    // Fall back to English (same chapter + lesson) if none in this language.
    if (rows.length === 0 && lang !== 'english') rows = await fetchFor('english')
    return c.json(rows)
  })

  app.get('/hifz/surahs', async (c) => {
    const premium = c.req.query('premium') === 'true'
    let q = supabase.from('hifz_surahs').select('*').order('sort_order')
    if (!premium) q = q.eq('level', 'Basic')
    const { data } = await q
    return c.json(data ?? [])
  })

  app.get('/wajifa/categories', async (c) => {
    const { data } = await supabase.from('wajifa_categories').select('*').order('id')
    return c.json(data ?? [])
  })

  // ── ISLAMIC Q&A (volumes) ───────────────────────────────
  // A volume_no can exist in several languages (e.g. 'english', 'english-urdu').
  // Return one row per volume_no: the requested language if present, else the
  // English row as fallback. `lang` is the DB language value (see client map).
  app.get('/qa/volumes', async (c) => {
    const lang = c.req.query('lang') || 'english'
    const { data } = await supabase
      .from('qa_volumes')
      .select('id, volume_no, title, sort_order, language')
      .order('sort_order')
      .order('volume_no')
    const rows = data ?? []
    const byVol = new Map<number, any>()
    for (const r of rows) {
      const cur = byVol.get(r.volume_no)
      if (r.language === lang) byVol.set(r.volume_no, r) // exact match always wins
      else if (!cur) byVol.set(r.volume_no, r) // first-seen fallback
      else if (cur.language !== lang && r.language === 'english') byVol.set(r.volume_no, r) // prefer English fallback
    }
    const out = [...byVol.values()].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.volume_no - b.volume_no
    )
    return c.json(out)
  })

  app.get('/qa/volume/:id', async (c) => {
    const { data } = await supabase
      .from('qa_volumes')
      .select('*')
      .eq('id', c.req.param('id'))
      .single()
    return c.json(data)
  })

  // ── TRANSLATE (Google free endpoint + DB cache) ─────────
  app.post('/translate', async (c) => {
    const { texts, target } = await c.req.json()
    const list: string[] = Array.isArray(texts) ? texts : []
    const tl = String(target || 'en')
    if (!list.length || tl === 'en') return c.json({ translations: list })

    const out: string[] = new Array(list.length)
    const misses: { i: number; text: string; hash: string }[] = []

    for (let i = 0; i < list.length; i++) {
      const text = list[i] ?? ''
      if (!text.trim()) {
        out[i] = text
        continue
      }
      const hash = await sha256(tl + '|' + text)
      const { data } = await supabase
        .from('translations')
        .select('translated_text')
        .eq('hash', hash)
        .single()
      if (data?.translated_text != null) out[i] = data.translated_text
      else misses.push({ i, text, hash })
    }

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    // Roman Urdu: translate to Urdu but return Google's romanization (Latin letters).
    const roman = tl === 'ur-roman'
    const googleTl = roman ? 'ur' : tl

    // Translate one text with retry/backoff to survive the free endpoint's rate limits.
    async function gtx(text: string): Promise<string | null> {
      const dt = roman ? '&dt=t&dt=rm' : '&dt=t'
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
              googleTl
            )}${dt}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
              body: 'q=' + encodeURIComponent(text),
            }
          )
          if (res.status === 429 || res.status >= 500) {
            await sleep(400 * (attempt + 1))
            continue
          }
          const json = await res.json()
          const chunks = json?.[0] ?? []
          if (roman) {
            // Romanization lives in trailing chunks: [null, null, "roman text"].
            const rm = chunks
              .filter((seg: any[]) => seg?.[0] == null && typeof seg?.[2] === 'string')
              .map((seg: any[]) => seg[2])
              .join('')
            if (rm) return rm
            // fall back to plain Urdu translation if no romanization returned
          }
          const t = chunks.map((seg: any[]) => seg?.[0] ?? '').join('')
          if (t) return t
        } catch {
          /* retry */
        }
        await sleep(250)
      }
      return null
    }

    for (const m of misses) {
      const t = await gtx(m.text)
      if (t) {
        out[m.i] = t
        await supabase.from('translations').insert({
          hash: m.hash,
          target_lang: tl,
          source_text: m.text,
          translated_text: t,
        })
      } else {
        out[m.i] = m.text // leave English; NOT cached, so it retries next time
      }
      await sleep(120) // gentle spacing between calls
    }

    return c.json({ translations: out })
  })

  // ── CURATED TRANSLATION OVERRIDES ───────────────────────
  app.post('/translate/set', async (c) => {
    const { target, source_text, translated_text } = await c.req.json()
    if (!target || !source_text || translated_text == null) {
      return c.json({ error: 'target, source_text, translated_text required' }, 400)
    }
    const hash = await sha256(String(target) + '|' + String(source_text))
    const { error } = await supabase.from('translations').upsert({
      hash,
      target_lang: target,
      source_text,
      translated_text,
    })
    if (error) return c.json({ error: error.message }, 500)
    return c.json({ ok: true })
  })

  // Bulk download of every curated/cached translation for a target language,
  // for the client to store in IndexedDB (offline + instant reads). Paged past
  // the 1000-row PostgREST cap.
  app.get('/translate/all', async (c: any) => {
    const target = c.req.query('target')
    if (!target) return c.json({ error: 'target required' }, 400)
    const out: { source_text: string; translated_text: string }[] = []
    const PAGE = 1000
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from('translations')
        .select('source_text, translated_text')
        .eq('target_lang', target)
        .order('source_text')
        .range(from, from + PAGE - 1)
      if (error) break
      const rows = data ?? []
      out.push(...rows)
      if (rows.length < PAGE) break
    }
    return c.json({ target, count: out.length, rows: out })
  })

  app.get('/translate/list', async (c) => {
    const target = c.req.query('target')
    let q = supabase
      .from('translations')
      .select('hash, target_lang, source_text, translated_text')
      .order('source_text')
      .limit(500)
    if (target) q = q.eq('target_lang', target)
    const { data } = await q
    return c.json(data ?? [])
  })

  // ── APP VERSION (update banner) ─────────────────────────
  app.get('/app/version', async (c) => {
    const { data } = await supabase.from('app_config').select('*').limit(1).single()
    return c.json(data ?? null)
  })

  // ── FEEDBACK (Ulema / tester review) ────────────────────
  app.post('/feedback', async (c) => {
    const body = await c.req.json()
    const userId = uid(c, body.userId)
    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      user_name: body.userName ?? null,
      screen: body.screen ?? null,
      message: body.message ?? '',
      context: body.context ?? null,
    })
    if (error) return c.json({ error: error.message }, 500)
    return c.json({ ok: true })
  })

  app.get('/feedback', async (c) => {
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    return c.json(data ?? [])
  })

  // ── PROFILE ─────────────────────────────────────────────
  app.put('/profile', async (c) => {
    const body = await c.req.json()
    const userId = uid(c, body.id)
    if (!userId) return c.json({ error: 'no user id' }, 400)
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      name: body.name,
      age: body.age,
      gender: body.gender,
      madhab: body.madhab,
      language: body.language,
      tier: body.tier ?? 'free',
    })
    if (error) return c.json({ error: error.message }, 400)
    return c.json({ ok: true })
  })

  app.get('/profile', async (c) => {
    const userId = uid(c)
    if (!userId) return c.json({ error: 'no user id' }, 400)
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return c.json(data)
  })

  // ── MAQTAB PROGRESS ─────────────────────────────────────
  app.get('/maqtab/progress', async (c) => {
    const userId = uid(c)
    if (!userId) return c.json([])
    const { data } = await supabase
      .from('maqtab_progress')
      .select('lesson_id, quiz_score')
      .eq('user_id', userId)
    return c.json(data ?? [])
  })

  app.post('/maqtab/complete', async (c) => {
    const body = await c.req.json()
    const userId = uid(c, body.userId)
    if (!userId) return c.json({ error: 'no user id' }, 400)
    const { error } = await supabase
      .from('maqtab_progress')
      .upsert({ user_id: userId, lesson_id: body.lessonId, quiz_score: body.score })
    if (error) return c.json({ error: error.message }, 500)
    await logEvent(userId, 'lesson_completed', { lessonId: body.lessonId, score: body.score })
    return c.json({ ok: true })
  })

  // ── HIFZ PROGRESS ───────────────────────────────────────
  app.get('/hifz/progress', async (c) => {
    const userId = uid(c)
    if (!userId) return c.json([])
    const { data } = await supabase.from('hifz_progress').select('*').eq('user_id', userId)
    return c.json(data ?? [])
  })

  app.post('/hifz/status', async (c) => {
    const body = await c.req.json()
    const userId = uid(c, body.userId)
    if (!userId) return c.json({ error: 'no user id' }, 400)
    const status = body.status as string
    const { error } = await supabase.from('hifz_progress').upsert({
      user_id: userId,
      surah_id: body.surahId,
      status,
      last_revised_at: new Date().toISOString(),
      completed_at: status === 'Completed' ? new Date().toISOString() : null,
    })
    if (error) return c.json({ error: error.message }, 500)
    await logEvent(userId, status === 'Completed' ? 'surah_completed' : 'surah_revised', {
      surahId: body.surahId,
    })
    return c.json({ ok: true })
  })

  // ── TASBIH PROGRESS ─────────────────────────────────────
  app.get('/tasbih/progress', async (c) => {
    const userId = uid(c)
    if (!userId) return c.json([])
    const { data } = await supabase.from('tasbih_progress').select('*').eq('user_id', userId)
    return c.json(data ?? [])
  })

  app.post('/tasbih/save', async (c) => {
    const body = await c.req.json()
    const userId = uid(c, body.userId)
    if (!userId) return c.json({ error: 'no user id' }, 400)
    const { error } = await supabase.from('tasbih_progress').upsert({
      user_id: userId,
      wajifa_id: body.wajifaId,
      current_count: body.count,
      updated_at: new Date().toISOString(),
    })
    if (error) return c.json({ error: error.message }, 500)
    return c.json({ ok: true })
  })

  // ── EVENTS ──────────────────────────────────────────────
  app.post('/events', async (c) => {
    const body = await c.req.json()
    const userId = uid(c, body.userId)
    if (!userId) return c.json({ error: 'no user id' }, 400)
    await logEvent(userId, body.eventType, body.data)
    return c.json({ ok: true })
  })

  // ── ANALYZER ────────────────────────────────────────────
  app.get('/analyzer/summary', async (c) => {
    const userId = uid(c)
    if (!userId) return c.json(null)
    const [hifzRes, maqtabRes, eventsRes] = await Promise.all([
      supabase.from('hifz_progress').select('*').eq('user_id', userId),
      supabase.from('maqtab_progress').select('*').eq('user_id', userId),
      supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
    ])
    const hifz = hifzRes.data ?? []
    const maqtab = maqtabRes.data ?? []
    const events = eventsRes.data ?? []
    const basicCompleted = hifz.filter((p: any) => p.status === 'Completed').length
    const dates = [...new Set(events.map((e: any) => new Date(e.created_at).toDateString()))]
    let streak = 0
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date()
      expected.setDate(expected.getDate() - i)
      if (dates[i] === expected.toDateString()) streak++
      else break
    }
    const stale = hifz.find((p: any) => {
      if (p.status !== 'InProgress' || !p.last_revised_at) return false
      const days = (Date.now() - new Date(p.last_revised_at).getTime()) / 86400000
      return days >= 5
    })
    return c.json({
      hifzBasicCompleted: basicCompleted,
      hifzBasicTotal: 6,
      lessonsCompleted: maqtab.length,
      streakDays: streak,
      staleSurahId: stale?.surah_id ?? null,
      recentEvents: events.slice(0, 10),
    })
  })

  // ── MASAIL (AI + cache; secret key server-side) ─────────
  app.post('/masail', async (c) => {
    const { question, madhab } = await c.req.json()
    if (!question) return c.json({ answer: 'Please enter a question.' })
    const hash = await sha256(String(question).trim().toLowerCase() + '|' + madhab)

    const { data: cached } = await supabase
      .from('masail_cache')
      .select('answer_text, hit_count')
      .eq('question_hash', hash)
      .single()
    if (cached) {
      await supabase
        .from('masail_cache')
        .update({ hit_count: (cached.hit_count ?? 1) + 1 })
        .eq('question_hash', hash)
      return c.json({ answer: cached.answer_text })
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      return c.json({
        answer: 'Masail AI is not configured yet. Please consult your local Alim for rulings.',
      })
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: `You are a basic Islamic learning assistant. Answer strictly according to the ${madhab} school of fiqh (madhab); if the ruling differs by madhab, give only the ${madhab} position and do not mix schools. Answer only well-established basic fiqh questions about Wudhu, Gusl, Tayammum, Namaaz, and daily Adaab in under 100 words. State the ruling clearly (Farz/Wajib/Sunnah/Makrooh). For anything beyond basic fiqh advise the user to consult their local Alim. Always end with: "For a verified ruling please consult your local Alim."`,
        messages: [{ role: 'user', content: question }],
      }),
    })
    const json = await res.json()
    const answer =
      json?.content?.[0]?.text ?? 'Unable to answer right now. Please consult your local Alim.'

    await supabase.from('masail_cache').insert({
      question_hash: hash,
      question_text: question,
      answer_text: answer,
      madhab,
      hit_count: 1,
    })
    return c.json({ answer })
  })

  // ── AUTO-LOCALIZE (Gemini → english-urdu) ───────────────
  // A Database Webhook on maqtab_lessons / qa_volumes (Insert+Update of english
  // rows) POSTs to /localize/hook. We Gemini-convert title + content_md to
  // Roman-Urdu and upsert the english-urdu sibling. /localize/backfill does
  // existing rows. (Lesson quizzes come from beginner_exam_questions, not here.)

  // Google Gemini (AI Studio, free tier) chat call. Returns text or null.
  async function llmChat(system: string, user: string, maxTokens: number): Promise<string | null> {
    const key = Deno.env.get('GEMINI_API_KEY')
    if (!key) return null
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-2.0-flash'
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: user }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens },
          }),
        }
      )
      if (!res.ok) return null
      const json = await res.json()
      const parts = json?.candidates?.[0]?.content?.parts
      if (!Array.isArray(parts)) return null
      return parts.map((p: any) => p?.text ?? '').join('') || null
    } catch {
      return null
    }
  }

  const ROMANIZE_SYS = `You are an expert Urdu teacher who writes natural, spoken-style Roman Urdu (Urdu in Latin letters) for ordinary Pakistani/Indian Muslims. Convert the given English Islamic learning text into fluent Roman Urdu that reads the way a person actually speaks — NOT a stiff word-for-word translation.

STYLE:
- Everyday spoken register, e.g. English "Cleanliness is half of faith." → "Pakizgi aadha imaan hai." ; "Perform wudu before praying." → "Namaz se pehle wuzu karein." ; "Do not become angry." → "Gussa mat karein."
- Use common Urdu words people know (wuzu, namaz, farz, sunnat, gunah, sawab, dua, neeyat). Prefer familiar words over heavy/literary Urdu.
- Keep sentences short and clear. Address the reader politely with "karein / kijiye" forms.

KEEP UNCHANGED (do not translate or transliterate):
- All markdown structure exactly: headings (#, ##), bullet/number markers, **bold**, tables, blank lines, line breaks.
- Any Arabic script text.
- Quoted Arabic du'a / transliteration such as "Bismillah", "Allahumma...", ayah text, kalimah — leave the quoted part exactly as written.
- Proper nouns and Islamic terms already in Arabic/Urdu form.

RULES:
- Output Roman Urdu ONLY — never English sentences, never Urdu (Nastaliq) script.
- Do NOT add, remove, explain, or comment. Same meaning, same order, same structure.
- Output ONLY the converted text, nothing else.`

  // Convert a single string to Roman-Urdu. Empty passes through; null = failure.
  async function romanize(text: string): Promise<string | null> {
    if (!text || !text.trim()) return text ?? ''
    return await llmChat(ROMANIZE_SYS, text, 4000)
  }

  // Convert an english row's title + content_md and upsert its english-urdu
  // sibling (all other columns copied verbatim). onConflict = the logical key.
  async function localizeRow(table: string, eng: any): Promise<{ ok: boolean; error?: string }> {
    const title = await romanize(eng.title ?? '')
    const hasContentMd = 'content_md' in eng
    const contentSrc = hasContentMd ? eng.content_md ?? '' : eng.content ?? ''
    const content = await romanize(contentSrc)
    if (title == null || content == null) return { ok: false, error: 'Gemini unavailable or failed' }
    const sibling: Record<string, unknown> = { ...eng }
    delete sibling.id
    sibling.language = 'english-urdu'
    sibling.title = title
    if (hasContentMd) sibling.content_md = content
    else if ('content' in eng) sibling.content = content
    const onConflict =
      table === 'maqtab_lessons' ? 'level,chapter_num,lesson_num,language' : 'volume_no,language'
    const { error } = await supabase.from(table).upsert(sibling, { onConflict })
    return error ? { ok: false, error: error.message } : { ok: true }
  }

  function checkLocalizeSecret(c: any): boolean {
    const secret = Deno.env.get('LOCALIZE_SECRET') ?? ''
    return !!secret && c.req.header('x-localize-secret') === secret
  }

  // Database Webhook target.
  app.post('/localize/hook', async (c: any) => {
    if (!checkLocalizeSecret(c)) return c.json({ error: 'unauthorized' }, 401)
    const body = await c.req.json().catch(() => null)
    const table = body?.table
    const record = body?.record
    const type = body?.type // 'INSERT' | 'UPDATE' | 'DELETE'
    if (!record || (table !== 'maqtab_lessons' && table !== 'qa_volumes')) {
      return c.json({ ok: true, skipped: 'table' })
    }
    // Only mirror english rows (recursion guard: never act on english-urdu writes).
    if (record.language !== 'english') return c.json({ ok: true, skipped: 'not-english' })

    // Gemini can take longer than the webhook's ~5s timeout, which would abort
    // the request and cut the function off mid-write. So respond immediately and
    // finish the slow work in the background via EdgeRuntime.waitUntil.
    const work = (async () => {
      const loc = await localizeRow(table, record)
      if (!loc.ok) console.error('localizeRow failed', table, record?.id, loc.error)
    })()
    // @ts-ignore — EdgeRuntime is provided by the Supabase Edge runtime.
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(work)
    } else {
      await work
    }
    return c.json({ ok: true, queued: true })
  })

  // One-shot backfill for existing english rows (admin; same secret header).
  app.post('/localize/backfill', async (c: any) => {
    if (!checkLocalizeSecret(c)) return c.json({ error: 'unauthorized' }, 401)
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const result: Record<string, number> = { lessons: 0, volumes: 0, quizzes: 0, failed: 0 }
    for (const table of ['maqtab_lessons', 'qa_volumes']) {
      const { data } = await supabase.from(table).select('*').eq('language', 'english')
      for (const eng of data ?? []) {
        const loc = await localizeRow(table, eng)
        if (loc.ok) result[table === 'maqtab_lessons' ? 'lessons' : 'volumes']++
        else result.failed++
        await sleep(300)
      }
    }
    return c.json(result)
  })

  // ── BEGINNER EXAM (server-scored) ───────────────────────
  // Pool = beginner_exam_questions; attempts stored in exam_attempts. The paper
  // is up to 50 questions split evenly across chapters. Answers are NEVER sent
  // to the client for the graded exam — scoring happens here.
  const PASS_PERCENT = 75
  const EXAM_SIZE = 50

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Evenly sample up to `size` across chapters; top up from the leftover pool.
  function pickBalanced(rows: any[], size: number): any[] {
    const byChapter = new Map<number, any[]>()
    for (const r of rows) {
      const k = r.chapter_num ?? 0
      if (!byChapter.has(k)) byChapter.set(k, [])
      byChapter.get(k)!.push(r)
    }
    const chapters = [...byChapter.keys()]
    if (!chapters.length) return []
    const perChapter = Math.floor(size / chapters.length)
    const picked: any[] = []
    const leftover: any[] = []
    for (const k of chapters) {
      const shuffled = shuffle(byChapter.get(k)!)
      picked.push(...shuffled.slice(0, perChapter))
      leftover.push(...shuffled.slice(perChapter))
    }
    // Fill the remainder (and any shortfall from thin chapters) from leftovers.
    for (const r of shuffle(leftover)) {
      if (picked.length >= size) break
      picked.push(r)
    }
    return shuffle(picked).slice(0, size)
  }

  // Graded exam paper — WITHOUT correct answers.
  app.get('/exam/questions', async (c: any) => {
    const level = c.req.query('level') || 'Beginner'
    const lang = c.req.query('lang') || 'english'
    let { data } = await supabase
      .from('beginner_exam_questions')
      .select('id, chapter_num, question, options')
      .eq('level', level)
      .eq('language', lang)
    // Fall back to English if the requested language has no questions.
    if ((!data || data.length === 0) && lang !== 'english') {
      const r = await supabase
        .from('beginner_exam_questions')
        .select('id, chapter_num, question, options')
        .eq('level', level)
        .eq('language', 'english')
      data = r.data ?? []
    }
    const paper = pickBalanced(data ?? [], EXAM_SIZE).map((q) => ({
      id: q.id,
      chapter_num: q.chapter_num,
      question: q.question,
      options: q.options,
    }))
    return c.json({ questions: paper, total: paper.length, passPercent: PASS_PERCENT })
  })

  // Score the submitted answers server-side and record the attempt.
  app.post('/exam/submit', async (c: any) => {
    const body = await c.req.json().catch(() => ({}))
    const userId = uid(c, body.userId)
    if (!userId) return c.json({ error: 'no user id' }, 400)
    const level = body.level || 'Beginner'
    const answers: Record<string, number> = body.answers || {}
    const ids = Object.keys(answers)
    if (!ids.length) return c.json({ error: 'no answers' }, 400)

    const { data } = await supabase
      .from('beginner_exam_questions')
      .select('id, correct_idx, chapter_num')
      .in('id', ids)
    const rows = data ?? []
    const total = rows.length
    let score = 0
    const results = rows.map((r: any) => {
      const chosen = answers[r.id]
      const ok = chosen === r.correct_idx
      if (ok) score++
      return { id: r.id, correct_idx: r.correct_idx, chosen, ok }
    })
    const percent = total ? Math.round((score / total) * 100) : 0
    const passed = percent >= PASS_PERCENT

    await supabase.from('exam_attempts').insert({
      user_id: userId,
      level,
      score,
      total,
      percent,
      passed,
      elapsed_seconds: Number(body.elapsedSeconds) || null,
    })
    await logEvent(userId, 'exam_submitted', { level, percent, passed })
    return c.json({ score, total, percent, passed, passPercent: PASS_PERCENT, results })
  })

  // This user's attempt history (newest first).
  app.get('/exam/attempts', async (c: any) => {
    const userId = uid(c)
    if (!userId) return c.json([])
    const level = c.req.query('level') || 'Beginner'
    const { data } = await supabase
      .from('exam_attempts')
      .select('id, score, total, percent, passed, elapsed_seconds, created_at')
      .eq('user_id', userId)
      .eq('level', level)
      .order('created_at', { ascending: false })
      .limit(50)
    return c.json(data ?? [])
  })

  // Informal pre-test — a small sample WITH answers (client-scored).
  app.get('/exam/knowledge-check', async (c: any) => {
    const level = c.req.query('level') || 'Beginner'
    const lang = c.req.query('lang') || 'english'
    const count = Math.max(1, Math.min(20, Number(c.req.query('count')) || 5))
    let { data } = await supabase
      .from('beginner_exam_questions')
      .select('id, question, options, correct_idx, explanation')
      .eq('level', level)
      .eq('language', lang)
    if ((!data || data.length === 0) && lang !== 'english') {
      const r = await supabase
        .from('beginner_exam_questions')
        .select('id, question, options, correct_idx, explanation')
        .eq('level', level)
        .eq('language', 'english')
      data = r.data ?? []
    }
    return c.json(shuffle(data ?? []).slice(0, count))
  })

  // ── ADMIN: reformat run-on glossaries into markdown tables ──────────────
  // Q&A content authored as prose ("GLOSSARY OF TERMS Term Meaning Allah The
  // One True God ...") can't be tabulated reliably on the client. This uses
  // Gemini to rewrite ONLY the glossary part of each english qa_volumes row
  // into a GitHub markdown table. Updating the row fires the localize webhook,
  // which regenerates the Roman sibling with the same table.
  const GLOSSARY_SYS = `You are a markdown formatter. You are given the full content of an Islamic Q&A document. If it contains a glossary written as run-on prose (a heading like "GLOSSARY OF TERMS" followed by term/meaning pairs such as "Allah The One True God Salat Formal ritual prayer ..."), convert ONLY that glossary into a GitHub-flavoured markdown table with exactly this header:

| Term | Meaning |
| --- | --- |

Put each term in the first column and its meaning in the second. Keep the "GLOSSARY OF TERMS" heading on its own line just before the table. Any sentence that comes AFTER the glossary (e.g. "This concludes Book One...") must be kept as a separate paragraph after the table. Leave ALL other text in the document exactly as it is — same words, same order. If there is no such glossary, return the document unchanged. Output ONLY the full document markdown, no code fences, no commentary.`

  app.post('/qa/reformat-glossary', async (c: any) => {
    if (!checkLocalizeSecret(c)) return c.json({ error: 'unauthorized' }, 401)
    const { data } = await supabase
      .from('qa_volumes')
      .select('id, content_md')
      .eq('language', 'english')
    const rows = data ?? []
    let changed = 0
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    for (const row of rows) {
      const md = String(row.content_md ?? '')
      if (!/glossary/i.test(md) || md.includes('| Term | Meaning |')) continue
      const out = await llmChat(GLOSSARY_SYS, md, 8000)
      if (out && out.trim() && out.includes('| Term | Meaning |')) {
        const { error } = await supabase
          .from('qa_volumes')
          .update({ content_md: out.trim() })
          .eq('id', row.id)
        if (!error) changed++
      }
      await sleep(300)
    }
    return c.json({ scanned: rows.length, changed })
  })

  Deno.serve(app.fetch)
