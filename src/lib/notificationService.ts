import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

export interface NotificationPayload {
  title: string
  body: string
  actionTypeId?: string
  data?: Record<string, string>
}

export async function sendLocalNotification(payload: NotificationPayload) {
  // Only send on native platforms
  if (!Capacitor.isNativePlatform()) return

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Math.random() * 10000),
          title: payload.title,
          body: payload.body,
          actionTypeId: payload.actionTypeId,
          largeBody: payload.body,
          summaryText: payload.title,
          extra: payload.data || {},
        },
      ],
    })
  } catch (error) {
    console.error('Notification failed:', error)
  }
}

export async function requestNotificationPermission() {
  if (!Capacitor.isNativePlatform()) return true

  try {
    const result = await LocalNotifications.requestPermissions()
    return result.display === 'granted'
  } catch {
    return false
  }
}
