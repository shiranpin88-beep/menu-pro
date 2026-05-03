import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MenuCategory } from '@/lib/types'
import MenuItemClient from './MenuItemClient'

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  const { category, id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: item }, { data: profile }, { data: allItems }] = await Promise.all([
    supabase.from('menu_items').select('*').eq('id', id).single(),
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase.from('menu_items').select('id').eq('category', category).order('display_order'),
  ])

  if (!item) notFound()

  const ids = (allItems ?? []).map((i: { id: string }) => i.id)
  const currentIndex = ids.indexOf(id)
  const prevId = currentIndex > 0 ? ids[currentIndex - 1] : null
  const nextId = currentIndex < ids.length - 1 ? ids[currentIndex + 1] : null

  return (
    <MenuItemClient
      item={item}
      category={category as MenuCategory}
      isAdmin={profile?.role === 'admin'}
      prevId={prevId}
      nextId={nextId}
    />
  )
}
