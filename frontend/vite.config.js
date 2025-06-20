import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  erver: {
    host: true,          // autoriza cualquier host, incluido '' y localhost
    strictPort: false,   // opcional: permite cambiar de puerto si el actual está ocupado
  },
})
