import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDevMode } from './useDevMode';

const KEY = 'cyberstars.devMode';

// A window as wide as asked, which can be narrowed or widened later
function windowOf(wide: boolean) {
  const listeners = new Set<() => void>();
  const query = {
    get matches() {
      return wide;
    },
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  };
  vi.stubGlobal('matchMedia', () => query);
  return (next: boolean) => {
    wide = next;
    act(() => listeners.forEach((fn) => fn()));
  };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useDevMode', () => {
  it('starts off, and turning it on lasts to the next visit', () => {
    windowOf(true);
    const { result } = renderHook(() => useDevMode());
    expect(result.current).toMatchObject({ available: true, on: false });
    act(() => result.current.toggle());
    expect(result.current.on).toBe(true);
    expect(localStorage.getItem(KEY)).toBe('on');
    expect(renderHook(() => useDevMode()).result.current.on).toBe(true);
  });

  it('forgets it once turned off', () => {
    windowOf(true);
    localStorage.setItem(KEY, 'on');
    const { result } = renderHook(() => useDevMode());
    act(() => result.current.toggle());
    expect(result.current.on).toBe(false);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('is not there on a phone, even when left on, and comes back on a wider window', () => {
    const resize = windowOf(false);
    localStorage.setItem(KEY, 'on');
    const { result } = renderHook(() => useDevMode());
    expect(result.current).toMatchObject({ available: false, on: false });
    resize(true);
    expect(result.current).toMatchObject({ available: true, on: true });
    resize(false);
    expect(result.current.on).toBe(false);
    expect(localStorage.getItem(KEY)).toBe('on');
  });
});
