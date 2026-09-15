// src/pages/Settings/TermsPage.tsx
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr } from '../../i18n/useTr'

export function TermsPage() {
  const tTerms = useTr('Terms & Conditions')

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={tTerms} backTo="/settings" />

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
          <section>
            <h2 className="font-bold text-teal-900 mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm text-ink leading-relaxed">
              By using Islam Seeko, you agree to abide by these Terms & Conditions and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">2. User Accounts</h2>
            <p className="text-sm text-ink leading-relaxed">
              You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">3. Use License</h2>
            <p className="text-sm text-ink leading-relaxed">
              Permission is granted to access the material (information or content) on Islam Seeko for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="text-sm text-ink leading-relaxed list-disc list-inside mt-2 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">4. Limitation of Liability</h2>
            <p className="text-sm text-ink leading-relaxed">
              The materials on Islam Seeko are provided on an 'as is' basis. Islam Seeko makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">5. Accuracy of Materials</h2>
            <p className="text-sm text-ink leading-relaxed">
              The materials appearing on Islam Seeko could include technical, typographical, or photographic errors. Islam Seeko does not warrant that any of the materials on its website are accurate, complete, or current. Islam Seeko may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">6. Links</h2>
            <p className="text-sm text-ink leading-relaxed">
              Islam Seeko has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Islam Seeko of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">7. Modifications</h2>
            <p className="text-sm text-ink leading-relaxed">
              Islam Seeko may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-teal-900 mb-2">8. Governing Law</h2>
            <p className="text-sm text-ink leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Islam Seeko operates.
            </p>
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
