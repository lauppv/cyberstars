import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockUsage = { getSummary: vi.fn(), consume: vi.fn() };
vi.mock('../services/usage.service.js', () => mockUsage);

const mockUserRepo = { getRole: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const mockPaths = { contentDir: vi.fn((key: string) => `/lessons/${key}`), readLocalized: vi.fn() };
vi.mock('../services/paths.js', () => mockPaths);

const { getUsage, revealSolution } = await import('./usage.controller.js');

function mockReq(id = 5, params: Record<string, string> = {}, body: object = {}): Request {
  return { user: { id }, params, body } as unknown as Request;
}

function solutionReq(lessonSlug = 'loops', body: object = { lang: 'en' }, id = 8): Request {
  return mockReq(id, { courseKey: 'python', lessonSlug }, body);
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getUsage', () => {
  it('passes admin=true for a FOUNDER role', async () => {
    mockUserRepo.getRole.mockResolvedValue('FOUNDER');
    mockUsage.getSummary.mockReturnValue({ ok: true });
    const res = mockRes();
    await getUsage(mockReq(), res, vi.fn());
    expect(mockUsage.getSummary).toHaveBeenCalledWith(5, true);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('passes admin=false for a USER role', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockUsage.getSummary.mockReturnValue({});
    await getUsage(mockReq(), mockRes(), vi.fn());
    expect(mockUsage.getSummary).toHaveBeenCalledWith(5, false);
  });

  it('forwards errors to next', async () => {
    mockUserRepo.getRole.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getUsage(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('revealSolution', () => {
  it('spends a reveal and returns the solution with the refreshed usage', async () => {
    mockPaths.readLocalized.mockReturnValue('```py\nprint(1)\n```');
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockUsage.consume.mockReturnValue({ spent: 1 });
    const res = mockRes();
    await revealSolution(solutionReq(), res, vi.fn());
    expect(mockPaths.readLocalized).toHaveBeenCalledWith(
      '/lessons/python',
      'loops-solution.md',
      'en',
    );
    expect(mockUsage.consume).toHaveBeenCalledWith(8, 'showSolution', false);
    expect(res.json).toHaveBeenCalledWith({
      solution: '```py\nprint(1)\n```',
      usage: { spent: 1 },
    });
  });

  it('reads the Romanian solution when asked, and English otherwise', async () => {
    mockPaths.readLocalized.mockReturnValue('x');
    mockUserRepo.getRole.mockResolvedValue('USER');
    await revealSolution(solutionReq('loops', { lang: 'ro' }), mockRes(), vi.fn());
    await revealSolution(solutionReq('loops', {}), mockRes(), vi.fn());
    expect(mockPaths.readLocalized).toHaveBeenNthCalledWith(
      1,
      '/lessons/python',
      'loops-solution.md',
      'ro',
    );
    expect(mockPaths.readLocalized).toHaveBeenNthCalledWith(
      2,
      '/lessons/python',
      'loops-solution.md',
      'en',
    );
  });

  it("reads a multi-language lesson's solution in the language on screen", async () => {
    mockPaths.readLocalized.mockReturnValue('x');
    mockUserRepo.getRole.mockResolvedValue('USER');
    const req = solutionReq('trees', { lang: 'en', language: 'java' });
    req.params.courseKey = 'trees-graphs';
    await revealSolution(req, mockRes(), vi.fn());
    expect(mockPaths.contentDir).toHaveBeenCalledWith('trees-graphs', 'java');
  });

  it('404s without spending a reveal when the lesson has no solution', async () => {
    mockPaths.readLocalized.mockReturnValue('');
    const next = vi.fn();
    await revealSolution(solutionReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    expect(mockUsage.consume).not.toHaveBeenCalled();
  });

  it('404s on a slug that tries to leave the course directory', async () => {
    const next = vi.fn();
    await revealSolution(solutionReq('../../etc/passwd'), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    expect(mockPaths.readLocalized).not.toHaveBeenCalled();
    expect(mockUsage.consume).not.toHaveBeenCalled();
  });

  it('forwards a 429 from the service to next', async () => {
    mockPaths.readLocalized.mockReturnValue('x');
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockUsage.consume.mockImplementation(() => {
      throw new Error('limit');
    });
    const next = vi.fn();
    await revealSolution(solutionReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
