import { describe, it, expect } from 'vitest';
import { createResolution } from './resolution';

// Feeds `n` frames of `ms` each and returns every ratio the scene was told to take
function run(res: ReturnType<typeof createResolution>, ms: number, n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const next = res.frame(ms);
    if (next !== null) out.push(next);
  }
  return out;
}

describe('createResolution', () => {
  it('starts at the screen ratio, at most 1.5', () => {
    expect(createResolution(1).ratio).toBe(1);
    expect(createResolution(2).ratio).toBe(1.5);
  });

  it('keeps the ratio while frames are fast enough', () => {
    expect(run(createResolution(1), 16, 600)).toEqual([]);
  });

  it('steps down once per slow window, down to half', () => {
    const res = createResolution(1);
    expect(run(res, 40, 60)).toEqual([0.8]);
    expect(run(res, 40, 59)).toEqual([]);
    const steps = run(res, 40, 600);
    expect(steps.at(-1)).toBe(0.5);
    expect(steps.filter((r) => r === 0.5)).toHaveLength(1);
  });

  it('leaves out the long gaps of a tab coming back', () => {
    expect(run(createResolution(1), 1000, 600)).toEqual([]);
  });
});
