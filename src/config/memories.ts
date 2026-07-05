/**
 * Level 4 — Memory Vault
 * -----------------------------------------------------------------------------
 * Each entry is one encrypted file. Opening it reveals a personal memory and
 * adds a glowing fragment to the crystal. Edit the `body` of each to make it
 * real — keep it to 1–3 short sentences for the nicest reveal animation.
 */

export interface Memory {
  /** The filename shown before it's opened, e.g. memory01.lock */
  file: string
  /** Emoji shown on the fragment / header. Keep it subtle. */
  glyph: string
  /** Short label for the memory. */
  title: string
  /** The actual memory. Replace the placeholders below with real ones. */
  body: string
}

export const memories: Memory[] = [
  {
    file: 'memory01.lock',
    glyph: '✦',
    title: 'The first thing I noticed',
    body: 'The first thing I noticed about you — and the reason I kept finding excuses to talk to you.',
  },
  {
    file: 'memory02.lock',
    glyph: '❖',
    title: 'The conversation I replay',
    body: 'The conversation I still think about, the one where I realised you were different from anyone else.',
  },
  {
    file: 'memory03.lock',
    glyph: '✧',
    title: 'Your smile',
    body: 'Your smile. The one that shows up mid-sentence and quietly reorganises my entire day.',
  },
  {
    file: 'memory04.lock',
    glyph: '❉',
    title: 'Your love for lilac',
    body: 'The way lilac follows you everywhere — your favourite colour, and somehow now mine too.',
  },
  {
    file: 'memory05.lock',
    glyph: '✺',
    title: 'Your determination',
    body: 'Your determination. Watching you refuse to give up on things you care about makes me want to be better.',
  },
]
