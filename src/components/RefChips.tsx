// src/components/RefChips.tsx
import type { Reference } from '../content/guide'

// Shorten a reference for display: drop the explanatory clause after ':' and
// add "(ra)" for a named companion. Qur'an ayah refs are kept as-is.
export function shortRef(source: string): string {
  if (/^Qur/i.test(source)) return source.split('—')[0].trim()
  const head = source.split(':')[0].trim()
  if (head.includes('—') && !/\(ra\)/i.test(head)) return `${head} (ra)`
  return head
}

export function RefChips({ refs }: { refs?: Reference[] }) {
  // References (collections, narrators, Qur'an ayah refs) are proper nouns —
  // rendered as-is; MT was garbling them (e.g. "Qur'an" → "qaran").
  const labels = (refs ?? []).map((r) => shortRef(r.source))
  if (!refs || refs.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {refs.map((_, i) => (
        <span
          key={i}
          className="text-[10px] font-semibold text-teal-700 bg-teal-500/10 border border-teal-500/20 rounded-full px-2 py-0.5"
        >
          {labels[i]}
        </span>
      ))}
    </div>
  )
}
