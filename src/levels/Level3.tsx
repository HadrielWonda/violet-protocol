import Screen from '../components/Screen'
import Terminal from '../components/Terminal'
import Quiz from '../components/Quiz'
import { quiz } from '../config/puzzles'
import { useGame } from '../store/useGame'

export default function Level3() {
  const advance = useGame((s) => s.advance)
  const unlock = useGame((s) => s.unlock)

  return (
    <Screen>
      <Terminal
        title="violet://level-03 · the-impossible-quiz"
        status="analysing"
        statusTone="busy"
      >
        <div className="mb-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-lavender/50">
            Level 03 — Calibration
          </div>
          <p className="mt-1 font-sora text-sm text-lavender/70">
            A few quick questions. Some are easy. Some are personal. All of them
            are rigged in your favour.
          </p>
        </div>
        <Quiz
          questions={quiz}
          onComplete={() => {
            unlock('quiz')
            advance()
          }}
        />
      </Terminal>
    </Screen>
  )
}
