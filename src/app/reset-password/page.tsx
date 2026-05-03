'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const code = searchParams.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setError('הקישור פג תוקף — נסי לאפס סיסמה שוב')
        else setReady(true)
      })
    } else {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') setReady(true)
      })
      return () => subscription.unsubscribe()
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('הסיסמאות אינן תואמות'); return }
    if (password.length < 6) { setError('הסיסמה חייבת להכיל לפחות 6 תווים'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError('שגיאה באיפוס הסיסמה, נסי שוב'); setLoading(false) }
    else router.push('/home')
  }

  if (error && !ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-4" style={{ background: '#1a1a1a' }}>
        <p className="text-sm text-center" style={{ color: '#e05555' }}>{error}</p>
        <a href="/forgot-password" className="text-sm" style={{ color: '#c4722a' }}>לאיפוס סיסמה מחדש</a>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a1a' }}>
        <p className="text-sm" style={{ color: '#a89880' }}>טוען...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#1a1a1a' }}>
      <div className="mb-10 flex flex-col items-center gap-2">
        <h1 className="text-xl font-light tracking-widest" style={{ color: '#f5f0e8' }}>סיסמה חדשה</h1>
        <div className="w-16 h-px" style={{ background: '#c4722a' }} />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: '#a89880' }}>סיסמה חדשה</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{ background: '#242424', border: '1px solid #333', color: '#f5f0e8' }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: '#a89880' }}>אימות סיסמה</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            placeholder="••••••••"
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
          {loading ? 'שומר...' : 'שמירת סיסמה חדשה'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a1a' }}>
        <p className="text-sm" style={{ color: '#a89880' }}>טוען...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
