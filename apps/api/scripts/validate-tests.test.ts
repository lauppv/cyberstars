import { describe, it, expect } from 'vitest';
import type { LessonTestsSpec } from '@cyberstars/shared/tests';
import {
  collectProblems,
  auditSolution,
  auditCases,
  auditKinds,
  auditHarness,
  MAX_CASES,
} from './validate-tests.js';

// The corpus regression: if anyone edits a -tests.json / -solution.md so an
// inject key no longer resolves, or drops a RO tests file for an injection
// lesson, this goes red, so anti-hardcoding can't be silently disabled anymore.
describe('validate-tests corpus', () => {
  it('has no unpaired locales or dead inject keys', async () => {
    const problems = await collectProblems();
    expect(problems, JSON.stringify(problems, null, 2)).toEqual([]);
  });
});

// auditSolution is the pure per-lesson check; drive it with synthetic inputs to
// prove the gate actually bites on the drift it exists to catch.
describe('auditSolution', () => {
  it('passes a Python solution whose inject key and required var resolve', async () => {
    const code = 'age = 5\nprint(age)';
    const spec: LessonTestsSpec = {
      structure: { requires: [{ kind: 'variable', name: 'age' }] },
      cases: [{ inject: { age: 10 } }],
    };
    expect(await auditSolution('python', code, spec)).toEqual([]);
  });

  it('finds a required call that a Python solution makes only inside an f-string', async () => {
    const code = 'log = ["a"]\nprint(f"{len(log)}")\nn = sorted(log)\nprint(f"{n}")';
    const spec: LessonTestsSpec = {
      structure: { requires: [{ kind: 'call', name: 'sorted' }] },
      cases: [],
    };
    expect(await auditSolution('python', code, spec)).toEqual([]);
  });

  it('flags a Python inject key that is a typo (absent from the solution)', async () => {
    const code = 'age = 5\nprint(age)';
    const spec: LessonTestsSpec = { cases: [{ inject: { aeg: 10 } }] };
    const problems = await auditSolution('python', code, spec);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('aeg');
  });

  it('flags a renamed required variable (honest solution would fail structure)', async () => {
    const code = 'age = 5\nprint(age)';
    const spec: LessonTestsSpec = {
      structure: { requires: [{ kind: 'variable', name: 'varsta' }] },
      cases: [{ inject: { age: 10 } }],
    };
    const problems = await auditSolution('python', code, spec);
    expect(problems.some((p) => p.includes('varsta'))).toBe(true);
  });

  it('ignores strings/comments so an identifier only in text does not count', async () => {
    const code = '# score is nice\nx = "score"\nprint(x)';
    const spec: LessonTestsSpec = { cases: [{ inject: { score: 3 } }] };
    expect(await auditSolution('python', code, spec)).toHaveLength(1);
  });

  it('flags a Java inject key that does not match the declared local', async () => {
    const code =
      'public class Main { public static void main(String[] a) { int score = 5; System.out.println(score); } }';
    expect(await auditSolution('java', code, { cases: [{ inject: { scor: 3 } }] })).toHaveLength(1);
    expect(await auditSolution('java', code, { cases: [{ inject: { score: 3 } }] })).toEqual([]);
  });

  it('accepts a C inject key that is a real initializer', async () => {
    const code =
      '#include <stdio.h>\nint main(void) { int temperature = 20; printf("%d", temperature); return 0; }';
    const spec: LessonTestsSpec = { cases: [{ inject: { temperature: 5 } }] };
    expect(await auditSolution('c', code, spec)).toEqual([]);
  });

  it('flags a C inject key that has no initializer (scanf var, injection no-ops)', async () => {
    const code =
      '#include <stdio.h>\nint main(void) { int temperature; scanf("%d", &temperature); printf("%d", temperature); return 0; }';
    const spec: LessonTestsSpec = { cases: [{ inject: { temperature: 5 } }] };
    const problems = await auditSolution('c', code, spec);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('temperature');
  });

  it('handles a case with no inject block (structure-only lesson)', async () => {
    const code = 'age = 5\nprint(age)';
    const spec: LessonTestsSpec = {
      structure: { requires: [{ kind: 'variable', name: 'age' }] },
      cases: [{}],
    };
    expect(await auditSolution('python', code, spec)).toEqual([]);
  });

  it('flags a C solution missing a required structure name', async () => {
    const code =
      '#include <stdio.h>\nint main(void) { int temperature = 20; printf("%d", temperature); return 0; }';
    const spec: LessonTestsSpec = {
      structure: { requires: [{ kind: 'variable', name: 'ghost' }] },
      cases: [{ inject: { temperature: 5 } }],
    };
    const problems = await auditSolution('c', code, spec);
    expect(problems.some((p) => p.includes('ghost'))).toBe(true);
  });
});

describe('auditCases', () => {
  const stdinCase = (extra: object = {}) => ({ stdin: '1\n', ...extra });

  it('accepts a spec within the limit with hidden generated cases', () => {
    const spec: LessonTestsSpec = {
      cases: [stdinCase({ visible: true }), stdinCase({ generated: true })],
    };
    expect(auditCases('python', spec)).toEqual([]);
  });

  it('flags a spec over the language limit', () => {
    const spec: LessonTestsSpec = {
      cases: Array.from({ length: MAX_CASES.java + 1 }, () => stdinCase()),
    };
    expect(auditCases('java', spec)).toEqual([expect.stringMatching(/exceeds the java limit/)]);
    expect(auditCases('python', spec)).toEqual([]);
  });

  it('flags a visible generated case', () => {
    const spec: LessonTestsSpec = { cases: [stdinCase({ visible: true, generated: true })] };
    expect(auditCases('c', spec)).toEqual([expect.stringMatching(/always hidden/)]);
  });

  it('flags generated cases on a nondeterministic comparator', () => {
    const spec: LessonTestsSpec = {
      comparator: 'unordered',
      cases: [stdinCase({ generated: true })],
    };
    expect(auditCases('c', spec)).toEqual([expect.stringMatching(/not deterministic/)]);
  });

  it('flags a template comparator without its template, and a template without the comparator', () => {
    const cases = [{ visible: true }];
    expect(auditCases('python', { comparator: 'template', template: 'Hi <name>', cases })).toEqual(
      [],
    );
    expect(auditCases('python', { comparator: 'template', cases })).toEqual([
      expect.stringMatching(/template comparator and a template/),
    ]);
    expect(auditCases('python', { template: 'Hi <name>', cases })).toEqual([
      expect.stringMatching(/template comparator and a template/),
    ]);
  });
  it('accepts one hidden load test at the end', () => {
    const spec: LessonTestsSpec = {
      cases: [stdinCase({ visible: true }), stdinCase({ load: true })],
    };
    expect(auditCases('python', spec)).toEqual([]);
  });

  it('flags a second, misplaced or visible load test', () => {
    expect(
      auditCases('python', { cases: [stdinCase({ load: true }), stdinCase({ load: true })] }),
    ).toEqual([expect.stringMatching(/2 load tests/)]);
    expect(auditCases('python', { cases: [stdinCase({ load: true }), stdinCase()] })).toEqual([
      expect.stringMatching(/not the last case/),
    ]);
    expect(auditCases('python', { cases: [stdinCase({ load: true, visible: true })] })).toEqual([
      expect.stringMatching(/marked visible/),
    ]);
  });
});

describe('auditKinds', () => {
  it('flags a kind the language does not implement, and a loop type it lacks', () => {
    const spec: LessonTestsSpec = {
      structure: {
        requires: [{ kind: 'try' }, { kind: 'loop', type: 'comprehension' }, { kind: 'operator' }],
      },
      cases: [],
    };
    expect(auditKinds('c', spec)).toEqual([
      'structure kind "try" is not implemented for c',
      'loop type "comprehension" does not exist in c',
      'a operator rule needs a name',
    ]);
    expect(auditKinds('python', { ...spec, structure: { requires: [{ kind: 'try' }] } })).toEqual(
      [],
    );
  });
});

describe('auditHarness', () => {
  const harness = { source: '{{code: solve}}\n\nprint(solve())\n', entry: 'solve', lineOffset: 0 };

  it('passes a stdin lesson whose solution defines the function the hidden part calls', () => {
    const spec: LessonTestsSpec = { cases: [{ stdin: '1\n' }] };
    expect(auditHarness(harness, spec, 'def solve():\n    return 1\n')).toEqual([]);
  });

  it('flags structure rules and injection, which would see the hidden code too', () => {
    const spec: LessonTestsSpec = {
      structure: { requires: [{ kind: 'loop' }] },
      cases: [{ inject: { n: 3 } }],
    };
    expect(auditHarness(harness, spec, 'def solve():\n    return 1\n')).toEqual([
      'structure rules on a lesson with a hidden part would see the hidden code too',
      'injection on a lesson with a hidden part could land in the hidden code',
    ]);
  });

  it("flags a solution that doesn't define the function", () => {
    expect(auditHarness(harness, { cases: [] }, 'def other():\n    return 1\n')).toEqual([
      "the solution doesn't define solve, which the hidden part calls",
    ]);
  });
});
