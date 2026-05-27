import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockSignup = vi.fn();
const mockLogin = vi.fn();
const mockGetUser = vi.fn();
const mockForgotPassword = vi.fn();
const mockResetPassword = vi.fn();

vi.mock('../services/auth.service.js', () => ({
  signup: (...args: unknown[]) => mockSignup(...args),
  login: (...args: unknown[]) => mockLogin(...args),
  getUser: (...args: unknown[]) => mockGetUser(...args),
  forgotPassword: (...args: unknown[]) => mockForgotPassword(...args),
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return {};
    }
  },
}));

const { signup, login, logout, forgotPassword, resetPassword, me } =
  await import('./auth.controller.js');

type NextFunction = import('express').NextFunction;

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response & {
  cookie: ReturnType<typeof vi.fn>;
  clearCookie: ReturnType<typeof vi.fn>;
} {
  const res = {
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response & {
    cookie: ReturnType<typeof vi.fn>;
    clearCookie: ReturnType<typeof vi.fn>;
  };
}

beforeEach(() => vi.clearAllMocks());

describe('signup', () => {
  it('creates user, sets cookie, and returns success', async () => {
    mockSignup.mockResolvedValue('jwt-token-123');
    const req = mockReq({ body: { name: 'Test', email: 'test@test.com', password: 'pass123' } });
    const res = mockRes();
    const next = mockNext();
    await signup(req, res, next);
    expect(mockSignup).toHaveBeenCalledWith('Test', 'test@test.com', 'pass123');
    expect(res.cookie).toHaveBeenCalledWith('token', 'jwt-token-123', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
  });

  it('calls next on error', async () => {
    const err = new Error('fail');
    mockSignup.mockRejectedValue(err);
    const req = mockReq({ body: { name: 'T', email: 't@t.com', password: 'p' } });
    const res = mockRes();
    const next = mockNext();
    await signup(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('login', () => {
  it('logs in, sets cookie, and returns success', async () => {
    mockLogin.mockResolvedValue('jwt-token-456');
    const req = mockReq({ body: { email: 'test@test.com', password: 'pass123' } });
    const res = mockRes();
    const next = mockNext();
    await login(req, res, next);
    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'pass123');
    expect(res.cookie).toHaveBeenCalledWith('token', 'jwt-token-456', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
  });

  it('calls next on error', async () => {
    const err = new Error('fail');
    mockLogin.mockRejectedValue(err);
    const req = mockReq({ body: { email: 't@t.com', password: 'p' } });
    const res = mockRes();
    const next = mockNext();
    await login(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('logout', () => {
  it('clears cookie and returns success', () => {
    const req = mockReq();
    const res = mockRes();
    logout(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith(
      'token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
  });
});

describe('forgotPassword', () => {
  it('returns success message', async () => {
    mockForgotPassword.mockResolvedValue(undefined);
    const req = mockReq({ body: { email: 'test@test.com' } });
    const res = mockRes();
    const next = mockNext();
    await forgotPassword(req, res, next);
    expect(mockForgotPassword).toHaveBeenCalledWith('test@test.com');
    expect(res.json).toHaveBeenCalledWith({
      message: 'If that email exists, a reset code was sent',
    });
  });

  it('calls next on error', async () => {
    const err = new Error('fail');
    mockForgotPassword.mockRejectedValue(err);
    const req = mockReq({ body: { email: 'test@test.com' } });
    const res = mockRes();
    const next = mockNext();
    await forgotPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('resetPassword', () => {
  it('resets password and returns success', async () => {
    mockResetPassword.mockResolvedValue(undefined);
    const req = mockReq({ body: { email: 'test@test.com', code: '123456', password: 'new' } });
    const res = mockRes();
    const next = mockNext();
    await resetPassword(req, res, next);
    expect(mockResetPassword).toHaveBeenCalledWith('test@test.com', '123456', 'new');
    expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successfully' });
  });

  it('calls next on error', async () => {
    const err = new Error('fail');
    mockResetPassword.mockRejectedValue(err);
    const req = mockReq({ body: { email: 'a', code: '0', password: 'p' } });
    const res = mockRes();
    const next = mockNext();
    await resetPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('me', () => {
  it('returns current user data', async () => {
    const userData = { id: 1, name: 'Test', email: 'test@test.com' };
    mockGetUser.mockResolvedValue(userData);
    const req = mockReq({ user: { id: 1 } as Request['user'] });
    const res = mockRes();
    const next = mockNext();
    await me(req, res, next);
    expect(mockGetUser).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(userData);
  });

  it('calls next on error', async () => {
    const err = new Error('fail');
    mockGetUser.mockRejectedValue(err);
    const req = mockReq({ user: { id: 1 } as Request['user'] });
    const res = mockRes();
    const next = mockNext();
    await me(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
