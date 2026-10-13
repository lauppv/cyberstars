import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

type Limiter = (req: Request, res: Response, next: () => void) => void;
type RateLimitOpts = { max: number };

const captured: { opts?: RateLimitOpts } = {};

vi.mock('express-rate-limit', () => ({
  default: (opts: RateLimitOpts): Limiter => {
    captured.opts = opts;
    return (_req: Request, _res: Response, next: () => void) => next();
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticateToken: (_req: Request, _res: Response, next: () => void) => next(),
}));

vi.mock('../middleware/validate.js', () => ({
  validateBody: () => (_req: Request, _res: Response, next: () => void) => next(),
}));

vi.mock('../controllers/auth.controller.js', () => ({
  signup: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  me: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
}));

beforeEach(() => {
  captured.opts = undefined;
  vi.resetModules();
});

describe('auth.routes rate limiter', () => {
  it('uses a relaxed limit (10_000) under NODE_ENV=test', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await import('./auth.routes.js');
    expect(captured.opts?.max).toBe(10_000);
    vi.unstubAllEnvs();
  });

  it('uses the production limit (10) outside test', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await import('./auth.routes.js');
    expect(captured.opts?.max).toBe(10);
    vi.unstubAllEnvs();
  });
});
