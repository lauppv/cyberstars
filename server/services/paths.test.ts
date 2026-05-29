import { describe, it, expect } from 'vitest';
import { contentDir } from './paths.js';
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
