import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Screen from '../components/Screen'
import Terminal from '../components/Terminal'
import GlassButton from '../components/GlassButton'
import DecryptText from '../components/DecryptText'
import { cipherModules, cipherSolutionId, cipherHint } from '../config/puzzles'
import { content } from '../config/content'
import { useGame } from '../store/useGame'
import { audio } from '../lib/audio'

type Phase = 'puzzle' | 'decrypting' | 'revealed'

export default function Level1() {
  const advance = useGame((s) => s.advance)
  const unlock = useGame((s) => s.unlock)
  const [phase, setPhase] = useState<Phase>('puzzle')
  const [wrong, setWrong] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [pct, setPct] = useState(0)

  const choose = (id: string) => {
    if (id === cipherSolutionId) {
      audio.play('unlock')
      setPhase('decrypting')
    } else {
      audio.play('beep')
      setWrong(id)
      setShowHint(true)
      window.setTimeout(() => setWrong(null), 600)
    }
  }

  useEffect(() => {
    if (phase !== 'decrypting') return
    let v = 0
    const id = window.setInterval(() => {
      v += Math.random() * 3 + 1
      if (v >= 20) {
        v = 20
        window.clearInterval(id)
        audio.play('decrypt')
        unlock('logic')
        window.setTimeout(() => setPhase('revealed'), 500)
      }
      setPct(Math.floor(v))
    }, 90)
    return () => window.clearInterval(id)
  }, [phase, unlock])

  const bars = 10
  const filled = Math.round((pct / 100) * bars)

  return (
    <Screen>
      <Terminal
        title="violet://level-01 · purple-cipher"
        status={phase === 'revealed' ? '20% decrypted' : 'encrypted'}
        statusTone={phase === 'revealed' ? 'ok' : 'danger'}
      >
        <div className="mb-5">
          <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-lavender/50">
            <span>Level 01 — Logic</span>
            <span>Message Status</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-mono text-lg tracking-[0.3em] text-lilac">
              {'█'.repeat(filled)}
              <span className="text-white/15">{'█'.repeat(bars - filled)}</span>
            </div>
            <span className="font-mono text-xs text-lavender/50">{pct}%</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'puzzle' && (
            <motion.div key="puzzle" exit={{ opacity: 0 }}>
              <p className="mb-1 font-sora text-sm text-soft/90">
                Four AI security modules guard the decryption key. Exactly one
                holds it. Each module’s profile tells you whether it speaks the
                truth. <span className="text-lilac">Find the module with the key.</span>
              </p>
              <p className="mb-4 font-mono text-[11px] text-lavender/40">
                {'// tip: a false statement means the opposite is true.'}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {cipherModules.map((m, i) => (
                  <motion.button
                    key={m.id}
                    onClick={() => choose(m.id)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      x: wrong === m.id ? [0, -8, 8, -6, 6, 0] : 0,
                    }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(196,181,253,0.6)' }}
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-semibold text-lilac-soft">
                        {m.name}
                      </span>
                      <span className="rounded-full border border-lavender/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-lavender/60">
                        {m.profile}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-lavender/40">{m.rule}</p>
                    <p className="mt-3 font-sora text-sm text-soft/90">“{m.statement}”</p>
                    <span className="mt-3 block font-mono text-[10px] text-lilac/0 transition-colors group-hover:text-lilac/70">
                      select this module →
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="font-mono text-[11px] text-lavender/50 underline-offset-4 hover:text-lilac hover:underline"
                >
                  {showHint ? 'hide hint' : 'need a hint?'}
                </button>
              </div>
              <AnimatePresence>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden font-mono text-[11px] text-lilac/70"
                  >
                    {cipherHint}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'decrypting' && (
            <motion.div
              key="decrypting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-6 text-center font-mono text-sm text-lavender/70 cursor-blink"
            >
              key located · decrypting fragment
            </motion.div>
          )}

          {phase === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-2 text-center"
            >
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-emerald-300/80">
                fragment recovered
              </div>
              <p className="mx-auto max-w-md font-display text-lg leading-relaxed text-lilac-soft text-glow sm:text-xl">
                <DecryptText text={content.level1Reveal} duration={1600} sound />
              </p>
              <div className="mt-8">
                <GlassButton onClick={advance} sound="decrypt">
                  Continue →
                </GlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Terminal>
    </Screen>
  )
}
