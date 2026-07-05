import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// When building for GitHub Pages we serve from /<repo>/, so the CI workflow sets
// GITHUB_PAGES=true. Netlify and Vercel serve from the domain root, so the base
// stays "/" for them.
const base = process.env.GITHUB_PAGES === 'true' ? '/violet-protocol/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
  },
})
