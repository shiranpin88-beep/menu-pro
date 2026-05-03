import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MenuCategory } from '@/lib/types'
import MenuListClient from './MenuListClient'

const categoryLabels: Record<MenuCategory, string> = {
  food: 'תפריט אוכל',
  alcohol: 'אלכוהול',
  wine: 'יין',
  desserts: 'קינוחים',
  sushi: 'סושי',
}

export default async function MenuCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  if (!['food', 'alcohol', 'wine', 'desserts', 'sushi'].includes(category)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category)
    .order('display_order', { ascending: true })

  return (
    <MenuListClient
      items={items || []}
      category={category as MenuCategory}
      categoryLabel={categoryLabels[category as MenuCategory]}
    />
  )
}
