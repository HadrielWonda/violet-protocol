import { useEffect, useRef, useState } from 'react'
import { audio } from '../lib/audio'

interface Options {
  speed?: number
  startDelay?: number
  /** Play a soft keystroke tick as characters appear. */
  sound?: boolean
  onDone?: () => void
}

/**
 * Types out `text` character by character. Returns the visible substring and a
 * `done` flag. Re-runs whenever `text` changes.
 */
export function useTypewriter(text: string, opts: Options = {}) {
  const { speed = 34, startDelay = 0, sound = false, onDone } = opts
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    setOut('')
    setDone(false)
    let i = 0
    let timer: number
    const tick = () => {
      i += 1
      setOut(text.slice(0, i))
      if (sound && i % 2 === 0) audio.play('type')
      if (i >= text.length) {
        setDone(true)
        doneRef.current?.()
        return
      }
      timer = window.setTimeout(tick, speed + (Math.random() * speed) / 2)
    }
    const startTimer = window.setTimeout(tick, startDelay)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(startTimer)
    }
  }, [text, speed, startDelay, sound])

  return { text: out, done }
}
