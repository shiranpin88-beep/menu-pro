'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { MenuItem } from '@/lib/types'

type ImageSlot = { file: File | null; preview: string | null; url: string | null }

export default function EditMenuItemClient({
  item,
  category,
}: {
  item: MenuItem
  category: string
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: item.name,
    ingredients: item.ingredients || '',
    description: item.description || '',
    allergies: item.allergies || '',
    flavor_profile: item.flavor_profile || '',
    notes: item.notes || '',
  })
  const [images, setImages] = useState<ImageSlot[]>([
    { file: null, preview: item.image_url, url: item.image_url },
    { file: null, preview: item.image_url_2, url: item.image_url_2 },
    { file: null, preview: item.image_url_3, url: item.image_url_3 },
  ])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  function handleImageChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImages(imgs => imgs.map((img, i) =>
      i === index ? { ...img, file, preview: URL.createObjectURL(file) } : img
    ))
  }

  function handleRemoveImage(index: number) {
    setImages(imgs => imgs.map((img, i) =>
      i === index ? { file: null, preview: null, url: null } : img
    ))
  }

  async function uploadImage(slot: ImageSlot, index: number): Promise<string | null> {
    if (slot.file) {
      const supabase = createClient()
      const ext = slot.file.name.split('.').pop()
      const suffix = index === 0 ? '' : `-${index + 1}`
      const path = `menu/${item.id}${suffix}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('menu-images').upload(path, slot.file)
      if (error) throw new Error(error.message)
      const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
      return data.publicUrl
    }
    return slot.url
  }

  async function handleSave() {
    setLoading(true)
    setMessage('')
    try {
      const [url1, url2, url3] = await Promise.all(images.map((s, i) => uploadImage(s, i)))
      const supabase = createClient()
      const { error } = await supabase
        .from('menu_items')
        .update({ ...form, image_url: url1, image_url_2: url2, image_url_3: url3 })
        .eq('id', item.id)
      if (error) { setMessage('שגיאה בשמירה: ' + error.message); setLoading(false); return }
      router.push(`/menu/${category}/${item.id}`)
      router.refresh()
    } catch (e: unknown) {
      setMessage('שגיאה בהעלאת תמונה: ' + (e instanceof Error ? e.message : ''))
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('למחוק את המנה לצמיתות?')) return
    const supabase = createClient()
    await supabase.from('menu_items').delete().eq('id', item.id)
    router.push(`/menu/${category}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#242424', border: '1px solid #333' }}
        >
          <span style={{ color: '#f5f0e8' }}>→</span>
        </button>
        <h1 className="text-lg font-semibold flex-1" style={{ color: '#f5f0e8' }}>עריכת מנה</h1>
        <button
          onClick={handleDelete}
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: '#e0404022', color: '#e07070', border: '1px solid #e0404033' }}
        >
          מחיקה
        </button>
      </div>

      <div className="mx-6 h-px mb-6" style={{ background: '#c4722a33' }} />

      <div className="px-6 flex flex-col gap-4">
        {/* Images */}
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest" style={{ color: '#a89880' }}>תמונות (עד 3)</label>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <label className="cursor-pointer block">
                  <div
                    className="w-full rounded-xl overflow-hidden flex items-center justify-center relative"
                    style={{ background: '#242424', border: '2px dashed #333', aspectRatio: '1' }}
                  >
                    {img.preview ? (
                      <Image src={img.preview} alt="" fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-2xl opacity-30">📷</span>
                    )}
                    {!img.preview && (
                      <span className="absolute bottom-1 text-xs" style={{ color: '#a89880' }}>
                        {i === 0 ? 'ראשית' : `תמונה ${i + 1}`}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(i, e)}
                    className="hidden"
                  />
                </label>
                {img.preview && (
                  <button
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs z-10"
                    style={{ background: '#1a1a1acc', color: '#e07070' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Field label="שם המנה">
          <input value={form.name} onChange={e => set('name', e.target.value)} className="edit-input" />
        </Field>

        <Field label="תיאור המנה">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} className="edit-input" />
        </Field>

        <Field label="רכיבים">
          <textarea value={form.ingredients} onChange={e => set('ingredients', e.target.value)} rows={3} className="edit-input" />
        </Field>

        <Field label="אלרגיות (מופרדות בפסיק)">
          <input value={form.allergies} onChange={e => set('allergies', e.target.value)} className="edit-input" placeholder="גלוטן, לקטוז, שומשום" />
        </Field>

        <Field label="מנעד טעמים (מופרד בפסיק)">
          <input value={form.flavor_profile} onChange={e => set('flavor_profile', e.target.value)} className="edit-input" placeholder="חמוץ, מלוח, מתקתק" />
        </Field>

        <Field label="שינויים אפשריים">
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="edit-input" />
        </Field>

        {message && (
          <p className="text-xs text-center" style={{ color: '#e07070' }}>{message}</p>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-medium mt-2"
          style={{ background: '#c4722a', color: '#f5f0e8', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'שומר...' : 'שמירת שינויים'}
        </button>
      </div>

      <style jsx>{`
        .edit-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          background: #242424;
          border: 1px solid #333;
          color: #f5f0e8;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          resize: vertical;
          line-height: 1.6;
        }
        .edit-input:focus {
          border-color: #c4722a66;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs tracking-widest" style={{ color: '#a89880' }}>{label}</label>
      {children}
    </div>
  )
}
