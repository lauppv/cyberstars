import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { defines, readHarness, studentHarness, studentLines, wrapCode } from './harness.js';

const dirs: string[] = [];

// A folder holding one <slug>-harness.md with this text.
function harnessDir(text: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-'));
  dirs.push(dir);
  fs.writeFileSync(path.join(dir, 'demo-harness.md'), text);
  return dir;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('readHarness', () => {
  it('reads the program, the function it calls and the lines above the placeholder', () => {
    const dir = harnessDir(
      '```c\n#include <stdio.h>\n#line 1 "main.c"\n{{code: solve}}\nint main(void) {}\n```\n',
    );
    expect(readHarness(dir, 'demo')).toEqual({
      source: '#include <stdio.h>\n#line 1 "main.c"\n{{code: solve}}\nint main(void) {}\n',
      entry: 'solve',
      lineOffset: 2,
    });
  });

  it('counts no lines when the placeholder shares the first line', () => {
    const dir = harnessDir(
      '```java\nimport java.util.*; {{code: solve}}\n\npublic class Main {}\n```\n',
    );
    expect(readHarness(dir, 'demo')?.lineOffset).toBe(0);
  });

  it('is null for a lesson without one', () => {
    expect(readHarness(os.tmpdir(), 'no-such-lesson')).toBeNull();
  });

  it('refuses a file without a placeholder or without a fence', () => {
    expect(() => readHarness(harnessDir('```py\nprint(1)\n```\n'), 'demo')).toThrow(/placeholder/);
    expect(() => readHarness(harnessDir('{{code: solve}}'), 'demo')).toThrow(/placeholder/);
  });
});

describe('wrapCode', () => {
  const harness = { source: '{{code: f}}\n\nprint(f())\n', entry: 'f', lineOffset: 0 };

  it("puts the code in the placeholder's place, its last newlines left out", () => {
    expect(wrapCode(harness, 'def f():\n    return 1\n\n\n')).toBe(
      'def f():\n    return 1\n\nprint(f())\n',
    );
  });

  it('keeps a $ in the code as written', () => {
    expect(wrapCode(harness, "s = '$&$1'")).toBe("s = '$&$1'\n\nprint(f())\n");
  });

  it('leaves the code alone without a hidden part', () => {
    expect(wrapCode(null, 'print(1)')).toBe('print(1)');
  });
});

describe('defines', () => {
  it('finds a function by its name followed by a bracket', () => {
    expect(defines('def max_depth (root):', 'max_depth')).toBe(true);
    expect(defines('def max_depth_of(root):', 'max_depth')).toBe(false);
    expect(defines('max_depth = 3', 'max_depth')).toBe(false);
  });
});

const ro = `${path.sep}ro${path.sep}`;
const PY = {
  en: '```py\n{{code: max_depth}}\n\nroot = build_tree(input())\nprint(max_depth(root))\n```\n',
  ro: '```py\n{{code: adancime_maxima}}\n\nprint(adancime_maxima(None))\n```\n',
};
const JAVA = {
  en: '```java\nimport java.util.*; {{code: maxDepth}}\n```\n',
  ro: '```java\nimport java.util.*; {{code: adancimeMaxima}}\n```\n',
};

// The trees and graphs challenges ship a hidden part in each locale; nothing
// else does.
function stubHarnesses() {
  vi.spyOn(fs, 'existsSync').mockImplementation(
    (file) => String(file).includes('trees-graphs') && String(file).endsWith('-harness.md'),
  );
  vi.spyOn(fs, 'readFileSync').mockImplementation((file) => {
    const harness = String(file).includes(`${path.sep}java${path.sep}`) ? JAVA : PY;
    return String(file).includes(ro) ? harness.ro : harness.en;
  });
}

describe('studentHarness', () => {
  beforeEach(stubHarnesses);

  it("picks the page language's hidden part", () => {
    const en = studentHarness('algo-trees-graphs', 'max-depth', 'en', 'python', '');
    const ro = studentHarness('algo-trees-graphs', 'max-depth', 'ro', 'python', '');
    expect(en?.entry).toBe('max_depth');
    expect(ro?.entry).toBe('adancime_maxima');
  });

  it("picks the other one when the code is written in the other language's names", () => {
    const code = 'def adancime_maxima(radacina):\n    return 0\n';
    expect(studentHarness('algo-trees-graphs', 'max-depth', 'en', 'python', code)?.entry).toBe(
      'adancime_maxima',
    );
    const java = 'class Solution {\n    static int maxDepth(Node root) { return 0; }\n}\n';
    expect(studentHarness('algo-trees-graphs', 'max-depth', 'ro', 'java', java)?.entry).toBe(
      'maxDepth',
    );
  });

  it('is null for a lesson without one, or a slug that is no slug', () => {
    expect(studentHarness('python', 'print', 'en', undefined, '')).toBeNull();
    expect(studentHarness('algo-trees-graphs', '../max-depth', 'en', 'python', '')).toBeNull();
  });
});

describe('studentLines', () => {
  const harness = { source: '', entry: 'f', lineOffset: 3 };

  it("moves every line number below the hidden part to the student's own", () => {
    expect(studentLines('line 5: syntax error, line 9: missing ;', harness)).toBe(
      'line 2: syntax error, line 6: missing ;',
    );
  });

  it('leaves a line inside the hidden part, and every line without one', () => {
    expect(studentLines('line 2: error', harness)).toBe('line 2: error');
    expect(studentLines('line 5: error', null)).toBe('line 5: error');
    expect(studentLines('line 5: error', { ...harness, lineOffset: 0 })).toBe('line 5: error');
  });
});
