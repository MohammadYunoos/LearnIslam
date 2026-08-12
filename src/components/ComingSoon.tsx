// src/components/ComingSoon.tsx
import { PageHeader } from './PageHeader'
import { BottomNav } from './BottomNav'
import { useTr } from '../i18n/useTr'

interface Props {
  title: string
  subtitle?: string
  icon?: string
  message?: string
  backTo?: string
  hideNav?: boolean
}

export function ComingSoon({
  title,
  subtitle,
  icon = '🚧',
  message = 'This section is coming soon in a future update, In sha Allah.',
  backTo,
  hideNav,
}: Props) {
  const tMessage = useTr(message)
  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title={title} subtitle={subtitle} backTo={backTo} />
      <div className="px-6 pt-16 text-center">
        <p className="text-5xl mb-4">{icon}</p>
        <p className="text-sm text-ink-muted leading-relaxed max-w-xs mx-auto">{tMessage}</p>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  )
}
