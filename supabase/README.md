# My Maqtab — Supabase API (Edge Function)

All app data + the Masail AI call run through one Edge Function named **`api`**
(`supabase/functions/api/index.ts`), a Hono router. The client hits
`{SUPABASE_URL}/functions/v1/api/<route>` via `src/services/apiClient.ts`.

## One-time setup

```bash
# 1. Install the Supabase CLI (once)
npm i -g supabase        # or: scoop install supabase / brew install supabase

# 2. Log in and link this repo to the project
supabase login
supabase link --project-ref wpdalidqkfsizgdvdbqi

# 3. Store secrets (NOT in the app)
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
# REQUIRED for writes: dashboard-created functions do not reliably auto-inject
# SUPABASE_SERVICE_ROLE_KEY, so set a custom secret with the service_role key
# (Project Settings -> API -> service_role). Without it, RLS blocks all writes
# (progress, profiles) and completions silently fail.
supabase secrets set SERVICE_ROLE_KEY=eyJ...service_role...

# Auto-localize (english-urdu via Gemini, free tier) — see "Auto-localize" below
supabase secrets set GEMINI_API_KEY=AIza...        # from https://aistudio.google.com/apikey
supabase secrets set LOCALIZE_SECRET=<any-long-random-string>
# optional: override the model (default gemini-2.0-flash)
# supabase secrets set GEMINI_MODEL=gemini-2.0-flash
```

`SUPABASE_URL` / `SUPABASE_ANON_KEY` are injected automatically. Verify the service
key reached the function:

```
curl https://wpdalidqkfsizgdvdbqi.supabase.co/functions/v1/api/debug/env \
  -H "apikey: <anon>" -H "Authorization: Bearer <anon>"
# expect: {"hasServiceKey":true,...}
```

## Run locally

```bash
supabase functions serve api          # serves at http://localhost:54321/functions/v1/api
# quick checks:
curl http://localhost:54321/functions/v1/api/health
curl http://localhost:54321/functions/v1/api/maqtab/chapters
curl -X POST http://localhost:54321/functions/v1/api/masail \
  -H "Content-Type: application/json" \
  -d '{"question":"How many faraiz in wudu?","madhab":"hanafi"}'
```

Point the app at local functions by leaving `VITE_SUPABASE_URL` as-is (the CLI proxies),
or just deploy and use the hosted URL.

## Deploy

```bash
# Alpha: JWT verification OFF (local-UUID login has no token).
supabase functions deploy api --no-verify-jwt
```

config.toml already sets `verify_jwt = false` for `[functions.api]`.

## Alpha vs Production

- **Alpha (now):** `--no-verify-jwt`. The client sends the device id in the `x-user-id`
  header; the function scopes queries by it. Same trust level as the current open RLS.
- **Production:** enable Supabase Google auth, remove `--no-verify-jwt` (set
  `verify_jwt = true`), and change `uid()` in `index.ts` to read the JWT `sub` instead of
  the header. Then tighten RLS so the anon key only reaches Storage/auth (the DB is only
  touched by this function via the service-role key).

## Routes

Content: `GET /hadees/today`, `/maqtab/chapters`, `/maqtab/lesson/:id`,
`/maqtab/quiz/:lessonId`, `/hifz/surahs?premium=`, `/wajifa/categories`
Profile: `GET/PUT /profile`
Progress: `GET /maqtab/progress` · `POST /maqtab/complete`; `GET /hifz/progress` ·
`POST /hifz/status`; `GET /tasbih/progress` · `POST /tasbih/save`;
`GET /analyzer/summary`; `POST /events`
AI: `POST /masail`
Auto-localize: `POST /localize/hook` (webhook target), `POST /localize/backfill` (admin)

## Auto-localize (english → english-urdu via Gemini, free tier)

When an **english** row in `maqtab_lessons` or `qa_volumes` is inserted/updated, Gemini
(`gemini-2.0-flash`, free tier) converts its `title` + `content_md` to Roman-Urdu and upserts the matching `english-urdu`
sibling (all other columns copied). On **insert** of a maqtab lesson it also generates a
10-question quiz into `maqtab_quiz` (only if the lesson has none). Roman-Urdu is served by the
existing per-language read logic; the quiz is served to Roman users via the english-sibling
fallback already in `/maqtab/quiz/:lessonId`.

Setup:

```bash
# 1. Secrets (see above)
supabase secrets set GEMINI_API_KEY=AIza...
supabase secrets set LOCALIZE_SECRET=<random>

# 2. Unique indexes needed for the upsert conflict target
#    (Supabase SQL editor, or: supabase db execute < supabase/localize_setup.sql)

# 3. Deploy
supabase functions deploy api --no-verify-jwt

# 4. Create Database Webhooks (dashboard → Database → Webhooks), one per table:
#    Table:  maqtab_lessons   Events: Insert, Update
#    Table:  qa_volumes       Events: Insert, Update
#    Type:   HTTP Request → POST
#    URL:    https://wpdalidqkfsizgdvdbqi.supabase.co/functions/v1/api/localize/hook
#    HTTP header:  x-localize-secret: <same LOCALIZE_SECRET>

# 5. Backfill existing english rows (siblings + missing quizzes)
curl -X POST https://wpdalidqkfsizgdvdbqi.supabase.co/functions/v1/api/localize/backfill \
  -H "apikey: <anon>" -H "Authorization: Bearer <anon>" \
  -H "x-localize-secret: <LOCALIZE_SECRET>"
```

Notes: the hook only acts on `language = 'english'` rows (recursion guard). Quiz is
generated on INSERT only (never overwrites an existing/edited quiz). The quiz insert uses
columns `lesson_id, question, options (jsonb array of 4), correct_idx, explanation, sort_order`
(matches the `maqtab_quiz` schema). Gemini free tier has daily rate limits — the backfill
paces calls; if you have a lot of content it may take a while or need re-running.
