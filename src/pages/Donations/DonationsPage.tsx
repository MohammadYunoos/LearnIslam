// src/pages/Donations/DonationsPage.tsx
// Donations page: Buy Me a Coffee + UPI options. Order based on user location.
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr, useTrList } from '../../i18n/useTr'
import { openExternal } from '../../lib/external'
import { getDonationConfig } from '../../services/supabaseService'

interface DonationConfig {
  buymeacoffee_link: string
  upi_vpa: string
}

const isIndianLocation = (lat: number, lng: number): boolean => {
  // Rough bounds for India: lat 8-35, lng 68-97
  return lat >= 8 && lat <= 35 && lng >= 68 && lng <= 97
}

const HADITH_QUOTES = [
  {
    text: 'Charity extinguishes the anger of the Lord.',
    source: 'Tirmidhi',
  },
  {
    text: 'The best of you are those who are best to their families, and I am the best among you to my family.',
    source: 'Tirmidhi',
  },
  {
    text: 'Wealth and children are adornments of life, but the everlasting good deeds are better.',
    source: 'Quran 18:46',
  },
  {
    text: 'Every act of charity is a sadaqah, even meeting your brother with a cheerful face.',
    source: 'Islamic Teaching',
  },
]

export function DonationsPage() {
  const [config, setConfig] = useState<DonationConfig | null>(null)
  const [isIndia, setIsIndia] = useState(false)
  const [upiAmount, setUpiAmount] = useState<number | ''>(50) // Default to 50
  const [selectedUpiPreset, setSelectedUpiPreset] = useState<number | null>(50) // Default to 50
  const [copied, setCopied] = useState(false)
  const [randomHadith] = useState(() =>
    HADITH_QUOTES[Math.floor(Math.random() * HADITH_QUOTES.length)]
  )

  const tTitle = useTr('Support Islam Seeko')
  const L = useTrList([
    'Islam Seeko is provided free of charge. Your voluntary donations help support app development, content creation, hosting, and maintenance.',
    'Donations are optional and do not provide any additional features, content, or benefits.',
    'Credit/Debit Card Donate', // was 'Buy Me a Coffee'
    'Support via Debit/Credit Card', // was 'Support via Buy Me a Coffee'
    'UPI Donate (INDIANS)', // was 'Donate with UPI'
    'Copy UPI ID',
    'Donate',
    'UPI ID copied to clipboard',
  ])

  // Load config + detect location + record donation timestamp
  useEffect(() => {
    const init = async () => {
      try {
        const data = await getDonationConfig()
        setConfig(data)
      } catch {
        /* config unavailable */
      }

      // Try to detect location
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((pos) => {
            setIsIndia(isIndianLocation(pos.coords.latitude, pos.coords.longitude))
          })
        }
      } catch {
        /* geolocation failed */
      }

      // Record donation timestamp for 7-day reminder
      localStorage.setItem('mymaqtab_donation_time', Date.now().toString())
    }
    init()
  }, [])

  const handleUpiPreset = (amount: number) => {
    setUpiAmount(amount)
    setSelectedUpiPreset(amount)
  }

  const handleUpiCustom = (value: string) => {
    const num = value ? parseInt(value, 10) : ''
    setUpiAmount(num)
    setSelectedUpiPreset(null)
  }

  const handleUpiDonate = () => {
    if (!config || !upiAmount) return
    const upiUrl = `upi://pay?pa=${encodeURIComponent(config.upi_vpa)}&pn=Islam%20Seeko&am=${upiAmount}&cu=INR&tn=Donation`
    window.location.href = upiUrl
  }

  const handleCopyUpi = () => {
    if (!config) return
    navigator.clipboard.writeText(config.upi_vpa)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const UPI_PRESETS = [25, 50, 100, 500, 1000]

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={tTitle} subtitle="💚 Your support helps us grow 💚" backTo="/home" />

      <div className="px-4 pt-4">
        {/* Hadith Quote with Islamic styling */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-gold rounded-2xl p-4 mb-4">
          <p className="text-center text-xs text-teal-900 italic leading-relaxed mb-2">
            🌸 {randomHadith.text} 🌸
          </p>
          <p className="text-xs text-right text-ink-muted">— {randomHadith.source}</p>
        </div>

        {/* Info card with hearts and flowers */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-gold rounded-2xl p-4 mb-4">
          <div className="text-center text-lg mb-2">❤️ 🌸 ❤️</div>
          <p className="text-xs text-teal-900 leading-relaxed mb-3">{L[0]}</p>
          <p className="text-xs text-teal-900 leading-relaxed">{L[1]}</p>
        </div>

        {/* Donation options in location-based order */}
        {isIndia ? (
          <>
            {/* UPI first for Indian users */}
            {config && (
              <div className="bg-white border border-border rounded-2xl p-5 mb-4">
                <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
                  {L[4]}
                </label>

                {/* Presets */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {UPI_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleUpiPreset(preset)}
                      className={`text-xs font-bold rounded-lg py-2 transition-colors ${
                        selectedUpiPreset === preset
                          ? 'bg-teal-900 text-white'
                          : 'bg-sand text-teal-900 border border-border'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <input
                  type="number"
                  value={upiAmount}
                  onChange={(e) => handleUpiCustom(e.target.value)}
                  placeholder="Custom amount"
                  min="1"
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm mb-3 bg-white text-ink"
                />

                {/* Donate button */}
                <button
                  onClick={handleUpiDonate}
                  disabled={!upiAmount}
                  className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm mb-3 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  {L[6]} · ₹{upiAmount || '0'}
                </button>

                {/* UPI ID section */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-ink-muted mb-2">UPI ID:</p>
                  <div className="flex gap-2">
                    <p className="flex-1 bg-sand rounded-lg px-3 py-2 text-sm font-mono text-teal-900 break-all">
                      {config.upi_vpa}
                    </p>
                    <button
                      onClick={handleCopyUpi}
                      className="bg-gold text-teal-900 font-bold rounded-lg px-4 py-2 text-xs active:scale-[0.98] transition-transform whitespace-nowrap"
                    >
                      {copied ? '✓' : L[5]}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Buy Me a Coffee second for Indian users */}
            {config && (
              <div className="bg-white border border-border rounded-2xl p-5">
                <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
                  {L[2]} (International)
                </label>
                <button
                  onClick={() => openExternal(config.buymeacoffee_link)}
                  className="w-full bg-yellow-400 text-yellow-900 font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform"
                >
                  ☕ {L[3]}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Buy Me a Coffee first for international users */}
            {config && (
              <div className="bg-white border border-border rounded-2xl p-5 mb-4">
                <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
                  {L[2]}
                </label>
                <button
                  onClick={() => openExternal(config.buymeacoffee_link)}
                  className="w-full bg-yellow-400 text-yellow-900 font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform"
                >
                  ☕ {L[3]}
                </button>
              </div>
            )}

            {/* UPI second for international users */}
            {config && (
              <div className="bg-white border border-border rounded-2xl p-5">
                <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
                  {L[4]} (India)
                </label>

                {/* Presets */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {UPI_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleUpiPreset(preset)}
                      className={`text-xs font-bold rounded-lg py-2 transition-colors ${
                        selectedUpiPreset === preset
                          ? 'bg-teal-900 text-white'
                          : 'bg-sand text-teal-900 border border-border'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <input
                  type="number"
                  value={upiAmount}
                  onChange={(e) => handleUpiCustom(e.target.value)}
                  placeholder="Custom amount"
                  min="1"
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm mb-3 bg-white text-ink"
                />

                {/* Donate button */}
                <button
                  onClick={handleUpiDonate}
                  disabled={!upiAmount}
                  className="w-full bg-teal-900 text-white font-bold rounded-xl py-3 text-sm mb-3 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  {L[6]} · ₹{upiAmount || '0'}
                </button>

                {/* UPI ID section */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-ink-muted mb-2">UPI ID:</p>
                  <div className="flex gap-2">
                    <p className="flex-1 bg-sand rounded-lg px-3 py-2 text-sm font-mono text-teal-900 break-all">
                      {config.upi_vpa}
                    </p>
                    <button
                      onClick={handleCopyUpi}
                      className="bg-gold text-teal-900 font-bold rounded-lg px-4 py-2 text-xs active:scale-[0.98] transition-transform whitespace-nowrap"
                    >
                      {copied ? '✓' : L[5]}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Fallback if config not loaded */}
        {!config && (
          <div className="bg-white border border-border rounded-2xl p-4 text-center">
            <p className="text-sm text-ink-muted">Donation options unavailable. Please try again later.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
