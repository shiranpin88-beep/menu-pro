'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MenuItem, MenuCategory } from '@/lib/types'

const categoryColors: Record<MenuCategory, string> = {
  food: '#c4722a',
  alcohol: '#7a6abf',
  wine: '#8b3a3a',
  desserts: '#a05c8a',
  sushi: '#4a8a7a',
}

function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#000000f5' }}>
      <div className="relative w-full h-full" onClick={onClose}>
        <Image key={images[index]} src={images[index]} alt="" fill className="object-contain" unoptimized />
      </div>
      <button onClick={onClose}
        className="absolute top-12 right-5 w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{ background: '#ffffff22', border: '1px solid #ffffff44' }}>
        <span style={{ color: '#fff', fontSize: 16 }}>✕</span>
      </button>
      {index > 0 && (
        <button onClick={e => { e.stopPropagation(); setIndex(i => i - 1) }}
          className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
          style={{ background: '#ffffff22' }}>
          <span style={{ color: '#fff', fontSize: 22 }}>→</span>
        </button>
      )}
      {index < images.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIndex(i => i + 1) }}
          className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
          style={{ background: '#ffffff22' }}>
          <span style={{ color: '#fff', fontSize: 22 }}>←</span>
        </button>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setIndex(i) }}
              className="rounded-full transition-all"
              style={{ width: i === index ? 20 : 8, height: 8, background: i === index ? '#fff' : '#ffffff55' }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MenuItemClient({
  item, category, isAdmin, prevId, nextId,
}: {
  item: MenuItem
  category: MenuCategory
  isAdmin: boolean
  prevId: string | null
  nextId: string | null
}) {
  const router = useRouter()
  const color = categoryColors[category]
  const [imgIndex, setImgIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef(0)

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < 50) return
    if (diff > 0 && imgIndex < images.length - 1) setImgIndex(i => i + 1)
    if (diff < 0 && imgIndex > 0) setImgIndex(i => i - 1)
  }

  const images = [item.image_url, item.image_url_2, item.image_url_3].filter(Boolean) as string[]
  const flavors = item.flavor_profile ? item.flavor_profile.split(',').map(f => f.trim()).filter(Boolean) : []
  const allergies = item.allergies ? item.allergies.split(',').map(a => a.trim()).filter(Boolean) : []

  return (
    <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
      {lightboxOpen && images.length > 0 && (
        <Lightbox images={images} startIndex={imgIndex} onClose={() => setLightboxOpen(false)} />
      )}

      {/* ── Image hero ── */}
      <div
        className="relative w-full"
        style={{ height: '50vh', minHeight: 300, background: '#111' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <>
            <Image
              key={images[imgIndex]}
              src={images[imgIndex]}
              alt={item.name}
              fill
              className="object-cover"
              unoptimized
            />
            {/* tap → lightbox */}
            <div className="absolute inset-0 z-10" onClick={() => setLightboxOpen(true)} />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl opacity-15">🍽️</span>
          </div>
        )}

        {/* top gradient */}
        <div className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #000000aa, transparent)' }} />

        {/* bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-28 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #1a1a1a, transparent)' }} />

        {/* back button */}
        <button onClick={() => router.back()}
          className="absolute top-10 right-4 w-9 h-9 rounded-full flex items-center justify-center z-30"
          style={{ background: '#00000066', backdropFilter: 'blur(10px)', border: '1px solid #ffffff22' }}>
          <span style={{ color: '#fff', fontSize: 16 }}>→</span>
        </button>

        {/* image prev/next arrows */}
        {images.length > 1 && imgIndex > 0 && (
          <button
            onClick={e => { e.stopPropagation(); setImgIndex(i => i - 1) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-30"
            style={{ background: '#000000aa', backdropFilter: 'blur(4px)', border: '1px solid #ffffff33' }}>
            <span style={{ color: '#fff', fontSize: 20 }}>›</span>
          </button>
        )}
        {images.length > 1 && imgIndex < images.length - 1 && (
          <button
            onClick={e => { e.stopPropagation(); setImgIndex(i => i + 1) }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-30"
            style={{ background: '#000000aa', backdropFilter: 'blur(4px)', border: '1px solid #ffffff33' }}>
            <span style={{ color: '#fff', fontSize: 20 }}>‹</span>
          </button>
        )}

        {/* image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-30">
            {images.map((_, i) => (
              <div key={i} className="rounded-full transition-all"
                style={{ width: i === imgIndex ? 20 : 7, height: 7, background: i === imgIndex ? '#fff' : '#ffffff55' }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Item navigation arrows ── */}
      {(prevId || nextId) && (
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          {nextId ? (
            <button
              onClick={() => router.replace(`/menu/${category}/${nextId}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium"
              style={{ background: '#242424', color: color, border: `1px solid ${color}33` }}>
              <span style={{ fontSize: 18 }}>←</span>
              <span>הבאה</span>
            </button>
          ) : <div />}
          {prevId ? (
            <button
              onClick={() => router.replace(`/menu/${category}/${prevId}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium"
              style={{ background: '#242424', color: color, border: `1px solid ${color}33` }}>
              <span>הקודמת</span>
              <span style={{ fontSize: 18 }}>→</span>
            </button>
          ) : <div />}
        </div>
      )}

      {/* ── Content ── */}
      <div className="px-5 pt-3 pb-12">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-2xl font-bold leading-snug" style={{ color: '#f5f0e8' }}>{item.name}</h1>
          {isAdmin && (
            <Link href={`/admin/menu/${item.id}/edit?category=${category}`}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium mt-1"
              style={{ background: '#c4722a22', color: '#c4722a', border: '1px solid #c4722a44' }}>
              ✏️ עריכה
            </Link>
          )}
        </div>

        {flavors.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5">
            {flavors.map(f => (
              <span key={f} className="text-xs px-3 py-1 rounded-full"
                style={{ background: color + '22', color, border: `1px solid ${color}33` }}>
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="h-px mb-5" style={{ background: '#2e2e2e' }} />

        <Section title="תיאור המנה">
          <p className="text-sm leading-relaxed" style={{ color: '#d4c9b8' }}>{item.description}</p>
        </Section>

        <Section title="רכיבים">
          <p className="text-sm leading-relaxed" style={{ color: '#d4c9b8' }}>{item.ingredients}</p>
        </Section>

        {item.notes && (
          <Section title="שינויים אפשריים">
            <p className="text-sm leading-relaxed" style={{ color: '#d4c9b8' }}>{item.notes}</p>
          </Section>
        )}

        {allergies.length > 0 && (
          <Section title="אלרגיות">
            <div className="flex gap-2 flex-wrap">
              {allergies.map(a => (
                <span key={a} className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: '#e0404022', color: '#e07070', border: '1px solid #e0404033' }}>
                  ⚠️ {a}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-xs tracking-widest mb-2" style={{ color: '#a89880' }}>{title}</p>
      {children}
    </div>
  )
}
