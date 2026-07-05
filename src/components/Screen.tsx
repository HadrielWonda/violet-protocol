import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

/** Consistent full-height, centered, fading container for every stage. */
export default function Screen({ children, className = '' }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-20 sm:px-6 ${className}`}
    >
      <div className="w-full max-w-2xl">{children}</div>
    </motion.main>
  )
}
