// src/lib/prayerTimes.ts
// Prayer + Sunnah timings per the Hanafi / Deobandi convention:
//   method = University of Islamic Sciences, Karachi (Fajr 18°, Isha 18°)
//   Asr    = Hanafi (shadow length = 2× object + noon shadow)
// Uses the `adhan` library for the astronomical calculation.
import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes,
  SunnahTimes,
  Qibla,
} from 'adhan'

export interface Timing {
  key: string
  label: string
  time: Date
  end?: Date // for windows (Tahajjud, Ishraq, Chasht, Awabin)
  note?: string
}

export interface DayTimings {
  fard: Timing[]
  sunnah: Timing[]
  roza: Timing[]
}

function karachiHanafi(coords: Coordinates, date: Date): PrayerTimes {
  const params = CalculationMethod.Karachi()
  params.madhab = Madhab.Hanafi
  return new PrayerTimes(coords, date, params)
}

// Qibla bearing in degrees clockwise from true North.
export function qiblaBearing(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng))
}

const addMin = (d: Date, m: number) => new Date(d.getTime() + m * 60000)

export function computeTimings(
  lat: number,
  lng: number,
  date: Date,
  offsetMin = 0
): DayTimings {
  const coords = new Coordinates(lat, lng)
  const pt = karachiHanafi(coords, date)
  const sunnah = new SunnahTimes(pt)

  // Isha lasts until the next day's Subah Sadiq (Fajr).
  const nextDay = new Date(date.getTime() + 86400000)
  const ptNext = karachiHanafi(coords, nextDay)

  // A single sunrise-calibration offset (minutes) shifts EVERY time equally so
  // the whole chart lines up with the local masjid timetable.
  const o = (d: Date) => addMin(d, offsetMin)

  const zawal = o(pt.dhuhr)
  const sr = o(pt.sunrise)

  // Each fard waqt shown as start → end (the valid time window).
  const fard: Timing[] = [
    { key: 'fajr', label: 'Fajr (Subah Sadiq)', time: o(pt.fajr), end: sr, note: 'Subah Sadiq until sunrise' },
    { key: 'sunrise', label: 'Sunrise (Tulu)', time: sr, note: 'No salah (makruh)' },
    { key: 'dhuhr', label: 'Zuhr (Zawal)', time: zawal, end: o(pt.asr), note: 'After Zawal until Asr' },
    { key: 'asr', label: 'Asr (Hanafi)', time: o(pt.asr), end: o(pt.maghrib), note: 'Until sunset (avoid the makruh time just before)' },
    { key: 'maghrib', label: 'Maghrib', time: o(pt.maghrib), end: o(pt.isha), note: 'After sunset until Isha' },
    { key: 'isha', label: 'Isha', time: o(pt.isha), end: o(ptNext.fajr), note: 'Until Subah Sadiq (next Fajr)' },
  ]

  // Sunnah / Nafl times (all shifted by the same offset).
  const forenoonMs = zawal.getTime() - sr.getTime()
  const ishraqTime = addMin(sr, 15) // single start time, not a window
  const chashtStart = new Date(sr.getTime() + forenoonMs * 0.5) // mid-morning
  const sunnahList: Timing[] = [
    {
      key: 'tahajjud',
      label: 'Tahajjud',
      time: o(sunnah.lastThirdOfTheNight),
      end: o(pt.fajr),
      note: 'Last third of the night → Subah Sadiq',
    },
    {
      key: 'ishraq',
      label: 'Ishraq',
      time: ishraqTime,
      note: '~15–20 min after sunrise',
    },
    {
      key: 'chasht',
      label: 'Chasht (Duha)',
      time: chashtStart,
      end: addMin(zawal, -10),
      note: 'Mid-morning until just before Zawal',
    },
    {
      key: 'awabin',
      label: 'Awabin',
      time: addMin(o(pt.maghrib), 5),
      end: o(pt.isha),
      note: 'After Maghrib fard until Isha',
    },
  ]

  const roza: Timing[] = [
    { key: 'sehri', label: 'Sehri ends (Subah Sadiq)', time: o(pt.fajr), note: 'Stop eating at Fajr' },
    { key: 'iftar', label: 'Iftar (Maghrib)', time: o(pt.maghrib), note: 'Open the fast' },
  ]

  return { fard, sunnah: sunnahList, roza }
}

export function fmtTime(d: Date): string {
  try {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch {
    return d.toTimeString().slice(0, 5)
  }
}
