// src/lib/external.ts
// Open an external URL: use the system browser / YouTube app on native (via the
// Capacitor Browser plugin), and a new tab on web.
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'

export async function openExternal(url: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url })
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
