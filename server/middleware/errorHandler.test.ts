import { describe, it, expect, vi } from 'vitest';
import { AppError, errorHandler } from './errorHandler.js';
import type { Request, Response, NextFunction } from 'express';

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('AppError', () => {
  it('stores statusCode and message', () => {
    const err = new AppError(404, 'Not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err.name).toBe('AppError');
  });
});

describe('errorHandler', () => {
  it('returns statusCode and message for AppError', () => {
    const res = mockRes();
    errorHandler(
      new AppError(422, 'Bad input'),
      {} as Request,
      res,
      vi.fn() as unknown as NextFunction,
    );
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad input' });
  });

  it('returns 500 for generic errors', () => {
    const res = mockRes();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    errorHandler(new Error('oops'), {} as Request, res, vi.fn() as unknown as NextFunction);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    spy.mockRestore();
  });
});
