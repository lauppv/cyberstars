import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['.direnv/**', '.claude/**', 'test/integration/**', 'e2e/**', '**/node_modules/**'],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        '**/dist/',
        'coverage/',
        'prisma/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        'server/lessons/**',
        'server/algorithms/**',
        'server/services/terminal-session.service.ts',
        'server/services/interactive-execution.service.ts',
        'server/config/index.ts',
      ],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90,
      },
    },
  },
});
