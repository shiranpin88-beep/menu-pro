'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message || 'שגיאה בשליחה, נסי שוב')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#1a1a1a' }}>
      <div className="mb-10 flex flex-col items-center gap-2">
        <h1 className="text-xl font-light tracking-widest" style={{ color: '#f5f0e8' }}>איפוס סיסמה</h1>
        <div className="w-16 h-px" style={{ background: '#c4722a' }} />
      </div>

      {sent ? (
        <div className="w-full max-w-sm text-center flex flex-col gap-4">
          <p className="text-sm" style={{ color: '#d4c9b8' }}>
            נשלח אימייל לכתובת <span style={{ color: '#c4722a' }}>{email}</span>
          </p>
          <p className="text-xs" style={{ color: '#a89880' }}>
            לחצי על הקישור באימייל כדי להגדיר סיסמה חדשה
          </p>
          <a href="/login" className="text-xs mt-2" style={{ color: '#a89880' }}>חזרה להתחברות</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#a89880' }}>אימייל</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: '#242424', border: '1px solid #333', color: '#f5f0e8' }}
            />
          </div>

          {error && <p className="text-sm text-center" style={{ color: '#e05555' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium text-sm tracking-wide mt-2"
            style={{ background: '#c4722a', color: '#f5f0e8', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'שולח...' : 'שליחת קישור לאיפוס'}
          </button>

          <a href="/login" className="text-xs text-center" style={{ color: '#a89880' }}>חזרה להתחברות</a>
        </form>
      )}
    </div>
  )
}
