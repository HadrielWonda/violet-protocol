import { useEffect } from 'react'
import { useGame, type Stage } from '../store/useGame'

const TITLES: Record<Stage, string> = {
  opening: 'The Violet Protocol',
  level1: '◍ Decrypting… 20%',
  level2: '◍ Debugging… 40%',
  level3: '◍ Analysing… 60%',
  level4: '◍ Reconstructing… 80%',
  level5: '◍ Access… 95%',
  final: '◍ Decrypting message…',
  celebration: '💜 Protocol Complete',
}

/** Updates the browser tab title as the user progresses. (Easter egg.) */
export function useTabTitle() {
  const stage = useGame((s) => s.stage)
  useEffect(() => {
    document.title = TITLES[stage]
  }, [stage])
}
