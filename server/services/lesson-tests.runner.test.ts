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
  });

  it("times the CPU the program's own code used, and nothing when it skips its exit hooks", () => {
    const lines = runRunner(
      'lesson-tests.runner.py',
      {
        userCode: 'print(sum(range(5_000_000)))\n',
        solutionCode: 'import time\ntime.sleep(0.2)\nprint(12499997500000)\n',
        structure: {},
        cases: [{}],
      },
      ['next'],
    );
    const { user, solution } = lines[1] as { user: { ms: number }; solution: { ms: number } };
    // Computing counts; sleeping doesn't, and neither does interpreter startup.
    expect(user.ms).toBeGreaterThan(20);
    expect(solution.ms).toBeLessThan(20);

    const exited = runRunner(
      'lesson-tests.runner.py',
      {
        userCode: 'import os\nprint("ok", flush=True)\nos._exit(0)\n',
        solutionCode: 'print("ok")\n',
        structure: {},
        cases: [{}],
      },
      ['stop'],
    );
    expect((exited[1] as { user: { ms?: number } }).user.ms).toBeUndefined();
  });

  it('keeps tracebacks on the same lines as without the timing preamble', () => {
    const lines = runRunner(
      'lesson-tests.runner.py',
      { userCode: 'x = 1\ny = nope\n', solutionCode: 'print(1)\n', structure: {}, cases: [{}] },
      ['stop'],
    );
    const { user } = lines[1] as { user: { stderr: string; exit: number; ms: number } };
    expect(user.stderr).toContain('line 5, in <module>');
    expect(user.exit).toBe(1);
    expect(user.ms).toBeGreaterThanOrEqual(0);
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
  it("times the CPU the program's own code used, and nothing when it crashes", () => {
    const user =
      '#include <stdio.h>\n#include <unistd.h>\nint main(void) { volatile long s = 0; for (long i = 0; i < 200000000; i++) s += i; usleep(200000); puts("ok"); return 0; }\n';
    const solution = 'int main(void) { int *p = 0; *p = 1; return 0; }\n';
    const lines = runRunner(
      'lesson-tests.runner.c.py',
      { pristineUser: user, cases: [{ userSrc: user, solutionSrc: solution }] },
      ['stop'],
    );
    const { user: u, solution: s } = lines[1] as {
      user: { ms: number; stdout: string };
      solution: { ms?: number; exit: number };
    };
    // The loop counts, the 200 ms sleep doesn't.
    expect(u.stdout).toBe('ok\n');
    expect(u.ms).toBeGreaterThan(50);
    expect(s.exit).not.toBe(0);
    expect(s.ms).toBeUndefined();
  });
});
