// src/store/appStore.ts
import { create } from 'zustand'
import type { AppUser } from '../services/authService'

interface AppStore {
  user: AppUser | null
  setUser: (u: AppUser | null) => void
  logout: () => void

  // True when signed in (Google) but the profile detail is not filled yet.
  needsProfile: boolean
  setNeedsProfile: (v: boolean) => void

  showHadeesPopup: boolean
  setShowHadeesPopup: (v: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, needsProfile: false }),
  needsProfile: false,
  setNeedsProfile: (needsProfile) => set({ needsProfile }),
  showHadeesPopup: true,
  setShowHadeesPopup: (v) => set({ showHadeesPopup: v }),
}))
