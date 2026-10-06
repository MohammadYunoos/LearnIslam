// src/pages/Donations/DonationsPage.tsx
// Donations page: voluntary support via UPI (QR or manual) or Buy Me a Coffee.
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr } from '../../i18n/useTr'
import { openExternal } from '../../lib/external'
import { getDonationConfig } from '../../services/supabaseService'
import { logAnalyticsEvent } from '../../lib/analytics'

interface DonationConfig {
  buymeacoffee_link: string
  upi_vpa: string
}

const QR_IMAGE = `${import.meta.env.BASE_URL}QR/QR.jpg`

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
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'upi-id' | 'qr'>('upi-id')
  const [randomHadith] = useState(() =>
    HADITH_QUOTES[Math.floor(Math.random() * HADITH_QUOTES.length)]
  )

  const tTitle = useTr('Support Islam Seeko')

  // Load config
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

  const handleCopyVpa = async () => {
    if (!config?.upi_vpa) return
    try {
      await navigator.clipboard.writeText(config.upi_vpa)
      setCopied(true)
      void logAnalyticsEvent('donation_started', { method: 'upi' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }


  return (
    <div className="bg-cream min-h-screen pb-24 page-fade">
      <PageHeader title={tTitle} subtitle="Keep Islamic learning free" backTo="/home" />

      <main className="px-4 pt-5">
        <section className="relative overflow-hidden bg-teal-900 text-white border border-teal-700 rounded-lg px-5 py-6 shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 border border-gold/20 rotate-45 translate-x-12 -translate-y-12" aria-hidden="true" />
          <p className="text-[11px] font-bold uppercase text-gold tracking-wide mb-2">Keep Islamic learning free</p>
          <h1 className="font-arabic text-2xl font-bold leading-tight mb-3">{tTitle}</h1>
          <p className="text-sm text-sand leading-relaxed">Your support helps maintain reliable access and create carefully reviewed learning resources.</p>
        </section>

        <section className="grid grid-cols-3 border-y border-border my-5 py-4">
          {[
            ['Learning', 'More lessons'],
            ['Quality', 'Careful work'],
            ['Access', 'For everyone'],
          ].map(([title, detail], index) => (
            <div key={title} className={`px-2 text-center ${index > 0 ? 'border-l border-border' : ''}`}>
              <p className="text-xs font-bold text-teal-900">{title}</p>
              <p className="text-[10px] text-ink-muted leading-snug mt-1">{detail}</p>
            </div>
          ))}
        </section>

        <blockquote className="reader-surface rounded-lg px-5 py-4 mb-6">
          <p className="text-sm text-teal-900 italic leading-relaxed">
            "{randomHadith.text}"
          </p>
          <footer className="text-[11px] font-semibold text-gold-dark mt-2">— {randomHadith.source}</footer>
        </blockquote>

        <h2 className="text-base font-bold text-teal-900 mb-3">Choose a way to support</h2>

        {config?.upi_vpa && (
          <section className="bg-white border border-border rounded-lg mb-3 shadow-sm">
            <div className="flex items-start gap-3 p-4 pb-3">
              <div className="w-9 h-9 rounded-md bg-teal-900 text-white flex items-center justify-center font-bold" aria-hidden="true">₹</div>
              <div>
                <p className="text-sm font-bold text-teal-900">India</p>
                <p className="text-xs text-ink-muted mt-0.5">Send money via UPI</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 px-4 pb-4">
              <img
                src={QR_IMAGE}
                alt="UPI QR code"
                className="w-96 h-96 object-contain rounded-lg border border-border"
              />
            </div>

            <div className="flex border-t border-border">
              <button
                onClick={() => setActiveTab('upi-id')}
                className={`flex-1 px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'upi-id'
                    ? 'text-teal-900 border-b-teal-900'
                    : 'text-ink-muted border-b-transparent hover:bg-sand/30'
                }`}
              >
                UPI ID
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'qr'
                    ? 'text-teal-900 border-b-teal-900'
                    : 'text-ink-muted border-b-transparent hover:bg-sand/30'
                }`}
              >
                QR Code
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'upi-id' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-sand border border-border rounded-lg px-4 py-3">
                    <div>
                      <p className="text-[10px] text-ink-muted mb-1">UPI ID</p>
                      <p className="text-sm font-semibold text-teal-900 break-all">{config.upi_vpa}</p>
                    </div>
                    <button
                      onClick={handleCopyVpa}
                      className="text-xs font-bold text-teal-900 border border-teal-900/30 rounded-md px-3 py-1.5 ml-2 whitespace-nowrap"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-teal-900 mb-2">How to pay</p>
                    <ol className="list-decimal list-inside space-y-1.5">
                      <li className="text-[11px] text-ink-muted leading-relaxed">Install a UPI app (Google Pay, PhonePe, Paytm, BHIM) from the Play Store if you don't have one.</li>
                      <li className="text-[11px] text-ink-muted leading-relaxed">Open the app and go to Send Money or New Transfer.</li>
                      <li className="text-[11px] text-ink-muted leading-relaxed">Paste or type the UPI ID shown above.</li>
                      <li className="text-[11px] text-ink-muted leading-relaxed">Enter the amount you want to send.</li>
                      <li className="text-[11px] text-ink-muted leading-relaxed">Confirm with your UPI PIN.</li>
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === 'qr' && (
                <div>
                  <p className="text-xs font-bold text-teal-900 mb-3">How to pay</p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li className="text-[11px] text-ink-muted leading-relaxed">Install a UPI app (Google Pay, PhonePe, Paytm, BHIM) from the Play Store if you don't have one.</li>
                    <li className="text-[11px] text-ink-muted leading-relaxed">Take a screenshot of the QR code above.</li>
                    <li className="text-[11px] text-ink-muted leading-relaxed">Open your UPI app and look for Upload QR, Scan QR, or Paste QR option.</li>
                    <li className="text-[11px] text-ink-muted leading-relaxed">Select the QR code image from your gallery to upload it. UPI ID will auto-fill.</li>
                    <li className="text-[11px] text-ink-muted leading-relaxed">Enter the amount you want to send.</li>
                    <li className="text-[11px] text-ink-muted leading-relaxed">Confirm with your UPI PIN.</li>
                  </ol>
                </div>
              )}
            </div>
          </section>
        )}

        {config?.buymeacoffee_link && (
          <section className="bg-white border border-border rounded-lg p-4 mb-3 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-gold text-teal-900 flex items-center justify-center font-bold" aria-hidden="true">$</div>
              <div>
                <p className="text-sm font-bold text-teal-900">International</p>
                <p className="text-xs text-ink-muted mt-0.5">Support through Buy Me a Coffee</p>
              </div>
            </div>
            <button
              onClick={() => {
                void logAnalyticsEvent('donation_started', { method: 'buymeacoffee' })
                openExternal(config.buymeacoffee_link)
              }}
              className="w-full bg-gold text-teal-900 border border-gold-dark/20 font-bold rounded-lg py-3 text-sm shadow-sm"
            >
              Support now
            </button>
          </section>
        )}

        {!config && (
          <div className="bg-white border border-border rounded-lg p-5 text-center">
            <div className="w-5 h-5 border-2 border-teal-900/20 border-t-teal-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-ink-muted">Loading donation options...</p>
          </div>
        )}

        <div className="mt-5 border-t border-border pt-4 text-center">
          <p className="text-xs text-ink-muted leading-relaxed">Islam Seeko is provided free. Donations are optional and do not unlock content.</p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
