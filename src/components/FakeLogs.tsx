import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/** The playful system logs that occasionally scroll past. (Easter egg.) */
export const FAKE_LOGS = [
  'Searching for courage... Found.',
  'Love.exe initialized successfully.',
  'Warning: Feelings exceed measurable limits.',
  'Error 143: Message too heartfelt.',
  'Compiling butterflies... done.',
  'Rerouting all thoughts to one recipient.',
  'Patch applied: overthinking.dll disabled.',
  'Encryption key resembles someone specific.',
]

interface Props {
  className?: string
}

/** A tiny mono line at the corner that cycles through the fake logs. */
export default function FakeLogs({ className = '' }: Props) {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = window.setInterval(
      () => setI((n) => (n + 1) % FAKE_LOGS.length),
      4200
    )
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className={`pointer-events-none fixed bottom-3 left-3 z-30 max-w-[70vw] font-mono text-[10px] text-lavender/35 sm:bottom-5 sm:left-5 ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="block truncate"
        >
          <span className="text-emerald-300/50">$</span> {FAKE_LOGS[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
