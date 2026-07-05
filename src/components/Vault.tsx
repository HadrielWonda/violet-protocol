import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Memory } from '../config/memories'
import { audio } from '../lib/audio'
import GlassButton from './GlassButton'

interface Props {
  memories: Memory[]
  opened: string[]
  onOpen: (file: string) => void
}

/** The grid of encrypted memory files + the reveal modal. */
export default function Vault({ memories, opened, onOpen }: Props) {
  const [active, setActive] = useState<Memory | null>(null)

  const open = (m: Memory) => {
    if (!opened.includes(m.file)) {
      audio.play('unlock')
      onOpen(m.file)
    } else {
      audio.play('beep')
    }
    setActive(m)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {memories.map((m, i) => {
          const isOpen = opened.includes(m.file)
          return (
            <motion.button
              key={m.file}
              onClick={() => open(m)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-colors ${
                isOpen
                  ? 'border-lilac/50 bg-lilac/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-lavender/40'
              }`}
            >
              <span className={`text-2xl ${isOpen ? '' : 'opacity-60'}`}>
                {isOpen ? m.glyph : '🔒'}
              </span>
              <span className="font-mono text-[10px] leading-tight text-lavender/60">
                {m.file}
              </span>
              {isOpen && (
                <span className="font-sora text-[10px] text-lilac-soft/80">
                  {m.title}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-md rounded-3xl p-7 text-center glow-ring"
            >
              <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-emerald-300/70">
                decrypted · {active.file}
              </div>
              <div className="my-4 text-4xl">{active.glyph}</div>
              <h3 className="font-display text-lg font-semibold text-lilac-soft">
                {active.title}
              </h3>
              <p className="mt-3 font-sora text-[15px] leading-relaxed text-soft/90">
                {active.body}
              </p>
              <div className="mt-6">
                <GlassButton
                  variant="ghost"
                  sound="beep"
                  onClick={() => setActive(null)}
                >
                  Close
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
