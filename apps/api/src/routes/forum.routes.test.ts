import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

type Limiter = (req: Request, res: Response, next: () => void) => void;
type RateLimitOpts = { limit?: number; skip?: () => boolean };

const captured: { opts: RateLimitOpts[] } = { opts: [] };

vi.mock('express-rate-limit', () => ({
  default: (opts: RateLimitOpts): Limiter => {
    captured.opts.push(opts);
    return (_req: Request, _res: Response, next: () => void) => next();
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticateToken: (_req: Request, _res: Response, next: () => void) => next(),
}));

vi.mock('@cyberstars-framework/server-kit/validate', () => ({
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
  it('allows 10 writes and 120 reads a minute, and lets tests through', async () => {
    await import('./forum.routes.js');
    expect(captured.opts.map((o) => o.limit)).toEqual([10, 120]);
    expect(captured.opts.map((o) => o.skip?.())).toEqual([true, true]);
  });
});
