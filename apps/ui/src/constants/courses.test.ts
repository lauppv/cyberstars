import { describe, it, expect } from 'vitest';
import i18next from 'i18next';
import { courseLabel, courseMeta, courseTitle } from './courses';

describe('courseMeta', () => {
  it('resolves base languages', () => {
    expect(courseMeta('python').label).toBe('Python');
    expect(courseMeta('java').icon).toBe('☕');
    expect(courseMeta('c').langLabel).toBe('C');
  });

  it('resolves algo- keys to the same metadata as the base language', () => {
    expect(courseMeta('algo-python')).toEqual(courseMeta('python'));
    expect(courseMeta('algo-c')).toEqual(courseMeta('c'));
  });

  it('uses one color per language across course and algorithm screens', () => {
    expect(courseMeta('algo-java').color).toBe(courseMeta('java').color);
  });

  it('falls back gracefully for unknown keys', () => {
    const meta = courseMeta('ruby');
    expect(meta.icon).toBe('📘');
    expect(meta.label).toBe('ruby');
  });
});

describe('courseTitle', () => {
  it('returns the plain label for base courses', () => {
    expect(courseTitle('python')).toBe('Python');
  });

  it("appends 'Algorithms' for algo- courses", () => {
    expect(courseTitle('algo-python')).toBe('Python Algorithms');
    expect(courseTitle('algo-c')).toBe('C Algorithms');
  });

  it('names courses and challenge sets in Romanian', () => {
    const ro = i18next.getFixedT('ro');
    expect(courseTitle('algo-python', ro)).toBe('Algoritmi Python');
    expect(courseTitle('trees-graphs', ro)).toBe('Arbori și grafuri');
    expect(courseTitle('algo-trees-graphs', ro)).toBe('Algoritmi pe arbori și grafuri');
    expect(courseLabel('algo-trees-graphs', ro)).toBe('Arbori și grafuri');
    expect(courseLabel('algo-java', ro)).toBe('Java');
  });
});
