import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { contentDir, hasTestsFile, readLocalized } from './paths.js';
import { AppError } from '@cyberstars-framework/server-kit/errors';

describe('contentDir', () => {
  it('returns lessons dir for main courses', () => {
    expect(contentDir('python')).toContain('packages/content/lessons/python');
    expect(contentDir('java')).toContain('packages/content/lessons/java');
    expect(contentDir('c')).toContain('packages/content/lessons/c');
  });

  it('returns algorithms dir for algo courses', () => {
    expect(contentDir('algo-python')).toContain('packages/content/algorithms/python');
    expect(contentDir('algo-java')).toContain('packages/content/algorithms/java');
    expect(contentDir('algo-c')).toContain('packages/content/algorithms/c');
  });

  it('returns lessons dir for terminal courses', () => {
    expect(contentDir('linux')).toContain('packages/content/lessons/linux');
  });

  it('rejects path traversal attempts via courseKey', () => {
    expect(() => contentDir('../../etc')).toThrow(AppError);
    expect(() => contentDir('..')).toThrow(AppError);
    expect(() => contentDir('python/../..')).toThrow(AppError);
  });

  it('rejects unknown course keys', () => {
    expect(() => contentDir('unknown-course')).toThrow(AppError);
    expect(() => contentDir('')).toThrow(AppError);
  });
});

describe('contentDir on a multi-language course', () => {
  it('opens the folder of the language given, Python without one', () => {
    expect(contentDir('trees-graphs', 'java')).toMatch(/lessons\/trees-graphs\/java$/);
    expect(contentDir('trees-graphs')).toMatch(/lessons\/trees-graphs\/python$/);
  });

  it('opens a multi-language challenge set under algorithms/', () => {
    expect(contentDir('algo-trees-graphs', 'c')).toMatch(/algorithms\/trees-graphs\/c$/);
    expect(contentDir('algo-trees-graphs')).toMatch(/algorithms\/trees-graphs\/python$/);
  });

  it('ignores the language on a course with one', () => {
    expect(contentDir('algo-c', 'java')).toMatch(/algorithms\/c$/);
  });

  it('rejects a language that is not a code language', () => {
    expect(() => contentDir('trees-graphs', '../python')).toThrow(AppError);
    expect(() => contentDir('python', 'ruby')).toThrow(AppError);
  });
});

describe('hasTestsFile', () => {
  it('is true for a lesson shipping a tests file', () => {
    expect(hasTestsFile('python', 'anagram')).toBe(true);
  });

  it('is false for a lesson without a tests file', () => {
    expect(hasTestsFile('python', 'no-such-lesson')).toBe(false);
  });
});

describe('readLocalized', () => {
  const dir = contentDir('python');
  const read = (...parts: string[]) => fs.readFileSync(path.join(dir, ...parts), 'utf8');

  it('reads the English file', () => {
    expect(readLocalized(dir, 'anagram-solution.md', 'en')).toBe(read('anagram-solution.md'));
  });

  it('prefers the Romanian translation when there is one', () => {
    expect(readLocalized(dir, 'anagram-solution.md', 'ro')).toBe(read('ro', 'anagram-solution.md'));
  });

  it('returns an empty string for a missing file', () => {
    expect(readLocalized(dir, 'no-such-lesson-solution.md', 'ro')).toBe('');
  });
});
