import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RunTestsResponse } from '@cyberstars/shared/tests';

const mockRepo = {
  createAndPrune: vi.fn(),
  listForLesson: vi.fn(),
  findOwned: vi.fn(),
};

vi.mock('../repositories/submissions.repository.js', () => mockRepo);

const mockLoadTestsSpec = vi.fn();
vi.mock('./lesson-tests.service.js', () => ({
  loadTestsSpec: (...args: unknown[]) => mockLoadTestsSpec(...args),
}));

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
  language: 'python',
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
  language: 'python',
  createdAt: '2026-10-09T12:00:00.000Z',
};

beforeEach(() => vi.clearAllMocks());

describe('record', () => {
  it('stores the verdict with the case the run stopped on and returns its summary', async () => {
    mockRepo.createAndPrune.mockResolvedValue({ ...summaryRow, code: 'x' });
    const failed = { index: 1, visible: true, passed: false, expected: '2', actual: '3' };
    const result: RunTestsResponse = {
      status: 'failed',
      comparator: 'trimmed',
      structureFailures: [],
      cases: [{ index: 0, visible: true, passed: true }, failed],
      total: 3,
      passedCount: 1,
      runtimeMs: 12.5,
      referenceMs: 10.25,
    };

    expect(await service.record(7, 'python', 'print', 'ro', 'python', 'print(3)', result)).toEqual(
      summary,
    );

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
        language: 'python',
        code: 'print(3)',
        syntaxError: null,
        structureFailures: [],
        failedCase: failed,
      },
      20,
      false,
    );
  });

  it("keeps a web lesson's newest passing attempt past the cap", async () => {
    mockRepo.createAndPrune.mockResolvedValue({ ...summaryRow, code: 'x' });
    const result: RunTestsResponse = {
      status: 'passed',
      comparator: 'trimmed',
      structureFailures: [],
      cases: [],
      total: 1,
      passedCount: 1,
    };

    await service.record(7, 'web-dev', 'first-page', 'en', 'web-dev' as never, 'site', result);

    expect(mockRepo.createAndPrune).toHaveBeenCalledWith(
      expect.objectContaining({ courseKey: 'web-dev' }),
      20,
      true,
    );
  });

  describe('a long output', () => {
    const MAX = service.SAVED_OUTPUT_MAX_LENGTH;
    const NOTE = '\n… [cut here: the history keeps only the start]';
    const MB = 'x'.repeat(1024 * 1024);
    const run = (failed: object, extra: Partial<RunTestsResponse> = {}): RunTestsResponse => ({
      status: 'failed',
      comparator: 'trimmed',
      structureFailures: [],
      cases: [failed as RunTestsResponse['cases'][number]],
      total: 1,
      passedCount: 0,
      ...extra,
    });
    const saved = () => mockRepo.createAndPrune.mock.calls[0][0];

    beforeEach(() => mockRepo.createAndPrune.mockResolvedValue({ ...summaryRow, code: 'x' }));

    it('keeps the start of the output and the errors, with a note, and the student gets it whole', async () => {
      const failed = {
        index: 0,
        visible: true,
        passed: false,
        stdin: '5',
        expected: '120',
        actual: MB,
        error: MB,
      };
      const result = run(failed, { syntaxError: MB });

      await service.record(7, 'python', 'print', 'en', 'python', 'x', result);

      const { failedCase, syntaxError } = saved();
      expect(failedCase.actual).toBe('x'.repeat(MAX) + NOTE);
      expect(failedCase.error).toBe('x'.repeat(MAX) + NOTE);
      expect(syntaxError).toBe('x'.repeat(MAX) + NOTE);
      expect(failedCase).toMatchObject({ index: 0, visible: true, stdin: '5', expected: '120' });
      expect(result.cases[0].actual).toBe(MB);
      expect(result.syntaxError).toBe(MB);
    });

    it("cuts what a web page had, and says it in the student's language", async () => {
      const web = { kind: 'logged', found: MB, hidden: true };
      await service.record(
        7,
        'web-dev',
        'first-page',
        'ro',
        'web-dev' as never,
        'site',
        run({ index: 0, visible: false, passed: false, web }),
      );

      expect(saved().failedCase.web).toEqual({
        kind: 'logged',
        hidden: true,
        found: 'x'.repeat(MAX) + '\n… [tăiat aici: istoricul păstrează doar începutul]',
      });
    });

    it('leaves an output at the limit as it is', async () => {
      const actual = 'x'.repeat(MAX);
      await service.record(
        7,
        'python',
        'print',
        'en',
        'python',
        'x',
        run({ index: 0, visible: true, passed: false, actual, error: 'timeout' }),
      );

      expect(saved().failedCase).toEqual({
        index: 0,
        visible: true,
        passed: false,
        actual,
        error: 'timeout',
      });
    });

    it('never keeps half of an emoji', async () => {
      const actual = 'x'.repeat(MAX - 1) + '😀'.repeat(10);
      await service.record(
        7,
        'python',
        'print',
        'en',
        'python',
        'x',
        run({ index: 0, visible: true, passed: false, actual }),
      );

      expect(saved().failedCase.actual).toBe('x'.repeat(MAX - 1) + NOTE);
    });
  });

  it('stores nulls for absent timings, a syntax error and no failed case', async () => {
    mockRepo.createAndPrune.mockResolvedValue({ ...summaryRow, runtimeMs: null });
    const result: RunTestsResponse = {
      status: 'failed',
      comparator: 'trimmed',
      syntaxError: 'line 1',
      structureFailures: [],
      cases: [],
      total: 3,
      passedCount: 0,
    };

    const out = await service.record(7, 'python', 'print', 'en', 'python', 'print(', result);

    expect(out.runtimeMs).toBeNull();
    expect(mockRepo.createAndPrune).toHaveBeenCalledWith(
      expect.objectContaining({
        runtimeMs: null,
        referenceMs: null,
        syntaxError: 'line 1',
        failedCase: null,
      }),
      20,
      false,
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
      courseKey: 'python',
      lessonSlug: 'print',
      code: 'print(3)',
      syntaxError: null,
      structureFailures,
      failedCase,
    });
    mockLoadTestsSpec.mockReturnValue({ structure: {}, cases: [] });

    expect(await service.getForUser(7, 9)).toEqual({
      ...summary,
      code: 'print(3)',
      syntaxError: null,
      structureFailures,
      failedCase,
      comparator: 'trimmed',
    });
    expect(mockRepo.findOwned).toHaveBeenCalledWith(7, 9);
    expect(mockLoadTestsSpec).toHaveBeenCalledWith('python', 'print', 'ro', 'python');
  });

  it('reads the comparator from the lesson, and leaves it out once the lesson has no tests', async () => {
    const row = {
      ...summaryRow,
      courseKey: 'c',
      lessonSlug: 'os-fork',
      code: 'x',
      syntaxError: null,
      structureFailures: [],
      failedCase: null,
    };
    mockRepo.findOwned.mockResolvedValue(row);
    mockLoadTestsSpec.mockReturnValue({ comparator: 'masked', structure: {}, cases: [] });
    expect((await service.getForUser(7, 9)).comparator).toBe('masked');

    mockLoadTestsSpec.mockReturnValue(null);
    expect(await service.getForUser(7, 9)).not.toHaveProperty('comparator');
  });

  it("opens a web lesson's attempt, whose language picks no folder", async () => {
    mockRepo.findOwned.mockResolvedValue({
      ...summaryRow,
      lang: 'en',
      language: 'web-dev',
      courseKey: 'web-dev',
      lessonSlug: 'first-page',
      code: '```html index.html\n<h1>Hi</h1>\n```',
      syntaxError: null,
      structureFailures: [],
      failedCase: null,
    });
    mockLoadTestsSpec.mockReturnValue({ cases: [] });
    expect((await service.getForUser(7, 9)).language).toBe('web-dev');
    expect(mockLoadTestsSpec).toHaveBeenCalledWith('web-dev', 'first-page', 'en', undefined);
  });

  it('404s a missing or foreign attempt', async () => {
    mockRepo.findOwned.mockResolvedValue(null);

    await expect(service.getForUser(7, 9)).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('findForLesson', () => {
  const row = {
    ...summaryRow,
    courseKey: 'python',
    lessonSlug: 'print',
    code: 'print(3)',
    syntaxError: null,
    structureFailures: [],
    failedCase: null,
  };

  it("returns the student's attempt on this lesson", async () => {
    mockRepo.findOwned.mockResolvedValue(row);
    mockLoadTestsSpec.mockReturnValue(null);

    expect(await service.findForLesson(7, 9, 'python', 'print')).toMatchObject({
      id: 9,
      code: 'print(3)',
    });
    expect(mockRepo.findOwned).toHaveBeenCalledWith(7, 9);
  });

  it('returns null for an attempt that is missing, foreign or on another lesson', async () => {
    mockRepo.findOwned.mockResolvedValue(null);
    expect(await service.findForLesson(7, 9, 'python', 'print')).toBeNull();

    mockRepo.findOwned.mockResolvedValue(row);
    expect(await service.findForLesson(7, 9, 'python', 'for')).toBeNull();
    expect(await service.findForLesson(7, 9, 'java', 'print')).toBeNull();
  });
});
