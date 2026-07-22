import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const mockHints = { generateHint: vi.fn() };
vi.mock('../services/hints.service.js', () => mockHints);

const mockUsage = { consume: vi.fn(), getState: vi.fn() };
vi.mock('../services/usage.service.js', () => mockUsage);

const mockUserRepo = { getRole: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const { getHint } = await import('./hints.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    params: { courseKey: 'python', lessonSlug: 'vars' },
    body: { code: 'x = 1', level: 1, lang: 'en' },
    user: { id: 5 },
    ...overrides,
  } as unknown as Request;
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUserRepo.getRole.mockResolvedValue('USER');
});

describe('getHint', () => {
  it('generates a hint and returns it with the refreshed usage', async () => {
    mockUsage.getState.mockReturnValue({ remaining: 4 });
    mockHints.generateHint.mockResolvedValue({ hint: 'try a loop', level: 1, maxLevel: 3 });
    mockUsage.consume.mockReturnValue({ getHint: { used: 7 } });
    const res = mockRes();

    await getHint(mockReq(), res, vi.fn());

    expect(mockUsage.getState).toHaveBeenCalledWith(5, 'getHint', false);
    expect(mockUsage.consume).toHaveBeenCalledWith(5, 'getHint', false);
    expect(res.json).toHaveBeenCalledWith({
      hint: 'try a loop',
      level: 1,
      maxLevel: 3,
      usage: { getHint: { used: 7 } },
    });
  });

  it('rejects with 429 before calling Gemini when the budget is empty', async () => {
    mockUsage.getState.mockReturnValue({ remaining: 0 });
    const next = vi.fn();

    await getHint(mockReq(), mockRes(), next);

    expect(mockHints.generateHint).not.toHaveBeenCalled();
    expect(mockUsage.consume).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(429);
  });

  it('does not consume when generation fails', async () => {
    mockUsage.getState.mockReturnValue({ remaining: 3 });
    mockHints.generateHint.mockRejectedValue(new Error('gemini down'));
    const next = vi.fn();

    await getHint(mockReq(), mockRes(), next);

    expect(mockUsage.consume).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('treats admins as unlimited', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockUsage.getState.mockReturnValue({ remaining: Infinity });
    mockHints.generateHint.mockResolvedValue({ hint: 'h', level: 2, maxLevel: 3 });
    mockUsage.consume.mockReturnValue({ getHint: { unlimited: true } });

    await getHint(mockReq({ body: { code: '', level: 2, lang: 'ro' } }), mockRes(), vi.fn());

    expect(mockUsage.getState).toHaveBeenCalledWith(5, 'getHint', true);
  });
});
