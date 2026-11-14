import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The .env lives at the repo root, where the server reads it too
  envDir: '../..',
  server: {
    port: 5173,
    // Vite's own CORS answers every preflight itself, before the proxy, and
    // turns away a web lesson's preview (origin null): the practice API's
    // POST must reach the API's own answer, as it does in production (CYB-115)
    cors: false,
    proxy: {
      '/api': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
      '/ws': { target: 'ws://localhost:5000', ws: true },
    },
  },
});
