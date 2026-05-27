import { describe, it, expect, vi } from 'vitest';
import { z, ZodError } from 'zod';
import { validateBody } from './validate.js';
import type { Request, Response, NextFunction } from 'express';

const schema = z.object({ name: z.string().min(1), age: z.number() });

function callMiddleware(body: unknown) {
  const req = { body } as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;

  validateBody(schema)(req, res, next);

  return { req, res, next };
}

describe('validateBody', () => {
  it('calls next and sets parsed body on valid input', () => {
    const { req, next } = callMiddleware({ name: 'Ada', age: 25 });
    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ name: 'Ada', age: 25 });
  });

  it('returns 400 with error message on invalid input', () => {
    const { res, next } = callMiddleware({ name: '', age: 'not a number' });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String), issues: expect.any(Array) }),
    );
  });

  it('returns 400 when body is missing fields', () => {
    const { res, next } = callMiddleware({});
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('falls back to generic error message when ZodError has no issues', () => {
    const throwingSchema = {
      parse: () => {
        throw new ZodError([]);
      },
    } as unknown as Parameters<typeof validateBody>[0];

    const req = { body: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    validateBody(throwingSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Invalid request body' }),
    );
  });

  it('forwards non-ZodError to next() instead of responding', () => {
    const boom = new Error('something else broke');
    const throwingSchema = {
      parse: () => {
        throw boom;
      },
    } as unknown as Parameters<typeof validateBody>[0];

    const req = { body: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    validateBody(throwingSchema)(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(boom);
  });
});
