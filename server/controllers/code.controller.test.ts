import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockExecute = vi.fn();

vi.mock('../services/code-execution.service.js', () => ({
  execute: (...args: unknown[]) => mockExecute(...args),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return {};
    }
  },
}));

const { executeCode } = await import('./code.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
  return res as unknown as Response;
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

type NextFunction = import('express').NextFunction;

beforeEach(() => vi.clearAllMocks());

describe('executeCode', () => {
  it('executes code and returns output', async () => {
    mockExecute.mockResolvedValue('Hello World');
    const req = mockReq({ body: { code: 'print("Hello World")', language: 'python' } });
    const res = mockRes();
    const next = mockNext();
    await executeCode(req, res, next);
    expect(mockExecute).toHaveBeenCalledWith('print("Hello World")', 'python');
    expect(res.json).toHaveBeenCalledWith({ output: 'Hello World' });
  });

  it('calls next on error', async () => {
    const err = new Error('exec failed');
    mockExecute.mockRejectedValue(err);
    const req = mockReq({ body: { code: 'bad', language: 'python' } });
    const res = mockRes();
    const next = mockNext();
    await executeCode(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
