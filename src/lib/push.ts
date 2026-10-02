import { Capacitor } from '@capacitor/core'
import { FirebaseMessaging } from '@capacitor-firebase/messaging'
import { registerDeviceToken, unregisterDeviceToken } from '../services/supabaseService'

// Guards against re-registering the same token/listeners on every
// loadSession() call (sign-in, token refresh, etc.) within one app session.
let listenersInstalled = false

export async function registerForPushNotifications() {
  if (!Capacitor.isNativePlatform()) return

  try {
    const { receive } = await FirebaseMessaging.checkPermissions()
    if (receive !== 'granted') {
      const { receive: requested } = await FirebaseMessaging.requestPermissions()
      if (requested !== 'granted') return
    }

    const { token } = await FirebaseMessaging.getToken()
    if (token) await registerDeviceToken(token, 'android')

    if (!listenersInstalled) {
      listenersInstalled = true
      FirebaseMessaging.addListener('tokenReceived', async (event) => {
        if (event.token) await registerDeviceToken(event.token, 'android')
      })
    }
  } catch (e) {
    console.error('Push registration failed:', e)
  }
}

export async function unregisterCurrentDevice() {
  if (!Capacitor.isNativePlatform()) return
  try {
    const { token } = await FirebaseMessaging.getToken()
    if (token) await unregisterDeviceToken(token)
  } catch (e) {
    console.error('Push unregister failed:', e)
  }
}

export interface PushTapData {
  type?: 'engagement' | 'maqtab-progress' | 'donation-reminder'
  id?: string
  variant?: string
}

// Registers the listener that fires when the user taps a push notification
// (foreground, background, or cold-start). Mirrors the local-notification
// tap contract in App.tsx so both sources drive the same in-app modals.
// Returns an unsubscribe function.
export function addPushTapListener(onTap: (data: PushTapData) => void) {
  if (!Capacitor.isNativePlatform()) return () => {}

  let remove: (() => void) | undefined
  FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
    const data = (event.notification.data ?? {}) as PushTapData
    onTap(data)
  }).then((h) => {
    remove = () => h.remove()
  })
  return () => remove?.()
}
