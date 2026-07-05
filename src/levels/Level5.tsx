import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import Terminal from '../components/Terminal'
import PasswordInput from '../components/PasswordInput'
import { content } from '../config/content'
import { useGame } from '../store/useGame'

export default function Level5() {
  const advance = useGame((s) => s.advance)
  const unlock = useGame((s) => s.unlock)

  return (
    <Screen>
      <Terminal
        title="violet://level-05 · final-lock"
        status="access denied"
        statusTone="danger"
      >
        <div className="text-center">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="font-display text-2xl font-bold tracking-[0.2em] text-rose-300 sm:text-3xl"
          >
            ACCESS DENIED
          </motion.div>
          <p className="mx-auto mt-4 max-w-md font-sora text-sm text-lavender/70">
            One layer remains. The key isn’t written anywhere — but you’ve been
            carrying it through every level. It’s the colour that was quietly
            yours the whole time.
          </p>
        </div>

        <div className="mt-8">
          <PasswordInput
            answer={content.password.value}
            placeholder={content.password.placeholder}
            hints={content.password.hints}
            onSuccess={() => {
              unlock('password')
              advance()
            }}
          />
        </div>
      </Terminal>
    </Screen>
  )
}
