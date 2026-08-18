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

export function computeTimings(lat: number, lng: number, date: Date): DayTimings {
  const coords = new Coordinates(lat, lng)
  const pt = karachiHanafi(coords, date)
  const sunnah = new SunnahTimes(pt)

  // Roza (fasting) window uses today's Fajr (Subah Sadiq) and Maghrib.
  const fard: Timing[] = [
    { key: 'fajr', label: 'Fajr', time: pt.fajr, note: 'Subah Sadiq → sunrise' , end: pt.sunrise },
    { key: 'sunrise', label: 'Sunrise (Tulu)', time: pt.sunrise, note: 'No salah (makruh)' },
    { key: 'dhuhr', label: 'Zuhr', time: pt.dhuhr, note: 'After Zawal' },
    { key: 'asr', label: 'Asr (Hanafi)', time: pt.asr },
    { key: 'maghrib', label: 'Maghrib', time: pt.maghrib },
    { key: 'isha', label: 'Isha', time: pt.isha },
  ]

  // Sunnah / Nafl windows.
  const ishraqStart = addMin(pt.sunrise, 15) // ~ a spear's length after sunrise
  const zawal = pt.dhuhr // Zuhr begins just after Zawal
  const sunnahList: Timing[] = [
    {
      key: 'tahajjud',
      label: 'Tahajjud',
      time: sunnah.lastThirdOfTheNight,
      end: pt.fajr,
      note: 'Last third of the night → Subah Sadiq',
    },
    {
      key: 'ishraq',
      label: 'Ishraq',
      time: ishraqStart,
      end: addMin(pt.sunrise, 45),
      note: '~15 min after sunrise',
    },
    {
      key: 'chasht',
      label: 'Chasht (Duha)',
      time: addMin(pt.sunrise, 45),
      end: addMin(zawal, -10),
      note: 'Mid-morning until before Zawal',
    },
    {
      key: 'awabin',
      label: 'Awabin',
      time: addMin(pt.maghrib, 5),
      end: pt.isha,
      note: 'After Maghrib fard until Isha',
    },
  ]

  const roza: Timing[] = [
    { key: 'sehri', label: 'Sehri ends (Subah Sadiq)', time: pt.fajr, note: 'Stop eating at Fajr' },
    { key: 'iftar', label: 'Iftar (Maghrib)', time: pt.maghrib, note: 'Open the fast' },
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
