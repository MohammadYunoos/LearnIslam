// src/pages/Wajifa/WajifaListPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BottomNav } from '../../components/BottomNav'
import { getWajifaCategories } from '../../services/supabaseService'

interface Category {
  id: number
  name: string
  arabic_text?: string
  description?: string
  target_count?: number
  icon?: string
}

export function WajifaListPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWajifaCategories().then((data) => {
      setCategories(data as Category[])
      setLoading(false)
    })
  }, [])

  return (
    <div className="bg-cream min-h-screen pb-20">
      <PageHeader title="Wajifa" subtitle="Tasbih and duas" backTo="/home" />

      <div className="px-4 pt-4">
        {loading && <p className="text-ink-muted text-sm text-center py-8">Loading…</p>}

        {!loading && categories.length === 0 && (
          <p className="text-ink-muted text-sm text-center py-8">No wajifa categories found.</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/wajifa/${cat.id}`)}
              className="bg-white border border-border rounded-2xl p-4 text-left active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-sand flex items-center justify-center text-lg mb-2">
                {cat.icon ?? '🤲'}
              </div>
              <p className="text-sm font-bold text-teal-900">{cat.name}</p>
              {cat.arabic_text && (
                <p className="font-arabic text-base text-ink mt-0.5">{cat.arabic_text}</p>
              )}
              {cat.target_count ? (
                <p className="text-xs text-gold-dark font-semibold mt-1">
                  Target: {cat.target_count}×
                </p>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
