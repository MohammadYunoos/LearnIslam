// src/store/appStore.ts
import { create } from 'zustand'
import type { AppUser } from '../services/authService'
import type { EngagementNotificationContent } from '../content/engagementNotifications'

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
  donationNotificationType: 'reminder' | 'post-lesson' | 'post-exam' | 'session'
  setDonationNotificationType: (t: 'reminder' | 'post-lesson' | 'post-exam' | 'session') => void

  showMaqtabNotification: boolean
  setShowMaqtabNotification: (v: boolean) => void
  maqtabNotificationType: 'incomplete' | 'start'
  setMaqtabNotificationType: (t: 'incomplete' | 'start') => void

  engagementNotification: EngagementNotificationContent | null
  setEngagementNotification: (content: EngagementNotificationContent | null) => void

  // Suppress non-donate notifications for 5 min after app open
  appOpenSuppressed: boolean
  setAppOpenSuppressed: (v: boolean) => void

  // Suppress all notifications (including donate) on first run for 5 min
  firstRunSuppressed: boolean
  setFirstRunSuppressed: (v: boolean) => void
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
  engagementNotification: null,
  setEngagementNotification: (engagementNotification) => set({ engagementNotification }),
  appOpenSuppressed: false,
  setAppOpenSuppressed: (v) => set({ appOpenSuppressed: v }),
  firstRunSuppressed: false,
  setFirstRunSuppressed: (v) => set({ firstRunSuppressed: v }),
}))
