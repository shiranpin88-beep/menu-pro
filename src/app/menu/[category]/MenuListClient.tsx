'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MenuItem, MenuCategory } from '@/lib/types'

const categoryColors: Record<MenuCategory, string> = {
  food: '#c4722a',
  alcohol: '#7a6abf',
  wine: '#8b3a3a',
  desserts: '#a05c8a',
  sushi: '#4a8a7a',
}

const categoryEmojis: Record<MenuCategory, string> = {
  food: '🍽️',
  alcohol: '🍸',
  wine: '🍷',
  desserts: '🍮',
  sushi: '🍣',
}

const wineTypeColors: Record<string, string> = {
  'אדום': '#8b3a3a',
  'רוזה': '#c4607a',
  'לבן': '#a89450',
}

function getWineType(flavorProfile: string): string | null {
  if (!flavorProfile) return null
  if (flavorProfile.includes('אדום')) return 'אדום'
  if (flavorProfile.includes('רוזה')) return 'רוזה'
  if (flavorProfile.includes('לבן')) return 'לבן'
  return null
}

function getAlcoholType(flavorProfile: string): string | null {
  if (!flavorProfile) return null
  if (flavorProfile.includes('בירה')) return flavorProfile.split('|')[1]?.trim() || 'בירה'
  if (flavorProfile.includes('סאקה')) return flavorProfile.split('|')[1]?.trim() || 'סאקה'
  return null
}

export default function MenuListClient({
  items,
  category,
  categoryLabel,
}: {
  items: MenuItem[]
  category: MenuCategory
  categoryLabel: string
}) {
  const router = useRouter()
  const color = categoryColors[category]
  const [filter, setFilter] = useState<string | null>(null)

  // Wine filters
  const wineFilters = category === 'wine' ? ['אדום', 'רוזה', 'לבן'] : []
  const alcoholFilters = category === 'alcohol' ? ['בירה', 'סאקה'] : []
  const filters = [...wineFilters, ...alcoholFilters]

  const filteredItems = filter
    ? items.filter(item => item.flavor_profile?.includes(filter))
    : items

  return (
    <div className="min-h-screen pb-8" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#242424', border: '1px solid #333' }}
        >
          <span style={{ color: '#f5f0e8' }}>→</span>
        </button>
        <div>
          <p className="text-xs tracking-widest" style={{ color: '#a89880' }}>
            {categoryEmojis[category]} {categoryLabel}
          </p>
          <p className="text-sm mt-0.5" style={{ color: '#a89880' }}>
            {filteredItems.length} פריטים
          </p>
        </div>
      </div>

      <div className="mx-6 h-px mb-4" style={{ background: color + '33' }} />

      {/* Filter tabs */}
      {filters.length > 0 && (
        <div className="px-6 flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter(null)}
            className="px-4 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              background: filter === null ? color : '#242424',
              color: filter === null ? '#f5f0e8' : '#a89880',
              border: `1px solid ${filter === null ? color : '#333'}`,
            }}
          >
            הכל
          </button>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(filter === f ? null : f)}
              className="px-4 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-all"
              style={{
                background: filter === f ? color : '#242424',
                color: filter === f ? '#f5f0e8' : '#a89880',
                border: `1px solid ${filter === f ? color : '#333'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-5xl opacity-30">{categoryEmojis[category]}</span>
          <p style={{ color: '#a89880' }}>אין פריטים עדיין</p>
        </div>
      ) : (
        <div className="px-6 flex flex-col gap-3">
          {filteredItems.map(item => {
            const wineType = category === 'wine' ? getWineType(item.flavor_profile) : null
            const wineColor = wineType ? wineTypeColors[wineType] : color
            const alcoholType = category === 'alcohol' ? getAlcoholType(item.flavor_profile) : null
            const isSake = item.flavor_profile?.includes('סאקה')
            const isBeer = item.flavor_profile?.includes('בירה')
            const subLabel = alcoholType || null

            return (
              <Link
                key={item.id}
                href={`/menu/${category}/${item.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-98"
                style={{ background: '#242424', border: '1px solid #2e2e2e' }}
              >
                {/* Image / Icon */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: (wineColor || color) + '22' }}
                >
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-2xl">
                      {wineType === 'אדום' ? '🍷' :
                       wineType === 'רוזה' ? '🌸' :
                       wineType === 'לבן' ? '🥂' :
                       isSake ? '🍶' :
                       isBeer ? '🍺' :
                       categoryEmojis[category]}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-base truncate" style={{ color: '#f5f0e8' }}>
                    {item.name}
                  </p>
                  {item.ingredients && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#a89880' }}>
                      {item.ingredients}
                    </p>
                  )}
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {wineType && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: wineColor + '22', color: wineColor }}>
                        {wineType}
                      </span>
                    )}
                    {subLabel && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: color + '22', color }}>
                        {subLabel}
                      </span>
                    )}
                    {item.allergies?.includes('כשר') && !item.allergies?.includes('לא כשר') && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#2a4a2a', color: '#7ada7a' }}>
                        כשר
                      </span>
                    )}
                  </div>
                </div>

                <span style={{ color: '#333' }}>←</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
