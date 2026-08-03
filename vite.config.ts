import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so built assets load from file:// inside the Android APK
  base: './',
  plugins: [react()],
})
