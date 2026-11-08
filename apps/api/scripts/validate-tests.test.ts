import { describe, it, expect } from 'vitest';
import type { LessonTestsSpec } from '@cyberstars/shared/tests';
import {
  collectProblems,
  auditSolution,
  auditCases,
  auditKinds,
  auditHarness,
  auditWebSpec,
  MAX_CASES,
  MAX_WEB_CASES,
} from './validate-tests.js';
import type { WebTestsSpec } from '@cyberstars/shared/webTests';

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

describe('auditWebSpec', () => {
  const site = new Set(['index.html', 'crew.html', 'data/crew.json']);
  const spec = (cases: unknown[]) => ({ cases }) as WebTestsSpec;
  const one = (steps: unknown[], extra: object = {}) =>
    auditWebSpec(spec([{ name: 'A case', steps, ...extra }]), site);

  it('takes every kind of step with what it needs', () => {
    expect(
      one([
        { exists: 'h1', label: 'a heading' },
        { count: 'li', atLeast: 2, label: 'crew members' },
        { text: 'h1', equals: 'Hi', label: 'the heading' },
        { attr: 'html', name: 'lang', equals: 'en', label: 'the page' },
        { style: 'h1', prop: 'color', equals: 'rgb(0, 0, 0)', label: 'the heading' },
        { style: 'h1', pseudo: '::before', prop: 'content', equals: '"★"', label: 'its mark' },
        { layout: '.card', arrange: 'row', label: 'the cards' },
        { layout: '.card', arrange: 'column', gap: 12, label: 'the cards' },
        { layout: '.card', arrange: 'row', align: 'start', label: 'the cards' },
        { style: '.card', prop: 'border-top-style', not: 'none', label: 'a card' },
        { style: 'body', prop: 'font-family', endsWith: 'sans-serif', label: 'the page' },
        {
          style: '.card',
          prop: 'padding-top',
          atLeast: 8,
          atMost: 40,
          every: true,
          label: 'a card',
        },
        { contrast: 'p', atLeast: 4.5, on: 'dark', every: true, label: 'a paragraph' },
        {
          differs: '.warning',
          from: 'p:not(.warning)',
          props: ['color', 'background-color'],
          fromLabel: 'the other paragraphs',
          label: 'the warnings',
        },
        { centered: 'main', label: 'the column' },
        { outline: true },
        { size: '.card', maxWidth: 300, label: 'a card' },
        { click: 'a', label: 'the link' },
        { hover: 'a', label: 'the link' },
        { fill: 'input', text: 'Ada', label: 'the name box' },
        { press: 'Enter' },
        { submit: 'form', label: 'the form' },
        { wait: 500 },
        { open: 'crew.html' },
        { at: 'crew.html' },
        { fits: true },
        { logged: 'ready' },
        { noErrors: true },
      ]),
    ).toEqual([]);
  });

  it('refuses a step the judge does not know, or without what it needs', () => {
    expect(one([{ focus: 'a' }])).toEqual([expect.stringMatching(/none of the known keys/)]);
    expect(one([{ hover: 'a' }])).toEqual([expect.stringMatching(/without a label/)]);
    expect(
      one([{ style: 'h1', pseudo: '::marker', prop: 'color', equals: 'red', label: 'x' }]),
    ).toEqual([expect.stringMatching(/pseudo is one of ::before, ::after/)]);
    expect(one([{ exists: 'h1' }])).toEqual([expect.stringMatching(/without a label/)]);
    expect(one([{ text: 'h1', label: 'x' }])).toEqual([expect.stringMatching(/exactly one of/)]);
    expect(one([{ text: 'h1', equals: 'a', contains: 'a', label: 'x' }])).toEqual([
      expect.stringMatching(/exactly one of/),
    ]);
    expect(one([{ count: 'li', label: 'x' }])).toEqual([
      expect.stringMatching(/equals or atLeast/),
    ]);
    expect(one([{ layout: '.c', arrange: 'grid', label: 'x' }])).toEqual([
      expect.stringMatching(/row or a column/),
    ]);
    expect(one([{ size: '.c', label: 'x' }])).toEqual([expect.stringMatching(/needs a bound/)]);
    expect(one([{ style: 'h1', prop: 'color', label: 'x' }])).toEqual([
      expect.stringMatching(/exactly one of equals, not, endsWith, or atLeast/),
    ]);
    expect(one([{ style: 'h1', prop: 'margin', equals: '0px', atLeast: 2, label: 'x' }])).toEqual([
      expect.stringMatching(/exactly one of equals, not, endsWith, or atLeast/),
    ]);
    expect(one([{ style: 'h1', prop: 'margin', atLeast: '8px', label: 'x' }])).toEqual([
      expect.stringMatching(/bounds are px numbers/),
    ]);
    expect(one([{ contrast: 'p', atLeast: 30, label: 'x' }])).toEqual([
      expect.stringMatching(/ratio from 1 to 21/),
    ]);
    expect(one([{ differs: 'p', from: 'h1', props: [], fromLabel: 'y', label: 'x' }])).toEqual([
      expect.stringMatching(/needs props/),
    ]);
    expect(one([{ differs: 'p', props: ['color'], fromLabel: 'y', label: 'x' }])).toEqual([
      expect.stringMatching(/needs from/),
    ]);
    expect(one([{ layout: '.c', arrange: 'row', gap: 0, label: 'x' }])).toEqual([
      expect.stringMatching(/gap is a number of px above 0/),
    ]);
    expect(one([{ outline: 'yes' }])).toEqual([expect.stringMatching(/outline must be true/)]);
    expect(one([{ wait: 10_000 }])).toEqual([expect.stringMatching(/wait must be/)]);
    expect(one([{ exists: 'h1', label: 'x', equal: 'typo' }])).toEqual([
      expect.stringMatching(/keys it doesn't take: equal/),
    ]);
  });

  it('wants every page a case opens in the site', () => {
    expect(one([{ open: 'wiki.html' }])).toEqual([expect.stringMatching(/doesn't have/)]);
    expect(one([{ exists: 'h1', label: 'x' }], { page: 'wiki.html' })).toEqual([
      expect.stringMatching(/opens wiki.html/),
    ]);
    // A case may bring the page itself
    expect(
      one([{ exists: 'h1', label: 'x' }], { page: 'wiki.html', files: { 'wiki.html': '<h1>' } }),
    ).toEqual([]);
  });

  it('checks the case itself: a name, a width a window has, whole fetch addresses', () => {
    expect(auditWebSpec(spec([{ steps: [{ fits: true }] }]), site)).toEqual([
      expect.stringMatching(/no name/),
    ]);
    expect(one([{ fits: true }], { width: 100 })).toEqual([expect.stringMatching(/width 100/)]);
    expect(one([{ fits: true }], { fetch: { '/api/crew': { body: '[]' } } })).toEqual([
      expect.stringMatching(/whole http/),
    ]);
    expect(one([], {})).toEqual([expect.stringMatching(/no steps/)]);
    expect(auditWebSpec(spec([]), site)).toEqual(['no cases']);
    const many = Array.from({ length: MAX_WEB_CASES + 1 }, () => ({
      name: 'x',
      steps: [{ fits: true }],
    }));
    expect(auditWebSpec(spec(many), site)).toEqual([expect.stringMatching(/web limit/)]);
  });
});
