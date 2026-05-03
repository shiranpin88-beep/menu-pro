import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditMenuItemClient from './EditMenuItemClient'

export default async function EditMenuItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { id } = await params
  const { category } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/home')

  const { data: item } = await supabase.from('menu_items').select('*').eq('id', id).single()
  if (!item) notFound()

  return <EditMenuItemClient item={item} category={category || item.category} />
}
