import { useEffect, useRef } from 'react'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

/** Fires `onUnlock` when the Konami code is entered. */
export function useKonami(onUnlock: () => void) {
  const index = useRef(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const expected = SEQUENCE[index.current]
      if (key === expected) {
        index.current += 1
        if (index.current === SEQUENCE.length) {
          index.current = 0
          onUnlock()
        }
      } else {
        index.current = key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onUnlock])
}
