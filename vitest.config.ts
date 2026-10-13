import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [
      '.direnv/**',
      '.claude/**',
      'apps/api/test/integration/**',
      'e2e/**',
      '**/node_modules/**',
    ],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        '**/dist/',
        'coverage/',
        'apps/api/prisma/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        'packages/content/lessons/**',
        'packages/content/algorithms/**',
        'apps/api/src/services/terminal-session.service.ts',
        'apps/api/src/services/interactive-execution.service.ts',
        'apps/api/src/config/index.ts',
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
