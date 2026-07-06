import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('dotenv', () => ({ default: { config: vi.fn() } }));

const REQUIRED = {
  JWT_SECRET: 's',
  DB_USER: 'u',
  DB_HOST: 'h',
  DB_NAME: 'n',
  DB_PASSWORD: 'p',
};

function setEnv(extra: Record<string, string | undefined> = {}) {
  for (const [k, v] of Object.entries({ ...REQUIRED, ...extra })) {
    if (v === undefined) vi.stubEnv(k, '');
    else vi.stubEnv(k, v);
  }
}

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

afterEach(() => vi.unstubAllEnvs());

describe('env config', () => {
  it('uses production branch when NODE_ENV=production', async () => {
    setEnv({ NODE_ENV: 'production', PORT: '9000', CORS_ORIGIN: 'https://example.com' });
    const { env } = await import('./env.js');
    expect(env.isProduction).toBe(true);
    expect(env.port).toBe(9000);
    expect(env.corsOrigin).toBe('https://example.com');
    expect(env.cookie.secure).toBe(true);
  });

  it('falls back to prod default CORS origin when CORS_ORIGIN is unset', async () => {
    setEnv({ NODE_ENV: 'production', PORT: '9000' });
    const { env } = await import('./env.js');
    expect(env.corsOrigin).toBe('https://cyber-stars.org');
  });

  it('falls back to PORT default (8080) in production when PORT is unset', async () => {
    setEnv({ NODE_ENV: 'production' });
    const { env } = await import('./env.js');
    expect(env.port).toBe(8080);
  });

  it('uses dev branch when NODE_ENV is not production', async () => {
    setEnv({ NODE_ENV: 'development', EXPRESS_PORT: '4000', CORS_DEV_ORIGIN: 'http://x' });
    const { env } = await import('./env.js');
    expect(env.isProduction).toBe(false);
    expect(env.port).toBe(4000);
    expect(env.corsOrigin).toBe('http://x');
    expect(env.cookie.secure).toBe(false);
  });

  it('falls back to dev defaults when EXPRESS_PORT and CORS_DEV_ORIGIN are unset', async () => {
    setEnv({ NODE_ENV: 'development' });
    const { env } = await import('./env.js');
    expect(env.port).toBe(5000);
    expect(env.corsOrigin).toBe('http://localhost:5173');
  });

  it('uses DB_PORT when present, falls back to 5432 when unset', async () => {
    setEnv({ NODE_ENV: 'development', DB_PORT: '5433' });
    const { env: withPort } = await import('./env.js');
    expect(withPort.db.port).toBe(5433);

    vi.resetModules();
    vi.unstubAllEnvs();
    setEnv({ NODE_ENV: 'development' });
    const { env: noPort } = await import('./env.js');
    expect(noPort.db.port).toBe(5432);
  });

  it('reads Resend credentials when provided, empty/default otherwise', async () => {
    setEnv({
      NODE_ENV: 'development',
      RESEND_API_KEY: 're_test',
      RESEND_FROM: 'X <x@y.z>',
    });
    const { env: withResend } = await import('./env.js');
    expect(withResend.resend).toEqual({ apiKey: 're_test', from: 'X <x@y.z>' });

    vi.resetModules();
    vi.unstubAllEnvs();
    setEnv({ NODE_ENV: 'development' });
    const { env: noResend } = await import('./env.js');
    expect(noResend.resend).toEqual({
      apiKey: '',
      from: 'CyberStars <noreply@cyber-stars.org>',
    });
  });

  it('throws when a required variable is missing', async () => {
    setEnv({ NODE_ENV: 'development', JWT_SECRET: undefined });
    await expect(import('./env.js')).rejects.toThrow(/Missing required environment variable/);
  });
});
