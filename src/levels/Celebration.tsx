import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import Crystal from '../components/Crystal'
import GlassButton from '../components/GlassButton'
import { content } from '../config/content'
import { useGame } from '../store/useGame'
import { audio } from '../lib/audio'

const PETAL_COLORS = ['#c8a2e6', '#c4b5fd', '#e2d3f4', '#7c3aed']

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 7,
        size: 8 + Math.random() * 12,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        drift: (Math.random() - 0.5) * 120,
      })),
    []
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -40, x: `${p.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [`${p.x}vw`, `calc(${p.x}vw + ${p.drift}px)`],
            opacity: [0, 0.9, 0.9, 0],
            rotate: 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 1.3,
            background: p.color,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            filter: 'blur(0.3px)',
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

export default function Celebration() {
  const unlock = useGame((s) => s.unlock)
  const reset = useGame((s) => s.reset)
  const [hasVideo, setHasVideo] = useState(true)
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    unlock('heart')
    audio.setEmotional(true)
    audio.play('success')
    const t = window.setTimeout(() => setReveal(true), 900)
    return () => window.clearTimeout(t)
  }, [unlock])

  return (
    <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* Glowing violet sky */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(124,58,237,0.5), transparent 55%), radial-gradient(circle at 50% 100%, rgba(200,162,230,0.35), transparent 60%), linear-gradient(180deg, #1a0f33 0%, #09090b 100%)',
        }}
      />
      <Petals />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Crystal size={200} broken fragments={6} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-8 font-display text-3xl font-bold tracking-[0.15em] text-lilac-soft text-glow sm:text-5xl"
      >
        {content.celebration.title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-3 font-sora text-base text-lavender/80 sm:text-lg"
      >
        {content.celebration.subtitle}
      </motion.p>

      {reveal && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-6 max-w-md font-sora text-sm leading-relaxed text-lilac/80"
        >
          {content.celebration.afterYes}
        </motion.p>
      )}

      {/* Optional proposal video — auto-skips if the file isn't present. */}
      {hasVideo && (
        <motion.video
          src={`${import.meta.env.BASE_URL}${content.proposalVideo}`}
          autoPlay
          playsInline
          controls
          onError={() => setHasVideo(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="glass mt-8 w-full max-w-md rounded-2xl"
        />
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        onClick={() => {
          audio.play('beep')
          reset()
        }}
        className="mt-10 font-mono text-[11px] uppercase tracking-widest text-lavender/40 hover:text-lilac"
      >
        ↺ replay the protocol
      </motion.button>
    </div>
  )
}
