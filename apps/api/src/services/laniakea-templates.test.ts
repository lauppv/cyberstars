import { describe, it, expect } from 'vitest';
import {
  madeId,
  parseTemplates,
  planLesson,
  planTemplate,
  sameQuestions,
  templatePairProblems,
  type ProgramRun,
} from './laniakea-templates.js';

// A run that printed `out`, or one stopped by `error`
const ok = (out: string): ProgramRun => ({ ok: true, out });
const fails = (error = 'NameError'): ProgramRun => ({ ok: false, error });

const prints = {
  id: 'add',
  kind: 'prints',
  text: 'What does this print?',
  code: 'x = {{a}}\nprint(x + {{b}})',
  values: [
    { a: 7, b: 3 },
    { a: 5, b: 5 },
  ],
  mistakes: [
    ['x + {{b}}', 'str(x) + str({{b}})'],
    ['x + {{b}}', '"x + {{b}}"'],
    ['x + {{b}}', 'x, {{b}}'],
    ['x + {{b}}', 'x - {{b}}'],
  ],
};

const template = (over: Record<string, unknown> = {}) =>
  parseTemplates({ templates: [{ ...prints, ...over }] })[0];
const plans = (over: Record<string, unknown> = {}, lang: 'en' | 'ro' = 'en') =>
  planTemplate(template(over), lang);

describe('parseTemplates', () => {
  it('has none in a file without templates', () => {
    expect(parseTemplates({ questions: [] })).toEqual([]);
  });

  it('reads a template, its values as text', () => {
    expect(template()).toMatchObject({
      id: 'add',
      kind: 'prints',
      values: [
        { a: '7', b: '3' },
        { a: '5', b: '5' },
      ],
      mistakes: prints.mistakes,
    });
  });

  it.each([
    [{ templates: 3 }, 'templates is not a list'],
    [{ templates: [null] }, 'template 1 has a bad id'],
    [{ templates: [prints, prints] }, 'template 2 repeats the id add'],
    [{ templates: [{ ...prints, kind: 'guess' }] }, 'add has no kind of prints, which-program'],
    [{ templates: [{ ...prints, code: ' ' }] }, 'add code has no text'],
    [{ templates: [{ ...prints, text: '' }] }, 'add has no text'],
    [{ templates: [{ ...prints, values: [] }] }, 'add has no values'],
    [{ templates: [{ ...prints, values: [[1]] }] }, 'add value set 1 is not an object'],
    [{ templates: [{ ...prints, values: [{ a: true }] }] }, 'add value a in set 1 is not text'],
    [
      { templates: [{ ...prints, values: [{ a: 1, b: 2 }, { a: 1 }] }] },
      'add value set 2 fills a, the first fills a, b',
    ],
    [{ templates: [{ ...prints, mistakes: 'x' }] }, 'add mistakes is not a list'],
    [{ templates: [{ ...prints, mistakes: prints.mistakes.slice(0, 2) }] }, 'add needs 3 mistakes'],
    [{ templates: [{ ...prints, mistakes: [['x']] }] }, 'add mistake 1 is not a pair'],
    [{ templates: [{ ...prints, mistakes: [['x', 'x']] }] }, 'add mistake 1 changes nothing'],
    [
      { templates: [{ ...prints, mistakes: [['y', 'z']] }] },
      'add mistake 1: "y" is not in the code once',
    ],
    [
      { templates: [{ ...prints, kind: 'wrong-line', bug: ['x = {{a}}\n', 'x = 1'] }] },
      'add bug changes more than one line',
    ],
    [
      { templates: [{ ...prints, kind: 'missing-line', answer: 'a', wrong: ['b', 'c', 'd'] }] },
      'add code needs one ___',
    ],
    [
      { templates: [{ ...prints, kind: 'missing-line', code: 'print(___)' }] },
      'add: the ___ of a missing line is a line of its own',
    ],
    [
      { templates: [{ ...prints, kind: 'missing-value', code: 'x = 1\n  ___' }] },
      'add: the ___ of a missing value is inside a line',
    ],
    [
      {
        templates: [
          { ...prints, kind: 'missing-value', code: 'print(___)', answer: 'x', wrong: ['a', 'b'] },
        ],
      },
      'add needs 3 wrong options',
    ],
  ])('refuses a broken template (%#)', (raw, message) => {
    expect(() => parseTemplates(raw)).toThrow(message);
  });
});

describe('madeId', () => {
  it('names a question by its template, kind and values, in any order', () => {
    const t = template();
    const id = madeId(t, { a: '7', b: '3' });
    expect(id).toMatch(/^add-[0-9a-f]{6}$/);
    expect(madeId(t, { b: '3', a: '7' })).toBe(id);
    expect(madeId(t, { a: '7', b: '4' })).not.toBe(id);
    expect(madeId({ ...t, kind: 'which-program' }, { a: '7', b: '3' })).not.toBe(id);
  });
});

describe('planTemplate', () => {
  it('prints: the right option is what the code prints, the wrong ones what the mistakes print', () => {
    const [plan] = plans();
    expect(plan.id).toBe(madeId(template(), { a: '7', b: '3' }));
    expect(plan.programs).toEqual([
      'x = 7\nprint(x + 3)',
      'x = 7\nprint(str(x) + str(3))',
      'x = 7\nprint("x + 3")',
      'x = 7\nprint(x, 3)',
      'x = 7\nprint(x - 3)',
    ]);
    expect(plan.build([ok('10\n'), ok('73\n'), ok('x + 3\n'), ok('7 3\n'), ok('4\n')])).toEqual({
      id: plan.id,
      text: 'What does this print?',
      code: 'x = 7\nprint(x + 3)',
      output: null,
      options: ['10', '73', 'x + 3', '7 3'],
      answer: 0,
    });
  });

  it('passes over a mistake that prints the answer, another option, nothing, or fails', () => {
    const [plan] = plans({
      mistakes: [...prints.mistakes, ['x + {{b}}', 'x * {{b}}'], ['x + {{b}}', 'x // {{b}}']],
    });
    const runs = [ok('10'), ok('10'), ok('\n'), fails(), ok('4  \n\n'), ok('4'), ok('21'), ok('2')];
    expect(plan.build(runs).options).toEqual(['10', '4', '21', '2']);
  });

  it('refuses values whose mistakes leave fewer than three wrong options', () => {
    const [, plan] = plans();
    expect(() => plan.build([ok('10'), ok('55'), ok('10'), ok('55'), fails()])).toThrow(
      'add with {"a":"5","b":"5"}: only 1 of its wrong options stand',
    );
  });

  it('refuses a program that fails or prints nothing', () => {
    const [plan] = plans();
    expect(() => plan.build([fails('SyntaxError'), ...Array(4).fill(ok('1'))])).toThrow(
      'add with {"a":"7","b":"3"}: the program fails (SyntaxError)',
    );
    expect(() => plan.build([ok(' \n'), ...Array(4).fill(ok('1'))])).toThrow(
      'the program prints nothing',
    );
  });

  it('which-program: the options are programs, a mistaken one that prints the output passed over', () => {
    const [plan] = plans({ kind: 'which-program' });
    expect(plan.build([ok('10'), ok('73'), fails(), ok('10\n'), ok('4')])).toEqual({
      id: plan.id,
      text: 'What does this print?',
      code: null,
      output: '10',
      options: [
        'x = 7\nprint(x + 3)',
        'x = 7\nprint(str(x) + str(3))',
        'x = 7\nprint("x + 3")',
        'x = 7\nprint(x - 3)',
      ],
      answer: 0,
    });
  });

  const gap = {
    kind: 'missing-line',
    text: 'Which line goes in the gap?',
    code: 'x = {{a}}\nif x > 0:\n    ___',
    values: [{ a: 2 }],
    answer: 'print(x * 2)',
    wrong: ['print(x + 2)', 'print(x ** 2)', 'print("x * 2")', 'print(x)', 'print(x - 2)'],
  };

  it('missing-line: each line goes in the gap, the answer gives the output shown', () => {
    const [plan] = plans(gap);
    expect(plan.programs.slice(0, 2)).toEqual([
      'x = 2\nif x > 0:\n    print(x * 2)',
      'x = 2\nif x > 0:\n    print(x + 2)',
    ]);
    // With x = 2, x + 2 and x ** 2 print 4 too, so they don't stand
    const runs = [ok('4'), ok('4'), ok('4'), ok('x * 2'), ok('2'), ok('0')];
    expect(plan.build(runs)).toEqual({
      id: plan.id,
      text: 'Which line goes in the gap?',
      code: 'x = 2\nif x > 0:\n    ___',
      output: '4',
      options: ['print(x * 2)', 'print("x * 2")', 'print(x)', 'print(x - 2)'],
      answer: 0,
    });
  });

  it('missing-value: a value fills the gap inside a line, and a wrong one may fail', () => {
    const [plan] = plans({
      ...gap,
      kind: 'missing-value',
      code: 'print(___)',
      values: [{ word: 'Hi' }],
      answer: '"{{word}}"',
      wrong: ['{{word}}', '\'"{{word}}"\'', '"print {{word}}"'],
    });
    expect(plan.programs[1]).toBe('print(Hi)');
    expect(plan.build([ok('Hi'), fails(), ok('"Hi"'), ok('print Hi')]).options).toEqual([
      '"Hi"',
      'Hi',
      '\'"Hi"\'',
      '"print Hi"',
    ]);
  });

  const wrongLine = {
    kind: 'wrong-line',
    text: 'Which line is wrong?',
    code: 'a = {{a}}\nb = 2\n\nprint(a)\nprint(b)',
    values: [{ a: 1 }],
    bug: ['print(a)', 'print(c)'],
  };

  it('wrong-line: shows the broken program, its broken line and three others as options', () => {
    const [plan] = plans(wrongLine);
    expect(plan.programs).toEqual([
      'a = 1\nb = 2\n\nprint(a)\nprint(b)',
      'a = 1\nb = 2\n\nprint(c)\nprint(b)',
    ]);
    expect(plan.build([ok('1\n2\n'), fails()])).toEqual({
      id: plan.id,
      text: 'Which line is wrong?',
      code: 'a = 1\nb = 2\n\nprint(c)\nprint(b)',
      output: '1\n2',
      options: ['print(c)', 'a = 1', 'b = 2', 'print(b)'],
      answer: 0,
    });
  });

  it('wrong-line: refuses a broken program that still prints the output, or too few lines', () => {
    const [plan] = plans(wrongLine);
    expect(() => plan.build([ok('1\n2'), ok('1\n2\n')])).toThrow(
      'the broken program still prints it',
    );
    const [short] = plans({ ...wrongLine, code: 'a = 1\nprint(a)\n\na = 1' });
    expect(() => short.build([ok('1\n1'), fails()])).toThrow('only 1 of its wrong options stand');
  });

  it('wrong-line: refuses a bug that a value undoes', () => {
    const [plan] = plans({ ...wrongLine, code: 'a = {{a}}\nprint(a)', bug: ['{{a}}', '1'] });
    expect(() => plan.build([ok('1'), ok('1')])).toThrow('the bug changes nothing');
  });

  it('refuses a value set twice and a blank the text has no value for', () => {
    expect(() =>
      plans({
        values: [
          { a: 1, b: 2 },
          { b: 2, a: 1 },
        ],
      }),
    ).toThrow('add repeats a set of values');
    expect(() => plans({ text: 'What is {{c}}?' })).toThrow(
      'add with {"a":"7","b":"3"}: the text has a blank with no value',
    );
  });

  it("refuses Romanian code that isn't ASCII", () => {
    expect(() => plans({ values: [{ a: '"șapte"', b: 3 }] }, 'ro')).toThrow(
      "the Romanian code isn't ASCII",
    );
    expect(plans({ values: [{ a: '"sapte"', b: 3 }] }, 'ro')).toHaveLength(1);
  });
});

describe('Romanian twins', () => {
  const ro = {
    ...prints,
    text: 'Ce afișează?',
    code: 'y = {{a}}\nprint(y + {{b}})',
    mistakes: prints.mistakes.map(([w, i]) => [w.replace('x', 'y'), i.replace(/x/g, 'y')]),
  };

  it('make the same questions, with the English ids', () => {
    const plan = planLesson(
      parseTemplates({ templates: [prints] }),
      parseTemplates({
        templates: [
          {
            ...ro,
            values: [
              { a: 1, b: 2 },
              { a: 3, b: 4 },
            ],
          },
        ],
      }),
    );
    expect(plan.ro.map((p) => p.id)).toEqual(plan.en.map((p) => p.id));
    expect(plan.ro[0].programs[0]).toBe('y = 1\nprint(y + 2)');
  });

  it('name what differs', () => {
    const en = parseTemplates({
      templates: [prints, { ...prints, id: 'b' }, { ...prints, id: 'c' }],
    });
    const other = parseTemplates({
      templates: [
        { ...ro, id: 'z' },
        { ...ro, id: 'b', kind: 'which-program' },
        { ...ro, id: 'c', values: [{ a: 1, b: 2 }] },
        { ...ro, id: 'd' },
      ],
    });
    expect(templatePairProblems(en, other)).toEqual([
      '3 templates in English, 4 in Romanian',
      'template 1 is add in English, z in Romanian',
      'b is another kind in Romanian',
      'c has 2 value sets in English, 1 in Romanian',
    ]);
    expect(() => planLesson(en, other)).toThrow(
      '3 templates in English, 4 in Romanian; template 1',
    );
  });
});

describe('sameQuestions', () => {
  it('names questions that read the same', () => {
    const q = (id: string, text: string, code: string | null = null) => ({
      id,
      text,
      code,
      output: null,
      options: [],
      answer: 0,
    });
    expect(
      sameQuestions([q('a', 'Hi?'), q('b', 'Hi?', 'x'), q('c', 'Hi?'), q('d', 'Yo?')]),
    ).toEqual(['c reads the same as a']);
  });
});
