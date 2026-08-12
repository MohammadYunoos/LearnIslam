// src/components/UpdateBanner.tsx
// Shows an "update available" banner when app_config.latest_version_code is
// newer than this build. Mandatory updates block the app until installed.
import { useEffect, useState } from 'react'
import { APP_VERSION_CODE } from '../version'
import { getAppVersion } from '../services/supabaseService'
import { openExternal } from '../lib/external'

interface Cfg {
  latest_version_code?: number
  latest_version_name?: string
  min_version_code?: number
  apk_url?: string
  mandatory?: boolean
}

export function UpdateBanner() {
  const [cfg, setCfg] = useState<Cfg | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    getAppVersion()
      .then((d) => setCfg(d))
      .catch(() => {})
  }, [])

  if (!cfg?.latest_version_code || cfg.latest_version_code <= APP_VERSION_CODE) return null

  const mandatory = cfg.mandatory && (cfg.min_version_code ?? 0) > APP_VERSION_CODE
  const download = () => cfg.apk_url && openExternal(cfg.apk_url)

  if (mandatory) {
    return (
      <div className="fixed inset-0 z-[60] bg-teal-900/95 flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-5xl mb-3">⬆️</p>
          <h3 className="text-white font-bold text-lg mb-2">Update required</h3>
          <p className="text-sand text-sm mb-5">
            A newer version {cfg.latest_version_name ?? ''} is available. Please update to continue.
          </p>
          <button
            onClick={download}
            className="bg-gold text-teal-900 font-bold rounded-xl py-3 px-8 text-sm"
          >
            Download update
          </button>
        </div>
      </div>
    )
  }

  if (dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[55] max-w-lg mx-auto bg-gold text-teal-900 px-4 py-2 flex items-center justify-between gap-2 text-sm">
      <span className="font-semibold">
        Update available{cfg.latest_version_name ? ` (${cfg.latest_version_name})` : ''}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={download} className="bg-teal-900 text-white font-bold rounded-lg px-3 py-1">
          Download
        </button>
        <button onClick={() => setDismissed(true)} className="font-bold px-1" aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}
