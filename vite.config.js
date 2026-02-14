import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // Change to 3000 (or any other number like 4000, 5174)
    strictPort: true, // Optional: Makes it fail if 3000 is also busy, rather than just picking the next one
  }
})