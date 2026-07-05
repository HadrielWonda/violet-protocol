import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { audio } from '../lib/audio'

interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
  /** Sound played on click. */
  sound?: 'beep' | 'unlock' | 'decrypt' | 'success' | null
}

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-sora text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 select-none'

const variants: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'text-white glass-strong border border-lavender/40 hover:border-lavender/80 shadow-[0_0_30px_-8px_rgba(124,58,237,0.8)]',
  ghost: 'text-lavender/80 border border-white/10 hover:border-lavender/40 hover:text-white',
  danger: 'text-rose-200 border border-rose-400/30 hover:border-rose-300/60',
}

export default function GlassButton({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className = '',
  type = 'button',
  sound = 'beep',
}: Props) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        if (sound) audio.play(sound)
        onClick?.()
      }}
      whileHover={{ scale: disabled ? 1 : 1.035 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 0%, rgba(196,181,253,0.25), transparent 60%)',
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
