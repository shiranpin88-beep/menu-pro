'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddUserForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('waiter')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('המשתמש נוצר בהצלחה ✓')
      setFullName(''); setEmail(''); setPassword(''); setRole('waiter')
      setOpen(false)
      router.refresh()
    } else {
      setMessage(data.error || 'שגיאה ביצירת המשתמש')
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
        <span>+</span> הוספת משתמש חדש
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 p-4 rounded-2xl" style={{ background: '#242424', border: '1px solid #2e2e2e' }}>
          <Input label="שם מלא" value={fullName} onChange={setFullName} placeholder="ישראל ישראלי" />
          <Input label="אימייל" value={email} onChange={setEmail} type="email" placeholder="email@example.com" />
          <Input label="סיסמה" value={password} onChange={setPassword} type="password" placeholder="לפחות 6 תווים" />

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: '#a89880' }}>תפקיד</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ background: '#1a1a1a', border: '1px solid #333', color: '#f5f0e8' }}
            >
              <option value="waiter">מלצר</option>
              <option value="bartender">ברמן</option>
              <option value="hostess">מארחת</option>
              <option value="shift_manager">מנהל משמרת</option>
              <option value="admin">אדמין</option>
            </select>
          </div>

          {message && (
            <p className="text-xs text-center" style={{ color: message.includes('✓') ? '#7ada7a' : '#e07070' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium mt-1"
            style={{ background: '#c4722a', color: '#f5f0e8', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'יוצר...' : 'צור משתמש'}
          </button>
        </form>
      )}
    </div>
  )
}

function Input({
  label, value, onChange, type = 'text', placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs" style={{ color: '#a89880' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
        style={{ background: '#1a1a1a', border: '1px solid #333', color: '#f5f0e8' }}
      />
    </div>
  )
}
