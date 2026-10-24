import { describe, it, expect } from 'vitest';
import { hashOf, layoutPlanets } from './planetLayout';

const SLUGS = Array.from({ length: 60 }, (_, i) => `lesson-${i}`);

describe('layoutPlanets', () => {
  const spots = layoutPlanets(SLUGS, 13);

  it('puts the first planet straight ahead of the start', () => {
    expect(spots[0].position[0]).toBeCloseTo(0);
    expect(spots[0].position[2]).toBeCloseTo(-1600);
  });

  it('keeps the planets a short flight apart, and never on top of each other', () => {
    for (let i = 1; i < spots.length; i++) {
      const [a, b] = [spots[i - 1].position, spots[i].position];
      expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeLessThan(2200);
    }
    for (let i = 0; i < spots.length; i++) {
      for (let j = i + 1; j < spots.length; j++) {
        const [a, b] = [spots[i].position, spots[j].position];
        const gap = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        expect(gap).toBeGreaterThan(spots[i].radius + spots[j].radius + 300);
      }
    }
  });

  it('lays out the same planets the same way every time', () => {
    expect(layoutPlanets(SLUGS, 13)).toEqual(spots);
    expect(spots.every((s) => s.look >= 0 && s.look < 13)).toBe(true);
    expect(spots.every((s) => s.radius >= 70 && s.radius < 200)).toBe(true);
  });
});

describe('hashOf', () => {
  it('gives a word the same number every time and other words others', () => {
    expect(hashOf('print')).toBe(hashOf('print'));
    expect(hashOf('print')).not.toBe(hashOf('lists'));
  });
});
