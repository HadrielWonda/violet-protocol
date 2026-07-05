import { useEffect, useRef, useState } from 'react'
import { audio } from '../lib/audio'

interface Props {
  text: string
  className?: string
  /** ms before the scramble begins resolving. */
  delay?: number
  /** total resolve duration in ms. */
  duration?: number
  sound?: boolean
  onDone?: () => void
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFΞΨΩλ░▒▓'

/**
 * Renders `text` as scrambled glyphs that resolve, character by character, into
 * the real message — the "decrypting" effect used for reveals.
 */
export default function DecryptText({
  text,
  className = '',
  delay = 0,
  duration = 1400,
  sound = false,
  onDone,
}: Props) {
  const [display, setDisplay] = useState('')
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    let raf = 0
    let start = 0
    let soundGate = 0
    const total = text.length

    const frame = (now: number) => {
      if (!start) start = now
      const elapsed = now - start - delay
      if (elapsed < 0) {
        setDisplay(
          text
            .split('')
            .map((c) => (c === ' ' ? ' ' : randGlyph()))
            .join('')
        )
        raf = requestAnimationFrame(frame)
        return
      }
      const progress = Math.min(elapsed / duration, 1)
      const revealed = Math.floor(progress * total)
      let out = ''
      for (let i = 0; i < total; i++) {
        const ch = text[i]
        if (ch === ' ') out += ' '
        else if (i < revealed) out += ch
        else out += randGlyph()
      }
      setDisplay(out)
      if (sound && now - soundGate > 55) {
        audio.play('type')
        soundGate = now
      }
      if (progress < 1) {
        raf = requestAnimationFrame(frame)
      } else {
        setDisplay(text)
        doneRef.current?.()
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [text, delay, duration, sound])

  return <span className={className}>{display}</span>
}

function randGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}
