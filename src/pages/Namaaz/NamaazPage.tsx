// src/pages/Namaaz/NamaazPage.tsx
// Ehtimam-e-Namaaz — prayer, Sunnah/Nafl and Roza timings for the user's
// location, Hanafi / Deobandi convention (Karachi 18°/18°, Hanafi Asr).
// Defaults to today; any date can be picked.
import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { computeTimings, fmtTime, type Timing } from '../../lib/prayerTimes'
import { getSavedCoords, saveCoords, requestGpsCoords, type Coords } from '../../lib/location'

function isoToday(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function Row({ t }: { t: Timing }) {
  return (
    <div className="flex items-start justify-between px-4 py-3">
      <div className="min-w-0 pr-3">
        <p className="text-sm font-semibold text-teal-900">{t.label}</p>
        {t.note && <p className="text-[11px] text-ink-muted">{t.note}</p>}
      </div>
      <p className="text-sm font-bold text-gold-dark whitespace-nowrap">
        {fmtTime(t.time)}
        {t.end ? ` – ${fmtTime(t.end)}` : ''}
      </p>
    </div>
  )
}

export function NamaazPage() {
  const [coords, setCoords] = useState<Coords | null>(getSavedCoords())
  const [dateStr, setDateStr] = useState(isoToday())
  const [manual, setManual] = useState(false)
  const [latIn, setLatIn] = useState('')
  const [lngIn, setLngIn] = useState('')
  const [err, setErr] = useState<string | null>(null)

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
      setErr('Enter valid latitude and longitude')
      return
    }
    const c = { lat, lng, manual: true }
    setCoords(c)
    saveCoords(c)
    setManual(false)
    setErr(null)
  }

  const timings = useMemo(() => {
    if (!coords) return null
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0) // noon avoids DST edge issues
    return computeTimings(coords.lat, coords.lng, date)
  }, [coords, dateStr])

  return (
    <div className="bg-cream min-h-screen pb-20 page-fade">
      <PageHeader
        title="Ehtimam-e-Namaaz"
        subtitle="Timings · Hanafi / Deobandi"
        backTo="/home"
      />

      <div className="px-4 pt-4">
        {/* Date picker */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value || isoToday())}
            className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink"
          />
          <button
            onClick={() => setDateStr(isoToday())}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-teal-900 text-white whitespace-nowrap"
          >
            Today
          </button>
        </div>

        {!coords && !manual && (
          <p className="text-sm text-ink-muted text-center py-10">Getting your location…</p>
        )}

        {manual && (
          <div className="bg-white border border-border rounded-2xl p-4 mb-4 space-y-3">
            <p className="text-sm text-ink">Location unavailable. Enter coordinates or retry GPS.</p>
            <div className="flex gap-2">
              <input value={latIn} onChange={(e) => setLatIn(e.target.value)} inputMode="decimal" placeholder="Latitude" className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink" />
              <input value={lngIn} onChange={(e) => setLngIn(e.target.value)} inputMode="decimal" placeholder="Longitude" className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-white text-ink" />
            </div>
            <div className="flex gap-2">
              <button onClick={saveManual} className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-2.5 text-sm">Use these</button>
              <button onClick={useGps} className="flex-1 bg-white border border-teal-700 text-teal-900 font-bold rounded-xl py-2.5 text-sm">Retry GPS</button>
            </div>
          </div>
        )}

        {err && <p className="text-xs text-red-500 text-center mb-3">{err}</p>}

        {timings && (
          <>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Fard prayers</p>
            <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-4">
              {timings.fard.map((t) => <Row key={t.key} t={t} />)}
            </div>

            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Sunnah &amp; Nafl</p>
            <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-4">
              {timings.sunnah.map((t) => <Row key={t.key} t={t} />)}
            </div>

            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Roza (fasting)</p>
            <div className="bg-white border border-border rounded-2xl divide-y divide-border mb-4">
              {timings.roza.map((t) => <Row key={t.key} t={t} />)}
            </div>

            {coords && (
              <p className="text-[11px] text-ink-muted text-center">
                {coords.manual ? 'Manual location' : 'GPS location'} · {coords.lat.toFixed(3)},{' '}
                {coords.lng.toFixed(3)} ·{' '}
                <button onClick={() => setManual(true)} className="text-gold-dark underline">
                  change
                </button>
              </p>
            )}
            <p className="text-[10px] text-ink-muted text-center mt-3 leading-relaxed">
              Karachi method (Fajr/Isha 18°), Hanafi Asr. Times are calculated for your device
              timezone. Keep a few minutes of precaution for Sehri and verify Sehri/Iftar with your
              local masjid.
            </p>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
