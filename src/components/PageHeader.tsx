// src/components/PageHeader.tsx
import { useNavigate } from 'react-router-dom'
import { useTr } from '../i18n/useTr'

interface Props {
  title: string
  subtitle?: string
  back?: boolean
  backTo?: string
  // Skip runtime translation — for titles already in the user's language
  // (e.g. a localized DB lesson title). Prevents MT re-garbling.
  noTranslate?: boolean
}

export function PageHeader({ title, subtitle, back = true, backTo, noTranslate }: Props) {
  const navigate = useNavigate()
  const trTitle = useTr(title)
  const trSub = useTr(subtitle ?? '')
  const tTitle = noTranslate ? title : trTitle
  const tSub = noTranslate ? subtitle ?? '' : trSub
  return (
    <div className="bg-teal-900 px-4 pt-10 pb-4 flex items-center gap-3 safe-top">
      {back && (
        <button
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-lg shrink-0"
          aria-label="Back"
        >
          ←
        </button>
      )}
      <div>
        <p className="font-arabic text-white text-xl font-bold leading-tight">{tTitle}</p>
        {subtitle && <p className="text-sand text-xs">{tSub}</p>}
      </div>
    </div>
  )
}
