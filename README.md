# The Violet Protocol 💜

An interactive, encrypted-puzzle proposal experience — built as a single-page app
that unfolds through five levels before revealing one very specific question.

Every personal detail lives in configuration, so nothing in the story is hard-coded.

- **Framework:** React + Vite + TypeScript
- **Styling / motion:** Tailwind CSS v4, Framer Motion
- **State:** Zustand (progress persisted to LocalStorage)
- **Audio:** fully procedural (Web Audio API) — no asset files needed
- **Target:** mobile-first, scales gracefully to desktop

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Personalising it

All the personal content is in three files — edit these and nothing else:

| File | What it holds |
| --- | --- |
| `src/config/content.ts` | Name, favourite colour, the vault **password**, the final message, the proposal text, allergy facts |
| `src/config/memories.ts` | The five Memory Vault entries (Level 4) |
| `src/config/puzzles.ts` | The cipher puzzle, debugger questions, and the quiz |

The vault password is currently **`LILAC`** (case-insensitive) — her favourite colour,
hidden underneath all the violet. Change it in `content.ts` → `password.value`.

### Optional proposal video

Drop a file named **`proposal.mp4`** into the `public/` folder and it will auto-play on
the final celebration screen. If it isn't there, the site skips it gracefully.

## Deploying

The build output is a static site in `dist/`. Three easy paths:

- **GitHub Pages** — a workflow at `.github/workflows/deploy.yml` builds and deploys on
  every push to `main`. Enable *Settings → Pages → Source: GitHub Actions*.
- **Netlify** — `netlify.toml` is included. Just point Netlify at the repo (build:
  `npm run build`, publish: `dist`).
- **Vercel** — `vercel.json` is included. Import the repo; Vercel auto-detects Vite.

> On Netlify/Vercel the base path is `/`. The GitHub Pages workflow sets
> `GITHUB_PAGES=true`, which switches the base to `/violet-protocol/` automatically.

## Easter eggs

- The browser tab title changes as you progress.
- The **Konami code** (↑ ↑ ↓ ↓ ← → ← → B A) unlocks a playful Developer Mode with level jumps.
- Idle particles occasionally drift into the outline of a heart.
- Achievements pop after each level; system logs whisper things they shouldn't.

---

Made for **Oreoluwa Banjo**. Favourite colour: lilac.
