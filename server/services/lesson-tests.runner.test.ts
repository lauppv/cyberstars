// @vitest-environment node
// Runs the Python and C judge runners on the host (python3 / gcc, skipped when
// missing) to cover what the service tests mock away: the runners' own output
// handling. Each test plays the server side of the lockstep protocol.
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const SERVICES = path.join(process.cwd(), 'server', 'services');

function has(cmd: string): boolean {
  try {
    execFileSync(cmd, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

let dir: string;
beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-runner-'));
});
afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

// Writes the payload, runs the runner with `replies` on stdin, and returns the
// JSON lines it printed.
function runRunner(runner: string, payload: unknown, replies: string[]): unknown[] {
  const payloadPath = path.join(dir, 'payload.json');
  fs.writeFileSync(payloadPath, JSON.stringify(payload));
  const result = spawnSync('python3', [path.join(SERVICES, runner), payloadPath], {
    input: replies.map((r) => `${r}\n`).join(''),
    encoding: 'utf8',
    env: { ...process.env, JUDGE_WORK_DIR: dir },
    timeout: 60_000,
  });
  expect(result.stderr).toBe('');
  expect(result.status).toBe(0);
  return result.stdout
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
}

describe.skipIf(!has('python3'))('python runner', () => {
  it('grades a program that prints invalid UTF-8 instead of crashing', () => {
    const lines = runRunner(
      'lesson-tests.runner.py',
      {
        userCode: 'import sys\nsys.stdout.buffer.write(b"A\\x93\\n")\n',
        solutionCode: 'print("A")\n',
        structure: {},
        cases: [{ stdin: '' }],
      },
      ['stop'],
    );
    expect(lines[0]).toEqual({ syntaxError: null, structureFailures: [] });
    expect(lines[1]).toMatchObject({
      user: { stdout: 'A�\n', exit: 0, timedOut: false },
      solution: { stdout: 'A\n', exit: 0 },
    });
  });

  it('streams one line per case and stops on the server reply', () => {
    const lines = runRunner(
      'lesson-tests.runner.py',
      {
        userCode: 'print(input())\n',
        solutionCode: 'print(input())\n',
        structure: {},
        cases: [{ stdin: 'é\n' }, { stdin: '2\n', skipSolution: true }, { stdin: '3\n' }],
      },
      ['next', 'stop'],
    );
    expect(lines).toHaveLength(3);
    expect(lines[1]).toMatchObject({ user: { stdout: 'é\n' }, solution: { stdout: 'é\n' } });
    // A cached case runs the student's program only.
    expect(lines[2]).toEqual({ user: expect.objectContaining({ stdout: '2\n' }) });
    expect((lines[2] as { user: { ms: number } }).user.ms).toBeGreaterThan(0);
  });
});

describe.skipIf(!has('python3') || !has('gcc'))('c runner', () => {
  it('grades a program that prints invalid UTF-8 instead of crashing', () => {
    const user =
      '#include <stdio.h>\nint main(void) { char c = (char)0x93; printf("A%c\\n", c); return 0; }\n';
    const solution = '#include <stdio.h>\nint main(void) { printf("A\\n"); return 0; }\n';
    const lines = runRunner(
      'lesson-tests.runner.c.py',
      { pristineUser: user, cases: [{ userSrc: user, solutionSrc: solution }] },
      ['stop'],
    );
    expect(lines[0]).toEqual({ syntaxError: null });
    expect(lines[1]).toMatchObject({
      user: { stdout: 'A�\n', exit: 0 },
      solution: { stdout: 'A\n', exit: 0 },
    });
  });
});
