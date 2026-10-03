// src/components/PageHeader.tsx
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTr } from '../i18n/useTr'
import { OverflowMarquee } from './OverflowMarquee'

interface Props {
  title: string
  subtitle?: string
  back?: boolean
  backTo?: string
  // Skip runtime translation — for titles already in the user's language
  // (e.g. a localized DB lesson title). Prevents MT re-garbling.
  noTranslate?: boolean
  rightAction?: ReactNode
  compact?: boolean
  marqueeTitle?: boolean
}

export function PageHeader({ title, subtitle, back = true, backTo, noTranslate, rightAction, compact = false, marqueeTitle = false }: Props) {
  const navigate = useNavigate()
  const trTitle = useTr(title)
  const trSub = useTr(subtitle ?? '')
  const tTitle = noTranslate ? title : trTitle
  const tSub = noTranslate ? subtitle ?? '' : trSub
  return (
    <div className={compact
      ? 'compact-safe-top bg-teal-900 px-3 pb-2 flex items-center gap-2 border-b border-white/10'
      : 'bg-teal-900 px-4 pt-10 pb-4 flex items-center gap-3 safe-top'}>
      {back && (
        <button
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className={`${compact ? 'w-7 h-7 text-base' : 'w-8 h-8 text-lg'} rounded-full bg-white/10 flex items-center justify-center text-white shrink-0`}
          aria-label="Back"
        >
          ←
        </button>
      )}
      <div className="flex-1 min-w-0">
        {marqueeTitle ? (
          <OverflowMarquee
            text={tTitle}
            className={`${compact ? 'font-sans text-sm' : 'font-arabic text-xl'} text-white font-bold leading-tight`}
          />
        ) : (
          <p className={`${compact ? 'font-sans text-sm truncate' : 'font-arabic text-xl'} text-white font-bold leading-tight`}>{tTitle}</p>
        )}
        {subtitle && <p className="text-sand text-xs">{tSub}</p>}
      </div>
      {rightAction}
    </div>
  )
}
