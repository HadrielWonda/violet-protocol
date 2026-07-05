import { useEffect } from 'react'
import { audio } from '../lib/audio'
import { useGame } from '../store/useGame'

/**
 * Keeps the audio engine in sync with the mute flag, and (once) attaches a
 * one-time gesture listener so the ambient pad begins the moment the user
 * first interacts with the page — satisfying browser autoplay policies.
 */
export function useAudioSync() {
  const muted = useGame((s) => s.muted)

  useEffect(() => {
    audio.setMuted(muted)
  }, [muted])

  useEffect(() => {
    const kick = () => {
      void audio.start()
    }
    window.addEventListener('pointerdown', kick, { once: true })
    window.addEventListener('keydown', kick, { once: true })
    return () => {
      window.removeEventListener('pointerdown', kick)
      window.removeEventListener('keydown', kick)
    }
  }, [])
}

export { audio }
