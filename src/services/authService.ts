// src/services/authService.ts
// Alpha version — local UUID login only.
// Replace with Google Sign-In for production; the Supabase tables and
// queries stay exactly the same — only the user id source changes.

import { api } from './apiClient'

const USER_ID_KEY = 'mymaqtab_user_id'
const USER_NAME_KEY = 'mymaqtab_user_name'
const USER_DATA_KEY = 'mymaqtab_user_data'

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

// Generate a UUID that works in all browsers / the Android WebView
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Called when user enters name on login screen
export async function loginWithName(
  name: string,
  age: number,
  gender: Gender,
  madhab: string,
  language: string
): Promise<AppUser> {
  // Check if this device already has a user ID
  let userId = localStorage.getItem(USER_ID_KEY)

  if (!userId) {
    // First time on this device — create a new ID
    userId = generateUUID()
    localStorage.setItem(USER_ID_KEY, userId)
  }

  // Save profile through the API. Falls back to local-only if the API is
  // unreachable (e.g. function not deployed yet), so the app still works.
  try {
    await api.put('/profile', {
      id: userId,
      name: name.trim(),
      age,
      gender,
      madhab,
      language,
      tier: 'free',
    })
  } catch (e) {
    console.warn('Profile save via API failed, using local only:', e)
  }

  // Always save to localStorage as a backup / offline source
  const userData: AppUser = {
    id: userId,
    name: name.trim(),
    age,
    gender,
    madhab,
    language,
    tier: 'free',
  }
  localStorage.setItem(USER_NAME_KEY, name.trim())
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))

  return userData
}

// Called on app open to check if a user already exists on this device
export function getLocalUser(): AppUser | null {
  const raw = localStorage.getItem(USER_DATA_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AppUser
  } catch {
    return null
  }
}

// Called on logout (for testing — clears this device's data)
export function logout(): void {
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USER_NAME_KEY)
  localStorage.removeItem(USER_DATA_KEY)
}

// Get the userId for Supabase queries
export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY)
}
