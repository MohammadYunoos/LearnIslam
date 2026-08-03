// src/store/appStore.ts
import { create } from 'zustand'
import type { AppUser } from '../services/authService'

interface AppStore {
  user: AppUser | null
  setUser: (u: AppUser | null) => void
  logout: () => void

  showHadeesPopup: boolean
  setShowHadeesPopup: (v: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  showHadeesPopup: true,
  setShowHadeesPopup: (v) => set({ showHadeesPopup: v }),
}))
