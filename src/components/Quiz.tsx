import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { QuizQuestion } from '../config/puzzles'
import { audio } from '../lib/audio'
import GlassButton from './GlassButton'

interface Props {
  questions: QuizQuestion[]
  onComplete: () => void
}

const GENERIC_WRONG = [
  'The system respectfully disagrees.',
  'Bold. Wrong, but bold.',
  'Nice try. Not today.',
  'That answer has been flagged for review by the heart department.',
]

export default function Quiz({ questions, onComplete }: Props) {
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(false)
  const [feedback, setFeedback] = useState('')

  const q = questions[qi]

  const pick = (i: number) => {
    if (correct) return
    setPicked(i)
    if (i === q.answer) {
      audio.play('unlock')
      setCorrect(true)
      setFeedback(q.correct)
    } else {
      audio.play('beep')
      setFeedback(
        q.wrong?.[i] ??
          GENERIC_WRONG[Math.floor(Math.random() * GENERIC_WRONG.length)]
      )
    }
  }

  const next = () => {
    if (qi + 1 < questions.length) {
      setQi(qi + 1)
      setPicked(null)
      setCorrect(false)
      setFeedback('')
    } else {
      onComplete()
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-1.5">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < qi ? 'bg-lilac' : i === qi ? 'bg-lavender/60' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qi}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-lavender/50">
            Question {qi + 1} / {questions.length}
          </div>
          <h3 className="mb-5 font-display text-xl font-semibold leading-snug text-soft sm:text-2xl">
            {q.question}
          </h3>

          <div className="grid gap-2.5">
            {q.options.map((opt, i) => {
              const isPicked = picked === i
              const isAnswer = i === q.answer
              const state =
                correct && isAnswer
                  ? 'correct'
                  : isPicked && !isAnswer
                    ? 'wrong'
                    : 'idle'
              return (
                <motion.button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={correct}
                  whileHover={{ scale: correct ? 1 : 1.015 }}
                  whileTap={{ scale: 0.99 }}
                  animate={
                    state === 'wrong'
                      ? { x: [0, -8, 8, -6, 6, 0] }
                      : { x: 0 }
                  }
                  className={`rounded-xl border px-4 py-3 text-left font-sora text-sm transition-colors ${
                    state === 'correct'
                      ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100'
                      : state === 'wrong'
                        ? 'border-rose-400/50 bg-rose-500/10 text-rose-100'
                        : 'border-white/10 bg-white/[0.03] text-soft/90 hover:border-lilac/50'
                  }`}
                >
                  <span className="mr-2 font-mono text-xs text-lavender/40">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 font-sora text-sm ${
                  correct ? 'text-lilac-soft' : 'text-rose-200/80'
                }`}
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>

          {correct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-right"
            >
              <GlassButton onClick={next} sound="beep">
                {qi + 1 < questions.length ? 'Next →' : 'Finish →'}
              </GlassButton>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
