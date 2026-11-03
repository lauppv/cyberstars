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

  it('forbids a call in any use, but not a variable of the same name', () => {
    const rule = { kind: 'call', name: 'nsmallest' };
    const max = { kind: 'call', name: 'max' };
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { forbids: [rule, max] }, cases: [] },
        [],
      )[0];
    const forbidden = (which: unknown) => ({
      syntaxError: null,
      structureFailures: [{ type: 'forbid', rule: which }],
    });
    for (const code of [
      'from heapq import nsmallest as pick\nprint(pick(1, [2]))\n',
      'import heapq\npick = heapq.nsmallest\nprint(pick(1, [2]))\n',
    ]) {
      expect(header(code)).toEqual(forbidden(rule));
    }
    expect(header('pick = max\nprint(pick([1, 2]))\n')).toEqual(forbidden(max));
    expect(header('print(sorted([1, 2], key=max))\n')).toEqual(forbidden(max));
    expect(
      header('max = 0\nfor x in [1, 2]:\n    if x > max:\n        max = x\nprint(max)\n'),
    ).toEqual({
      syntaxError: null,
      structureFailures: [],
    });
  });

  it("takes a name as the student's own only where their binding has surely run", () => {
    const max = { kind: 'call', name: 'max' };
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { forbids: [max] }, cases: [] },
        [],
      )[0];
    const passes = { syntaxError: null, structureFailures: [] };
    for (const code of [
      'def best(nums):\n    for x in nums:\n        if x > max:\n            max = x\n    return max\n',
      'max = 0\nfor x in [1, 2]:\n    max = x if x > max else max\nprint(max)\n',
      'for max in [1, 2]:\n    print(max)\n',
      'def show(max):\n    print(max)\nshow(1)\n',
      'max = 0\ndef show():\n    print(max)\nshow()\n',
    ]) {
      expect(header(code)).toEqual(passes);
    }
    for (const code of [
      // A parameter of another function, a binding after the read or one that may never run.
      'def show(max):\n    print(max)\npick = max\nprint(pick([1, 2]))\n',
      'pick = max\nmax = 0\nprint(pick([1, 2]))\n',
      'if False:\n    max = 0\npick = max\nprint(pick([1, 2]))\n',
      'max = 0\ndel max\npick = max\nprint(pick([1, 2]))\n',
      'try:\n    pass\nexcept Exception as max:\n    pass\npick = max\nprint(pick([1, 2]))\n',
      // A class body is not seen from its methods.
      'class Box:\n    max = 0\n    def get(self):\n        return max\nprint(Box().get()([1, 2]))\n',
      'pick = [max for max in [1]] and max\nprint(pick([1, 2]))\n',
    ]) {
      expect(header(code)).toEqual({
        syntaxError: null,
        structureFailures: [{ type: 'forbid', rule: max }],
      });
    }
  });

  it("sees the student's binding only on the paths where it has run", () => {
    const max = { kind: 'call', name: 'max' };
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { forbids: [max] }, cases: [] },
        [],
      )[0];
    const forbidden = { syntaxError: null, structureFailures: [{ type: 'forbid', rule: max }] };
    for (const code of [
      // Bound in one branch, read in another.
      'nums = [3, 1]\nif len(nums) < 0:\n    max = 0\nelse:\n    pick = max\nprint(pick(nums))\n',
      "try:\n    int('x')\n    max = 0\nexcept ValueError:\n    pick = max\nprint(pick([3, 1]))\n",
      'x = False and (max := 0)\npick = max\nprint(pick([3, 1]))\n',
      // A function runs before the module binds the name.
      'def get():\n    return max\nprint(get()([3, 1]))\nmax = 0\n',
      'def get():\n    return max\nfs = []\nfs.append(get)\nprint(fs[0]()([3, 1]))\nmax = 0\n',
      'class A:\n    def f():\n        return max\n    x = f()([3, 1])\nmax = 0\nprint(A.x)\n',
      'def f():\n    global max\n    pick = max\n    max = 0\n    return pick\n',
    ]) {
      expect(header(code)).toEqual(forbidden);
    }
    const passes = { syntaxError: null, structureFailures: [] };
    for (const code of [
      // Read only where it is compared or printed, the builtin there would fail.
      'nums = [3, 1]\nfor i, x in enumerate(nums):\n    if i == 0 or x > max:\n        max = x\nprint(max)\n',
      // Their own max, defined after the function that calls it, before the call runs.
      'def solve(nums):\n    m = nums[0]\n    for x in nums:\n        m = max(m, x)\n    return m\n' +
        'def max(a, b):\n    return a if a > b else b\nnums = list(map(int, input().split()))\nprint(solve(nums))\n',
    ]) {
      expect(header(code)).toEqual(passes);
    }
    // A class whose operators may be handed the builtin keeps every read in sight.
    expect(
      header('class P:\n    def __lt__(self, o):\n        return o([1])\nprint(P() < max)\n'),
    ).toEqual(forbidden);
  });

  it("takes the student's own function or attribute of a forbidden name as theirs", () => {
    const rules = ['heappush', 'max', 'sort'].map((name) => ({ kind: 'call', name }));
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { forbids: rules }, cases: [] },
        [],
      )[0] as { structureFailures: { rule: { name: string } }[] };
    const fired = (code: string) => header(code).structureFailures.map((f) => f.rule.name);
    for (const code of [
      'def heappush(h, x):\n    h.append(x)\nh = []\nheappush(h, 1)\n',
      'class Box:\n    def __init__(self):\n        self.max = 0\n    def get(self):\n        return self.max\n',
      'class Heap:\n    def heappush(self, x):\n        pass\nh = Heap()\nh.heappush(1)\n',
    ]) {
      expect(fired(code)).toEqual([]);
    }
    expect(fired('import heapq\nh = []\nheapq.heappush(h, 1)\n')).toEqual(['heappush']);
    // Inherited from list, not the student's own.
    expect(fired('class L(list):\n    def go(self):\n        self.sort()\n')).toEqual(['sort']);
  });

  it('forbids a call reached by a name built at run time or another program', () => {
    const rule = { kind: 'call', name: 'max' };
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { forbids: [rule] }, cases: [] },
        [],
      )[0];
    for (const code of [
      "print(getattr(__builtins__, 'm' + 'ax')([1]))\n",
      "print(vars(__builtins__)['max']([1]))\n",
      "import operator\nprint(operator.methodcaller('max')(x))\n",
      "import os\nos.system('sort -n')\n",
      'import subprocess\n',
    ]) {
      expect(header(code)).toEqual({
        syntaxError: null,
        structureFailures: [{ type: 'forbid', rule }],
      });
    }
    expect(header("print(getattr(obj, 'value'))\n")).toEqual({
      syntaxError: null,
      structureFailures: [],
    });
  });

  it('finds a forbidden constant inside a string too', () => {
    const rule = { kind: 'int_literal', values: [58, 64] };
    const header = (userCode: string) =>
      runRunner(
        'lesson-tests.runner.py',
        { userCode, solutionCode: '', structure: { forbids: [rule] }, cases: [] },
        [],
      )[0];
    for (const code of ['print("58 64")\n', 'print(f"{1} 64")\n', 'print(58)\n']) {
      expect(header(code)).toEqual({
        syntaxError: null,
        structureFailures: [{ type: 'forbid', rule }],
      });
    }
    expect(header('print("580 6.4")\n')).toEqual({ syntaxError: null, structureFailures: [] });
    // A sum of constants or bytes say it as well; a width only pads.
    for (const code of ['print(57 + 1)\n', 'print("5" + "8")\n', 'print(b"58".decode())\n']) {
      expect(header(code)).toEqual({
        syntaxError: null,
        structureFailures: [{ type: 'forbid', rule }],
      });
    }
    for (const code of ['print(f"{1:58}")\n', 'print("%58d" % 1)\n']) {
      expect(header(code)).toEqual({ syntaxError: null, structureFailures: [] });
    }
    // A run too long to be an answer is skipped, not handed to int().
    expect(header(`print("${'9'.repeat(5000)}")\n`)).toEqual({
      syntaxError: null,
      structureFailures: [],
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

  // A program runs in a child forked from the runner, but the load test's in a
  // fresh `python -u` (its time is what the student sees): both must behave
  // alike, down to the streams, the exit and what the shutdown prints.
  it.each([
    ['a traceback from inside a function', 'def f():\n    return 1 / 0\nf()\n'],
    [
      'a chained exception',
      'try:\n    {}["k"]\nexcept KeyError as e:\n    raise ValueError("v") from e\n',
    ],
    ['a compile error ast.parse lets through', 'print(1)\nreturn 5\n'],
    ['sys.exit with a message', 'import sys\nprint("a")\nsys.exit("bye")\n'],
    ['sys.exit with a code', 'import sys\nsys.exit(3)\n'],
    [
      'a thread still printing after the last line',
      'import threading, time\ndef w():\n    time.sleep(0.1)\n    print("late")\nthreading.Thread(target=w).start()\nprint("main")\n',
    ],
    ['atexit hooks', 'import atexit\natexit.register(print, "bye")\nprint("hi")\n'],
    [
      'objects finalized at shutdown',
      'class A:\n    def __del__(self):\n        print("del")\na = A()\nprint("end")\n',
    ],
    [
      'the recursion room',
      'def f(n):\n    try:\n        return f(n + 1)\n    except RecursionError:\n        return n\nprint(f(1))\n',
    ],
    [
      'the streams, names and paths of a script',
      'import sys\nfor s in (sys.stdin, sys.stdout, sys.stderr):\n    print(type(s.buffer).__name__, s.encoding, s.errors, s.write_through)\n' +
        'print(__name__, __file__, sys.argv, sys.path[0], repr(sys.stdin.read()))\n',
    ],
  ])('runs %s as a fresh interpreter does', (_name, code) => {
    const lines = runRunner(
      'lesson-tests.runner.py',
      {
        userCode: code,
        solutionCode: 'print(1)\n',
        structure: {},
        cases: [{ stdin: 'a\r\nb\n' }, { stdin: 'a\r\nb\n', load: true }],
      },
      ['next', 'next'],
    ) as { user: { stdout: string; stderr: string; exit: number } }[];
    const [forked, fresh] = [lines[1].user, lines[2].user];
    expect(forked.stdout).toBe(fresh.stdout);
    expect(forked.stderr).toBe(fresh.stderr);
    expect(forked.exit).toBe(fresh.exit);
  });

  it("runs our solution with another hash seed than the student's program", () => {
    // A set of strings comes out in the order of the seed: our solution run
    // as the student's code must still print it differently (check:tests).
    const words = Array.from({ length: 20 }, (_, i) => `w${i}`);
    const code = `print(set(${JSON.stringify(words)}))\n`;
    const lines = runRunner(
      'lesson-tests.runner.py',
      { userCode: code, solutionCode: code, structure: {}, cases: [{}] },
      ['stop'],
    );
    const { user, solution } = lines[1] as {
      user: { stdout: string };
      solution: { stdout: string };
    };
    expect(user.stdout).not.toBe(solution.stdout);
  });

  it("leaves the program none of the runner's files, and takes an input larger than a pipe", () => {
    const lines = runRunner(
      'lesson-tests.runner.py',
      {
        userCode:
          'import os, sys\ndef is_open(fd):\n    try:\n        os.fstat(fd)\n        return True\n    except OSError:\n        return False\n' +
          'print([fd for fd in range(4, 256) if is_open(fd)], len(sys.stdin.read()))\n',
        solutionCode: 'print(1)\n',
        structure: {},
        cases: [{ stdin: 'x'.repeat(1_000_000) }],
      },
      ['stop'],
    );
    expect(lines[1]).toMatchObject({ user: { stdout: '[] 1000000\n', exit: 0 } });
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
  function header(userCode: string, requires: unknown[], forbids: unknown[] = []): unknown {
    const payloadPath = path.join(dir, 'payload.json');
    fs.writeFileSync(
      payloadPath,
      JSON.stringify({ userCode, solutionCode: '', structure: { requires, forbids }, cases: [] }),
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

  it('compiles the timer once, beside its own classes, and again when its source changes', () => {
    const payloadPath = path.join(dir, 'payload.json');
    const program =
      'public class Main {\n    public static void main(String[] args) { System.out.println("hi"); }\n}\n';
    fs.writeFileSync(
      payloadPath,
      JSON.stringify({ userCode: program, solutionCode: program, structure: {}, cases: [{}] }),
    );
    const run = () => {
      const result = spawnSync('java', ['-cp', classes, 'Runner', payloadPath], {
        input: 'stop\n',
        encoding: 'utf8',
        timeout: 60_000,
      });
      expect(result.status).toBe(0);
      const lines = result.stdout.trim().split('\n');
      expect(JSON.parse(lines[1])).toMatchObject({
        user: { stdout: 'hi\n', exit: 0, ms: expect.any(Number) },
        solution: { stdout: 'hi\n' },
      });
    };
    const timer = path.join(classes, 'timer', 'CyberstarsJudgeTimer');
    run();
    const compiled = fs.statSync(`${timer}.class`).mtimeMs;
    run();
    expect(fs.statSync(`${timer}.class`).mtimeMs).toBe(compiled);
    // A deploy that changes the timer finds another source there.
    const source = fs.readFileSync(`${timer}.java`, 'utf8');
    fs.writeFileSync(`${timer}.java`, '// an older timer\n');
    run();
    expect(fs.readFileSync(`${timer}.java`, 'utf8')).toBe(source);
    expect(fs.statSync(`${timer}.class`).mtimeMs).toBeGreaterThan(compiled);
  });

  it("counts a library call by its class's name too, and a method reference as a call", () => {
    const passes = { syntaxError: null, structureFailures: [] };
    const sort = { kind: 'call', name: 'Arrays.sort' };
    for (const code of [
      'import java.util.*;\n' + main('    static void f(int[] a) { Arrays.sort(a); }'),
      main('    static void f(int[] a) { java.util.Arrays.sort(a); }'),
      'import java.util.*;\nimport java.util.function.*;\n' +
        main('    static Consumer<int[]> f = Arrays::sort;'),
      'import static java.util.Arrays.sort;\n' + main('    static void f(int[] a) { sort(a); }'),
      'import static java.util.Arrays.*;\n' + main('    static void f(int[] a) { sort(a); }'),
    ]) {
      expect(header(code, [sort])).toEqual(passes);
    }
    // The student's own sort is not the library's, even with every member of Arrays imported.
    expect(
      header(
        'import static java.util.Arrays.*;\n' +
          main('    static void sort(int[] a) {}\n    static void f(int[] a) { sort(a); }'),
        [sort],
      ),
    ).toEqual({ syntaxError: null, structureFailures: [{ type: 'require', rule: sort }] });
    const deque = { kind: 'call', name: 'ArrayDeque' };
    expect(
      header(
        'import java.util.*;\nimport java.util.function.*;\n' +
          main('    static Supplier<ArrayDeque<Integer>> make = ArrayDeque::new;'),
        [deque],
      ),
    ).toEqual(passes);
  });

  it("forbids a bare name only where the student's own code can't be making the call", () => {
    const passes = { syntaxError: null, structureFailures: [] };
    const indexOf = { kind: 'call', name: 'indexOf' };
    const deque = { kind: 'call', name: 'ArrayDeque' };
    const own = 'class Searcher { int indexOf(int[] a, int t) { return 0; } }\n';
    const ownStatic = '    static int indexOf(int[] a, int t) { return 0; }\n';
    // Their own method called bare, through their class or an object of it, their own class built.
    for (const code of [
      main(ownStatic + '    static int f(int[] a) { return indexOf(a, 1); }'),
      main(ownStatic + '    static int f(int[] a) { return Main.indexOf(a, 1); }'),
      own +
        main('    static int f(int[] a) { Searcher s = new Searcher(); return s.indexOf(a, 1); }'),
      own + main('    static int f(int[] a) { var s = new Searcher(); return s.indexOf(a, 1); }'),
      'class ArrayDeque {}\n' + main('    static Object f() { return new ArrayDeque(); }'),
    ]) {
      expect(header(code, [], [indexOf, deque])).toEqual(passes);
    }
    // The library's, next to a method or a class of the same name too.
    for (const [code, rule] of [
      [
        'import java.util.*;\n' +
          main(ownStatic + '    static int f(List<Integer> l) { return l.indexOf(1); }'),
        indexOf,
      ],
      [
        'import java.util.*;\nimport java.util.function.*;\n' +
          main('    static Supplier<Deque<Integer>> make = ArrayDeque<Integer>::new;'),
        deque,
      ],
      [
        'class ArrayDeque {}\n' +
          main('    static Object f() { return new java.util.ArrayDeque<Integer>(); }'),
        deque,
      ],
    ] as const) {
      expect(header(code, [], [indexOf, deque])).toEqual({
        syntaxError: null,
        structureFailures: [{ type: 'forbid', rule }],
      });
    }
  });

  it('finds a constant inside a string too', () => {
    const rule = { kind: 'int_literal', values: [64] };
    expect(header(main('    static String s = "58 64";'), [rule])).toEqual({
      syntaxError: null,
      structureFailures: [],
    });
    expect(header(main('    static String s = "640";'), [rule])).toEqual({
      syntaxError: null,
      structureFailures: [{ type: 'require', rule }],
    });
  });

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
