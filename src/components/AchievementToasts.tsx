import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ACHIEVEMENTS, useGame, type AchievementId } from '../store/useGame'
import { audio } from '../lib/audio'

interface Toast {
  id: AchievementId
  key: number
}

/** Watches for newly-unlocked achievements and pops a small toast for each. */
export default function AchievementToasts() {
  const achievements = useGame((s) => s.achievements)
  const seen = useRef<Set<AchievementId>>(new Set())
  const [toasts, setToasts] = useState<Toast[]>([])
  const primed = useRef(false)

  useEffect(() => {
    // On first mount, adopt whatever's already unlocked without toasting.
    if (!primed.current) {
      achievements.forEach((a) => seen.current.add(a))
      primed.current = true
      return
    }
    const fresh = achievements.filter((a) => !seen.current.has(a))
    if (fresh.length === 0) return
    fresh.forEach((a) => seen.current.add(a))
    audio.play('success')
    setToasts((t) => [...t, ...fresh.map((id) => ({ id, key: Date.now() + Math.random() }))])
    fresh.forEach((_, i) => {
      window.setTimeout(
        () => setToasts((t) => t.slice(1)),
        3600 + i * 400
      )
    })
  }, [achievements])

  return (
    <div className="pointer-events-none fixed bottom-4 right-3 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const def = ACHIEVEMENTS[t.id]
          return (
            <motion.div
              key={t.key}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="glass flex items-center gap-3 rounded-2xl px-4 py-3 glow-ring"
            >
              <span className="text-2xl">{def.glyph}</span>
              <div className="pr-1">
                <div className="font-sora text-[10px] uppercase tracking-widest text-lavender/60">
                  Achievement unlocked
                </div>
                <div className="font-display text-sm font-semibold text-lilac-soft">
                  {def.label}
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
