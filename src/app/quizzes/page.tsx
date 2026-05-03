import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function QuizzesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, title, description, category')
    .order('created_at', { ascending: false })

  const categoryColors: Record<string, string> = {
    food: '#c4722a',
    alcohol: '#7a6abf',
    wine: '#8b3a3a',
    general: '#4a7a6a',
  }
  const categoryLabels: Record<string, string> = {
    food: 'אוכל',
    alcohol: 'אלכוהול',
    wine: 'יין',
    general: 'כללי',
  }

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
          <h1 className="text-xl font-semibold" style={{ color: '#f5f0e8' }}>מבחנים</h1>
          <p className="text-xs mt-0.5" style={{ color: '#a89880' }}>בדוק את הידע שלך</p>
        </div>
      </div>

      <div className="mx-6 h-px mb-6" style={{ background: '#4a7a6a33' }} />

      {!quizzes || quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-5xl opacity-30">📝</span>
          <p style={{ color: '#a89880' }}>אין מבחנים עדיין</p>
        </div>
      ) : (
        <div className="px-6 flex flex-col gap-3">
          {quizzes.map(quiz => {
            const color = categoryColors[quiz.category] || '#4a7a6a'
            return (
              <Link
                key={quiz.id}
                href={`/quizzes/${quiz.id}`}
                className="p-4 rounded-2xl transition-all active:scale-98"
                style={{ background: '#242424', border: '1px solid #2e2e2e' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-base" style={{ color: '#f5f0e8' }}>{quiz.title}</p>
                    {quiz.description && (
                      <p className="text-xs mt-1" style={{ color: '#a89880' }}>{quiz.description}</p>
                    )}
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                    style={{ background: color + '22', color }}
                  >
                    {categoryLabels[quiz.category] || quiz.category}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
