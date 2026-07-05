import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  /** 0–5 lit facets, from the Memory Vault. */
  fragments?: number
  /** When true the crystal appears fractured/opening (celebration & opening crack). */
  broken?: boolean
  size?: number
  /** Interactive hover glow (easter egg). */
  interactive?: boolean
  className?: string
}

/**
 * The heart of the experience — a faceted violet crystal. Facets light up as
 * memory fragments are collected; hovering intensifies the glow.
 */
export default function Crystal({
  fragments = 0,
  broken = false,
  size = 160,
  interactive = true,
  className = '',
}: Props) {
  const [hover, setHover] = useState(false)

  // Six triangular facets around a centre point.
  const facets = Array.from({ length: 6 }, (_, i) => i)
  const cx = 100
  const cy = 100
  const rTop = 46
  const points = facets.map((i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return [cx + Math.cos(a) * rTop, cy + Math.sin(a) * rTop] as const
  })

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      onHoverStart={() => interactive && setHover(true)}
      onHoverEnd={() => setHover(false)}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(124,58,237,0.55), transparent 65%)',
          filter: 'blur(18px)',
        }}
        animate={{
          opacity: hover ? 0.95 : 0.55 + fragments * 0.07,
          scale: hover ? 1.25 : 1,
        }}
        transition={{ duration: 0.6 }}
      />
      <motion.svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        animate={{ rotate: broken ? [0, -2, 2, 0] : 0 }}
        transition={{ duration: 0.5, repeat: broken ? 3 : 0 }}
      >
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c8a2e6" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <radialGradient id="cc" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e2d3f4" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>
        </defs>

        {/* Outer hexagon body */}
        <polygon
          points={points.map((p) => p.join(',')).join(' ')}
          fill="url(#cg)"
          opacity={0.28}
          stroke="rgba(226,211,244,0.5)"
          strokeWidth={1.2}
        />

        {/* Facets — lit according to fragment count */}
        {facets.map((i) => {
          const a = points[i]
          const b = points[(i + 1) % 6]
          const lit = i < fragments || broken
          return (
            <motion.polygon
              key={i}
              points={`${cx},${cy} ${a.join(',')} ${b.join(',')}`}
              fill="url(#cg)"
              stroke="rgba(226,211,244,0.55)"
              strokeWidth={0.8}
              initial={false}
              animate={{ opacity: lit ? 0.9 : 0.12 }}
              transition={{ duration: 0.8, delay: lit ? i * 0.04 : 0 }}
            />
          )
        })}

        {/* Core */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={14}
          fill="url(#cc)"
          animate={{
            r: hover ? 18 : 14,
            opacity: broken ? [1, 0.4, 1] : 0.9,
          }}
          transition={{ duration: broken ? 0.6 : 0.4, repeat: broken ? Infinity : 0 }}
        />

        {broken && (
          <motion.line
            x1={cx}
            y1={cy - rTop}
            x2={cx}
            y2={cy + rTop}
            stroke="#e2d3f4"
            strokeWidth={1.4}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.svg>
    </motion.div>
  )
}
