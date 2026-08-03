// src/components/RefChips.tsx
import type { Reference } from '../content/guide'

export function RefChips({ refs }: { refs?: Reference[] }) {
  if (!refs || refs.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {refs.map((r, i) => (
        <span
          key={i}
          className="text-[10px] font-semibold text-teal-700 bg-teal-500/10 border border-teal-500/20 rounded-full px-2 py-0.5"
        >
          {r.source}
        </span>
      ))}
    </div>
  )
}
