import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Screen from '../components/Screen'
import Terminal from '../components/Terminal'
import GlassButton from '../components/GlassButton'
import { useTypewriter } from '../hooks/useTypewriter'
import { debugQuestions, debugFinalError } from '../config/puzzles'
import { useGame } from '../store/useGame'
import { audio } from '../lib/audio'

type Phase = 'boot' | 'debug' | 'final'

interface Line {
  text: string
  tone: 'dim' | 'ok' | 'error' | 'ask'
}

const BOOT = 'Relationship Engine v1.0\nLoading...\nRunning diagnostics...\nCRITICAL ERROR: relationshipStatus = undefined'

export default function Level2() {
  const advance = useGame((s) => s.advance)
  const unlock = useGame((s) => s.unlock)

  const [phase, setPhase] = useState<Phase>('boot')
  const [qi, setQi] = useState(0)
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [nudge, setNudge] = useState('')
  const [log, setLog] = useState<Line[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const boot = useTypewriter(BOOT, {
    speed: 22,
    sound: true,
    onDone: () => window.setTimeout(() => setPhase('debug'), 500),
  })

  useEffect(() => {
    if (phase === 'debug') inputRef.current?.focus()
  }, [phase, qi])

  const q = debugQuestions[qi]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const guess = value.trim().toLowerCase()
    if (!guess) return
    if (q.accepts.some((a) => guess.includes(a))) {
      audio.play('beep')
      setLog((l) => [
        ...l,
        { text: `> ${value}`, tone: 'dim' },
        { text: `✓ Bug fixed — ${q.patch}`, tone: 'ok' },
      ])
      setValue('')
      setNudge('')
      if (qi + 1 < debugQuestions.length) {
        setQi(qi + 1)
      } else {
        unlock('ai')
        window.setTimeout(() => setPhase('final'), 600)
      }
    } else {
      audio.play('beep')
      setShake(true)
      setNudge('Still throwing an error. Try again — you already know this one.')
      window.setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <Screen>
      <Terminal
        title="violet://level-02 · relationship-engine"
        status={phase === 'final' ? '1 error remaining' : 'debugging'}
        statusTone={phase === 'final' ? 'danger' : 'busy'}
      >
        {phase === 'boot' && (
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-lavender/80 cursor-blink">
            {boot.text}
          </pre>
        )}

        {phase !== 'boot' && (
          <div>
            <div className="space-y-1 font-mono text-[13px] leading-relaxed">
              <p className="text-rose-300/80">CRITICAL ERROR: relationshipStatus = undefined</p>
              <p className="text-lavender/40">{'// resolve each error to continue'}</p>
              {log.map((l, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    l.tone === 'ok'
                      ? 'text-emerald-300'
                      : l.tone === 'error'
                        ? 'text-rose-300'
                        : 'text-lavender/50'
                  }
                >
                  {l.text}
                </motion.p>
              ))}
            </div>

            {phase === 'debug' && q && (
              <motion.div
                key={qi}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5"
              >
                <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-amber-300/70">
                  ▲ {q.bug}
                </div>
                <p className="mb-3 font-sora text-sm text-soft/90">{q.prompt}</p>
                <motion.form
                  onSubmit={submit}
                  animate={{ x: shake ? [0, -8, 8, -6, 6, 0] : 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <span className="font-mono text-lilac">{'>'}</span>
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="type your answer"
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-soft outline-none placeholder:text-lavender/25 focus:border-lilac/60"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <GlassButton type="submit" sound={null} className="!px-4 !py-2">
                    patch
                  </GlassButton>
                </motion.form>
                <AnimatePresence>
                  {nudge && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 font-mono text-[11px] text-rose-300/80"
                    >
                      {nudge}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {phase === 'final' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <p className="font-mono text-sm text-emerald-300">
                  ✓ All logic errors resolved.
                </p>
                <motion.p
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="mt-2 font-mono text-sm text-rose-400"
                >
                  ✖ Unresolved: {debugFinalError}
                </motion.p>
                <p className="mt-1 font-mono text-[11px] text-lavender/40">
                  {'// this one can’t be fixed with a keyboard.'}
                </p>
                <div className="mt-7 text-center">
                  <GlassButton onClick={advance} sound="decrypt">
                    Investigate →
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </Terminal>
    </Screen>
  )
}
