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

  it('reports structure failures from the pristine user code', async () => {
    const noAge = '#include <stdio.h>\nint main(void){ printf("hi"); return 0; }';
    const result = await prepareC(noAge, PROGRAM, spec);
    expect(result.structureFailures).toEqual([
      { type: 'require', rule: { kind: 'variable', name: 'age' } },
    ]);
  });
});
