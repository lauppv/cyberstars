import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const mockTutor = { askTutor: vi.fn() };
vi.mock('../services/tutor.service.js', () => mockTutor);

const mockUserRepo = { getRole: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const { chat } = await import('./tutor.controller.js');

function mockReq(body: Record<string, unknown> = {}): Request {
  return {
    body: { message: 'which lesson has loops?', page: '/courses', lang: 'ro', ...body },
    user: { id: 5 },
  } as unknown as Request;
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUserRepo.getRole.mockResolvedValue('USER');
});

describe('chat', () => {
  it("asks the tutor with the student's role and returns the answer", async () => {
    mockTutor.askTutor.mockResolvedValue('Try the For lesson.');
    const res = mockRes();

    await chat(mockReq(), res, vi.fn());

    expect(mockUserRepo.getRole).toHaveBeenCalledWith(5);
    expect(mockTutor.askTutor).toHaveBeenCalledWith({
      message: 'which lesson has loops?',
      page: '/courses',
      uiLang: 'ro',
      role: 'USER',
      isProd: false,
    });
    expect(res.json).toHaveBeenCalledWith({ answer: 'Try the For lesson.' });
  });

  it('falls back to English when the client sends no language', async () => {
    mockTutor.askTutor.mockResolvedValue('ok');

    await chat(mockReq({ lang: undefined }), mockRes(), vi.fn());

    expect(mockTutor.askTutor).toHaveBeenCalledWith(expect.objectContaining({ uiLang: 'en' }));
  });

  it('tells the tutor it runs on prod when it does', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    mockTutor.askTutor.mockResolvedValue('ok');

    await chat(mockReq(), mockRes(), vi.fn());

    expect(mockTutor.askTutor).toHaveBeenCalledWith(expect.objectContaining({ isProd: true }));
    vi.unstubAllEnvs();
  });

  it('passes a tutor error on to the error handler', async () => {
    const err = new AppError(502, 'The tutor could not answer right now, please try again');
    mockTutor.askTutor.mockRejectedValue(err);
    const next = vi.fn();
    const res = mockRes();

    await chat(mockReq(), res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.json).not.toHaveBeenCalled();
  });
});
