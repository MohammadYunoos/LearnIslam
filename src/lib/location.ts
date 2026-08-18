// src/lib/location.ts
// Resolve the user's coordinates for Qibla + prayer times.
// Order: cached/manual override → native Capacitor Geolocation → browser
// geolocation. Falls back to a manual value the user can set/store.
import { Capacitor } from '@capacitor/core'

export interface Coords {
  lat: number
  lng: number
  label?: string // optional place name for manual entries
  manual?: boolean
}

const KEY = 'is_coords_v1'

export function getSavedCoords(): Coords | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Coords) : null
  } catch {
    return null
  }
}

export function saveCoords(c: Coords) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
  } catch {
    /* ignore */
  }
}

export function clearManualCoords() {
  const c = getSavedCoords()
  if (c?.manual) localStorage.removeItem(KEY)
}

// Try to get a live GPS fix. Throws on denial/unavailable so the caller can
// show the manual-entry fallback.
export async function requestGpsCoords(): Promise<Coords> {
  if (Capacitor.isNativePlatform()) {
    const { Geolocation } = await import('@capacitor/geolocation')
    const perm = await Geolocation.requestPermissions()
    if (perm.location === 'denied' && perm.coarseLocation === 'denied') {
      throw new Error('Location permission denied')
    }
    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })
    return { lat: pos.coords.latitude, lng: pos.coords.longitude }
  }
  // Web / WebView fallback.
  return new Promise<Coords>((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('Geolocation unavailable'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000 }
    )
  })
}
