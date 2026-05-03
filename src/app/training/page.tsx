import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TrainingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: materials } = await supabase
    .from('training_materials')
    .select('id, title, content, video_url, pdf_url')
    .order('display_order', { ascending: true })

  return (
    <div className="min-h-screen pb-8" style={{ background: '#1a1a1a' }}>
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <Link
          href="/home"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#242424', border: '1px solid #333' }}
        >
          <span style={{ color: '#f5f0e8' }}>→</span>
        </Link>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#f5f0e8' }}>הדרכות</h1>
          <p className="text-xs mt-0.5" style={{ color: '#a89880' }}>חומרי לימוד</p>
        </div>
      </div>

      <div className="mx-6 h-px mb-6" style={{ background: '#4a6a7a33' }} />

      {!materials || materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-5xl opacity-30">🎓</span>
          <p style={{ color: '#a89880' }}>אין הדרכות עדיין</p>
        </div>
      ) : (
        <div className="px-6 flex flex-col gap-3">
          {materials.map(m => (
            <Link
              key={m.id}
              href={`/training/${m.id}`}
              className="p-4 rounded-2xl transition-all active:scale-98"
              style={{ background: '#242424', border: '1px solid #2e2e2e' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#4a6a7a22' }}
                >
                  <span>{m.video_url ? '🎥' : m.pdf_url ? '📄' : '📖'}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: '#f5f0e8' }}>{m.title}</p>
                  {m.content && (
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#a89880' }}>
                      {m.content.substring(0, 80)}...
                    </p>
                  )}
                </div>
                <span style={{ color: '#333' }}>←</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
