// src/pages/Settings/ContactPage.tsx
import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr, useTrList } from '../../i18n/useTr'
import { openExternal } from '../../lib/external'

export function ContactPage() {
  const tContact = useTr('Contact Us')
  const [copied, setCopied] = useState<string | null>(null)

  const L = useTrList([
    'Email',
    'Website',
    'Send email',
    'Copy email',
    'Email copied to clipboard',
  ])

  const CONTACT_EMAIL = 'support@islamseeko.com'
  const CONTACT_WEBSITE = 'https://islamseeko.com'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL)
    setCopied('email')
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSendEmail = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}`
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={tContact} backTo="/settings" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-5 mb-4">
          <p className="text-sm text-ink leading-relaxed mb-4">
            Have questions, feedback, or need assistance? Reach out to us through any of the following channels.
          </p>

          {/* Email section */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-teal-700 mb-2 uppercase tracking-wide">
              {L[0]}
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleSendEmail}
                className="flex-1 bg-teal-900 text-white font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform"
              >
                ✉ {L[2]}
              </button>
              <button
                onClick={handleCopyEmail}
                className="flex-1 bg-gold text-teal-900 font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform"
              >
                {copied === 'email' ? L[4] : L[3]}
              </button>
            </div>
            <p className="text-xs text-ink-muted mt-2 text-center">{CONTACT_EMAIL}</p>
          </div>

          {/* Website section */}
          <div>
            <label className="block text-xs font-semibold text-teal-700 mb-2 uppercase tracking-wide">
              {L[1]}
            </label>
            <button
              onClick={() => openExternal(CONTACT_WEBSITE)}
              className="w-full bg-white border border-teal-700 text-teal-900 font-bold rounded-xl py-3 text-sm active:scale-[0.98] transition-transform"
            >
              🌐 Visit Website
            </button>
            <p className="text-xs text-ink-muted mt-2 text-center">{CONTACT_WEBSITE}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-900 leading-relaxed">
            We value your feedback and suggestions. Your input helps us improve Islam Seeko and better serve the community. Don't hesitate to reach out!
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
