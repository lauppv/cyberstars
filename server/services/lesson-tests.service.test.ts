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

const { mockDockerExec } = vi.hoisted(() => ({ mockDockerExec: vi.fn() }));
vi.mock('./docker-exec.js', () => ({
  dockerExec: (...args: unknown[]) => mockDockerExec(...args),
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
// load its wasm under jsdom — mock it here so dispatch is testable without a
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

function stubVerdict(verdict: unknown) {
  // write runner, write payload, run runner
  mockDockerExec
    .mockResolvedValueOnce('')
    .mockResolvedValueOnce('')
    .mockResolvedValueOnce(JSON.stringify(verdict));
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

  it('shows expected output only on visible failed cases', async () => {
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
    expect(res.cases[0]).toMatchObject({ visible: true, expected: 'ok', actual: 'wrong' });
    expect(res.cases[1].expected).toBeUndefined();
    expect(res.cases[1]).toMatchObject({ visible: false, inject: { tank_a: 0 } });
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

    stubVerdict({ syntaxError: 'line 1: invalid syntax', structureFailures: [], cases: [] });
    const res2 = await runLessonTests('user:1', 'python', 'print', 'x =');
    expect(res2.status).toBe('failed');
    expect(res2.syntaxError).toContain('invalid syntax');
  });

  it('maps user timeouts and crashes to case errors', async () => {
    stubFiles();
    stubVerdict({
      syntaxError: null,
      structureFailures: [],
      cases: [
        { user: program({ timedOut: true, exit: -1 }), solution: program() },
        { user: program({ exit: 1, stderr: 'Traceback...' }), solution: program() },
      ],
    });
    const res = await runLessonTests('user:1', 'python', 'print', 'code');
    expect(res.cases[0]).toMatchObject({ passed: false, error: 'timeout' });
    expect(res.cases[1]).toMatchObject({ passed: false, error: 'Traceback...' });
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
    const runArgs = mockDockerExec.mock.calls[2][0] as string[];
    expect(runArgs).toContain('sh');
    expect(runArgs.join(' ')).toContain('javac -d /tmp/_judge /work/Runner.java');
  });

  it('404s when the course language has no judge runner', async () => {
    stubFiles();
    await expect(runLessonTests('user:1', 'kotlin', 'print', 'code')).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockAcquire).not.toHaveBeenCalled();
  });

  it('dispatches c lessons to the c runner with a server-prepped payload', async () => {
    stubFiles();
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
    stubFiles();
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
