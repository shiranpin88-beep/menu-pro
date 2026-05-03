import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuizClient from './QuizClient'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .single()

  if (!quiz) notFound()

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', id)
    .order('display_order', { ascending: true })

  return <QuizClient quiz={quiz} questions={questions || []} />
}
