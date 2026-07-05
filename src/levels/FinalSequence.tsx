import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import Screen from '../components/Screen'
import GlassButton from '../components/GlassButton'
import DecryptText from '../components/DecryptText'
import { content } from '../config/content'
import { useGame } from '../store/useGame'
import { audio } from '../lib/audio'

type Phase = 'decrypting' | 'reveal'

const STEPS = [1, 7, 15, 46, 79, 99, 100]

interface Block {
  kind: 'line' | 'spacer' | 'name' | 'scramble'
  text?: string
  gap: number
}

export default function FinalSequence() {
  const advance = useGame((s) => s.advance)
  const [phase, setPhase] = useState<Phase>('decrypting')
  const [pct, setPct] = useState(0)
  const [replay, setReplay] = useState(0)
  const [visible, setVisible] = useState(0)
  const [showButtons, setShowButtons] = useState(false)

  // Warm the pad up for the emotional close.
  useEffect(() => {
    audio.setEmotional(true)
    return () => audio.setEmotional(false)
  }, [])

  // Phase 1 — the decrypt ramp.
  useEffect(() => {
    if (phase !== 'decrypting') return
    let i = 0
    const tick = () => {
      setPct(STEPS[i])
      audio.play('decrypt')
      i += 1
      if (i < STEPS.length) {
        window.setTimeout(tick, 520 + Math.random() * 260)
      } else {
        window.setTimeout(() => setPhase('reveal'), 900)
      }
    }
    const start = window.setTimeout(tick, 700)
    return () => window.clearTimeout(start)
  }, [phase])

  const blocks = useMemo<Block[]>(() => {
    const b: Block[] = []
    for (const line of content.finalMessage) {
      b.push(line === '' ? { kind: 'spacer', gap: 700 } : { kind: 'line', text: line, gap: 1250 })
    }
    b.push({ kind: 'name', text: content.recipientName, gap: 1700 })
    for (const line of content.proposal.afterNameLines) {
      b.push({ kind: 'line', text: line, gap: 1350 })
    }
    b.push({ kind: 'scramble', text: content.proposal.scrambleLine, gap: 2100 })
    return b
  }, [])

  // Phase 2 — reveal blocks one at a time (re-runnable via `replay`).
  useEffect(() => {
    if (phase !== 'reveal') return
    setVisible(0)
    setShowButtons(false)
    const timers: number[] = []
    let elapsed = 0
    blocks.forEach((blk, idx) => {
      elapsed += blk.gap
      timers.push(window.setTimeout(() => setVisible(idx + 1), elapsed))
    })
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [phase, replay, blocks])

  const replayMessage = () => {
    audio.play('beep')
    setReplay((r) => r + 1)
  }

  const bars = 24
  const filled = Math.round((pct / 100) * bars)

  return (
    <Screen className="!bg-transparent">
      <div className="mx-auto w-full max-w-xl text-center">
        <AnimatePresence mode="wait">
          {phase === 'decrypting' ? (
            <motion.div
              key="decrypting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono"
            >
              <div className="text-xs uppercase tracking-[0.4em] text-lavender/50">
                decrypting
              </div>
              <div className="mt-6 text-lg tracking-[0.25em] text-lilac">
                {'█'.repeat(filled)}
                <span className="text-white/10">{'█'.repeat(bars - filled)}</span>
              </div>
              <motion.div
                key={pct}
                initial={{ scale: 0.8, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 text-4xl font-bold text-lilac-soft text-glow"
              >
                {pct}%
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={`reveal-${replay}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {blocks.slice(0, visible).map((blk, i) => {
                if (blk.kind === 'spacer') return <div key={i} className="h-2" />
                if (blk.kind === 'name') {
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      className="py-2 font-display text-2xl font-bold text-lilac-soft text-glow sm:text-4xl"
                    >
                      <DecryptText text={blk.text ?? ''} duration={1400} sound />
                    </motion.div>
                  )
                }
                if (blk.kind === 'scramble') {
                  return (
                    <motion.div
                      key={`${i}-${replay}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-6 font-display text-2xl font-bold leading-snug text-white text-glow sm:text-4xl"
                    >
                      <DecryptText
                        text={blk.text ?? ''}
                        duration={2600}
                        sound
                        onDone={() => setShowButtons(true)}
                      />
                    </motion.div>
                  )
                }
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-sora text-base leading-relaxed text-lavender/85 sm:text-lg"
                  >
                    {blk.text}
                  </motion.p>
                )
              })}

              <AnimatePresence>
                {showButtons && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center justify-center gap-3 pt-10 sm:flex-row"
                  >
                    <GlassButton onClick={advance} sound="success" className="!px-8">
                      {content.celebration.yesButton} 💜
                    </GlassButton>
                    <GlassButton variant="ghost" onClick={replayMessage} sound={null}>
                      {content.celebration.replayButton}
                    </GlassButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  )
}
