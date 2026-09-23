// src/pages/Donations/DonationsPage.tsx
// Donations page: Razorpay payment button
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr, useTrList } from '../../i18n/useTr'
import { openExternal } from '../../lib/external'
import { getDonationConfig } from '../../services/supabaseService'

interface DonationConfig {
  buymeacoffee_link: string
  upi_vpa: string
  razorpay_button_id?: string
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
  const [randomHadith] = useState(() =>
    HADITH_QUOTES[Math.floor(Math.random() * HADITH_QUOTES.length)]
  )

  const tTitle = useTr('Support Islam Seeko')
  const L = useTrList([
    'Islam Seeko is provided free of charge. Your voluntary donations help support app development, content creation, hosting, and maintenance.',
    'Donations are optional and do not provide any additional features, content, or benefits.',
  ])

  // Load config + record donation timestamp
  useEffect(() => {
    const init = async () => {
      try {
        const data = await getDonationConfig()
        setConfig(data)
      } catch {
        /* config unavailable */
      }

      // Record donation timestamp for 7-day reminder
      localStorage.setItem('mymaqtab_donation_time', Date.now().toString())
    }
    init()
  }, [])

  // Load Razorpay script when config is available
  useEffect(() => {
    if (!config?.razorpay_button_id) return

    const form = document.getElementById('razorpay-form')
    if (!form) return

    form.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js'
    script.async = true
    script.setAttribute('data-payment_button_id', config.razorpay_button_id)

    form.appendChild(script)
  }, [config])

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

        {/* Razorpay Donate Button */}
        {config?.razorpay_button_id && (
          <div className="bg-white border border-border rounded-2xl p-5 mb-4">
            <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
              For Indians - 💳 Donate with Razorpay
            </label>
            <form id="razorpay-form" />
          </div>
        )}

        {/* Buy Me a Coffee Button */}
        {config?.buymeacoffee_link && (
          <div className="bg-white border border-border rounded-2xl p-5 mb-4">
            <label className="block text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">
              For Internationals - ☕ Buy Me a Coffee
            </label>
            <button
              onClick={() => openExternal(config.buymeacoffee_link)}
              className="w-full bg-yellow-400 text-yellow-900 font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform"
            >
              Support via Buy Me a Coffee
            </button>
          </div>
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
