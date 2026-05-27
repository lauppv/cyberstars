import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

type Limiter = (req: Request, res: Response, next: () => void) => void;
type RateLimitOpts = { limit?: number; max?: number };

const captured: { opts?: RateLimitOpts } = {};

vi.mock('express-rate-limit', () => ({
  default: (opts: RateLimitOpts): Limiter => {
    captured.opts = opts;
    return (_req: Request, _res: Response, next: () => void) => next();
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticateToken: (_req: Request, _res: Response, next: () => void) => next(),
  optionalAuth: (_req: Request, _res: Response, next: () => void) => next(),
}));

vi.mock('../middleware/validate.js', () => ({
  validateBody: () => (_req: Request, _res: Response, next: () => void) => next(),
}));

vi.mock('../controllers/forum.controller.js', () => ({
  getCategories: vi.fn(),
  getThreads: vi.fn(),
  getThread: vi.fn(),
  createThread: vi.fn(),
  createPost: vi.fn(),
  deleteThread: vi.fn(),
  toggleReaction: vi.fn(),
  markSolution: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
  updateUserRole: vi.fn(),
}));

beforeEach(() => {
  captured.opts = undefined;
  vi.resetModules();
});

describe('forum.routes rate limiter', () => {
  it('uses a relaxed limit (10_000) under NODE_ENV=test', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await import('./forum.routes.js');
    expect(captured.opts?.limit).toBe(10_000);
    vi.unstubAllEnvs();
  });

  it('uses the production limit (10) outside test', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await import('./forum.routes.js');
    expect(captured.opts?.limit).toBe(10);
    vi.unstubAllEnvs();
  });
});
