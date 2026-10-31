import { describe, it, expect, vi, beforeEach } from 'vitest';
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

const { authenticateToken, optionalAuth, requireAdmin } = await import('./auth.js');

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
