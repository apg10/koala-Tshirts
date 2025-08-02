// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // permite acceder con http://localhost y http://<tu-ip>
    port: 5173,      // fuerza siempre 5173 (opcional)
    strictPort: false,
  },
});
