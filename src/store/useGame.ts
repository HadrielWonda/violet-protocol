import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Stage =
  | 'opening'
  | 'level1'
  | 'level2'
  | 'level3'
  | 'level4'
  | 'level5'
  | 'final'
  | 'celebration'

export type AchievementId =
  | 'logic'
  | 'ai'
  | 'quiz'
  | 'memory'
  | 'password'
  | 'heart'

export interface AchievementDef {
  id: AchievementId
  glyph: string
  label: string
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementDef> = {
  logic: { id: 'logic', glyph: '🔓', label: 'Logic Master' },
  ai: { id: 'ai', glyph: '🤖', label: 'AI Whisperer' },
  quiz: { id: 'quiz', glyph: '🧠', label: 'Puzzle Solver' },
  memory: { id: 'memory', glyph: '💜', label: 'Memory Keeper' },
  password: { id: 'password', glyph: '🗝️', label: 'Codebreaker' },
  heart: { id: 'heart', glyph: '❤️', label: 'Heart Decrypted' },
}

/** The narrative checkpoints shown in the top timeline. */
export const PROGRESS_STAGES = [
  'Curiosity',
  'Discovery',
  'Connection',
  'Trust',
  'Almost There',
  'Heart Unlocked',
] as const

/** Which timeline checkpoint each stage maps to. */
export const stageProgress: Record<Stage, number> = {
  opening: -1,
  level1: 0,
  level2: 1,
  level3: 2,
  level4: 3,
  level5: 4,
  final: 5,
  celebration: 5,
}

const STAGE_ORDER: Stage[] = [
  'opening',
  'level1',
  'level2',
  'level3',
  'level4',
  'level5',
  'final',
  'celebration',
]

interface GameState {
  stage: Stage
  achievements: AchievementId[]
  /** Number of crystal fragments earned (0–5) in the Memory Vault. */
  fragments: number
  muted: boolean
  devMode: boolean
  /** Set once so intro-only flourishes don't repeat on revisits. */
  hasStarted: boolean

  setStage: (stage: Stage) => void
  advance: () => void
  unlock: (id: AchievementId) => void
  setFragments: (n: number) => void
  toggleMute: () => void
  setMuted: (m: boolean) => void
  setDevMode: (v: boolean) => void
  reset: () => void
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      stage: 'opening',
      achievements: [],
      fragments: 0,
      muted: false,
      devMode: false,
      hasStarted: false,

      setStage: (stage) =>
        set({ stage, hasStarted: get().hasStarted || stage !== 'opening' }),

      advance: () => {
        const i = STAGE_ORDER.indexOf(get().stage)
        const next = STAGE_ORDER[Math.min(i + 1, STAGE_ORDER.length - 1)]
        set({ stage: next, hasStarted: true })
      },

      unlock: (id) =>
        set((s) =>
          s.achievements.includes(id)
            ? s
            : { achievements: [...s.achievements, id] }
        ),

      setFragments: (n) => set({ fragments: Math.max(0, Math.min(5, n)) }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      setMuted: (m) => set({ muted: m }),
      setDevMode: (v) => set({ devMode: v }),

      reset: () =>
        set({
          stage: 'opening',
          achievements: [],
          fragments: 0,
          devMode: false,
          hasStarted: false,
        }),
    }),
    {
      name: 'violet-protocol',
      partialize: (s) => ({
        stage: s.stage,
        achievements: s.achievements,
        fragments: s.fragments,
        muted: s.muted,
        hasStarted: s.hasStarted,
      }),
    }
  )
)
