import { AnimatePresence, motion } from 'framer-motion'
import { useGame, type Stage } from '../store/useGame'

const JUMP: { label: string; stage: Stage }[] = [
  { label: 'Opening', stage: 'opening' },
  { label: 'L1 · Cipher', stage: 'level1' },
  { label: 'L2 · Debugger', stage: 'level2' },
  { label: 'L3 · Quiz', stage: 'level3' },
  { label: 'L4 · Vault', stage: 'level4' },
  { label: 'L5 · Password', stage: 'level5' },
  { label: 'Final', stage: 'final' },
  { label: 'Celebration', stage: 'celebration' },
]

/**
 * The Konami-code reward: a tongue-in-cheek "Developer Mode" panel that also
 * happens to be a handy level-jump + reset console for whoever set this up.
 */
export default function DevMode() {
  const devMode = useGame((s) => s.devMode)
  const setDevMode = useGame((s) => s.setDevMode)
  const setStage = useGame((s) => s.setStage)
  const setFragments = useGame((s) => s.setFragments)
  const reset = useGame((s) => s.reset)

  return (
    <AnimatePresence>
      {devMode && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="glass-strong fixed left-1/2 top-16 z-[60] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-300">
              ▚ DEVELOPER MODE — you found it.
            </span>
            <button
              onClick={() => setDevMode(false)}
              className="text-lavender/60 hover:text-white"
              aria-label="Close developer mode"
            >
              ✕
            </button>
          </div>
          <p className="mb-3 font-mono text-[11px] leading-relaxed text-lavender/60">
            {'// Feelings.compile() succeeded with 0 warnings.'}
            <br />
            {'// Warp to any level. She will never know.'}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {JUMP.map((j) => (
              <button
                key={j.stage}
                onClick={() => {
                  if (j.stage === 'celebration' || j.stage === 'final')
                    setFragments(5)
                  setStage(j.stage)
                  setDevMode(false)
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 font-mono text-[10px] text-lavender/80 hover:border-lavender/50 hover:text-white"
              >
                {j.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              reset()
              setDevMode(false)
            }}
            className="mt-3 w-full rounded-lg border border-rose-400/30 px-2 py-2 font-mono text-[10px] text-rose-200/80 hover:border-rose-300/60"
          >
            reset --hard (wipe progress)
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
