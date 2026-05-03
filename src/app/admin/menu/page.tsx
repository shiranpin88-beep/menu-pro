import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AddMenuItemForm from './AddMenuItemForm'

export default async function AdminMenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/home')

  const { data: items } = await supabase
    .from('menu_items')
    .select('id, name, category, display_order')
    .order('category')
    .order('display_order')

  const categoryLabels: Record<string, string> = {
    food: 'אוכל', alcohol: 'אלכוהול', wine: 'יין', desserts: 'קינוחים', sushi: 'סושי',
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: '#1a1a1a' }}>
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <Link href="/admin" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#242424', border: '1px solid #333' }}>
          <span style={{ color: '#f5f0e8' }}>→</span>
        </Link>
        <h1 className="text-xl font-semibold" style={{ color: '#f5f0e8' }}>ניהול תפריט</h1>
      </div>

      <div className="mx-6 h-px mb-6" style={{ background: '#c4722a33' }} />

      <div className="px-6 mb-6">
        <AddMenuItemForm />
      </div>

      <div className="px-6 flex flex-col gap-2">
        <p className="text-xs tracking-widest mb-2" style={{ color: '#a89880' }}>מנות קיימות ({items?.length || 0})</p>
        {items?.map(item => (
          <Link
            key={item.id}
            href={`/admin/menu/${item.id}/edit?category=${item.category}`}
            className="p-3 rounded-xl flex items-center justify-between"
            style={{ background: '#242424', border: '1px solid #2e2e2e' }}
          >
            <p className="text-sm" style={{ color: '#f5f0e8' }}>{item.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#33333388', color: '#a89880' }}>
                {categoryLabels[item.category] ?? item.category}
              </span>
              <span style={{ color: '#a89880', fontSize: 14 }}>←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
