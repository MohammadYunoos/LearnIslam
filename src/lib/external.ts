// src/lib/external.ts
// Open an external URL: use the system browser / YouTube app on native (via the
// Capacitor Browser plugin), and a new tab on web.
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'

export async function openExternal(url: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url })
  } else {
    const opened = window.open('', '_blank')
    if (!opened) throw new Error('The browser blocked the external link')
    opened.opener = null
    opened.location.href = url
  }
}
