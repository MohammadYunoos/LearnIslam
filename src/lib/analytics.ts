import { Capacitor } from '@capacitor/core'
import { FirebaseAnalytics } from '@capacitor-firebase/analytics'

export async function logAnalyticsEvent(name: string, params?: Record<string, unknown>) {
  if (!Capacitor.isNativePlatform()) return

  try {
    await FirebaseAnalytics.logEvent({ name, params })
  } catch (e) {
    console.error('Analytics logEvent failed:', e)
  }
}

export async function logScreenView(screenName: string) {
  if (!Capacitor.isNativePlatform()) return

  try {
    await FirebaseAnalytics.logEvent({
      name: 'screen_view',
      params: { screen_name: screenName, screen_class: screenName },
    })
  } catch (e) {
    console.error('Analytics logScreenView failed:', e)
  }
}

export async function setAnalyticsUserId(userId: string | null) {
  if (!Capacitor.isNativePlatform()) return

  try {
    await FirebaseAnalytics.setUserId({ userId })
  } catch (e) {
    console.error('Analytics setUserId failed:', e)
  }
}
