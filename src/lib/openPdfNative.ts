import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { FileOpener } from '@capacitor-community/file-opener'

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function openPdf(url: string, fileName: string) {
  // Cache-bust so a replaced PDF isn't served stale from HTTP/WebView cache.
  const bust = (u: string) => u + (u.includes('?') ? '&' : '?') + 'v=' + Date.now()

  if (!Capacitor.isNativePlatform()) {
    window.open(bust(new URL(url, window.location.href).href), '_blank')
    return
  }
  try {
    const res = await fetch(bust(url), { cache: 'no-store' })
    const blob = await res.blob()
    const base64 = await blobToBase64(blob)
    const path = `pdfs/${fileName}`
    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
      recursive: true,
    })
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache })
    await FileOpener.open({ filePath: uri, contentType: 'application/pdf' })
  } catch (err) {
    console.error('Failed to open PDF:', err)
  }
}
