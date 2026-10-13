// @vitest-environment node
// Runs the Python, C and Java judge runners on the host (python3 / gcc / java,
// skipped when missing) to cover what the service tests mock away: the
// runners' own output handling. Each test plays the server side of the
// lockstep protocol.
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const SERVICES = import.meta.dirname;

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

  it('tells a for statement from a while and a comprehension', () => {
    const forRule = { kind: 'loop', type: 'for' };
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { requires: [forRule] }, cases: [] },
        [],
      )[0];
    expect(header('for i in range(3):\n    print(i)\n')).toEqual({
      syntaxError: null,
      structureFailures: [],
    });
    for (const userCode of [
      'i = 0\nwhile i < 3:\n    i += 1\n',
      'print([i for i in range(3)])\n',
    ]) {
      expect(header(userCode)).toMatchObject({
        structureFailures: [{ type: 'require', rule: forRule }],
      });
    }
  });

  it('takes any function when the rule names none, and spots recursion', () => {
    const rules = [{ kind: 'function' }, { kind: 'recursion' }];
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { requires: rules }, cases: [] },
        [],
      )[0];
    expect(header('def f(n):\n    return 1 if n < 2 else n * f(n - 1)\n')).toEqual({
      syntaxError: null,
      structureFailures: [],
    });
    expect(header('def g(n):\n    return n\n')).toMatchObject({
      structureFailures: [{ type: 'require', rule: { kind: 'recursion' } }],
    });
    // s.count(...) is the str method, not count calling itself.
    expect(header('def count(s, ch):\n    return s.count(ch)\n')).toMatchObject({
      structureFailures: [{ type: 'require', rule: { kind: 'recursion' } }],
    });
    expect(
      header('class T:\n    def walk(self, n):\n        return n and self.walk(n - 1)\n'),
    ).toEqual({ syntaxError: null, structureFailures: [] });
    // main and constructors aren't a function of the student's own.
    expect(
      header('class A:\n    def __init__(self):\n        self.a = 1\n\ndef main():\n    A()\n'),
    ).toMatchObject({
      structureFailures: [
        { type: 'require', rule: { kind: 'function' } },
        { type: 'require', rule: { kind: 'recursion' } },
      ],
    });
  });

  it("injects the input variable, not a helper's parameter of the same name", () => {
    const solution = 'shield = 5\nprint(shield * 2)\n';
    const user =
      'def boost(shield):\n    shield = shield * 2\n    return shield\n\nshield = 5\nprint(boost(shield))\n';
    const lines = runRunner(
      'lesson-tests.runner.py',
      { userCode: user, solutionCode: solution, structure: {}, cases: [{ inject: { shield: 7 } }] },
      ['stop'],
    );
    expect(lines[1]).toMatchObject({ user: { stdout: '14\n' }, solution: { stdout: '14\n' } });
  });

  it('injects the input variable, not a class attribute of the same name', () => {
    const lines = runRunner(
      'lesson-tests.runner.py',
      {
        userCode: 'class Ship:\n    shield = 0\n\nshield = 5\nprint(shield, Ship.shield)\n',
        solutionCode: 'shield = 5\nprint(shield, 0)\n',
        structure: {},
        cases: [{ inject: { shield: 7 } }],
      },
      ['stop'],
    );
    expect(lines[1]).toMatchObject({ user: { stdout: '7 0\n' }, solution: { stdout: '7 0\n' } });
  });

  // Each new kind: a program that has the construct, and one that only gets
  // the same output without it.
  it.each([
    [{ kind: 'if' }, 'x = 3\nif x > 2:\n    print(x)\n', 'x = 3\nprint(x if x > 2 else 0)\n'],
    [
      { kind: 'switch' },
      'c = 1\nmatch c:\n    case 1:\n        print("a")\n',
      'c = 1\nif c == 1:\n    print("a")\n',
    ],
    [
      { kind: 'break' },
      'for i in range(9):\n    if i == 3:\n        break\n',
      'for i in range(3):\n    pass\n',
    ],
    [
      { kind: 'continue' },
      'for i in range(3):\n    if i == 1:\n        continue\n    print(i)\n',
      'for i in range(3):\n    if i != 1:\n        print(i)\n',
    ],
    [
      { kind: 'nested_loop' },
      'for i in range(2):\n    for j in range(2):\n        print(i, j)\n',
      'for i in range(2):\n    print([j for j in range(2)])\n',
    ],
    [
      { kind: 'try' },
      'try:\n    int("x")\nexcept ValueError:\n    print("no")\n',
      'print("no" if not "x".isdigit() else 1)\n',
    ],
    [{ kind: 'slice' }, 'print("abc"[::-1])\n', 'print("".join(reversed("abc")))\n'],
    [{ kind: 'operator', name: 'and' }, 'print(1 > 0 and 2 > 1)\n', 'print(all([1 > 0, 2 > 1]))\n'],
    [{ kind: 'operator', name: '%' }, 'print(7 % 2)\n', 'print(divmod(7, 2)[1])\n'],
    [{ kind: 'class' }, 'class Ship:\n    pass\n', 'ship = {}\n'],
    [{ kind: 'class', name: 'Ship' }, 'class Ship:\n    pass\n', 'class Boat:\n    pass\n'],
    [
      { kind: 'object' },
      'class Dog:\n    pass\n\nrex = Dog()\n',
      'class Dog:\n    pass\n\nrex = dict()\n',
    ],
    [
      { kind: 'return' },
      'def f(x):\n    return x * 2\n\nprint(f(2))\n',
      'def f(x):\n    print(x * 2)\n\nf(2)\n',
    ],
    [
      { kind: 'default_param' },
      'def dock(ship, bay=1):\n    print(ship, bay)\n',
      'def dock(ship, bay):\n    print(ship, bay)\n',
    ],
  ])('requires %j only where the construct is there', (rule, withIt, without) => {
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { requires: [rule] }, cases: [] },
        [],
      )[0];
    expect(header(withIt)).toEqual({ syntaxError: null, structureFailures: [] });
    expect(header(without)).toEqual({
      syntaxError: null,
      structureFailures: [{ type: 'require', rule }],
    });
  });

  it('checks a rule with "in" only inside that function', () => {
    const rules = {
      requires: [{ kind: 'loop', in: 'reverse_text' }],
      forbids: [{ kind: 'slice', in: 'reverse_text' }],
    };
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: rules, cases: [] },
        [],
      )[0];
    const loop =
      'def reverse_text(t):\n    out = ""\n    for c in t:\n        out = c + out\n    return out\n';
    expect(header(loop + 'print(" ".join("a b".split()[::-1]))\n')).toEqual({
      syntaxError: null,
      structureFailures: [],
    });
    expect(
      header('def reverse_text(t):\n    return t[::-1]\n\nfor w in "ab":\n    print(w)\n'),
    ).toEqual({
      syntaxError: null,
      structureFailures: [
        { type: 'require', rule: rules.requires[0] },
        { type: 'forbid', rule: rules.forbids[0] },
      ],
    });
    // The helpers it calls are part of it: the loop may live in one, and the
    // slice can't hide in one.
    expect(
      header(
        'def back(t):\n    out = ""\n    for c in t:\n        out = c + out\n    return out\n\n' +
          'def reverse_text(t):\n    return back(t)\n',
      ),
    ).toEqual({ syntaxError: null, structureFailures: [] });
    expect(
      header(
        'def flip(s):\n    return s[::-1]\n\n' +
          'def reverse_text(t):\n    for _ in [0]:\n        pass\n    return flip(t)\n',
      ),
    ).toEqual({
      syntaxError: null,
      structureFailures: [{ type: 'forbid', rule: rules.forbids[0] }],
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

  it('reports one time from the program itself when it forks a child', () => {
    const code =
      'import os, sys\npid = os.fork()\nif pid == 0:\n    sys.exit(0)\nos.waitpid(pid, 0)\nprint("ok")\n';
    const lines = runRunner(
      'lesson-tests.runner.py',
      { userCode: code, solutionCode: 'print("ok")\n', structure: {}, cases: [{}] },
      ['stop'],
    );
    const { user } = lines[1] as { user: { stdout: string; ms?: number } };
    expect(user.stdout).toBe('ok\n');
    expect(user.ms).toBeGreaterThanOrEqual(0);
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
  it('reports one time from the program itself when it forks a child', () => {
    const user =
      '#include <stdio.h>\n#include <unistd.h>\n#include <sys/wait.h>\nint main(void) { pid_t p = fork(); if (p == 0) return 0; waitpid(p, NULL, 0); puts("ok"); return 0; }\n';
    const lines = runRunner(
      'lesson-tests.runner.c.py',
      { pristineUser: user, cases: [{ userSrc: user, solutionSrc: user }] },
      ['stop'],
    );
    const { user: u } = lines[1] as { user: { stdout: string; ms?: number } };
    expect(u.stdout).toBe('ok\n');
    expect(u.ms).toBeGreaterThanOrEqual(0);
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

// javac once, as the service does per container; the source launcher would
// recompile the runner on every call.
describe.skipIf(!has('javac'))('java runner', { timeout: 60_000 }, () => {
  let classes: string;
  beforeAll(() => {
    classes = path.join(dir, 'java-classes');
    const source = path.join(dir, 'Runner.java');
    fs.copyFileSync(path.join(SERVICES, 'lesson-tests.runner.java'), source);
    execFileSync('javac', ['-d', classes, source]);
  }, 120_000);

  // The structure header only: no cases, so nothing is compiled or run.
  function header(userCode: string, requires: unknown[]): unknown {
    const payloadPath = path.join(dir, 'payload.json');
    fs.writeFileSync(
      payloadPath,
      JSON.stringify({ userCode, solutionCode: '', structure: { requires }, cases: [] }),
    );
    const result = spawnSync('java', ['-cp', classes, 'Runner', payloadPath], {
      encoding: 'utf8',
      timeout: 60_000,
    });
    expect(result.status).toBe(0);
    return JSON.parse(result.stdout.trim().split('\n')[0]);
  }

  const main = (members: string) =>
    `public class Main {\n${members}\n    public static void main(String[] args) {}\n}\n`;

  it('takes a method calling itself as recursion, not a same-named call on something else', () => {
    const recursion = { kind: 'recursion' };
    expect(
      header(main('    static int f(int n) { return n < 2 ? 1 : n * f(n - 1); }'), [recursion]),
    ).toEqual({ syntaxError: null, structureFailures: [] });
    for (const members of [
      // equals on a field, and an overload of the same arity: other methods.
      '    String name = "a";\n    public boolean equals(Object o) { return name.equals(o); }',
      '    static void show(int n) { show("" + n); }\n    static void show(String s) {}',
    ]) {
      expect(header(main(members), [recursion])).toEqual({
        syntaxError: null,
        structureFailures: [{ type: 'require', rule: recursion }],
      });
    }
  });

  it('counts static or private only outside the class holding main', () => {
    const rules = [
      { kind: 'modifier', name: 'static' },
      { kind: 'modifier', name: 'private' },
    ];
    expect(header('class Counter {\n    private static int total;\n}\n' + main(''), rules)).toEqual(
      { syntaxError: null, structureFailures: [] },
    );
    expect(header(main('    private static final int START = 0;'), rules)).toEqual({
      syntaxError: null,
      structureFailures: rules.map((rule) => ({ type: 'require', rule })),
    });
  });
});
