import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

type Limiter = (req: Request, res: Response, next: () => void) => void;
type RateLimitOpts = {
  max: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
  message: { error: string };
};

// every limiter the module makes, in order: authLimiter, then resetCodeLimiter
let captured: RateLimitOpts[] = [];

vi.mock('express-rate-limit', () => ({
  default: (opts: RateLimitOpts): Limiter => {
    captured.push(opts);
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
  captured = [];
  vi.resetModules();
});

describe('auth.routes rate limiter', () => {
  it('uses a relaxed limit (10_000) under NODE_ENV=test', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await import('./auth.routes.js');
    expect(captured[0]?.max).toBe(10_000);
    vi.unstubAllEnvs();
  });

  it('uses the production limit (10) outside test', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await import('./auth.routes.js');
    expect(captured[0]?.max).toBe(10);
    vi.unstubAllEnvs();
  });
});

describe('auth.routes reset code limiter', () => {
  it('allows three codes an hour per email, also under NODE_ENV=test', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await import('./auth.routes.js');
    const opts = captured[1]!;
    expect(opts.max).toBe(3);
    expect(opts.windowMs).toBe(60 * 60 * 1000);
    expect(opts.message.error).toBe('Too many codes asked for this email, try again later');
    vi.unstubAllEnvs();
  });

  it('is keyed by the email, not the IP', async () => {
    await import('./auth.routes.js');
    const req = { ip: '1.2.3.4', body: { email: 'a@b.com' } } as Request;
    expect(captured[1]!.keyGenerator!(req)).toBe('a@b.com');
  });
});
