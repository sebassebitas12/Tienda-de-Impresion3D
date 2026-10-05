import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, globalThis.process.cwd(), 'VITE_');
  return {
  plugins: [react()],
  cacheDir: globalThis.process?.env?.VITE_CACHE_DIR || undefined,
  define: {
    'globalThis.__VERTICE_JSON_SERVER_URL__': JSON.stringify(globalThis.process?.env?.VITE_JSON_SERVER_URL || env.VITE_JSON_SERVER_URL || 'http://localhost:3000'),
  },
  };
})
