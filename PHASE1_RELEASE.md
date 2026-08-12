# Phase 1 — APK, updates & Ulema/QA review

App name: **Islam Seekho (Learn Islam)** · appId `com.learnislam.app`.
Most content is Supabase-driven, so Ulema/content fixes go live **without a new APK** — only
code/UI changes need a rebuild.

## 1. Database (run in Supabase SQL editor)

```sql
-- Update-banner config (single row)
create table if not exists app_config (
  id int primary key default 1,
  min_version_code int default 1,
  latest_version_code int default 1,
  latest_version_name text default '1.0',
  apk_url text,
  mandatory bool default false
);
insert into app_config (id, latest_version_code, latest_version_name)
values (1, 1, '1.0') on conflict (id) do nothing;

-- Feedback / correction reports (Ulema + testers)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  user_name text,
  screen text,
  message text not null,
  context text,
  status text default 'open',
  created_at timestamptz default now()
);
```
Reached only via the service-role Edge Function — no RLS policy needed.

## 2. Redeploy the Edge Function
New routes: `GET /app/version`, `POST /feedback`, `GET /feedback`
(plus earlier `/qa/*`, `/translate`). Dashboard: paste updated
`supabase/functions/api/index.ts`, or:
`supabase functions deploy api --no-verify-jwt`

## 3. Build the APK — in the cloud (no Android Studio, no local SDK)

A GitHub Action (`.github/workflows/android.yml`) builds the APK on GitHub's servers.

**One-time / each build — in the VS Code terminal:**
```bash
git config --global --add safe.directory C:/LearnIslam
git rm -r --cached dist 2>/dev/null   # build output is git-ignored now
git add -A
git commit -m "build"
git push origin main
```

**Get the APK:**
1. GitHub → repo **MohammadYunoos/LearnIslam** → **Actions** tab.
2. **"Build Android APK"** runs on every push (or **Run workflow** manually).
3. After the green check (~3–5 min), open the run → **Artifacts** → download **`islam-seekho-apk`**.
4. Unzip → `app-debug.apk`.

This is a **debug APK** — auto-signed, installable, ideal for alpha/Ulema review.

## 4. Distribute (direct link)
- Upload `app-debug.apk` to the public `LearnIslam` bucket (e.g. `apk/islam-seekho-v1.apk`) → copy
  its public URL, or Google Drive (anyone-with-link).
- Share the link. Testers: enable **Install unknown apps** for their browser/file app → tap → install.

## 5. Shipping an update (no store)
1. Bump `versionCode` (+1) & `versionName` in `android/app/build.gradle` AND `src/version.ts`.
2. Commit + push → download the new APK from Actions → upload it, copy the new URL.
3. Update `app_config`:
   ```sql
   update app_config set latest_version_code = 2, latest_version_name = '1.1',
     apk_url = '<new apk url>', mandatory = false where id = 1;
   ```
   Running apps show an **Update available** banner (set `mandatory=true` + bump `min_version_code`
   to force it).

## 6. Ulema / tester review loop
- Every screen has a floating **⚑ Report** button → saves to `feedback` (message + screen + user).
- Review in-app at **Settings → 🛠 Admin: Feedback** (visible only to emails in
  `src/lib/admin.ts` → `ADMIN_EMAILS`; requires Google sign-in), or read the `feedback` table.
- Content fixes (Maqtab, Q&A `qa_volumes`, translations, etc.) are edited in Supabase → **live
  instantly**. Only code/UI changes need a new APK + `app_config` bump.

## Notes
- **Login for the review round:** use **Continue as guest** — works in the debug APK with no extra
  setup. Google Sign-In needs the debug build's SHA + `com.learnislam.app://auth` redirect registered
  in Google Cloud + Supabase; wire that only when needed.
- `.env.local`, `*.jks`, `node_modules/`, `dist/` are git-ignored — never pushed.
- Production (Play Store) later = a **signed release** APK/AAB with your own keystore.

## Verify
- `curl .../functions/v1/api/app/version` → returns the row.
- Submit a Report in the app → row appears in `feedback` + the admin list.
- Set `app_config.latest_version_code = 2` → app (code 1) shows the banner; link opens the APK.
  Reset to 1 → banner gone.
