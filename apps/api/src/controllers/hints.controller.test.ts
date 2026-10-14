import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const mockHints = { generateHint: vi.fn() };
vi.mock('../services/hints.service.js', () => mockHints);

const mockUsage = { hold: vi.fn(), release: vi.fn(), getSummary: vi.fn() };
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

const held = { userId: 5, action: 'getHint', windowStart: new Date(0), units: 1 };

describe('getHint', () => {
  it('generates a hint and returns it with the refreshed usage', async () => {
    mockUsage.hold.mockResolvedValue(held);
    mockHints.generateHint.mockResolvedValue({ hint: 'try a loop', level: 1, maxLevel: 3 });
    mockUsage.getSummary.mockResolvedValue({ getHint: { used: 7 } });
    const res = mockRes();

    await getHint(mockReq(), res, vi.fn());

    expect(mockUsage.hold).toHaveBeenCalledWith(5, 'getHint', false);
    expect(mockUsage.release).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      hint: 'try a loop',
      level: 1,
      maxLevel: 3,
      usage: { getHint: { used: 7 } },
    });
  });

  it('rejects with 429 before calling Gemini when the budget is empty', async () => {
    mockUsage.hold.mockRejectedValue(new AppError(429, 'Limit reached'));
    const next = vi.fn();

    await getHint(mockReq(), mockRes(), next);

    expect(mockHints.generateHint).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(429);
  });

  it('gives the hint back when generation fails', async () => {
    mockUsage.hold.mockResolvedValue(held);
    mockHints.generateHint.mockRejectedValue(new Error('gemini down'));
    const next = vi.fn();

    await getHint(mockReq(), mockRes(), next);

    expect(mockUsage.release).toHaveBeenCalledWith(held, 1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('treats admins as unlimited', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockUsage.hold.mockResolvedValue(null);
    mockHints.generateHint.mockResolvedValue({ hint: 'h', level: 2, maxLevel: 3 });
    mockUsage.getSummary.mockResolvedValue({ getHint: { unlimited: true } });

    await getHint(mockReq({ body: { code: '', level: 2, lang: 'ro' } }), mockRes(), vi.fn());

    expect(mockUsage.hold).toHaveBeenCalledWith(5, 'getHint', true);
  });
});
