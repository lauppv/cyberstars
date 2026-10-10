// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  parseC,
  detectSyntaxError,
  checkStructure,
  collectInjectionSites,
  applyInjection,
  prepareC,
} from './c-analysis.js';

const PROGRAM = `#include <stdio.h>

int main(void) {
    int age = 45;
    double price = 1.75;
    long big = 10;
    char grade = 'A';
    char name[] = "Rex";
    char *tag = "Kai";
    for (int i = 0; i < 3; i++) {
        printf("%d\\n", age);
    }
    return 0;
}`;

describe('detectSyntaxError', () => {
  it('returns null for well-formed C', async () => {
    expect(detectSyntaxError(await parseC(PROGRAM))).toBeNull();
  });

  it('reports a line for broken C', async () => {
    const err = detectSyntaxError(await parseC('int main(void){ int x = ; }'));
    expect(err).toMatch(/line \d+/);
  });

  it('reports a line for a missing brace', async () => {
    const err = detectSyntaxError(await parseC('int main(void){ int x = 1;'));
    expect(err).toMatch(/line \d+/);
  });

  it('quotes the offending snippet for a stray-token error', async () => {
    const err = detectSyntaxError(await parseC('int main(void){ return 0; } @ bogus'));
    expect(err).toMatch(/syntax error/);
  });
});

describe('checkStructure', () => {
  it('passes when required variable, call and loop are present', async () => {
    const root = await parseC(PROGRAM);
    const failures = checkStructure(root, {
      requires: [
        { kind: 'variable', name: 'age' },
        { kind: 'call', name: 'printf' },
        { kind: 'loop' },
        { kind: 'function', name: 'main' },
      ],
    });
    expect(failures).toHaveLength(0);
  });

  it('recognises a variable declared without an initializer', async () => {
    const root = await parseC('int main(void){ int total; return 0; }');
    expect(checkStructure(root, { requires: [{ kind: 'variable', name: 'total' }] })).toHaveLength(
      0,
    );
  });

  it('flags a missing required variable', async () => {
    const root = await parseC(PROGRAM);
    const failures = checkStructure(root, {
      requires: [{ kind: 'variable', name: 'missing' }],
    });
    expect(failures).toEqual([{ type: 'require', rule: { kind: 'variable', name: 'missing' } }]);
  });

  it('fires a forbidden int literal (hardcode smell)', async () => {
    const root = await parseC('int main(void){ printf("%d", 42); return 0; }');
    const failures = checkStructure(root, {
      forbids: [{ kind: 'int_literal', values: [42] }],
    });
    expect(failures).toHaveLength(1);
    expect(failures[0].type).toBe('forbid');
  });

  it('an unknown kind passes as a require and fires as a forbid', async () => {
    const root = await parseC(PROGRAM);
    expect(checkStructure(root, { requires: [{ kind: 'fstring' }] })).toHaveLength(0);
    expect(checkStructure(root, { forbids: [{ kind: 'fstring' }] })).toHaveLength(1);
  });

  it('flags a required function whose name is absent', async () => {
    const root = await parseC(PROGRAM);
    const failures = checkStructure(root, { requires: [{ kind: 'function', name: 'helper' }] });
    expect(failures).toEqual([{ type: 'require', rule: { kind: 'function', name: 'helper' } }]);
  });

  it('does not fire a forbidden int literal that is not present', async () => {
    const root = await parseC(PROGRAM);
    expect(
      checkStructure(root, { forbids: [{ kind: 'int_literal', values: [999] }] }),
    ).toHaveLength(0);
  });

  it('an int_literal rule without values never matches', async () => {
    const root = await parseC(PROGRAM);
    expect(checkStructure(root, { forbids: [{ kind: 'int_literal' }] })).toHaveLength(0);
  });

  it('matches hex and skips float literals for int_literal rules', async () => {
    const hex = await parseC('int main(void){ int x = 0xFF; return 0; }');
    expect(checkStructure(hex, { forbids: [{ kind: 'int_literal', values: [255] }] })).toHaveLength(
      1,
    );
    const flt = await parseC('int main(void){ double d = 2.5; return 0; }');
    expect(checkStructure(flt, { forbids: [{ kind: 'int_literal', values: [2] }] })).toHaveLength(
      0,
    );
  });

  it('ignores a call made through a non-identifier expression', async () => {
    const root = await parseC('int main(void){ int (*fp)(void) = 0; (*fp)(); return 0; }');
    expect(checkStructure(root, { requires: [{ kind: 'call', name: 'fp' }] })).toHaveLength(1);
  });

  it('finds a required substring inside a // comment, whitespace-insensitively', async () => {
    const root = await parseC(
      'int main(void){\n    // printf( "ACCESS-7734-SECRET\\n" );\n    return 0;\n}',
    );
    expect(
      checkStructure(root, { requires: [{ kind: 'comment', contains: 'ACCESS-7734-SECRET' }] }),
    ).toHaveLength(0);
    expect(
      checkStructure(root, {
        requires: [{ kind: 'comment', contains: 'printf("ACCESS-7734-SECRET' }],
      }),
    ).toHaveLength(0);
  });

  it('finds a required substring inside a /* */ comment', async () => {
    const root = await parseC('int main(void){\n    /* printf("secret"); */\n    return 0;\n}');
    expect(
      checkStructure(root, { requires: [{ kind: 'comment', contains: 'printf("secret")' }] }),
    ).toHaveLength(0);
  });

  it('flags a missing comment requirement (string in code is not a comment)', async () => {
    const root = await parseC('int main(void){ printf("ACCESS-7734-SECRET\\n"); return 0; }');
    expect(
      checkStructure(root, { requires: [{ kind: 'comment', contains: 'ACCESS-7734-SECRET' }] }),
    ).toHaveLength(1);
  });

  it('fires string_expr on a bare string statement (the fake-comment cheat)', async () => {
    const root = await parseC('int main(void){\n    "printf(\\"secret\\");";\n    return 0;\n}');
    expect(checkStructure(root, { forbids: [{ kind: 'string_expr' }] })).toHaveLength(1);
  });

  it('does not fire string_expr on strings used as arguments', async () => {
    const root = await parseC('int main(void){ printf("hello\\n"); return 0; }');
    expect(checkStructure(root, { forbids: [{ kind: 'string_expr' }] })).toHaveLength(0);
  });
});

describe('collectInjectionSites + applyInjection', () => {
  it('renders each scalar type correctly', async () => {
    const root = await parseC(PROGRAM);
    const sites = collectInjectionSites(root);
    const out = applyInjection(PROGRAM, sites, {
      age: 99,
      price: 4.75,
      big: 200,
      grade: 'Z',
      name: 'Tommy',
      tag: 'Lance',
    });
    expect(out).toContain('int age = 99;');
    expect(out).toContain('double price = 4.75;');
    expect(out).toContain('long big = 200L;');
    expect(out).toContain("char grade = 'Z';");
    expect(out).toContain('char name[] = "Tommy";');
    expect(out).toContain('char *tag = "Lance";');
  });

  it('leaves the source untouched when no names match', async () => {
    const root = await parseC(PROGRAM);
    expect(applyInjection(PROGRAM, collectInjectionSites(root), { nope: 1 })).toBe(PROGRAM);
  });

  it('feeds a JS array to successive declarations of the same name', async () => {
    const src = 'int main(void){ int x = 1; int x = 2; return 0; }';
    const sites = collectInjectionSites(await parseC(src));
    const out = applyInjection(src, sites, { x: [7, 8] });
    expect(out).toContain('int x = 7;');
    expect(out).toContain('int x = 8;');
  });

  it('renders booleans as 1/0 for a bool declarator', async () => {
    const src = '#include <stdbool.h>\nint main(void){ bool ok = true; return 0; }';
    const sites = collectInjectionSites(await parseC(src));
    expect(applyInjection(src, sites, { ok: false })).toContain('bool ok = 0;');
    expect(applyInjection(src, sites, { ok: true })).toContain('bool ok = 1;');
  });

  it('renders a float declarator, adding a decimal point for whole values', async () => {
    const src = 'int main(void){ float rate = 1.5f; return 0; }';
    const sites = collectInjectionSites(await parseC(src));
    expect(applyInjection(src, sites, { rate: 2.5 })).toContain('float rate = 2.5f;');
    expect(applyInjection(src, sites, { rate: 3 })).toContain('float rate = 3.0f;');
  });

  it('renders a boolean injected into an int declarator as 1/0', async () => {
    const src = 'int main(void){ int flag = 0; return 0; }';
    const sites = collectInjectionSites(await parseC(src));
    expect(applyInjection(src, sites, { flag: true })).toContain('int flag = 1;');
    expect(applyInjection(src, sites, { flag: false })).toContain('int flag = 0;');
  });

  it('skips declarations without an initializer', async () => {
    const src = 'int main(void){ int x; int y = 5; return 0; }';
    const sites = collectInjectionSites(await parseC(src));
    expect(sites.map((s) => s.name)).toEqual(['y']);
  });

  it('throws when asked to inject a $list/$dict value', async () => {
    const src = 'int main(void){ int x = 1; return 0; }';
    const sites = collectInjectionSites(await parseC(src));
    expect(() => applyInjection(src, sites, { x: { $list: [1, 2] } })).toThrow(/does not support/);
  });
});

describe('prepareC', () => {
  const spec = {
    structure: { requires: [{ kind: 'variable' as const, name: 'age' }] },
    cases: [
      { visible: true, inject: { age: 5 } },
      { inject: { age: 100 }, stdin: 'x\n' },
    ],
  };

  it('injects into both user and solution per case', async () => {
    const result = await prepareC(PROGRAM, PROGRAM, spec);
    expect(result.syntaxError).toBeNull();
    expect(result.structureFailures).toHaveLength(0);
    expect(result.cases).toHaveLength(2);
    expect(result.cases[0].userSrc).toContain('int age = 5;');
    expect(result.cases[0].solutionSrc).toContain('int age = 5;');
    expect(result.cases[1].userSrc).toContain('int age = 100;');
    expect(result.cases[1].stdin).toBe('x\n');
  });

  it('short-circuits on a syntax error without injecting', async () => {
    const result = await prepareC('int main(void){ int x = ; }', PROGRAM, spec);
    expect(result.syntaxError).toMatch(/line \d+/);
    expect(result.cases).toHaveLength(0);
  });

  it('handles cases with no inject block', async () => {
    const noInjectSpec = {
      structure: { requires: [{ kind: 'variable' as const, name: 'age' }] },
      cases: [{ visible: true }],
    };
    const result = await prepareC(PROGRAM, PROGRAM, noInjectSpec);
    expect(result.cases).toHaveLength(1);
    expect(result.cases[0].userSrc).toContain('int age = 45;');
  });

  it('reports structure failures from the pristine user code', async () => {
    const noAge = '#include <stdio.h>\nint main(void){ printf("hi"); return 0; }';
    const result = await prepareC(noAge, PROGRAM, spec);
    expect(result.structureFailures).toEqual([
      { type: 'require', rule: { kind: 'variable', name: 'age' } },
    ]);
  });
});
