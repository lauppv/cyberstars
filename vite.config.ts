import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
      '/ws': { target: 'ws://localhost:5000', ws: true },
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['test/integration/**', 'node_modules/**'],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'prisma/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        'server/lessons/**',
        'server/algorithms/**',
        'server/services/terminal-session.service.ts',
        'server/config/index.ts',
      ],
      thresholds: {
        lines: 85,
        branches: 70,
        functions: 80,
        statements: 85,
      },
    },
  },
});
