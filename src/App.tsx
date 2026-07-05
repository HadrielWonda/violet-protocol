import { AnimatePresence } from 'framer-motion'
import type { ReactElement } from 'react'
import Particles from './components/Particles'
import ProgressBar from './components/ProgressBar'
import MuteButton from './components/MuteButton'
import AchievementToasts from './components/AchievementToasts'
import FakeLogs from './components/FakeLogs'
import DevMode from './components/DevMode'
import Opening from './levels/Opening'
import Level1 from './levels/Level1'
import Level2 from './levels/Level2'
import Level3 from './levels/Level3'
import Level4 from './levels/Level4'
import Level5 from './levels/Level5'
import FinalSequence from './levels/FinalSequence'
import Celebration from './levels/Celebration'
import { useGame, type Stage } from './store/useGame'
import { useAudioSync } from './hooks/useAudio'
import { useTabTitle } from './hooks/useTabTitle'
import { useKonami } from './hooks/useKonami'

const STAGES: Record<Stage, () => ReactElement> = {
  opening: Opening,
  level1: Level1,
  level2: Level2,
  level3: Level3,
  level4: Level4,
  level5: Level5,
  final: FinalSequence,
  celebration: Celebration,
}

export default function App() {
  const stage = useGame((s) => s.stage)
  const setDevMode = useGame((s) => s.setDevMode)
  const devMode = useGame((s) => s.devMode)

  useAudioSync()
  useTabTitle()
  useKonami(() => setDevMode(!devMode))

  const Current = STAGES[stage]
  // Denser particle field, and no idle hearts, once we reach the celebration.
  const celebrating = stage === 'celebration'

  return (
    <>
      <div className="aurora" aria-hidden />
      <div className="grain" aria-hidden />
      <Particles count={celebrating ? 110 : 60} hearts={!celebrating} />

      <MuteButton />
      <ProgressBar />
      <AchievementToasts />
      <DevMode />
      {stage !== 'celebration' && <FakeLogs />}

      <AnimatePresence mode="wait">
        <Current key={stage} />
      </AnimatePresence>
    </>
  )
}
