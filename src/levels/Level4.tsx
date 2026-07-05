import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Screen from '../components/Screen'
import Terminal from '../components/Terminal'
import Crystal from '../components/Crystal'
import Vault from '../components/Vault'
import GlassButton from '../components/GlassButton'
import { memories } from '../config/memories'
import { useGame } from '../store/useGame'

export default function Level4() {
  const advance = useGame((s) => s.advance)
  const unlock = useGame((s) => s.unlock)
  const setFragments = useGame((s) => s.setFragments)
  const [opened, setOpened] = useState<string[]>([])

  const allOpen = opened.length === memories.length

  const handleOpen = (file: string) => {
    setOpened((prev) => {
      if (prev.includes(file)) return prev
      const next = [...prev, file]
      setFragments(next.length)
      if (next.length === memories.length) unlock('memory')
      return next
    })
  }

  return (
    <Screen>
      <Terminal
        title="violet://level-04 · memory-vault"
        status={`${opened.length}/${memories.length} recovered`}
        statusTone={allOpen ? 'ok' : 'busy'}
      >
        <div className="mb-5 flex flex-col items-center">
          <Crystal size={120} fragments={opened.length} interactive={false} />
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-lavender/50">
            each memory restores a fragment
          </p>
        </div>

        <p className="mb-4 text-center font-sora text-sm text-lavender/70">
          Five encrypted files survived. Open each one.
        </p>

        <Vault memories={memories} opened={opened} onOpen={handleOpen} />

        <AnimatePresence>
          {allOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-7 text-center"
            >
              <p className="mb-4 font-display text-base text-lilac-soft text-glow">
                The crystal is whole again.
              </p>
              <GlassButton onClick={advance} sound="decrypt">
                Proceed to final layer →
              </GlassButton>
            </motion.div>
          )}
        </AnimatePresence>
      </Terminal>
    </Screen>
  )
}
