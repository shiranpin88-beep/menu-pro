import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AddUserForm from './AddUserForm'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/home')

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pb-8" style={{ background: '#1a1a1a' }}>
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <Link
          href="/admin"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#242424', border: '1px solid #333' }}
        >
          <span style={{ color: '#f5f0e8' }}>→</span>
        </Link>
        <h1 className="text-xl font-semibold" style={{ color: '#f5f0e8' }}>ניהול משתמשים</h1>
      </div>

      <div className="mx-6 h-px mb-6" style={{ background: '#c4722a33' }} />

      {/* Add user form */}
      <div className="px-6 mb-6">
        <AddUserForm />
      </div>

      {/* Users list */}
      <div className="px-6 flex flex-col gap-2">
        <p className="text-xs tracking-widest mb-2" style={{ color: '#a89880' }}>
          משתמשים קיימים ({users?.length || 0})
        </p>
        {users?.map(u => {
          const roleLabel: Record<string, string> = {
            admin: 'אדמין', waiter: 'מלצר', bartender: 'ברמן',
            hostess: 'מארחת', shift_manager: 'מנהל משמרת', employee: 'עובד',
          }
          const isAdmin = u.role === 'admin'
          const isManager = u.role === 'shift_manager'
          return (
            <div
              key={u.id}
              className="p-4 rounded-xl flex items-center justify-between gap-3"
              style={{ background: '#242424', border: '1px solid #2e2e2e' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#f5f0e8' }}>{u.full_name || '—'}</p>
                <p className="text-xs mt-0.5" style={{ color: '#a89880' }}>{u.email}</p>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: isAdmin ? '#c4722a22' : isManager ? '#7a6abf22' : '#33333388',
                  color: isAdmin ? '#c4722a' : isManager ? '#9a8acf' : '#a89880',
                }}
              >
                {roleLabel[u.role] ?? u.role}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
