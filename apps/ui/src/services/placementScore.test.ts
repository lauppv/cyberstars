import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearPlacementScore, readPlacementScore, savePlacementScore } from './placementScore';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('placementScore', () => {
  it('keeps the score until it is cleared', () => {
    expect(readPlacementScore()).toBeUndefined();
    savePlacementScore(0);
    expect(readPlacementScore()).toBe(0);
    clearPlacementScore();
    expect(readPlacementScore()).toBeUndefined();
  });

  it('ignores anything that is not a score out of 12', () => {
    for (const value of ['13', '-1', '2.5', 'abc']) {
      localStorage.setItem('cyberstars.placement', value);
      expect(readPlacementScore()).toBeUndefined();
    }
  });

  it('keeps nothing and breaks nothing when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => savePlacementScore(5)).not.toThrow();
    expect(readPlacementScore()).toBeUndefined();
    expect(() => clearPlacementScore()).not.toThrow();
  });
});
