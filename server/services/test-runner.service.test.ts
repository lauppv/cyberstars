import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import type { TestCase } from '../../shared/tests.js';

vi.mock('./code-execution.service.js', () => ({
  execute: vi.fn(),
}));

const { getTestCases, runTests } = await import('./test-runner.service.js');
const { execute } = await import('./code-execution.service.js');
const mockExecute = vi.mocked(execute);

function stubTests(tests: TestCase[]) {
  vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(tests));
}

afterEach(() => vi.restoreAllMocks());

describe('getTestCases', () => {
  it('returns parsed test cases for an existing lesson', () => {
    const tests = getTestCases('python', 'booleans');
    expect(tests).not.toBeNull();
    expect(Array.isArray(tests)).toBe(true);
    expect(tests!.length).toBeGreaterThan(0);
    expect(tests![0]).toHaveProperty('name');
    expect(tests![0]).toHaveProperty('mode');
  });

  it('returns null for a non-existent lesson', () => {
    expect(getTestCases('python', 'does-not-exist-xyz')).toBeNull();
  });
});

describe('runTests', () => {
  it('returns allPassed when all tests pass (exact mode)', async () => {
    mockExecute.mockResolvedValue('hello');

    const result = await runTests('print("hello")', 'python', 'python', 'booleans');

    expect(result.total).toBeGreaterThan(0);
    expect(result.results.length).toBe(result.total);
  });

  it('returns empty results for a lesson with no tests', async () => {
    const result = await runTests('code', 'python', 'python', 'does-not-exist-xyz');
    expect(result).toEqual({ passed: 0, total: 0, allPassed: true, results: [] });
  });

  it("marks test as failed when output doesn't match", async () => {
    mockExecute.mockResolvedValue('wrong output');

    const result = await runTests('print("wrong output")', 'python', 'python', 'booleans');

    const failedCount = result.results.filter((r) => !r.passed).length;
    expect(failedCount).toBeGreaterThan(0);
  });

  it('applies overrides to code before execution', async () => {
    mockExecute.mockImplementation(async (code: string) => {
      if (code.includes('name = "Cortez"'))
        return 'Hello. My name is Cortez, I am 57 years old, and I am 1.67 tall';
      return 'wrong';
    });

    const tests = getTestCases('python', 'variables-int');
    if (!tests) return;

    await runTests(
      'name = ""\nage = 0\nheight = 0\nprint(f"Hello. My name is {name}, I am {age} years old, and I am {height} tall")',
      'python',
      'python',
      'variables-int',
    );

    expect(mockExecute).toHaveBeenCalled();
    const firstCall = mockExecute.mock.calls[0][0];
    expect(firstCall).not.toContain('name = ""');
  });
});

describe('checkResult modes', () => {
  beforeEach(() => mockExecute.mockReset());

  it("'any' mode: passes when output is non-empty and not 'No output.'", async () => {
    stubTests([{ name: 't', mode: 'any', expected: '' }]);
    mockExecute.mockResolvedValue('something');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(true);
  });

  it("'any' mode: fails when output is empty", async () => {
    stubTests([{ name: 't', mode: 'any', expected: '' }]);
    mockExecute.mockResolvedValue('');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(false);
  });

  it("'any' mode: fails when output is 'No output.'", async () => {
    stubTests([{ name: 't', mode: 'any', expected: '' }]);
    mockExecute.mockResolvedValue('No output.');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(false);
  });

  it("'contains' mode: passes when output contains expected", async () => {
    stubTests([{ name: 't', mode: 'contains', expected: 'world' }]);
    mockExecute.mockResolvedValue('hello world');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(true);
  });

  it("'line' mode: passes when specified line matches", async () => {
    stubTests([{ name: 't', mode: 'line', expected: 'second', line: 1 }]);
    mockExecute.mockResolvedValue('first\nsecond\nthird');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(true);
  });

  it("'line' mode: defaults to line 0 when no line is specified", async () => {
    stubTests([{ name: 't', mode: 'line', expected: 'first' }]);
    mockExecute.mockResolvedValue('first\nsecond');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(true);
  });

  it("'line' mode: fails when line index exceeds output length", async () => {
    stubTests([{ name: 't', mode: 'line', expected: 'x', line: 99 }]);
    mockExecute.mockResolvedValue('one');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(false);
  });

  it("'regex' mode: passes when output matches", async () => {
    stubTests([{ name: 't', mode: 'regex', expected: '^[a-z]+$' }]);
    mockExecute.mockResolvedValue('hello');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(true);
  });

  it("'code_regex' mode: passes when student code matches regex", async () => {
    stubTests([{ name: 't', mode: 'code_regex', expected: 'def\\s+greet' }]);
    mockExecute.mockResolvedValue('ignored');
    const r = await runTests('def greet():\n    pass', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(true);
    expect(r.results[0].expected).toBe('(code structure check)');
    expect(r.results[0].actual).toBe('(found)');
  });

  it("'code_regex' mode: fails when student code does not match", async () => {
    stubTests([{ name: 't', mode: 'code_regex', expected: 'def\\s+greet' }]);
    mockExecute.mockResolvedValue('ignored');
    const r = await runTests('print(1)', 'python', 'python', 'fake');
    expect(r.results[0].passed).toBe(false);
    expect(r.results[0].actual).toBe('(not found)');
  });

  it("'any' mode result reports '(any output)' as expected text", async () => {
    stubTests([{ name: 't', mode: 'any', expected: '' }]);
    mockExecute.mockResolvedValue('x');
    const r = await runTests('code', 'python', 'python', 'fake');
    expect(r.results[0].expected).toBe('(any output)');
  });

  it('appends extra code from testCase.append before executing', async () => {
    stubTests([{ name: 't', mode: 'exact', expected: 'done', append: '\nprint("done")' }]);
    mockExecute.mockResolvedValue('done');
    await runTests('x = 1', 'python', 'python', 'fake');
    expect(mockExecute.mock.calls[0][0]).toContain('print("done")');
  });

  it('applyOverrides falls back to generic assignment when single-key override does not match', async () => {
    stubTests([{ name: 't', mode: 'exact', expected: '42', overrides: { unknown: '42' } }]);
    mockExecute.mockResolvedValue('42');
    await runTests('x = 0', 'python', 'python', 'fake');
    expect(mockExecute.mock.calls[0][0]).toContain('x = 42');
  });
});
