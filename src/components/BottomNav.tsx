// src/components/BottomNav.tsx
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Home', icon: '🏠', path: '/home' },
  { label: 'Maqtab', icon: '📖', path: '/maqtab' },
  { label: 'Hifz', icon: '⭐', path: '/hifz' },
  { label: 'Ulema', icon: '🕌', path: '/ulema' },
  { label: 'Messages', icon: '💬', path: '/messages' },
  { label: 'Analyzer', icon: '📊', path: '/analyzer' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-40 max-w-lg mx-auto">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname.startsWith(item.path)
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-2 pb-4 text-xs font-semibold transition-colors ${
              active ? 'text-teal-900' : 'text-ink-muted'
            }`}
          >
            <span className="text-base mb-0.5">{item.icon}</span>
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
