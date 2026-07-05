import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { audio } from '../lib/audio'
import GlassButton from './GlassButton'

interface Props {
  answer: string
  placeholder?: string
  hints: readonly string[]
  onSuccess: () => void
}

export default function PasswordInput({
  answer,
  placeholder = 'enter key',
  hints,
  onSuccess,
}: Props) {
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(false)
  const [solved, setSolved] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const guess = value.trim().toLowerCase()
    if (!guess) return
    if (guess === answer.trim().toLowerCase()) {
      audio.play('unlock')
      setSolved(true)
      window.setTimeout(onSuccess, 1400)
      return
    }
    audio.play('beep')
    const n = attempts + 1
    setAttempts(n)
    setShake(true)
    setMessage(hints[Math.min(n - 1, hints.length - 1)])
    window.setTimeout(() => setShake(false), 500)
  }

  return (
    <div className="text-center">
      {!solved ? (
        <>
          <motion.form
            onSubmit={submit}
            animate={{ x: shake ? [0, -10, 10, -8, 8, 0] : 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex max-w-sm flex-col items-center gap-4"
          >
            <div className="flex w-full items-center gap-2">
              <span className="font-mono text-lilac">$</span>
              <input
                ref={ref}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-lilac-soft outline-none placeholder:text-lavender/25 placeholder:tracking-normal focus:border-lilac/60"
              />
            </div>
            <GlassButton type="submit" sound={null}>
              Authenticate
            </GlassButton>
          </motion.form>
          <AnimatePresence>
            {message && (
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 font-mono text-[12px] text-lilac/70"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 text-5xl"
          >
            🗝️
          </motion.div>
          <p className="font-display text-lg text-emerald-200 text-glow">
            Access granted.
          </p>
          <p className="mt-1 font-mono text-xs text-lavender/60 cursor-blink">
            opening the vault
          </p>
        </motion.div>
      )}
    </div>
  )
}
