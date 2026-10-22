import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const getRole = vi.fn();
const getSessionVersion = vi.fn();
vi.mock('../repositories/user.repository.js', () => ({
  getRole: (...args: unknown[]) => getRole(...args),
  getSessionVersion: (...args: unknown[]) => getSessionVersion(...args),
}));

const { authenticateToken, optionalAuth, requireAdmin, requireFeatureAccess } =
  await import('./auth.js');
const { PREVIEW_FEATURES } = await import('@cyberstars/shared/features');

function makeReqRes(token?: string) {
  const req = { cookies: token ? { token } : {} } as unknown as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

const validToken = jwt.sign({ id: 42 }, 'test-secret');

beforeEach(() => {
  vi.clearAllMocks();
  getSessionVersion.mockResolvedValue(0);
});

describe('authenticateToken', () => {
  it('sets req.user and calls next for valid token', async () => {
    const { req, res, next } = makeReqRes(validToken);
    await authenticateToken(req, res, next);
    expect(req.user).toEqual({ id: 42 });
    expect(next).toHaveBeenCalledWith();
  });

  it('returns 401 when no token', async () => {
    const { req, res, next } = makeReqRes();
    await authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 for invalid token', async () => {
    const { req, res, next } = makeReqRes('garbage');
    await authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('answers a session ended by a password change like an expired one', async () => {
    getSessionVersion.mockResolvedValue(1);
    const { req, res, next } = makeReqRes(validToken);
    await authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards a failed session check to next', async () => {
    const boom = new Error('db down');
    getSessionVersion.mockRejectedValue(boom);
    const { req, res, next } = makeReqRes(validToken);
    await authenticateToken(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('requireAdmin', () => {
  function makeAdminReq(id: number) {
    const req = { user: { id } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;
    return { req, res, next };
  }

  it('calls next for an ADMIN (role read from DB, not the token)', async () => {
    getRole.mockResolvedValueOnce('ADMIN');
    const { req, res, next } = makeAdminReq(42);
    await requireAdmin(req, res, next);
    expect(getRole).toHaveBeenCalledWith(42);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 for a non-admin USER', async () => {
    getRole.mockResolvedValueOnce('USER');
    const { req, res, next } = makeAdminReq(7);
    await requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 for a MODERATOR', async () => {
    getRole.mockResolvedValueOnce('MODERATOR');
    const { req, res, next } = makeAdminReq(7);
    await requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards errors to next', async () => {
    const boom = new Error('db down');
    getRole.mockRejectedValueOnce(boom);
    const { req, res, next } = makeAdminReq(7);
    await requireAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

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

  const originalEnv = process.env.NODE_ENV;
  const originalFlag = PREVIEW_FEATURES.messaging;
  beforeEach(() => {
    // Force the sample feature into preview so the admin-only assertions are
    // independent of its real launch state (it may already be launched).
    PREVIEW_FEATURES.messaging = true;
  });
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    PREVIEW_FEATURES.messaging = originalFlag;
    vi.clearAllMocks();
  });

  it('lets anyone through on dev, without touching the DB', async () => {
    process.env.NODE_ENV = 'development';
    const { req, res, next } = makeReq();
    await requireFeatureAccess('messaging')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(getRole).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('404s a guest on prod (feature is hidden, no role lookup)', async () => {
    process.env.NODE_ENV = 'production';
    const { req, res, next } = makeReq();
    await requireFeatureAccess('messaging')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(getRole).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('404s a non-admin USER on prod', async () => {
    process.env.NODE_ENV = 'production';
    getRole.mockResolvedValueOnce('USER');
    const { req, res, next } = makeReq({ id: 7 });
    await requireFeatureAccess('messaging')(req, res, next);
    expect(getRole).toHaveBeenCalledWith(7);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('lets an ADMIN through on prod', async () => {
    process.env.NODE_ENV = 'production';
    getRole.mockResolvedValueOnce('ADMIN');
    const { req, res, next } = makeReq({ id: 1 });
    await requireFeatureAccess('messaging')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('forwards errors to next', async () => {
    process.env.NODE_ENV = 'production';
    const boom = new Error('db down');
    getRole.mockRejectedValueOnce(boom);
    const { req, res, next } = makeReq({ id: 7 });
    await requireFeatureAccess('messaging')(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('optionalAuth', () => {
  it('sets req.user for valid token', async () => {
    const { req, res, next } = makeReqRes(validToken);
    await optionalAuth(req, res, next);
    expect(req.user).toEqual({ id: 42 });
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next without user when no token', async () => {
    const { req, res, next } = makeReqRes();
    await optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next without user for invalid token', async () => {
    const { req, res, next } = makeReqRes('garbage');
    await optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('treats a session ended by a password change as a guest', async () => {
    getSessionVersion.mockResolvedValue(1);
    const { req, res, next } = makeReqRes(validToken);
    await optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('forwards a failed session check to next', async () => {
    const boom = new Error('db down');
    getSessionVersion.mockRejectedValue(boom);
    const { req, res, next } = makeReqRes(validToken);
    await optionalAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});
