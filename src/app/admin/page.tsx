import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/home')

  const [{ count: usersCount }, { count: itemsCount }, { count: quizzesCount }, { count: trainingsCount }] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('quizzes').select('*', { count: 'exact', head: true }),
      supabase.from('training_materials').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    { label: 'משתמשים', count: usersCount || 0, href: '/admin/users', emoji: '👥' },
    { label: 'מנות', count: itemsCount || 0, href: '/admin/menu', emoji: '🍽️' },
    { label: 'מבחנים', count: quizzesCount || 0, href: '/admin/quizzes', emoji: '📝' },
    { label: 'הדרכות', count: trainingsCount || 0, href: '/admin/training', emoji: '🎓' },
  ]

  return (
    <div className="min-h-screen pb-8" style={{ background: '#1a1a1a' }}>
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <Link
          href="/home"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#242424', border: '1px solid #333' }}
        >
          <span style={{ color: '#f5f0e8' }}>→</span>
        </Link>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#f5f0e8' }}>ניהול</h1>
          <p className="text-xs mt-0.5" style={{ color: '#a89880' }}>פאנל אדמין</p>
        </div>
      </div>

      <div className="mx-6 h-px mb-6" style={{ background: '#c4722a33' }} />

      <div className="px-6 grid grid-cols-2 gap-3">
        {stats.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="p-5 rounded-2xl flex flex-col gap-2 transition-all active:scale-98"
            style={{ background: '#242424', border: '1px solid #2e2e2e' }}
          >
            <span className="text-3xl">{s.emoji}</span>
            <p className="text-2xl font-bold" style={{ color: '#c4722a' }}>{s.count}</p>
            <p className="text-sm" style={{ color: '#a89880' }}>{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
