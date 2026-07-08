import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBackgroundPref } from './useBackgroundPref';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useBackgroundPref', () => {
  it('defaults to minimal when nothing is stored', () => {
    const { result } = renderHook(() => useBackgroundPref());
    expect(result.current[0]).toBe('minimal');
  });

  it('reads cosmos from localStorage on init', () => {
    localStorage.setItem('cyberstars.background', 'cosmos');
    const { result } = renderHook(() => useBackgroundPref());
    expect(result.current[0]).toBe('cosmos');
  });

  it('persists updates and reflects them in state', () => {
    const { result } = renderHook(() => useBackgroundPref());
    act(() => result.current[1]('cosmos'));
    expect(result.current[0]).toBe('cosmos');
    expect(localStorage.getItem('cyberstars.background')).toBe('cosmos');
    act(() => result.current[1]('minimal'));
    expect(result.current[0]).toBe('minimal');
    expect(localStorage.getItem('cyberstars.background')).toBe('minimal');
  });

  it('syncs across multiple hook instances via the change event', () => {
    const a = renderHook(() => useBackgroundPref());
    const b = renderHook(() => useBackgroundPref());
    act(() => a.result.current[1]('cosmos'));
    expect(b.result.current[0]).toBe('cosmos');
  });

  it('falls back to minimal when localStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useBackgroundPref());
    expect(result.current[0]).toBe('minimal');
    spy.mockRestore();
  });

  it('does not throw when localStorage.setItem throws', () => {
    const { result } = renderHook(() => useBackgroundPref());
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => act(() => result.current[1]('cosmos'))).not.toThrow();
    spy.mockRestore();
  });
});
