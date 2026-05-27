import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const { authenticateToken, optionalAuth } = await import('./auth.js');

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
