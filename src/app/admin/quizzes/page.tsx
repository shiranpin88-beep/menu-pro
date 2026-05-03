import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminQuizzesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/home')

  return (
    <div className="min-h-screen pb-8" style={{ background: '#1a1a1a' }}>
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <Link href="/admin" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#242424', border: '1px solid #333' }}>
          <span style={{ color: '#f5f0e8' }}>→</span>
        </Link>
        <h1 className="text-xl font-semibold" style={{ color: '#f5f0e8' }}>ניהול מבחנים</h1>
      </div>
      <div className="mx-6 h-px mb-6" style={{ background: '#c4722a33' }} />
      <div className="px-6 flex flex-col items-center justify-center py-12 gap-3">
        <span className="text-5xl opacity-30">📝</span>
        <p className="text-sm" style={{ color: '#a89880' }}>ניהול מבחנים — בקרוב</p>
        <p className="text-xs text-center" style={{ color: '#555' }}>כרגע ניתן להוסיף מבחנים ישירות דרך Supabase</p>
      </div>
    </div>
  )
}
