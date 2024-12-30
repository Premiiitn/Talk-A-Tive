import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  server: {
    proxy: {
      // When the frontend dev server receives a request starting with /api,
      // it will forward it to http://127.0.0.1:5000
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
