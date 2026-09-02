// src/services/authService.ts
// Auth: Google (Supabase OAuth, browser + deep link) with a local guest fallback.
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { supabase } from '../lib/supabase'
import { api } from './apiClient'

const USER_ID_KEY = 'mymaqtab_user_id'
const USER_NAME_KEY = 'mymaqtab_user_name'
const USER_DATA_KEY = 'mymaqtab_user_data'

const REDIRECT_NATIVE = 'com.mymaqtab.app://auth'

export type Gender = 'male' | 'female'

export interface AppUser {
  id: string
  name: string
  age: number
  gender: Gender
  madhab: string
  language: string
  tier: 'free' | 'premium'
}

// ── Google (Supabase OAuth) ─────────────────────────────

export async function signInWithGoogle(): Promise<void> {
  const native = Capacitor.isNativePlatform()
  const redirectTo = native ? REDIRECT_NATIVE : window.location.origin
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: native },
  })
  if (error) throw error
  // Native: open Google in the system browser; the redirect deep-links back.
  if (native && data?.url) await Browser.open({ url: data.url })
  // Web: supabase performs the full-page redirect automatically.
}

// Map the current Supabase session to an AppUser + whether a profile exists.
export async function getSessionUser(): Promise<{ user: AppUser; hasProfile: boolean } | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const id = session.user.id
  const meta = session.user.user_metadata ?? {}
  const fallbackName =
    (meta.full_name as string) || (meta.name as string) || session.user.email || 'Learner'

  // Offline-safe: if we already cached this user's completed profile, trust it.
  // This stops a logged-in user being bounced to Login on reopen when the
  // profile fetch is slow or the network/API is down.
  const cached = getLocalUser()
  if (cached && cached.id === id && cached.madhab) {
    return { hasProfile: true, user: cached }
  }

  let profile: any = null
  try {
    profile = await api.get('/profile')
  } catch {
    /* profile not reachable — fall through */
  }

  if (profile && profile.name) {
    const user: AppUser = {
      id,
      name: profile.name,
      age: profile.age ?? 20,
      gender: (profile.gender as Gender) ?? 'male',
      madhab: profile.madhab ?? 'hanafi',
      language: profile.language ?? 'en',
      tier: (profile.tier as 'free' | 'premium') ?? 'free',
    }
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    return { hasProfile: true, user }
  }

  // No cache and no profile row → genuinely new; needs the profile step.
  return {
    hasProfile: false,
    user: { id, name: fallbackName, age: 0, gender: 'male', madhab: '', language: '', tier: 'free' },
  }
}

// Persist the profile detail for a signed-in (Google) user.
export async function saveProfile(
  id: string,
  name: string,
  age: number,
  gender: Gender,
  madhab: string,
  language: string
): Promise<AppUser> {
  const user: AppUser = { id, name: name.trim(), age, gender, madhab, language, tier: 'free' }
  await api.put('/profile', user)
  // Cache so reopen keeps the user on Home without a network round-trip.
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  return user
}

// ── Guest (local UUID) ──────────────────────────────────

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function continueAsGuest(
  name: string,
  age: number,
  gender: Gender,
  madhab: string,
  language: string
): Promise<AppUser> {
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = generateUUID()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  const userData: AppUser = { id: userId, name: name.trim(), age, gender, madhab, language, tier: 'free' }
  try {
    await api.put('/profile', userData)
  } catch (e) {
    console.warn('Guest profile save failed, using local only:', e)
  }
  localStorage.setItem(USER_NAME_KEY, name.trim())
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  return userData
}

export function getLocalUser(): AppUser | null {
  const raw = localStorage.getItem(USER_DATA_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AppUser
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut()
  } catch {
    /* ignore */
  }
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USER_NAME_KEY)
  localStorage.removeItem(USER_DATA_KEY)
}
