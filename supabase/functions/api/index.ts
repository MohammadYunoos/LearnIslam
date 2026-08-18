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
  })
)

// ── CONTENT (public reads) ──────────────────────────────
app.get('/hadees/today', async (c) => {
  const { count } = await supabase.from('hadith').select('*', { count: 'exact', head: true })
  const index = new Date().getDay() % (count ?? 7)
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

app.get('/maqtab/quiz/:lessonId', async (c) => {
  const { data } = await supabase
    .from('maqtab_quiz')
    .select('*')
    .eq('lesson_id', c.req.param('lessonId'))
    .order('sort_order')
  return c.json(data ?? [])
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

Deno.serve(app.fetch)
