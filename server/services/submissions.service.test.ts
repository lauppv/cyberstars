import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RunTestsResponse } from '../../shared/tests.js';

const mockRepo = {
  createAndPrune: vi.fn(),
  listForLesson: vi.fn(),
  findOwned: vi.fn(),
};

vi.mock('../repositories/submissions.repository.js', () => mockRepo);

const service = await import('./submissions.service.js');

const createdAt = new Date('2026-10-09T12:00:00.000Z');

const summaryRow = {
  id: 9,
  status: 'failed',
  passedCount: 1,
  total: 3,
  runtimeMs: 12.5,
  referenceMs: 10.25,
  lang: 'ro',
  createdAt,
};

const summary = {
  id: 9,
  status: 'failed',
  passedCount: 1,
  total: 3,
  runtimeMs: 12.5,
  referenceMs: 10.25,
  lang: 'ro',
  createdAt: '2026-10-09T12:00:00.000Z',
};

beforeEach(() => vi.clearAllMocks());

describe('record', () => {
  it('stores the verdict with the case the run stopped on and returns its summary', async () => {
    mockRepo.createAndPrune.mockResolvedValue({ ...summaryRow, code: 'x' });
    const failed = { index: 1, visible: true, passed: false, expected: '2', actual: '3' };
    const result: RunTestsResponse = {
      status: 'failed',
      structureFailures: [],
      cases: [{ index: 0, visible: true, passed: true }, failed],
      total: 3,
      passedCount: 1,
      runtimeMs: 12.5,
      referenceMs: 10.25,
    };

    expect(await service.record(7, 'python', 'print', 'ro', 'print(3)', result)).toEqual(summary);

    expect(mockRepo.createAndPrune).toHaveBeenCalledWith(
      {
        userId: 7,
        courseKey: 'python',
        lessonSlug: 'print',
        status: 'failed',
        passedCount: 1,
        total: 3,
        runtimeMs: 12.5,
        referenceMs: 10.25,
        lang: 'ro',
        code: 'print(3)',
        syntaxError: null,
        structureFailures: [],
        failedCase: failed,
      },
      20,
    );
  });

  it('stores nulls for absent timings, a syntax error and no failed case', async () => {
    mockRepo.createAndPrune.mockResolvedValue({ ...summaryRow, runtimeMs: null });
    const result: RunTestsResponse = {
      status: 'failed',
      syntaxError: 'line 1',
      structureFailures: [],
      cases: [],
      total: 3,
      passedCount: 0,
    };

    const out = await service.record(7, 'python', 'print', 'en', 'print(', result);

    expect(out.runtimeMs).toBeNull();
    expect(mockRepo.createAndPrune).toHaveBeenCalledWith(
      expect.objectContaining({
        runtimeMs: null,
        referenceMs: null,
        syntaxError: 'line 1',
        failedCase: null,
      }),
      20,
    );
  });
});

describe('listForLesson', () => {
  it('maps the rows to summaries', async () => {
    mockRepo.listForLesson.mockResolvedValue([summaryRow]);

    expect(await service.listForLesson(7, 'python', 'print')).toEqual([summary]);
    expect(mockRepo.listForLesson).toHaveBeenCalledWith(7, 'python', 'print');
  });

  it('rejects an unknown course before touching the database', async () => {
    await expect(service.listForLesson(7, 'nope', 'print')).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(mockRepo.listForLesson).not.toHaveBeenCalled();
  });
});

describe('getForUser', () => {
  it('returns the stored attempt with its code and failure details', async () => {
    const structureFailures = [{ type: 'require', rule: { kind: 'loop' } }];
    const failedCase = { index: 0, visible: false, passed: false };
    mockRepo.findOwned.mockResolvedValue({
      ...summaryRow,
      code: 'print(3)',
      syntaxError: null,
      structureFailures,
      failedCase,
    });

    expect(await service.getForUser(7, 9)).toEqual({
      ...summary,
      code: 'print(3)',
      syntaxError: null,
      structureFailures,
      failedCase,
    });
    expect(mockRepo.findOwned).toHaveBeenCalledWith(7, 9);
  });

  it('404s a missing or foreign attempt', async () => {
    mockRepo.findOwned.mockResolvedValue(null);

    await expect(service.getForUser(7, 9)).rejects.toMatchObject({ statusCode: 404 });
  });
});
