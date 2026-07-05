import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  title?: string
  children: ReactNode
  className?: string
  /** Status pill shown at the top-right, e.g. "ENCRYPTED". */
  status?: string
  statusTone?: 'danger' | 'ok' | 'busy'
}

const tone: Record<NonNullable<Props['statusTone']>, string> = {
  danger: 'text-rose-300 border-rose-400/40 bg-rose-500/10',
  ok: 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10',
  busy: 'text-lavender border-lavender/40 bg-royal/10',
}

/** A glassy terminal window frame used throughout the levels. */
export default function Terminal({
  title = 'violet://protocol',
  children,
  className = '',
  status,
  statusTone = 'busy',
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-strong w-full overflow-hidden rounded-2xl ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="truncate font-mono text-xs text-lavender/60">{title}</span>
        {status && (
          <span
            className={`ml-auto rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${tone[statusTone]}`}
          >
            {status}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </motion.div>
  )
}
