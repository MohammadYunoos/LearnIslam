// src/pages/Settings/DisclaimerPage.tsx
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr } from '../../i18n/useTr'

export function DisclaimerPage() {
  const tDisclaimer = useTr('Disclaimer')

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={tDisclaimer} backTo="/settings" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
          <section>
            <h2 className="font-bold text-teal-900 mb-2">Educational Content</h2>
            <p className="text-sm text-ink leading-relaxed">
              Islam Seeko provides Islamic educational content for personal learning and spiritual development. While we strive to present accurate and authentic Islamic teachings, all religious content should be verified with qualified Islamic scholars and authorities in your community.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">Not a Substitute for Professional Advice</h2>
            <p className="text-sm text-ink leading-relaxed">
              The content provided on Islam Seeko is for informational and educational purposes only. It is not intended as a substitute for professional Islamic guidance, fatwa (legal ruling), or consultation with qualified scholars. For matters of significant religious importance, please consult with qualified Islamic scholars or your local community leaders.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">Diversity of Islamic Schools</h2>
            <p className="text-sm text-ink leading-relaxed">
              Islam Seeko presents teachings from various Islamic schools of thought (madhabs) and scholarly interpretations. Differences in opinion among scholars are normal and respected in Islamic tradition. Users are encouraged to learn from multiple sources and consult with scholars of their preferred school of thought.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">Limitation of Liability</h2>
            <p className="text-sm text-ink leading-relaxed">
              Islam Seeko and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the materials, even if Islam Seeko has been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">Third-Party Content</h2>
            <p className="text-sm text-ink leading-relaxed">
              Islam Seeko may include links to third-party websites, resources, and external content. We do not endorse or take responsibility for the content on these external sites. Please review the policies of any external sites before using them.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">Medical or Legal Advice</h2>
            <p className="text-sm text-ink leading-relaxed">
              Nothing on Islam Seeko should be construed as medical, legal, or professional advice. Always consult qualified professionals for medical, legal, or other professional matters.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">Changes to Content</h2>
            <p className="text-sm text-ink leading-relaxed">
              Islam Seeko reserves the right to modify, update, or remove content at any time. While we strive to maintain accuracy, we do not guarantee that all information is up-to-date or error-free.
            </p>
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
