import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages: App liegt unter https://stefesbau.github.io/learning-/
export default defineConfig({
  base: './',
  plugins: [react()],
})
