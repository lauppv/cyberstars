import path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockExistsSync, mockReadFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  const patched = {
    ...actual,
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  };
  return { ...patched, default: patched };
});

const { mockDockerExec, mockConverse } = vi.hoisted(() => ({
  mockDockerExec: vi.fn(),
  mockConverse: vi.fn(),
}));
vi.mock('./docker-exec.js', () => ({
  dockerExec: (...args: unknown[]) => mockDockerExec(...args),
  dockerConverse: (...args: unknown[]) => mockConverse(...args),
}));

const { mockAcquire, mockRelease, mockDestroy } = vi.hoisted(() => ({
  mockAcquire: vi.fn(),
  mockRelease: vi.fn(),
  mockDestroy: vi.fn(),
}));
vi.mock('./code-container.service.js', () => ({
  acquireForRun: (...args: unknown[]) => mockAcquire(...args),
  releaseAfterRun: (...args: unknown[]) => mockRelease(...args),
  destroyOwner: (...args: unknown[]) => mockDestroy(...args),
}));

// C does structure + injection on the server via web-tree-sitter, which can't
// load its wasm under jsdom, so mock it here so dispatch is testable without a
// real parser (the parser itself is covered in c-analysis.test.ts, node env).
const { mockPrepareC } = vi.hoisted(() => ({ mockPrepareC: vi.fn() }));
vi.mock('./c-analysis.js', () => ({
  prepareC: (...args: unknown[]) => mockPrepareC(...args),
}));

const { loadTestsSpec, compareOutputs, runLessonTests } = await import('./lesson-tests.service.js');

const SPEC = {
  comparator: 'trimmed',
  structure: { requires: [{ kind: 'call', name: 'print' }] },
  cases: [{ visible: true }, { inject: { tank_a: 0 } }],
};
const ONE_CASE = { comparator: 'trimmed', structure: {}, cases: [{ visible: true }] };
const SOLUTION_MD = '```py\nprint("ok")\n```\n';

// Files the service reads, in order: <slug>-tests.json, <slug>-solution.md,
// then the runner script.
function stubFiles(spec: unknown = SPEC) {
  mockExistsSync.mockReturnValue(true);
  mockReadFileSync.mockImplementation((file: string) => {
    if (file.endsWith('-tests.json')) return JSON.stringify(spec);
    if (file.endsWith('-solution.md')) return SOLUTION_MD;
    return '# runner';
  });
}

function program(overrides: Record<string, unknown> = {}) {
  return { stdout: 'ok\n', stderr: '', exit: 0, timedOut: false, ...overrides };
}

interface StubVerdict {
  syntaxError: string | null;
  structureFailures?: unknown[];
  cases: unknown[];
}

// Server replies to each case line, in order ('next' | 'stop').
let replies: (string | null)[] = [];

// Writes the runner and the payload, then plays a runner that streams the
// header and one line per case, stopping when the server answers anything but
// 'next' (the lockstep protocol of the real runners).
function stubVerdict({ syntaxError, structureFailures = [], cases }: StubVerdict) {
  mockDockerExec.mockResolvedValueOnce('').mockResolvedValueOnce('');
  mockConverse.mockImplementationOnce(
    async (_args: string[], _timeout: number, onLine: (line: string) => string | null) => {
      replies = [];
      onLine(JSON.stringify(syntaxError ? { syntaxError } : { syntaxError, structureFailures }));
      if (syntaxError) return;
      for (const c of cases) {
        const reply = onLine(JSON.stringify(c));
        replies.push(reply);
        if (reply !== 'next') return;
      }
    },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAcquire.mockResolvedValue('cid-1');
});

describe('loadTestsSpec', () => {
  it('returns null when the lesson ships no tests file', () => {
    mockExistsSync.mockReturnValue(false);
    expect(loadTestsSpec('python', 'print')).toBeNull();
  });

  it('parses the tests JSON when present', () => {
    stubFiles();
    expect(loadTestsSpec('python', 'print')).toEqual(SPEC);
  });

  it('prefers the ro/ tests file when lang is ro', () => {
    const roSpec = { ...SPEC, cases: [{ visible: true }] };
    mockExistsSync.mockImplementation((file: string) => file.includes(`${path.sep}ro${path.sep}`));
    mockReadFileSync.mockImplementation((file: string) => {
      expect(file).toContain(`${path.sep}ro${path.sep}`);
      return JSON.stringify(roSpec);
    });
    expect(loadTestsSpec('python', 'print', 'ro')).toEqual(roSpec);
  });

  it('falls back to the English tests file when no ro/ variant exists', () => {
    mockExistsSync.mockImplementation((file: string) => !file.includes(`${path.sep}ro${path.sep}`));
    mockReadFileSync.mockImplementation((file: string) => {
      expect(file).not.toContain(`${path.sep}ro${path.sep}`);
      return JSON.stringify(SPEC);
    });
    expect(loadTestsSpec('python', 'print', 'ro')).toEqual(SPEC);
  });
});

describe('compareOutputs', () => {
  it('trimmed ignores trailing whitespace, CRLF, and trailing blank lines', () => {
    expect(compareOutputs('400\n350\n', '400  \r\n350\r\n\n\n', 'trimmed')).toBe(true);
  });

  it('trimmed still catches real differences', () => {
    expect(compareOutputs('400\n350', '400\n351', 'trimmed')).toBe(false);
  });

  it('exact requires byte equality', () => {
    expect(compareOutputs('a\n', 'a\n', 'exact')).toBe(true);
    expect(compareOutputs('a\n', 'a \n', 'exact')).toBe(false);
  });

  it('masked ignores differing integer runs (PIDs) but keeps surrounding text', () => {
    expect(compareOutputs('Child: my parent is 42\n', 'Child: my parent is 1337\n', 'masked')).toBe(
      true,
    );
    expect(compareOutputs('PID: 7\n', 'PIT: 7\n', 'masked')).toBe(false);
  });

  it('unordered matches the same lines in any order but catches missing lines', () => {
    expect(
      compareOutputs(
        'Child 1 ready\nChild 2 ready\n',
        'Child 2 ready\nChild 1 ready\n',
        'unordered',
      ),
    ).toBe(true);
    expect(compareOutputs('Ping\nPong\n', 'Ping\nPing\n', 'unordered')).toBe(false);
  });
});

describe('runLessonTests', () => {
  it('404s when the lesson has no tests', async () => {
    mockExistsSync.mockReturnValue(false);
    await expect(runLessonTests('user:1', 'python', 'comment', 'x')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('passes when structure is clean and all outputs match', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program(), solution: program() },
        { user: program({ stdout: '0\n' }), solution: program({ stdout: '0\n' }) },
      ],
    });

    const res = await runLessonTests('user:1', 'python', 'print', 'print("ok")');
    expect(res.status).toBe('passed');
    expect(res.cases).toHaveLength(2);
    expect(res.cases.every((c) => c.passed)).toBe(true);
    expect(mockRelease).toHaveBeenCalledWith('user:1');
    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it('reports per-case timings rounded to 0.1 ms and sums them over cases timed on both sides', async () => {
    stubFiles({
      comparator: 'trimmed',
      structure: {},
      cases: [{ visible: true }, { generated: true }, {}],
    });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program({ ms: 12.345 }), solution: program({ ms: 10.04 }) },
        { user: program({ ms: 3.25 }), solution: program({ ms: 2.75 }) },
        // An untimed side (older runner) leaves the case out of both totals.
        { user: program({ ms: 50 }), solution: program() },
      ],
    });

    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res.cases[0]).toMatchObject({ userMs: 12.3, solutionMs: 10 });
    expect(res.cases[0].generated).toBeUndefined();
    expect(res.cases[1]).toMatchObject({ generated: true, userMs: 3.3, solutionMs: 2.8 });
    expect(res.cases[2].userMs).toBe(50);
    expect(res.cases[2].solutionMs).toBeUndefined();
    expect(res.runtimeMs).toBe(15.6);
    expect(res.referenceMs).toBe(12.8);
  });

  it('omits the timing totals when no case is timed on both sides', async () => {
    stubFiles({ comparator: 'trimmed', structure: {}, cases: [{ visible: true }] });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program(), solution: program() }],
    });
    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res).not.toHaveProperty('runtimeMs');
    expect(res).not.toHaveProperty('referenceMs');
  });

  it('shows expected output on a visible failed case and stops there', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program({ stdout: 'wrong\n' }), solution: program() },
        { user: program({ stdout: 'wrong\n' }), solution: program({ stdout: '0\n' }) },
      ],
    });

    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res.status).toBe('failed');
    expect(res.cases).toHaveLength(1);
    expect(res.cases[0]).toMatchObject({ visible: true, expected: 'ok', actual: 'wrong' });
    expect(res).toMatchObject({ total: 2, passedCount: 0 });
    expect(replies).toEqual(['stop']);
  });

  it('hides expected output on a hidden failed case, after the passed ones', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program(), solution: program() },
        { user: program({ stdout: 'wrong\n' }), solution: program({ stdout: '0\n' }) },
      ],
    });

    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res.status).toBe('failed');
    expect(res.cases.map((c) => c.passed)).toEqual([true, false]);
    expect(res.cases[1].expected).toBeUndefined();
    expect(res.cases[1]).toMatchObject({ index: 1, visible: false, inject: { tank_a: 0 } });
    expect(res).toMatchObject({ total: 2, passedCount: 1 });
    expect(replies).toEqual(['next', 'stop']);
  });

  it('stops a long run at the first failing case and reports X / Y', async () => {
    stubFiles({
      comparator: 'trimmed',
      structure: {},
      cases: [{ visible: true }, {}, { generated: true }, { generated: true }, { generated: true }],
    });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program(), solution: program() },
        { user: program(), solution: program() },
        { user: program(), solution: program() },
        { user: program({ stdout: 'no\n' }), solution: program() },
        { user: program(), solution: program() },
      ],
    });
    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res).toMatchObject({ status: 'failed', total: 5, passedCount: 3 });
    expect(res.cases).toHaveLength(4);
    expect(res.cases[3]).toMatchObject({ index: 3, passed: false, generated: true });
    expect(replies).toEqual(['next', 'next', 'next', 'stop']);
  });

  it('500s when the runner quits early without a failing case', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program(), solution: program() }],
    });
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
    expect(mockDestroy).toHaveBeenCalledWith('user:1');
  });

  it('500s when the runner sends no header or more cases than the spec has', async () => {
    stubFiles();
    mockDockerExec.mockResolvedValue('');
    mockConverse.mockResolvedValueOnce(undefined);
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });

    stubFiles({ comparator: 'trimmed', structure: {}, cases: [{ visible: true }] });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program(), solution: program() },
        { user: program(), solution: program() },
      ],
    });
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('attaches the case stdin to failed results so the student can debug', async () => {
    stubFiles({
      comparator: 'trimmed',
      structure: {},
      cases: [{ visible: true, stdin: '1234\n' }],
    });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program({ stdout: 'wrong\n' }), solution: program() }],
    });
    const res = await runLessonTests('user:1', 'python', 'while', 'code');
    expect(res.cases[0]).toMatchObject({ visible: true, stdin: '1234\n', actual: 'wrong' });
  });

  it('reports structure failures and syntax errors', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [{ type: 'require', rule: { kind: 'call', name: 'print' } }],
      cases: [
        { user: program(), solution: program() },
        { user: program({ stdout: '0\n' }), solution: program({ stdout: '0\n' }) },
      ],
    });
    const res = await runLessonTests('user:1', 'python', 'print', 'x = 1');
    expect(res.status).toBe('failed');
    expect(res.structureFailures).toHaveLength(1);
    // Structure failures fail the run but every case still runs.
    expect(res).toMatchObject({ passedCount: 2, total: 2 });
    expect(res.cases).toHaveLength(2);

    stubVerdict({ syntaxError: 'line 1: invalid syntax', structureFailures: [], cases: [] });
    const res2 = await runLessonTests('user:1', 'python', 'print', 'x =');
    expect(res2.status).toBe('failed');
    expect(res2.syntaxError).toContain('invalid syntax');
    expect(res2).toMatchObject({ cases: [], passedCount: 0, total: 2 });
  });

  it('maps user timeouts and crashes to case errors', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program({ timedOut: true, exit: -1, ms: 5000 }), solution: program() }],
    });
    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res.cases).toEqual([
      expect.objectContaining({ passed: false, error: 'timeout', userMs: 5000 }),
    ]);

    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program(), solution: program() },
        { user: program({ exit: 1, stderr: 'Traceback...' }), solution: program() },
      ],
    });
    const res2 = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res2.cases[1]).toMatchObject({ passed: false, error: 'Traceback...' });
    expect(res2.passedCount).toBe(1);
  });

  it('treats a broken reference solution as an internal error', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program(), solution: program({ exit: 1 }) }],
    });
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
    expect(mockDestroy).toHaveBeenCalledWith('user:1');
  });

  it('loads the ro/ solution together with the ro/ tests spec', async () => {
    mockExistsSync.mockImplementation((file: string) => file.includes(`${path.sep}ro${path.sep}`));
    mockReadFileSync.mockImplementation((file: string) => {
      if (file.endsWith('-tests.json')) return JSON.stringify({ cases: [{ visible: true }] });
      if (file.endsWith('-solution.md')) {
        // The solution must come from the same locale folder as the spec.
        expect(file).toContain(`${path.sep}ro${path.sep}`);
        return SOLUTION_MD;
      }
      return '# runner';
    });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program(), solution: program() }],
    });
    const res = await runLessonTests('user:1', 'python', 'print', 'print("ok")', 'ro');
    expect(res.status).toBe('passed');
  });

  it('dispatches java lessons to the java runner', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program(), solution: program() },
        { user: program({ stdout: '0\n' }), solution: program({ stdout: '0\n' }) },
      ],
    });

    const res = await runLessonTests('user:1', 'java', 'variables-int', 'code');
    expect(res.status).toBe('passed');
    expect(
      mockReadFileSync.mock.calls.some((c) => String(c[0]).endsWith('lesson-tests.runner.java')),
    ).toBe(true);
    // Runner source lands in /work; the bootstrap compiles it once into
    // /tmp/_judge and hands stdout over to the runner via exec.
    expect((mockDockerExec.mock.calls[0][0] as string[]).join(' ')).toContain(
      'cat > /work/Runner.java',
    );
    const runArgs = mockConverse.mock.calls[0][0] as string[];
    // The run is a conversation: stdin stays attached for the server's replies.
    expect(runArgs.slice(0, 3)).toEqual(['exec', '-i', 'cid-1']);
    expect(runArgs).toContain('sh');
    expect(runArgs.join(' ')).toContain('javac -d /tmp/_judge /work/Runner.java');
  });

  it('caches generated reference outputs and skips the solution for them next time', async () => {
    const spec = {
      comparator: 'trimmed',
      structure: {},
      cases: [{ visible: true }, { generated: true, stdin: '1\n' }],
    };
    stubFiles(spec);
    stubVerdict({
      syntaxError: null,
      cases: [
        { user: program({ ms: 4 }), solution: program({ ms: 3 }) },
        { user: program({ stdout: '1\n', ms: 2 }), solution: program({ stdout: '1\n', ms: 1 }) },
      ],
    });
    const first = await runLessonTests('user:1', 'python', 'cache-pass', 'code');
    expect(first.cases[1]).toMatchObject({ passed: true, generated: true, solutionMs: 1 });
    const firstPayload = JSON.parse(mockDockerExec.mock.calls[1][2] as string);
    expect(firstPayload.cases.some((c: object) => 'skipSolution' in c)).toBe(false);

    mockDockerExec.mockClear();
    stubVerdict({
      syntaxError: null,
      cases: [
        { user: program({ ms: 4 }), solution: program({ ms: 3 }) },
        { user: program({ stdout: '1\n', ms: 2 }) },
      ],
    });
    const second = await runLessonTests('user:1', 'python', 'cache-pass', 'code');
    const payload = JSON.parse(mockDockerExec.mock.calls[1][2] as string);
    // Hand-written cases always run the reference fresh.
    expect(payload.cases[0]).toEqual({ visible: true });
    expect(payload.cases[1]).toEqual({ generated: true, stdin: '1\n', skipSolution: true });
    expect(second.status).toBe('passed');
    expect(second.cases[1]).toMatchObject({ passed: true, userMs: 2 });
    expect(second.cases[1].solutionMs).toBeUndefined();
    // The totals only cover cases timed on both sides.
    expect(second).toMatchObject({ runtimeMs: 4, referenceMs: 3 });
  });

  it('judges a cached case against the cached output', async () => {
    const spec = { comparator: 'exact', structure: {}, cases: [{ generated: true }] };
    stubFiles(spec);
    stubVerdict({ syntaxError: null, cases: [{ user: program(), solution: program() }] });
    await runLessonTests('user:1', 'python', 'cache-fail', 'code');

    stubVerdict({ syntaxError: null, cases: [{ user: program({ stdout: 'nope\n' }) }] });
    const res = await runLessonTests('user:1', 'python', 'cache-fail', 'code');
    expect(res.status).toBe('failed');
    expect(res.cases[0]).toMatchObject({ passed: false, generated: true, actual: 'nope' });
    expect(res.cases[0].expected).toBeUndefined();

    // A cached case still needs the student's run.
    stubVerdict({ syntaxError: null, cases: [{}] });
    await expect(runLessonTests('user:1', 'python', 'cache-fail', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('never caches a broken reference run or a nondeterministic lesson', async () => {
    stubFiles({ comparator: 'trimmed', structure: {}, cases: [{ generated: true }] });
    stubVerdict({
      syntaxError: null,
      cases: [{ user: program(), solution: program({ exit: 1 }) }],
    });
    await expect(runLessonTests('user:1', 'python', 'cache-broken', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
    stubVerdict({ syntaxError: null, cases: [{ user: program(), solution: program() }] });
    await runLessonTests('user:1', 'python', 'cache-broken', 'code');
    expect(JSON.parse(mockDockerExec.mock.calls.at(-1)![2] as string).cases[0]).not.toHaveProperty(
      'skipSolution',
    );

    stubFiles({ comparator: 'unordered', structure: {}, cases: [{ generated: true }] });
    for (let run = 0; run < 2; run++) {
      stubVerdict({ syntaxError: null, cases: [{ user: program(), solution: program() }] });
      await runLessonTests('user:1', 'python', 'cache-unordered', 'code');
    }
    expect(JSON.parse(mockDockerExec.mock.calls.at(-1)![2] as string).cases[0]).not.toHaveProperty(
      'skipSolution',
    );
  });

  it('hands the cached cases to the c prep so it leaves their solution out', async () => {
    stubFiles({ comparator: 'trimmed', structure: {}, cases: [{ generated: true, stdin: '2\n' }] });
    mockPrepareC.mockResolvedValue({
      syntaxError: null,
      structureFailures: [],
      cases: [{ userSrc: 'U', solutionSrc: 'S', stdin: '2\n' }],
    });
    stubVerdict({ syntaxError: null, cases: [{ user: program(), solution: program() }] });
    await runLessonTests('user:1', 'c', 'cache-c', 'code');
    expect(mockPrepareC.mock.calls[0][3]).toEqual(new Set());

    stubVerdict({ syntaxError: null, cases: [{ user: program() }] });
    const res = await runLessonTests('user:1', 'c', 'cache-c', 'code');
    expect(mockPrepareC.mock.calls[1][3]).toEqual(new Set([0]));
    expect(res.status).toBe('passed');
  });

  it('404s when the course language has no judge runner', async () => {
    stubFiles();
    await expect(runLessonTests('user:1', 'kotlin', 'print', 'code')).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockAcquire).not.toHaveBeenCalled();
  });

  it('dispatches c lessons to the c runner with a server-prepped payload', async () => {
    stubFiles(ONE_CASE);
    mockPrepareC.mockResolvedValue({
      syntaxError: null,
      structureFailures: [],
      cases: [{ userSrc: 'U', solutionSrc: 'S', stdin: '' }],
    });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program(), solution: program() }],
    });

    const res = await runLessonTests('user:1', 'c', 'variables-int', 'code');
    expect(res.status).toBe('passed');
    expect(
      mockReadFileSync.mock.calls.some((c) => String(c[0]).endsWith('lesson-tests.runner.c.py')),
    ).toBe(true);
    // The C runner gets pre-injected sources, not the raw code + spec.
    const payload = mockDockerExec.mock.calls[1][2] as string;
    expect(payload).toContain('pristineUser');
    expect(JSON.parse(payload).cases).toEqual([{ userSrc: 'U', solutionSrc: 'S', stdin: '' }]);
  });

  it('short-circuits a c syntax error before touching a container', async () => {
    stubFiles();
    mockPrepareC.mockResolvedValue({
      syntaxError: 'line 1: syntax error',
      structureFailures: [],
      cases: [],
    });
    const res = await runLessonTests('user:1', 'c', 'variables-int', 'int x =');
    expect(res.status).toBe('failed');
    expect(res.syntaxError).toContain('syntax error');
    expect(mockAcquire).not.toHaveBeenCalled();
  });

  it('merges c structure failures from the server prep, not the runner', async () => {
    stubFiles(ONE_CASE);
    mockPrepareC.mockResolvedValue({
      syntaxError: null,
      structureFailures: [{ type: 'require', rule: { kind: 'variable', name: 'age' } }],
      cases: [{ userSrc: 'U', solutionSrc: 'S', stdin: '' }],
    });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program(), solution: program() }],
    });
    const res = await runLessonTests('user:1', 'c', 'variables-int', 'code');
    expect(res.status).toBe('failed');
    expect(res.structureFailures).toEqual([
      { type: 'require', rule: { kind: 'variable', name: 'age' } },
    ]);
  });

  it('409s when the owner already has a run in progress', async () => {
    stubFiles();
    mockAcquire.mockRejectedValue(new Error('A run is already in progress'));
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  it('500s when the solution markdown has no fenced block', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation((file: string) => {
      if (file.endsWith('-tests.json')) return JSON.stringify(SPEC);
      if (file.endsWith('-solution.md')) return 'no fence in here';
      return '# runner';
    });
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it("falls back to a generic 'error' label when a crashed case has no stderr", async () => {
    stubFiles({ comparator: 'trimmed', structure: {}, cases: [{ visible: true }] });
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [{ user: program({ exit: 1, stderr: '' }), solution: program() }],
    });
    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res.cases[0]).toMatchObject({ passed: false, error: 'error' });
  });

  it('500s when acquiring a runner fails for an unexpected reason', async () => {
    stubFiles();
    mockAcquire.mockRejectedValue(new Error('docker daemon down'));
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('drops the container when the runner itself fails', async () => {
    stubFiles();
    mockDockerExec.mockRejectedValue(new Error('exec blew up'));
    await expect(runLessonTests('user:1', 'python', 'print', 'code')).rejects.toMatchObject({
      statusCode: 500,
    });
    expect(mockDestroy).toHaveBeenCalledWith('user:1');
    expect(mockRelease).not.toHaveBeenCalled();
  });
});
