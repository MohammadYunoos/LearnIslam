// src/pages/Plans/PlansPage.tsx
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { useTr, useTrList } from '../../i18n/useTr'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    highlight: false,
    features: ['Basic Maqtab lessons', 'Basic Hifz surahs', '5 Masail questions / month', 'Progress tracking'],
  },
  {
    name: 'Premium',
    price: 'Coming soon',
    highlight: true,
    features: ['All Maqtab lessons', 'Full Hifz library', 'Unlimited Masail questions', 'Direct Ulema messaging'],
  },
]

export function PlansPage() {
  const names = useTrList(PLANS.map((p) => p.name))
  const allFeatures = PLANS.flatMap((p) => p.features)
  const trFeatures = useTrList(allFeatures)
  const fMap = new Map(allFeatures.map((f, i) => [f, trFeatures[i]]))
  const tComingSoon = useTr('Coming soon')
  const tFooter = useTr('Premium is not available during alpha testing.')
  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Plans" subtitle="Choose your plan" backTo="/settings" />

      <div className="px-4 pt-4 space-y-4">
        {PLANS.map((plan, pi) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-5 border ${
              plan.highlight ? 'bg-teal-900 border-gold' : 'bg-white border-border'
            }`}
          >
            <div className="flex justify-between items-baseline mb-3">
              <p
                className={`text-lg font-bold ${plan.highlight ? 'text-gold' : 'text-teal-900'}`}
              >
                {names[pi]}
              </p>
              <p className={`text-sm font-bold ${plan.highlight ? 'text-white' : 'text-ink'}`}>
                {plan.price === 'Coming soon' ? tComingSoon : plan.price}
              </p>
            </div>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className={`text-sm flex items-center gap-2 ${
                    plan.highlight ? 'text-sand' : 'text-ink-muted'
                  }`}
                >
                  <span className="text-gold">✓</span>
                  {fMap.get(f) ?? f}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="text-center text-xs text-ink-muted mt-2 px-6">{tFooter}</p>
      </div>

      <BottomNav />
    </div>
  )
}
