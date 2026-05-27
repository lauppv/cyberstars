import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

type Limiter = (req: Request, res: Response, next: () => void) => void;
type RateLimitOpts = {
  max: number;
  handler: (req: Request, res: Response) => void;
};

const captured: { opts?: RateLimitOpts } = {};

vi.mock('express-rate-limit', () => ({
  default: (opts: RateLimitOpts): Limiter => {
    captured.opts = opts;
    return (_req: Request, _res: Response, next: () => void) => next();
  },
}));

vi.mock('../middleware/auth.js', () => ({
  optionalAuth: (_req: Request, _res: Response, next: () => void) => next(),
}));

vi.mock('../middleware/validate.js', () => ({
  validateBody: () => (_req: Request, _res: Response, next: () => void) => next(),
}));

vi.mock('../controllers/code.controller.js', () => ({
  executeCode: vi.fn(),
  submitCode: vi.fn(),
}));

beforeEach(async () => {
  captured.opts = undefined;
  vi.resetModules();
});

function loadRoutes() {
  return import('./code.routes.js');
}

function mockResponse(resetHeader: number | string | undefined) {
  const headers: Record<string, number | string | undefined> = {
    'RateLimit-Reset': resetHeader,
  };
  const status = vi.fn().mockReturnThis();
  const json = vi.fn().mockReturnThis();
  return {
    status,
    json,
    getHeader: (name: string) => headers[name],
  } as unknown as Response;
}

describe('code.routes rate limiter', () => {
  it('uses a relaxed limit (10_000) under NODE_ENV=test', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await loadRoutes();
    expect(captured.opts?.max).toBe(10_000);
    vi.unstubAllEnvs();
  });

  it('uses the production limit (10) outside test', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await loadRoutes();
    expect(captured.opts?.max).toBe(10);
    vi.unstubAllEnvs();
  });

  it('handler responds 429 with reset header as number', async () => {
    await loadRoutes();
    const res = mockResponse(42);
    captured.opts!.handler({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: 'Too many requests. Try again in 42 seconds.' });
  });

  it('handler parses reset header when given as string', async () => {
    await loadRoutes();
    const res = mockResponse('25');
    captured.opts!.handler({} as Request, res);
    expect(res.json).toHaveBeenCalledWith({ error: 'Too many requests. Try again in 25 seconds.' });
  });

  it('handler falls back to 60 seconds when reset header is missing/unparseable', async () => {
    await loadRoutes();
    const res = mockResponse(undefined);
    captured.opts!.handler({} as Request, res);
    expect(res.json).toHaveBeenCalledWith({ error: 'Too many requests. Try again in 60 seconds.' });
  });
});
