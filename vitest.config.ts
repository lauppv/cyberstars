import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The API brings its own settings; coverage can only be set here, once for every project
    projects: [
      {
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['apps/ui/**/*.test.{ts,tsx}', 'packages/**/*.test.ts'],
          setupFiles: ['./test/setup.ts'],
        },
      },
      'apps/api',
      { test: { name: 'framework', environment: 'node', include: ['framework/**/*.test.ts'] } },
    ],
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
        'framework/sandbox/src/live-run.ts',
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
