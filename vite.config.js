import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/matematyka-bryly-korki-1/',
  plugins: [react()],
  server: {
    host: true
  }
})
