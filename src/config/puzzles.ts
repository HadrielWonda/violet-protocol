/**
 * Puzzle content for Levels 1–3.
 * -----------------------------------------------------------------------------
 * All answers are configurable here. Text matching (Level 2) is case-insensitive
 * and accepts any of the listed synonyms.
 */

/* ------------------------------------------------------------------ *
 * LEVEL 1 — Purple Cipher (four AI security modules)
 * ------------------------------------------------------------------ *
 * Four modules each state where the decryption key is hidden. You know each
 * module's security profile, which tells you whether its statement is true or
 * false. Exactly one module holds the key. Deduce which — then click it.
 *
 * Profiles resolve to a fixed truth value for this single query:
 *   TRUTH  -> statement is TRUE
 *   INVERSE-> statement is FALSE (liar)
 *   MIMIC  -> mirrors the Truth module -> TRUE
 *   ALTERNATOR (last output was true) -> this one is FALSE
 */
export interface CipherModule {
  id: string
  name: string
  profile: string
  /** Human-readable rule for the player. */
  rule: string
  /** What this module claims. */
  statement: string
  /** Whether that statement is true, given the profile. */
  saysTruth: boolean
  hasKey: boolean
}

export const cipherModules: CipherModule[] = [
  {
    id: 'atlas',
    name: 'ATLAS',
    profile: 'TRUTH PROTOCOL',
    rule: 'Always states facts.',
    statement: 'The key is not inside me.',
    saysTruth: true,
    hasKey: false,
  },
  {
    id: 'cipher',
    name: 'CIPHER',
    profile: 'INVERSE PROTOCOL',
    rule: 'Always states falsehoods.',
    statement: 'The key is inside me.',
    saysTruth: false,
    hasKey: false,
  },
  {
    id: 'echo',
    name: 'ECHO',
    profile: 'MIMIC PROTOCOL',
    rule: 'Mirrors the Truth Protocol — states facts.',
    statement: 'The key is not inside ATLAS.',
    saysTruth: true,
    hasKey: false,
  },
  {
    id: 'flux',
    name: 'FLUX',
    profile: 'ALTERNATOR',
    rule: 'Its last transmission was true — so this one is false.',
    statement: 'The key is not inside me.',
    saysTruth: false,
    hasKey: true,
  },
]

export const cipherSolutionId = 'flux'
export const cipherHint =
  'FLUX always flips. It insists the key is not inside it — but a false statement means the opposite is true.'

/* ------------------------------------------------------------------ *
 * LEVEL 2 — Relationship AI Debugger
 * ------------------------------------------------------------------ *
 * Each answer fixes one "bug". Matching is case-insensitive; any synonym works.
 */
export interface DebugQuestion {
  bug: string
  prompt: string
  accepts: string[]
  /** Shown when they get it right. */
  patch: string
}

export const debugQuestions: DebugQuestion[] = [
  {
    bug: 'ColorUndefinedError',
    prompt: 'What colour appears throughout this entire system?',
    accepts: ['purple', 'violet', 'lilac'],
    patch: 'colorProfile = violet ✓',
  },
  {
    bug: 'RecurringValueWarning',
    prompt: 'One answer keeps appearing in every level. Who is it?',
    accepts: ['you'],
    patch: 'recurringValue = "you" ✓',
  },
  {
    bug: 'IntentUnknownError',
    prompt: 'What is this system quietly trying to understand?',
    accepts: ['us', 'our relationship', 'we'],
    patch: 'intent = "us" ✓',
  },
]

export const debugFinalError = 'HeartNotSharedException'

/* ------------------------------------------------------------------ *
 * LEVEL 3 — The Impossible Quiz (playful, increasingly personal)
 * ------------------------------------------------------------------ *
 * `answer` is the index of the correct option. `wrong` maps an option index to
 * a humorous response; a generic quip is used if none is provided.
 */
export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  /** Playful line shown when they finally get it right. */
  correct: string
  /** Optional per-option teasing for wrong answers. */
  wrong?: Record<number, string>
}

export const quiz: QuizQuestion[] = [
  {
    question: 'Warm-up. How many sides does a triangle have?',
    options: ['3', '4', 'A triangle is a social construct', '7'],
    answer: 0,
    correct: 'Correct. The system trusts you now. (It shouldn’t. But it does.)',
    wrong: {
      2: 'Philosophically brave. Mathematically… no.',
    },
  },
  {
    question: 'Which colour dominates this website?',
    options: ['Blue', 'Purple', 'Beige', 'It’s complicated'],
    answer: 1,
    correct: 'Purple on the surface. Lilac underneath. More on that later.',
    wrong: {
      3: 'It really isn’t complicated. Look around.',
    },
  },
  {
    question: 'Security question: which food should Oreoluwa avoid at all costs? 🥜',
    options: ['Peanuts', 'Jollof rice', 'Chocolate', 'Nothing, she’s invincible'],
    answer: 0,
    correct: 'Correct — and noted, permanently, because you matter.',
    wrong: {
      3: 'Invincible, yes. Allergic to peanuts, also yes.',
    },
  },
  {
    question: 'And which food should he avoid? 🥛',
    options: ['Milk', 'Water', 'Air', 'Confidence'],
    answer: 0,
    correct: 'Lactose: defeated. He appreciates you remembering.',
    wrong: {
      3: 'He has plenty of that. It’s the milk that’s the problem.',
    },
  },
  {
    question: 'Who is currently smiling at their screen?',
    options: ['Nobody', 'You', 'The NSA', 'Suspicious…'],
    answer: 1,
    correct: 'Caught you. Keep going.',
    wrong: {
      0: 'Check a mirror. We’ll wait.',
    },
  },
  {
    question: 'Objectively, scientifically — who is cuter?',
    options: ['You', 'You', 'Definitely you', 'Also you'],
    answer: 0,
    correct: 'Every option was correct. The system was never subtle.',
  },
  {
    question: 'Final question. Which answer has quietly been hidden in every single level?',
    options: ['Me', 'Us', 'You', 'The key'],
    answer: 2,
    correct: 'You. It was always you.',
    wrong: {
      1: 'Close. There’s no "us" without one specific person first.',
    },
  },
]
