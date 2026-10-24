import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import i18n from 'i18next';
import type { LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { formatWait, km, statusText, useNow } from './waitText';

const t = i18n.t.bind(i18n);
const NOW = Date.parse('2026-10-24T12:00:00Z');

function planet(over: Partial<LaniakeaPlanet> = {}): LaniakeaPlanet {
  return {
    slug: 'print',
    lessonDone: true,
    hasQuiz: true,
    level: 0,
    passedAt: null,
    nextRecapAt: null,
    retryAt: null,
    ...over,
  };
}

afterEach(() => vi.useRealTimers());

describe('formatWait', () => {
  it('says a wait in its two largest units, seconds padded', () => {
    expect(formatWait(t, 2 * 86400_000 + 3 * 3600_000)).toBe('2d 3h');
    expect(formatWait(t, 3 * 3600_000 + 5 * 60_000)).toBe('3h 5m');
    expect(formatWait(t, 4 * 60_000 + 5_000)).toBe('4:05');
  });
});

describe('statusText', () => {
  it('says where a planet stands, with its countdown', () => {
    expect(statusText(t, planet(), 'conquerable', NOW)).toBe('Ready to conquer');
    expect(
      statusText(t, planet({ retryAt: new Date(NOW + 90_000).toISOString() }), 'retry', NOW),
    ).toBe('Next try in 1:30');
    expect(
      statusText(
        t,
        planet({ level: 1, nextRecapAt: new Date(NOW + 86400_000).toISOString() }),
        'owned',
        NOW,
      ),
    ).toBe('Next recap in 1d 0h');
  });
});

describe('km', () => {
  it('reads the game units as kilometres', () => {
    expect(km(1434)).toBe((14340).toLocaleString());
  });
});

describe('useNow', () => {
  it('follows the server clock and ticks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const { result } = renderHook(() => useNow(5000, 1000));
    expect(result.current).toBe(NOW + 5000);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(NOW + 6000);
  });
});
