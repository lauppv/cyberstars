import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const getRole = vi.fn();
vi.mock('../repositories/user.repository.js', () => ({
  getRole: (...args: unknown[]) => getRole(...args),
}));

const { authenticateToken, optionalAuth, requireAdmin, requireFeatureAccess } =
  await import('./auth.js');

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
});

describe('authenticateToken', () => {
  it('sets req.user and calls next for valid token', () => {
    const { req, res, next } = makeReqRes(validToken);
    authenticateToken(req, res, next);
    expect(req.user).toEqual(expect.objectContaining({ id: 42 }));
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 when no token', () => {
    const { req, res, next } = makeReqRes();
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 for invalid token', () => {
    const { req, res, next } = makeReqRes('garbage');
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
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
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.clearAllMocks();
  });

  it('lets anyone through on dev, without touching the DB', async () => {
    process.env.NODE_ENV = 'development';
    const { req, res, next } = makeReq();
    await requireFeatureAccess('leaderboard')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(getRole).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('404s a guest on prod (feature is hidden, no role lookup)', async () => {
    process.env.NODE_ENV = 'production';
    const { req, res, next } = makeReq();
    await requireFeatureAccess('leaderboard')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(getRole).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('404s a non-admin USER on prod', async () => {
    process.env.NODE_ENV = 'production';
    getRole.mockResolvedValueOnce('USER');
    const { req, res, next } = makeReq({ id: 7 });
    await requireFeatureAccess('leaderboard')(req, res, next);
    expect(getRole).toHaveBeenCalledWith(7);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('lets an ADMIN through on prod', async () => {
    process.env.NODE_ENV = 'production';
    getRole.mockResolvedValueOnce('ADMIN');
    const { req, res, next } = makeReq({ id: 1 });
    await requireFeatureAccess('leaderboard')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('forwards errors to next', async () => {
    process.env.NODE_ENV = 'production';
    const boom = new Error('db down');
    getRole.mockRejectedValueOnce(boom);
    const { req, res, next } = makeReq({ id: 7 });
    await requireFeatureAccess('leaderboard')(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('optionalAuth', () => {
  it('sets req.user for valid token', () => {
    const { req, res, next } = makeReqRes(validToken);
    optionalAuth(req, res, next);
    expect(req.user).toEqual(expect.objectContaining({ id: 42 }));
    expect(next).toHaveBeenCalled();
  });

  it('calls next without user when no token', () => {
    const { req, res, next } = makeReqRes();
    optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('calls next without user for invalid token', () => {
    const { req, res, next } = makeReqRes('garbage');
    optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
