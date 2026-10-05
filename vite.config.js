import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: globalThis.process?.env?.VITE_CACHE_DIR || undefined,
  define: {
    'globalThis.__VERTICE_JSON_SERVER_URL__': JSON.stringify(globalThis.process?.env?.VITE_JSON_SERVER_URL || 'http://localhost:3000'),
  },
})
