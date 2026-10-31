import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const getRole = vi.fn();
vi.mock('../repositories/user.repository.js', () => ({
  getRole: (...args: unknown[]) => getRole(...args),
}));

const { requireFeatureAccess } = await import('./features.js');
const { PREVIEW_FEATURES } = await import('@cyberstars/shared/features');
const { config } = await import('../config/index.js');

// Uses `messaging` as the sample preview feature, since `leaderboard` is now
// launched (logged-in only), so it no longer exercises the admin-only branch.
describe('requireFeatureAccess (preview gate)', () => {
  function makeReq(user?: { id: number }) {
    const req = { user } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;
    return { req, res, next };
  }

  const wasProduction = config.isProduction;
  const originalFlag = PREVIEW_FEATURES.messaging;
  beforeEach(() => {
    // Force the sample feature into preview so the admin-only assertions are
    // independent of its real launch state (it may already be launched).
    PREVIEW_FEATURES.messaging = true;
  });
  afterEach(() => {
    Object.assign(config, { isProduction: wasProduction });
    PREVIEW_FEATURES.messaging = originalFlag;
    vi.clearAllMocks();
  });

  it('lets anyone through on dev, without touching the DB', async () => {
    Object.assign(config, { isProduction: false });
    const { req, res, next } = makeReq();
    await requireFeatureAccess('messaging')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(getRole).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('404s a guest on prod (feature is hidden, no role lookup)', async () => {
    Object.assign(config, { isProduction: true });
    const { req, res, next } = makeReq();
    await requireFeatureAccess('messaging')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(getRole).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('404s a non-admin USER on prod', async () => {
    Object.assign(config, { isProduction: true });
    getRole.mockResolvedValueOnce('USER');
    const { req, res, next } = makeReq({ id: 7 });
    await requireFeatureAccess('messaging')(req, res, next);
    expect(getRole).toHaveBeenCalledWith(7);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('lets an ADMIN through on prod', async () => {
    Object.assign(config, { isProduction: true });
    getRole.mockResolvedValueOnce('ADMIN');
    const { req, res, next } = makeReq({ id: 1 });
    await requireFeatureAccess('messaging')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('forwards errors to next', async () => {
    Object.assign(config, { isProduction: true });
    const boom = new Error('db down');
    getRole.mockRejectedValueOnce(boom);
    const { req, res, next } = makeReq({ id: 7 });
    await requireFeatureAccess('messaging')(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});
