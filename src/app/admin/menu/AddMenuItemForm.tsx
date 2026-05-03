'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddMenuItemForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: '', category: 'food', ingredients: '',
    description: '', allergies: '', flavor_profile: '', notes: '', display_order: '0',
  })
  const router = useRouter()

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createClient()

    let image_url = null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `menu/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('menu-images')
        .upload(path, imageFile)
      if (!uploadErr) {
        const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
        image_url = data.publicUrl
      }
    }

    const { error } = await supabase.from('menu_items').insert({
      ...form,
      display_order: parseInt(form.display_order) || 0,
      image_url,
      notes: form.notes || null,
    })

    if (error) {
      setMessage('שגיאה: ' + error.message)
    } else {
      setMessage('המנה נוספה בהצלחה ✓')
      setForm({ name: '', category: 'food', ingredients: '', description: '', allergies: '', flavor_profile: '', notes: '', display_order: '0' })
      setImageFile(null)
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
        style={{ background: '#c4722a22', color: '#c4722a', border: '1px solid #c4722a44' }}
      >
        <span>+</span> הוספת מנה חדשה
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 p-4 rounded-2xl" style={{ background: '#242424', border: '1px solid #2e2e2e' }}>
          <Field label="שם המנה"><input required value={form.name} onChange={e => set('name', e.target.value)} className="field-input" placeholder="סביצ'ה אינטיאס" /></Field>

          <Field label="קטגוריה">
            <select value={form.category} onChange={e => set('category', e.target.value)} className="field-input">
              <option value="food">אוכל</option>
              <option value="sushi">סושי</option>
              <option value="alcohol">אלכוהול</option>
              <option value="wine">יין</option>
              <option value="desserts">קינוחים</option>
            </select>
          </Field>

          <Field label="רכיבים"><textarea value={form.ingredients} onChange={e => set('ingredients', e.target.value)} rows={2} className="field-input" /></Field>
          <Field label="תיאור המנה"><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="field-input" /></Field>
          <Field label="אלרגיות (מופרדות בפסיק)"><input value={form.allergies} onChange={e => set('allergies', e.target.value)} className="field-input" placeholder="גלוטן, לקטוז" /></Field>
          <Field label="מנעד טעמים (מופרד בפסיק)"><input value={form.flavor_profile} onChange={e => set('flavor_profile', e.target.value)} className="field-input" placeholder="חמוץ, מלוח, מתקתק" /></Field>
          <Field label="שינויים אפשריים"><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="field-input" /></Field>
          <Field label="סדר תצוגה"><input type="number" value={form.display_order} onChange={e => set('display_order', e.target.value)} className="field-input" /></Field>

          <Field label="תמונה">
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
              className="text-sm"
              style={{ color: '#a89880' }}
            />
          </Field>

          {message && (
            <p className="text-xs text-center" style={{ color: message.includes('✓') ? '#7ada7a' : '#e07070' }}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium"
            style={{ background: '#c4722a', color: '#f5f0e8', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'מוסיף...' : 'הוסף מנה'}
          </button>
        </form>
      )}

      <style jsx>{`
        .field-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background: #1a1a1a;
          border: 1px solid #333;
          color: #f5f0e8;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          resize: vertical;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs" style={{ color: '#a89880' }}>{label}</label>
      {children}
    </div>
  )
}
