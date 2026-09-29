// src/pages/Donations/DonationsPage.tsx
// Donations page: voluntary support through Razorpay or Buy Me a Coffee.
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
    'Islam Seeko is provided free of charge in BETA version. Your voluntary donations help support app development, content creation, hosting, and maintenance.',
    'Donations are optional and do not provide any additional features, content, or benefits.',
    'Keep Islamic learning free',
    'Your support helps maintain reliable access and create carefully reviewed learning resources.',
    'Learning',
    'More useful lessons',
    'Quality',
    'Careful content work',
    'Access',
    'Available to everyone',
    'Choose a way to support',
    'India',
    'Donate securely with Razorpay',
    'International',
    'Support through Buy Me a Coffee',
    'Support now',
    'Donation options are loading. Please try again shortly.',
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
    <div className="bg-cream min-h-screen pb-24 page-fade">
      <PageHeader title={tTitle} subtitle={L[2]} backTo="/home" />

      <main className="px-4 pt-5">
        <section className="relative overflow-hidden bg-teal-900 text-white border border-teal-700 rounded-lg px-5 py-6 shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 border border-gold/20 rotate-45 translate-x-12 -translate-y-12" aria-hidden="true" />
          <p className="text-[11px] font-bold uppercase text-gold tracking-wide mb-2">{L[2]}</p>
          <h1 className="font-arabic text-2xl font-bold leading-tight mb-3">{tTitle}</h1>
          <p className="text-sm text-sand leading-relaxed">{L[3]}</p>
        </section>

        <section className="grid grid-cols-3 border-y border-border my-5 py-4">
          {[
            [L[4], L[5]],
            [L[6], L[7]],
            [L[8], L[9]],
          ].map(([title, detail], index) => (
            <div key={title} className={`px-2 text-center ${index > 0 ? 'border-l border-border' : ''}`}>
              <p className="text-xs font-bold text-teal-900">{title}</p>
              <p className="text-[10px] text-ink-muted leading-snug mt-1">{detail}</p>
            </div>
          ))}
        </section>

        <blockquote className="reader-surface rounded-lg px-5 py-4 mb-6">
          <p className="text-sm text-teal-900 italic leading-relaxed">
            “{randomHadith.text}”
          </p>
          <footer className="text-[11px] font-semibold text-gold-dark mt-2">— {randomHadith.source}</footer>
        </blockquote>

        <h2 className="text-base font-bold text-teal-900 mb-3">{L[10]}</h2>

        {config?.razorpay_button_id && (
          <section className="bg-white border border-border rounded-lg p-4 mb-3 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-teal-900 text-white flex items-center justify-center font-bold" aria-hidden="true">₹</div>
              <div>
                <p className="text-sm font-bold text-teal-900">{L[11]}</p>
                <p className="text-xs text-ink-muted mt-0.5">{L[12]}</p>
              </div>
            </div>
            <form id="razorpay-form" />
          </section>
        )}

        {config?.buymeacoffee_link && (
          <section className="bg-white border border-border rounded-lg p-4 mb-3 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-gold text-teal-900 flex items-center justify-center font-bold" aria-hidden="true">$</div>
              <div>
                <p className="text-sm font-bold text-teal-900">{L[13]}</p>
                <p className="text-xs text-ink-muted mt-0.5">{L[14]}</p>
              </div>
            </div>
            <button
              onClick={() => openExternal(config.buymeacoffee_link)}
              className="w-full bg-gold text-teal-900 border border-gold-dark/20 font-bold rounded-lg py-3 text-sm shadow-sm"
            >
              {L[15]}
            </button>
          </section>
        )}

        {!config && (
          <div className="bg-white border border-border rounded-lg p-5 text-center">
            <div className="w-5 h-5 border-2 border-teal-900/20 border-t-teal-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-ink-muted">{L[16]}</p>
          </div>
        )}

        <div className="mt-5 border-t border-border pt-4 text-center">
          <p className="text-xs text-ink-muted leading-relaxed">{L[0]}</p>
          <p className="text-[11px] text-gold-dark mt-2">{L[1]}</p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
