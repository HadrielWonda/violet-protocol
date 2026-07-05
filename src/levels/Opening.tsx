import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Crystal from '../components/Crystal'
import GlassButton from '../components/GlassButton'
import Screen from '../components/Screen'
import { content } from '../config/content'
import { useGame } from '../store/useGame'
import { audio } from '../lib/audio'

export default function Opening() {
  const advance = useGame((s) => s.advance)
  const [cracking, setCracking] = useState(false)

  const initialize = () => {
    audio.play('crack')
    void audio.start()
    setCracking(true)
    window.setTimeout(() => advance(), 1500)
  }

  return (
    <Screen>
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Crystal size={190} broken={cracking} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-8 font-display text-3xl font-bold tracking-[0.18em] text-glow sm:text-5xl"
        >
          {content.opening.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 space-y-1 font-sora text-sm text-lavender/70 sm:text-base"
        >
          {content.opening.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </motion.div>

        <AnimatePresence>
          {!cracking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-lilac/60">
                {content.opening.prompt}
              </span>
              <GlassButton onClick={initialize} sound={null}>
                {content.opening.button}
              </GlassButton>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cracking && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 font-mono text-xs text-lavender/60 cursor-blink"
            >
              establishing secure channel
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  )
}
