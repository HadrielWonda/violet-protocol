/**
 * The Violet Protocol — Master Configuration
 * -----------------------------------------------------------------------------
 * Everything personal lives here. Edit this file (and memories.ts / puzzles.ts)
 * to re-target the experience for a different person. You never need to touch
 * the components or level logic.
 */

export const content = {
  /** Who this was built for. Appears in the final reveal. */
  recipientName: 'Oreoluwa Banjo',
  recipientFirstName: 'Oreoluwa',
  /** How the narrator refers to her partner in the quiz ("Which food should he avoid?"). */
  partnerPronoun: 'he',

  /** Her actual favourite colour. The whole site is violet — but lilac is *hers*. */
  favoriteColor: 'Lilac',

  /** Little truths used inside puzzles so answers feel personal. */
  facts: {
    peanutAllergy: 'Peanuts',
    lactoseIntolerant: 'Milk',
  },

  /** Opening screen copy. */
  opening: {
    title: 'THE VIOLET PROTOCOL',
    lines: [
      'Some messages deserve more than words.',
      'They deserve to be discovered.',
    ],
    prompt: 'INITIALIZE?',
    button: 'Initialize Protocol',
  },

  /** The compliment revealed at the end of Level 1. */
  level1Reveal:
    'Some people enjoy solving puzzles. You somehow make them even more enjoyable.',

  /**
   * Level 5 — the vault password.
   * It should be inferable from the journey. Lilac has quietly been *her* colour
   * the whole time, hidden underneath all the violet. Matching is case-insensitive
   * and ignores surrounding spaces.
   */
  password: {
    value: 'LILAC',
    placeholder: 'enter decryption key',
    hints: [
      'Hint: it was never really violet. Look at the colour that was quietly yours all along.',
      'Hint: six letters. The one shade in this whole system that belongs to you.',
      'Hint: L _ L _ C — your colour.',
    ],
    successHint: 'Almost. The system recognises you.',
  },

  /** The final decrypted message, revealed line by line. */
  finalMessage: [
    'Every puzzle had a purpose.',
    'Every clue pointed somewhere.',
    'Every answer led here.',
    '',
    'This was never just a game.',
    'It was built for one person.',
  ],

  /** The proposal itself. `scrambleLine` resolves out of scrambled characters. */
  proposal: {
    beforeName: '',
    afterNameLines: [
      'Because every time I think about you,',
      'I realize',
      "you're my favorite mystery to solve.",
    ],
    scrambleLine: 'Will you be my girlfriend?',
  },

  celebration: {
    title: 'Protocol Complete',
    subtitle: 'Heart Successfully Shared',
    yesButton: 'YES',
    replayButton: 'Read That Again',
    afterYes: "She said yes. Some mysteries have the most beautiful answers.",
  },

  /**
   * Optional. Drop a file named `proposal.mp4` in the /public folder and it will
   * auto-play on the celebration screen. If it's missing, the site skips it
   * gracefully — no broken player, no error.
   */
  proposalVideo: 'proposal.mp4',
} as const

export type Content = typeof content
