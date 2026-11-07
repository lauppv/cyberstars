import { describe, it, expect } from 'vitest';
import { guardScript } from './scriptGuard';

// Runs guarded code with a clock that says a loop ran too long after `limit`
// turns, and gives back what it logged and the error that stopped it.
function run(code: string, limit = 1_000) {
  const turns: Record<number, number> = {};
  const logs: unknown[] = [];
  const helpers = {
    s(id: number) {
      turns[id] = 0;
    },
    t(id: number) {
      turns[id] += 1;
      return turns[id] > limit;
    },
    e(line: number, file: string) {
      return new Error(`loop at ${file}:${line}`);
    },
  };
  try {
    new Function('__cyberstars', 'log', code)(helpers, (v: unknown) => logs.push(v));
    return { logs, error: null };
  } catch (err) {
    return { logs, error: (err as Error).message };
  }
}

const guarded = (code: string) => guardScript(code, { module: false, label: 'script.js' }).code;

describe('guardScript', () => {
  it('stops every kind of endless loop, naming its line', () => {
    for (const loop of [
      'while (true) {}',
      'while (true) log;',
      'for (;;) {}',
      'for (;;);',
      'do {} while (true);',
      'for (const x of (function* () { while (true) yield 1; })()) {}',
      'outer: while (true) { inner: for (;;) { continue outer; } }',
    ]) {
      expect(run(guarded(`\n${loop}`)).error, loop).toBe('loop at script.js:2');
    }
  });

  it('leaves loops that end doing what they did', () => {
    const code = [
      'let sum = 0;',
      'for (let i = 1; i <= 10; i++) sum += i;',
      'log(sum);',
      'const seen = [];',
      'outer: for (const a of [1, 2, 3]) {',
      '  for (const b of [1, 2, 3]) {',
      '    if (b === 2) continue outer;',
      '    if (a === 3) break outer;',
      '    seen.push(`${a}${b}`);',
      '  }',
      '}',
      'log(seen.join(","));',
      'let n = 0;',
      'do n++; while (n < 5);',
      'if (n) while (n > 0) n--;',
      'log(n);',
      'for (const k in { x: 1, y: 2 }) log(k);',
    ].join('\n');
    expect(run(guarded(code))).toEqual({ logs: [55, '11,21', 0, 'x', 'y'], error: null });
  });

  it('keeps every line where it was', () => {
    const code = 'let a = 1;\nwhile (a < 3)\n  a++;\nfor (;;) {\n  a++;\n}\n';
    expect(guarded(code).split('\n').length).toBe(code.split('\n').length);
  });

  it('numbers the loops from the one it is given', () => {
    const out = guardScript('for(;;){} while(1){}', {
      module: false,
      label: 'a.js',
      firstLoop: 4,
    });
    expect(out.loops).toBe(2);
    expect(out.code).toContain('__cyberstars.s(4)');
    expect(out.code).toContain('__cyberstars.s(5)');
  });

  it('counts lines from where the code starts in its file', () => {
    const out = guardScript('let a = 1;\nwhile (a) {}', {
      module: false,
      label: 'index.html',
      firstLine: 10,
    });
    expect(run(out.code).error).toBe('loop at index.html:11');
  });

  it('leaves code that does not parse as it is', () => {
    expect(guardScript('while (true {', { module: false, label: 'a.js' })).toEqual({
      code: 'while (true {',
      loops: 0,
    });
  });

  it('renames the imports of a module it is asked to, and only those', () => {
    const code = [
      "import { a } from './a.js';",
      "import b from 'https://cdn.example/b.js';",
      "export { c } from './c.js';",
      "export * from './d.js';",
      "const e = await import('./e.js');",
      'const f = await import(name);',
    ].join('\n');
    const out = guardScript(code, {
      module: true,
      label: 'main.js',
      importTarget: (spec) => (spec.startsWith('./') ? `token:${spec}` : null),
    });
    expect(out.code).toBe(
      [
        'import { a } from "token:./a.js";',
        "import b from 'https://cdn.example/b.js';",
        'export { c } from "token:./c.js";',
        'export * from "token:./d.js";',
        'const e = await import("token:./e.js");',
        'const f = await import(name);',
      ].join('\n'),
    );
  });

  it('reads a script as a script, so an import there is a syntax error left alone', () => {
    const code = "import a from './a.js';\nwhile (true) {}";
    expect(guardScript(code, { module: false, label: 'a.js' }).code).toBe(code);
  });
});
