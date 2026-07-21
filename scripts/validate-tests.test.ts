import { describe, it, expect } from 'vitest';
import type { LessonTestsSpec } from '../shared/tests.js';
import { collectProblems, auditSolution } from './validate-tests.js';

// The corpus regression: if anyone edits a -tests.json / -solution.md so an
// inject key no longer resolves, or drops a RO tests file for an injection
// lesson, this goes red — anti-hardcoding can't be silently disabled anymore.
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

  it('flags a C inject key that has no initializer (scanf var — injection no-ops)', async () => {
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
