'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'

const menuSections = [
  {
    href: '/menu/food',
    label: 'תפריט אוכל',
    sublabel: 'מנות, רכיבים ואלרגיות',
    emoji: '🍽️',
    color: '#c4722a',
  },
  {
    href: '/menu/sushi',
    label: 'סושי',
    sublabel: 'רולים, ניגירי וסשימי',
    emoji: '🍣',
    color: '#4a8a7a',
  },
  {
    href: '/menu/desserts',
    label: 'קינוחים',
    sublabel: 'קינוחים ומתוקים',
    emoji: '🍮',
    color: '#a05c8a',
  },
  {
    href: '/menu/alcohol',
    label: 'אלכוהול',
    sublabel: 'קוקטיילים ומשקאות',
    emoji: '🍸',
    color: '#7a6abf',
  },
  {
    href: '/menu/wine',
    label: 'יין',
    sublabel: 'יינות לבנים, אדומים ורוזה',
    emoji: '🍷',
    color: '#8b3a3a',
  },
]

const otherSections = [
  {
    href: '/quizzes',
    label: 'מבחנים',
    sublabel: 'בדוק את הידע שלך',
    emoji: '📝',
  },
  {
    href: '/training',
    label: 'הדרכות',
    sublabel: 'חומרי לימוד ווידאו',
    emoji: '🎓',
  },
]

export default function HomeClient({ profile }: { profile: Profile | null }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'שלום'

  return (
    <div className="min-h-screen pb-8" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div>
          <p className="text-sm mb-1" style={{ color: '#a89880' }}>שלום, {firstName} 👋</p>
          <h1 className="text-xl font-semibold" style={{ color: '#f5f0e8' }}>Sun Young</h1>
        </div>
        <div className="flex items-center gap-3">
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: '#c4722a22', color: '#c4722a', border: '1px solid #c4722a44' }}
            >
              ניהול
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-full"
            style={{ background: '#33333388', color: '#a89880', border: '1px solid #333' }}
          >
            יציאה
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px mb-6" style={{ background: '#c4722a33' }} />

      {/* Menu sections */}
      <div className="px-6 mb-2">
        <p className="text-xs tracking-widest mb-4" style={{ color: '#a89880' }}>תפריטים</p>
        <div className="flex flex-col gap-3">
          {menuSections.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-98"
              style={{ background: '#242424', border: '1px solid #2e2e2e' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: s.color + '22' }}
              >
                {s.emoji}
              </div>
              <div className="flex-1">
                <p className="font-medium text-base" style={{ color: '#f5f0e8' }}>{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#a89880' }}>{s.sublabel}</p>
              </div>
              <span style={{ color: '#333' }}>←</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Other sections */}
      <div className="px-6 mt-6">
        <p className="text-xs tracking-widest mb-4" style={{ color: '#a89880' }}>למידה</p>
        <div className="grid grid-cols-2 gap-3">
          {otherSections.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl text-center transition-all active:scale-98"
              style={{ background: '#242424', border: '1px solid #2e2e2e' }}
            >
              <span className="text-3xl">{s.emoji}</span>
              <p className="font-medium text-sm" style={{ color: '#f5f0e8' }}>{s.label}</p>
              <p className="text-xs" style={{ color: '#a89880' }}>{s.sublabel}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
