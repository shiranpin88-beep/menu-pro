'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('שם משתמש או סיסמה שגויים')
      setLoading(false)
    } else {
      router.push('/home')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#1a1a1a' }}>
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-2 flex items-center justify-center" style={{ background: '#242424', border: '1px solid #333' }}>
          <Image src="/logo.png" alt="Sun Young" width={96} height={96} className="object-cover w-full h-full" />
        </div>
        <h1 className="text-2xl font-light tracking-widest" style={{ color: '#f5f0e8' }}>SUN YOUNG</h1>
        <div className="w-16 h-px" style={{ background: '#c4722a' }} />
        <p className="text-xs tracking-wider mt-1" style={{ color: '#a89880' }}>太陽の若い</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: '#a89880' }}>אימייל</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
            style={{
              background: '#242424',
              border: '1px solid #333',
              color: '#f5f0e8',
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: '#a89880' }}>סיסמה</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: '#242424',
              border: '1px solid #333',
              color: '#f5f0e8',
            }}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setRemember(r => !r)}
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
            style={{
              background: remember ? '#c4722a' : '#242424',
              border: `1px solid ${remember ? '#c4722a' : '#444'}`,
              transition: 'all 0.15s',
            }}
          >
            {remember && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
          </div>
          <span className="text-sm" style={{ color: '#a89880' }}>הישאר מחובר</span>
        </label>

        {error && (
          <p className="text-sm text-center" style={{ color: '#e05555' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium text-sm tracking-wide transition-opacity mt-2"
          style={{ background: '#c4722a', color: '#f5f0e8', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'מתחבר...' : 'כניסה'}
        </button>

        <a
          href="/forgot-password"
          className="text-xs text-center mt-1"
          style={{ color: '#a89880' }}
        >
          שכחתי סיסמה
        </a>
      </form>
    </div>
  )
}
