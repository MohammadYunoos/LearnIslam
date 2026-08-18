// src/pages/Qibla/QiblaPage.tsx
// Qibla finder: bearing to the Ka'bah from the user's location, with a live
// compass arrow when the device exposes orientation. GPS with manual fallback.
import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { qiblaBearing } from '../../lib/prayerTimes'
import { getSavedCoords, saveCoords, requestGpsCoords, type Coords } from '../../lib/location'

export function QiblaPage() {
  const [coords, setCoords] = useState<Coords | null>(getSavedCoords())
  const [bearing, setBearing] = useState<number | null>(null)
  const [heading, setHeading] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [manual, setManual] = useState(false)
  const [latIn, setLatIn] = useState('')
  const [lngIn, setLngIn] = useState('')
  const [compassOn, setCompassOn] = useState(false)
  const listenerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null)

  // Compute bearing whenever coords change.
  useEffect(() => {
    if (coords) setBearing(qiblaBearing(coords.lat, coords.lng))
  }, [coords])

  // Try GPS on mount if we have no coords yet.
  useEffect(() => {
    if (coords) return
    requestGpsCoords()
      .then((c) => {
        setCoords(c)
        saveCoords(c)
      })
      .catch(() => setManual(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useGps = () => {
    setErr(null)
    requestGpsCoords()
      .then((c) => {
        setCoords(c)
        saveCoords(c)
        setManual(false)
      })
      .catch((e) => setErr(e?.message || 'Could not get location'))
  }

  const saveManual = () => {
    const lat = parseFloat(latIn)
    const lng = parseFloat(lngIn)
    if (Number.isNaN(lat) || Number.isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      setErr('Enter valid latitude (-90..90) and longitude (-180..180)')
      return
    }
    const c = { lat, lng, manual: true }
    setCoords(c)
    saveCoords(c)
    setManual(false)
    setErr(null)
  }

  const enableCompass = async () => {
    try {
      // iOS 13+ needs an explicit permission request from a user gesture.
      const anyDOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
      if (typeof anyDOE.requestPermission === 'function') {
        const res = await anyDOE.requestPermission()
        if (res !== 'granted') {
          setErr('Compass permission denied')
          return
        }
      }
      const handler = (e: DeviceOrientationEvent) => {
        // iOS gives a true compass heading directly; Android absolute gives alpha.
        const anyE = e as unknown as { webkitCompassHeading?: number }
        let h: number | null = null
        if (typeof anyE.webkitCompassHeading === 'number') h = anyE.webkitCompassHeading
        else if (e.absolute && typeof e.alpha === 'number') h = 360 - e.alpha
        if (h != null) setHeading((h + 360) % 360)
      }
      listenerRef.current = handler
      window.addEventListener('deviceorientationabsolute', handler as EventListener, true)
      window.addEventListener('deviceorientation', handler as EventListener, true)
      setCompassOn(true)
    } catch {
      setErr('Compass not available on this device')
    }
  }

  useEffect(() => {
    return () => {
      const h = listenerRef.current
      if (h) {
        window.removeEventListener('deviceorientationabsolute', h as EventListener, true)
        window.removeEventListener('deviceorientation', h as EventListener, true)
      }
    }
  }, [])

  // Arrow points to Qibla relative to where the phone is facing.
  const arrowDeg = bearing != null && heading != null ? (bearing - heading + 360) % 360 : bearing ?? 0
  const aligned =
    bearing != null && heading != null && Math.min(arrowDeg, 360 - arrowDeg) < 6

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader title="Find Qibla" subtitle="Direction of the Ka'bah" backTo="/home" />

      <div className="px-4 pt-4">
        {!coords && !manual && (
          <p className="text-sm text-ink-muted text-center py-10">Getting your location…</p>
        )}

        {manual && (
          <div className="bg-white border border-border rounded-2xl p-4 mb-4 space-y-3">
            <p className="text-sm text-ink">Location unavailable. Enter coordinates or retry GPS.</p>
            <div className="flex gap-2">
              <input
                value={latIn}
                onChange={(e) => setLatIn(e.target.value)}
                inputMode="decimal"
                placeholder="Latitude"
                className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink"
              />
              <input
                value={lngIn}
                onChange={(e) => setLngIn(e.target.value)}
                inputMode="decimal"
                placeholder="Longitude"
                className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={saveManual} className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-2.5 text-sm">
                Use these
              </button>
              <button onClick={useGps} className="flex-1 bg-white border border-teal-700 text-teal-900 font-bold rounded-xl py-2.5 text-sm">
                Retry GPS
              </button>
            </div>
          </div>
        )}

        {err && <p className="text-xs text-red-500 text-center mb-3">{err}</p>}

        {coords && bearing != null && (
          <div className="bg-white border border-border rounded-2xl p-6 text-center">
            {/* Compass dial */}
            <div className="relative w-56 h-56 mx-auto mb-4">
              {/* Pulsing rings */}
              <span
                className={`absolute inset-0 rounded-full ${aligned ? 'bg-green-500/25' : 'bg-teal-500/20'} qibla-pulse`}
              />
              <span
                className={`absolute inset-0 rounded-full ${aligned ? 'bg-green-500/20' : 'bg-teal-500/15'} qibla-pulse`}
                style={{ animationDelay: '1.1s' }}
              />
              {/* Rotating dial with N/S/E/W */}
              <div
                className="absolute inset-0 rounded-full border-4 border-teal-900/15 bg-white/60 flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: heading != null ? `rotate(${-heading}deg)` : undefined }}
              >
                <span className="absolute top-1 text-xs font-bold text-teal-900">N</span>
                <span className="absolute bottom-1 text-xs text-ink-muted">S</span>
                <span className="absolute left-1 text-xs text-ink-muted">W</span>
                <span className="absolute right-1 text-xs text-ink-muted">E</span>
              </div>
              {/* Qibla arrow — points from centre to the Ka‘bah */}
              <div
                className="absolute inset-0 flex items-start justify-center transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${arrowDeg}deg)` }}
              >
                <div className="flex flex-col items-center pt-3">
                  <div className={`text-2xl leading-none ${aligned ? 'text-green-600' : 'text-gold-dark'}`}>▲</div>
                  {/* counter-rotate wrapper keeps the Ka‘bah upright; inner div floats */}
                  <div style={{ transform: `rotate(${-arrowDeg}deg)` }}>
                    <div className={`text-5xl qibla-float ${aligned ? 'qibla-glow' : ''}`}>🕋</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-lg font-bold text-teal-900">{Math.round(bearing)}° from North</p>
            {heading != null ? (
              <p className={`text-sm mt-1 ${aligned ? 'text-green-600 font-bold' : 'text-ink-muted'}`}>
                {aligned ? 'Facing the Qibla ✓' : 'Turn until the Ka‘bah points up'}
              </p>
            ) : (
              <button
                onClick={enableCompass}
                className="mt-3 bg-teal-900 text-white font-bold rounded-xl px-5 py-2.5 text-sm"
                disabled={compassOn}
              >
                {compassOn ? 'Waiting for compass…' : 'Enable live compass'}
              </button>
            )}

            <p className="text-[11px] text-ink-muted mt-4">
              {coords.manual ? 'Manual location' : 'GPS location'} · {coords.lat.toFixed(3)},{' '}
              {coords.lng.toFixed(3)}
            </p>
            <button onClick={() => setManual(true)} className="text-[11px] text-gold-dark underline mt-1">
              Change location
            </button>
            <p className="text-[10px] text-ink-muted mt-3 leading-relaxed">
              Compass accuracy depends on your device sensor. Move away from metal/magnets and
              calibrate by moving the phone in a figure-8 if the arrow drifts.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
