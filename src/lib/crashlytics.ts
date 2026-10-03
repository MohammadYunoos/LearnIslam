import { Capacitor } from '@capacitor/core'
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics'

export async function recordError(error: unknown, context?: string) {
  if (!Capacitor.isNativePlatform()) return

  const message = error instanceof Error ? error.message : String(error)
  try {
    await FirebaseCrashlytics.recordException({
      message: context ? `${context}: ${message}` : message,
    })
  } catch (e) {
    console.error('Crashlytics recordException failed:', e)
  }
}

export async function setCrashlyticsUserId(userId: string) {
  if (!Capacitor.isNativePlatform()) return

  try {
    await FirebaseCrashlytics.setUserId({ userId })
  } catch (e) {
    console.error('Crashlytics setUserId failed:', e)
  }
}

export function installGlobalErrorHandlers() {
  if (!Capacitor.isNativePlatform()) return

  window.addEventListener('error', (event) => {
    void recordError(event.error ?? event.message, 'window.onerror')
  })
  window.addEventListener('unhandledrejection', (event) => {
    void recordError(event.reason, 'unhandledrejection')
  })
}
