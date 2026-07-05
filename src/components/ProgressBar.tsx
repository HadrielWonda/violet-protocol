import { motion } from 'framer-motion'
import { useGame, PROGRESS_STAGES, stageProgress } from '../store/useGame'

/**
 * The narrative timeline across the top. Instead of a percentage it shows the
 * emotional checkpoints: Curiosity → Discovery → … → Heart Unlocked.
 */
export default function ProgressBar() {
  const stage = useGame((s) => s.stage)
  const current = stageProgress[stage]
  if (current < 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:pt-4">
      <div className="glass mx-auto flex max-w-3xl items-center gap-1 rounded-full px-3 py-2 sm:gap-2 sm:px-5">
        {PROGRESS_STAGES.map((label, i) => {
          const active = i === current
          const complete = i < current
          return (
            <div key={label} className="flex flex-1 items-center gap-1 sm:gap-2">
              <div className="flex flex-col items-center gap-1">
                <motion.span
                  className="block rounded-full"
                  animate={{
                    width: active ? 11 : 7,
                    height: active ? 11 : 7,
                    backgroundColor: complete
                      ? '#c8a2e6'
                      : active
                        ? '#e2d3f4'
                        : 'rgba(196,181,253,0.25)',
                    boxShadow: active
                      ? '0 0 14px rgba(226,211,244,0.9)'
                      : '0 0 0 rgba(0,0,0,0)',
                  }}
                />
                <span
                  className={`hidden whitespace-nowrap font-sora text-[9px] uppercase tracking-widest sm:block ${
                    active
                      ? 'text-lilac-soft'
                      : complete
                        ? 'text-lavender/60'
                        : 'text-white/25'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < PROGRESS_STAGES.length - 1 && (
                <div className="relative h-px flex-1 overflow-hidden bg-white/10">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-royal to-lilac"
                    initial={false}
                    animate={{ width: i < current ? '100%' : '0%' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
