import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { contentDir, hasTestsFile, readLocalized } from './paths.js';
import { AppError } from '../middleware/errorHandler.js';

describe('contentDir', () => {
  it('returns lessons dir for main courses', () => {
    expect(contentDir('python')).toContain('server/lessons/python');
    expect(contentDir('java')).toContain('server/lessons/java');
    expect(contentDir('c')).toContain('server/lessons/c');
  });

  it('returns algorithms dir for algo courses', () => {
    expect(contentDir('algo-python')).toContain('server/algorithms/python');
    expect(contentDir('algo-java')).toContain('server/algorithms/java');
    expect(contentDir('algo-c')).toContain('server/algorithms/c');
  });

  it('returns lessons dir for terminal courses', () => {
    expect(contentDir('linux')).toContain('server/lessons/linux');
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

describe('hasTestsFile', () => {
  it('is true for a lesson shipping a tests file', () => {
    expect(hasTestsFile('python', 'anagram')).toBe(true);
  });

  it('is false for a lesson without a tests file (Kotlin)', () => {
    expect(hasTestsFile('kotlin', 'hello-world')).toBe(false);
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
