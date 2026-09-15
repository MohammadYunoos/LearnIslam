# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LearnIslam** (Islam Seeko) — mobile-first Islamic educational app. React + Capacitor (Android), Supabase backend, offline-first with IndexedDB cache.

**Core features:** Qur'an memorization (Hifz), prayer times (Namaaz), Islamic school (Maqtab) with quizzes/exams/certificates, guides, daily practices (Wajifa), scholar profiles (Ulema), messaging.

## Build & Development

```bash
npm install                    # Install deps
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build web bundle + typecheck (tsc -b && vite build)
npm run preview               # Preview production build locally
npm run cap:sync             # Build + sync Android native code
npm run cap:open             # Open Android Studio
```

**Note:** `npm run build` runs `tsc -b` first (incremental TS checks). Vite builds to `dist/`.

## Architecture

### Directory Structure

- **`src/pages/`** — Route pages, named by feature (Maqtab, Hifz, Namaaz, etc.). Each page imports from components + services/lib.
- **`src/components/`** — Reusable UI (BottomNav, PageHeader, Logo, PdfViewer, etc.).
- **`src/services/`** — API clients (supabaseService, authService, apiClient) + business logic (translate, hifzLocal, translationStore).
- **`src/lib/`** — Utilities (supabase client, prayer times via adhan, geolocation, location services, certificates).
- **`src/store/appStore.ts`** — Zustand global state (user, profile, language, UI flags).
- **`src/i18n/`** — Translation system. `useTr` hook reads `useLang()` for current language; translations async-loaded from Supabase or cached.
- **`src/content/`** — Static content data (guides, adaab, surahs, i18n files). `*.i18n.ts` files hold translation tables.
- **`src/hooks/`** — Custom React hooks (useNarration for TTS, etc.).

### State Management

**Zustand store** (`src/store/appStore.ts`):
- `user` — Supabase auth user or null
- `needsProfile` — True if signed in but profile incomplete → redirects to login
- `language` — UI language (en, ur, ar, etc.)

Auth flow: Supabase OAuth + PKCE deep-link (Android) or browser flow (web). `getSessionUser()` checks for valid session; falls back to localStorage cache.

### i18n / Translations

- `useLang()` hook returns current language code.
- `ensureLang(lang)` primes the offline translation cache (web worker + IDB).
- Content stored in `content/i18n/*.i18n.ts` (lazy-loaded from Supabase if not cached).
- `TranslationOverlay` component handles per-word translation hovers.

### Mobile (Android)

- Built with **Capacitor 8** + native plugins: geolocation, text-to-speech, file sharing, browser control.
- `vite.config.ts` uses `base: './'` so assets load from APK file:// URLs.
- Android signing: credentials in `android/key.properties` (gitignored). App ID: `com.mymaqtab.app`.
- Version: `android/app/build.gradle` holds versionCode/versionName.
- OAuth callback: deep-link handler in `App.tsx` pulls code from `com.mymaqtab.app://auth?code=...` and exchanges it.

## Key Technologies

- **React 19** — UI framework
- **Vite 8** — Build tool (base: './' for APK bundling)
- **TypeScript 6** — Strict config with `noUnusedLocals`, `noUnusedParameters`
- **Zustand 5** — State management
- **Supabase** — Auth + backend DB
- **Capacitor 8** — Native bridge (Android)
- **Tailwind CSS** — Styling
- **React Router 7** — Client-side routing
- **adhan** — Prayer times calculation
- **IndexedDB (idb 8)** — Offline cache
- **react-pdf** — PDF rendering (Qur'an viewer)
- **text-to-speech** — Capacitor plugin for narration

## Routing

Routes protected by `PrivateRoute()` wrapper. Root `/` redirects based on auth state. All routes in `App.tsx`.

Main entry points:
- `/login` — Auth + profile setup
- `/home` — Dashboard
- `/maqtab` — Lessons/quizzes/exams/certificates
- `/hifz` — Surah memorization
- `/guide` — Topical guides with step player
- `/namaaz-timings` — Prayer times
- `/ulema` — Scholar profiles + messaging
- `/admin/feedback`, `/admin/translations` — Admin panel

## TypeScript Config

`tsconfig.app.json`:
- Target: ES2023
- Bundler mode with strict unused vars/params checks
- JSX: react-jsx (automatic import of React)
- Vite types included

## Common Patterns

**Fetching with auth:**
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id)
```

**Translation in components:**
```typescript
const tr = useTr()
// tr is an object with translation keys; e.g., tr.home.title
```

**Zustand state:**
```typescript
const user = useAppStore((s) => s.user)
const setUser = useAppStore((s) => s.setUser)
```

**Lazy Markdown with i18n:**
```typescript
import { GuideDisclaimer } from '...'  // Shows disclaimers before guide content
```

## Known Constraints

- **Offline-first:** IDB cache for translations + lesson data. Supabase real-time for updates.
- **Mobile first:** UI built mobile-first; web is a secondary target.
- **i18n overhead:** Language switching is async; `ensureLang` must complete before switching.
- **PKCE OAuth on native:** Deep-link handling required; browser can't redirect directly to app scheme.
- **No minification on Android:** `minifyEnabled: false` in build.gradle (keep debug symbols).

## Git Workflow

- Main branch: `main`
- Recent commits tracked in git history (no force-pushes without discussion)

# Compact instructions
when you are using compact, please focus on test and output and code changes
