// src/lib/certificate.ts
// Draw the Beginner-completion certificate on a <canvas>, and download / share
// it as a PNG. No heavy image library — pure Canvas 2D. Native share/save uses
// @capacitor/filesystem + @capacitor/share (loaded lazily so the web build and
// tsc do not require them until `npm i` + `npx cap sync`).
import { Capacitor } from '@capacitor/core'

export interface CertData {
  name: string
  percent: number
  date: string // e.g. '21 Aug 2026'
}

const W = 1000
const H = 700

// Render the certificate. Returns the canvas for save/share.
export function drawCertificate(canvas: HTMLCanvasElement, d: CertData): HTMLCanvasElement {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  // Background (cream) + subtle vignette.
  ctx.fillStyle = '#FBF7EC'
  ctx.fillRect(0, 0, W, H)

  // Outer gold border + inner teal keyline.
  ctx.strokeStyle = '#C8962C'
  ctx.lineWidth = 10
  ctx.strokeRect(24, 24, W - 48, H - 48)
  ctx.strokeStyle = '#0E3B36'
  ctx.lineWidth = 2
  ctx.strokeRect(40, 40, W - 80, H - 80)

  const center = W / 2
  ctx.textAlign = 'center'

  // Crest.
  ctx.fillStyle = '#0E3B36'
  ctx.font = 'bold 44px Georgia, serif'
  ctx.fillText('Islam Seeko', center, 120)
  ctx.fillStyle = '#C8962C'
  ctx.font = '20px Georgia, serif'
  ctx.fillText('☪  Learn Islam  ☪', center, 150)

  // Title.
  ctx.fillStyle = '#0E3B36'
  ctx.font = 'bold 40px Georgia, serif'
  ctx.fillText('Certificate of Completion', center, 240)
  ctx.strokeStyle = '#C8962C'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(center - 180, 258)
  ctx.lineTo(center + 180, 258)
  ctx.stroke()

  // Awardee.
  ctx.fillStyle = '#6b6455'
  ctx.font = '20px Georgia, serif'
  ctx.fillText('This is proudly awarded to', center, 310)
  ctx.fillStyle = '#0E3B36'
  ctx.font = 'bold 46px Georgia, serif'
  ctx.fillText(d.name || 'Student', center, 366)

  // Body.
  ctx.fillStyle = '#3a352c'
  ctx.font = '22px Georgia, serif'
  ctx.fillText('for successfully completing the Beginner section of', center, 424)
  ctx.fillText('Maqtab and demonstrating basic Islamic knowledge.', center, 456)

  // Score.
  ctx.fillStyle = '#C8962C'
  ctx.font = 'bold 30px Georgia, serif'
  ctx.fillText(`Score: ${d.percent}%`, center, 520)

  // Footer: date + dua.
  ctx.fillStyle = '#6b6455'
  ctx.font = '18px Georgia, serif'
  ctx.fillText(`Date: ${d.date}`, center, 600)
  ctx.fillStyle = '#0E3B36'
  ctx.font = 'italic 20px Georgia, serif'
  ctx.fillText('May Allah accept it and grant beneficial knowledge. Ameen.', center, 636)

  return canvas
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
  })
}

const FILENAME = 'islam-seekho-certificate.png'

// Download the certificate (web) or save + reveal via share sheet (native).
export async function saveCertificate(canvas: HTMLCanvasElement): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await shareCertificate(canvas, 'My Islam Seeko — Beginner certificate.')
    return
  }
  const blob = await canvasToBlob(canvas)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = FILENAME
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Share the certificate image with a caption to WhatsApp/Facebook/etc.
export async function shareCertificate(canvas: HTMLCanvasElement, text: string): Promise<void> {
  const dataUrl = canvas.toDataURL('image/png')

  if (Capacitor.isNativePlatform()) {
    // Lazy-load native plugins (present after `npm i` + `npx cap sync`).
    // @ts-ignore — optional native dep, resolved on device.
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    // @ts-ignore — optional native dep, resolved on device.
    const { Share } = await import('@capacitor/share')
    const base64 = dataUrl.split(',')[1]
    const res = await Filesystem.writeFile({
      path: FILENAME,
      data: base64,
      directory: Directory.Cache,
    })
    await Share.share({
      title: 'Islam Seeko Certificate',
      text,
      url: res.uri,
      dialogTitle: 'Share your certificate',
    })
    return
  }

  // Web: prefer the Web Share API with a file, else fall back to download.
  try {
    const blob = await canvasToBlob(canvas)
    const file = new File([blob], FILENAME, { type: 'image/png' })
    const nav = navigator as Navigator & { canShare?: (d: any) => boolean }
    if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
      await nav.share({ files: [file], text, title: 'Islam Seeko Certificate' })
      return
    }
  } catch {
    /* fall through to download */
  }
  await saveCertificate(canvas)
}

// Short celebratory fanfare via Web Audio (no audio asset needed).
export function playFanfare(): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    // A rising major arpeggio then an octave — celebratory.
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]
    notes.forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.value = f
      o.connect(g)
      g.connect(ctx.destination)
      const t = now + i * 0.18
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
      o.start(t)
      o.stop(t + 0.55)
    })
  } catch {
    /* ignore audio errors */
  }
  try {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('Mubarak ho! Certificate earned.')
      u.rate = 0.95
      window.speechSynthesis.speak(u)
    }
  } catch {
    /* ignore tts errors */
  }
}
