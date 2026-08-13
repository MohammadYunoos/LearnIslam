// src/components/PageHeader.tsx
import { useNavigate } from 'react-router-dom'
import { useTr } from '../i18n/useTr'

interface Props {
  title: string
  subtitle?: string
  back?: boolean
  backTo?: string
}

export function PageHeader({ title, subtitle, back = true, backTo }: Props) {
  const navigate = useNavigate()
  const tTitle = useTr(title)
  const tSub = useTr(subtitle ?? '')
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
