import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

type Limiter = (req: Request, res: Response, next: () => void) => void;
type RateLimitOpts = { limit?: number; max?: number };

const captured: { opts: RateLimitOpts[] } = { opts: [] };

vi.mock('express-rate-limit', () => ({
  default: (opts: RateLimitOpts): Limiter => {
    captured.opts.push(opts);
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
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
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
  captured.opts = [];
  vi.resetModules();
});

describe('forum.routes rate limiter', () => {
  it('relaxes both write and read limiters under NODE_ENV=test', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await import('./forum.routes.js');
    expect(captured.opts.map((o) => o.limit)).toEqual([10_000, 100_000]);
    vi.unstubAllEnvs();
  });

  it('uses production limits outside test', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await import('./forum.routes.js');
    expect(captured.opts.map((o) => o.limit)).toEqual([10, 120]);
    vi.unstubAllEnvs();
  });
});
