import { motion } from 'framer-motion'
import { useGame } from '../store/useGame'

/** Small always-available mute / unmute control. */
export default function MuteButton() {
  const muted = useGame((s) => s.muted)
  const toggleMute = useGame((s) => s.toggleMute)

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
      className="glass fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full text-lavender/80 sm:left-5 sm:top-5"
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </motion.button>
  )
}
