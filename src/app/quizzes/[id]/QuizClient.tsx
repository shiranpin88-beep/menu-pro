'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string | null
}

interface Quiz {
  id: string
  title: string
  description: string
}

export default function QuizClient({
  quiz,
  questions,
}: {
  quiz: Quiz
  questions: Question[]
}) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [finished, setFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#1a1a1a' }}>
        <span className="text-5xl mb-4 opacity-30">📝</span>
        <p style={{ color: '#a89880' }}>אין שאלות במבחן זה</p>
        <button onClick={() => router.back()} className="mt-6 text-sm" style={{ color: '#c4722a' }}>חזור</button>
      </div>
    )
  }

  const q = questions[current]
  const score = answers.filter((a, i) => a === questions[i].correct_answer).length

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    const newAnswers = [...answers]
    newAnswers[current] = idx
    setAnswers(newAnswers)
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const passed = pct >= 70
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#1a1a1a' }}>
        <span className="text-6xl mb-4">{passed ? '🎉' : '💪'}</span>
        <h2 className="text-2xl font-semibold mb-2" style={{ color: '#f5f0e8' }}>
          {passed ? 'כל הכבוד!' : 'כמעט!'}
        </h2>
        <p className="text-5xl font-bold my-4" style={{ color: passed ? '#c4722a' : '#a89880' }}>
          {pct}%
        </p>
        <p className="text-sm mb-8" style={{ color: '#a89880' }}>
          {score} מתוך {questions.length} תשובות נכונות
        </p>
        <button
          onClick={() => router.push('/quizzes')}
          className="px-6 py-3 rounded-xl text-sm font-medium"
          style={{ background: '#c4722a', color: '#f5f0e8' }}
        >
          חזור למבחנים
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-10 px-6 pt-12" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#242424', border: '1px solid #333' }}
        >
          <span style={{ color: '#f5f0e8' }}>→</span>
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: '#f5f0e8' }}>{quiz.title}</p>
          <p className="text-xs" style={{ color: '#a89880' }}>שאלה {current + 1} מתוך {questions.length}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 rounded-full mb-8" style={{ background: '#2a2a2a' }}>
        <div
          className="h-1 rounded-full transition-all duration-300"
          style={{ background: '#c4722a', width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="text-lg font-medium mb-6 leading-relaxed" style={{ color: '#f5f0e8' }}>
        {q.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-6">
        {q.options.map((opt, idx) => {
          let bg = '#242424'
          let border = '#2e2e2e'
          let textColor = '#f5f0e8'
          if (selected !== null) {
            if (idx === q.correct_answer) { bg = '#2a4a2a'; border = '#4a9a4a'; textColor = '#7ada7a' }
            else if (idx === selected && idx !== q.correct_answer) { bg = '#4a2a2a'; border = '#9a4a4a'; textColor = '#da7a7a' }
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="w-full text-right p-4 rounded-xl text-sm transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {selected !== null && q.explanation && (
        <div className="p-4 rounded-xl mb-6" style={{ background: '#242424', border: '1px solid #333' }}>
          <p className="text-xs" style={{ color: '#a89880' }}>{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl text-sm font-medium"
          style={{ background: '#c4722a', color: '#f5f0e8' }}
        >
          {current < questions.length - 1 ? 'שאלה הבאה' : 'סיום מבחן'}
        </button>
      )}
    </div>
  )
}
