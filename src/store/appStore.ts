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

  showDonationNotification: boolean
  setShowDonationNotification: (v: boolean) => void
  donationNotificationType: 'reminder' | 'post-lesson' | 'session'
  setDonationNotificationType: (t: 'reminder' | 'post-lesson' | 'session') => void

  showMaqtabNotification: boolean
  setShowMaqtabNotification: (v: boolean) => void
  maqtabNotificationType: 'incomplete' | 'start'
  setMaqtabNotificationType: (t: 'incomplete' | 'start') => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, needsProfile: false }),
  needsProfile: false,
  setNeedsProfile: (needsProfile) => set({ needsProfile }),
  showHadeesPopup: true,
  setShowHadeesPopup: (v) => set({ showHadeesPopup: v }),
  showDonationNotification: false,
  setShowDonationNotification: (v) => set({ showDonationNotification: v }),
  donationNotificationType: 'session',
  setDonationNotificationType: (t) => set({ donationNotificationType: t }),
  showMaqtabNotification: false,
  setShowMaqtabNotification: (v) => set({ showMaqtabNotification: v }),
  maqtabNotificationType: 'incomplete',
  setMaqtabNotificationType: (t) => set({ maqtabNotificationType: t }),
}))
