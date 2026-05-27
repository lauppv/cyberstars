import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup.ts',
  testDir: './tests',
  timeout: 60_000,
  retries: 1,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'browser',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /\/(auth|forum|support|courses|profile)\.spec\.ts$/,
    },
    {
      name: 'docker',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /\/code-.*\.spec\.ts$/,
    },
  ],
  webServer: {
    command: 'dotenv -e .env.test -- npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: { NODE_ENV: 'test' },
  },
});
