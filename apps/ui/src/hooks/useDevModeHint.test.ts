import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDevModeHint } from './useDevModeHint';

const KEY = 'cyberstars.devModeHint';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('useDevModeHint', () => {
  it('is open in a new session', () => {
    expect(renderHook(() => useDevModeHint()).result.current.open).toBe(true);
  });

  it('closed, stays closed for the session and comes back in the next one', () => {
    const { result } = renderHook(() => useDevModeHint());
    act(() => result.current.close());
    expect(result.current.open).toBe(false);
    expect(renderHook(() => useDevModeHint()).result.current.open).toBe(false);

    sessionStorage.clear(); // the tab opened again
    expect(renderHook(() => useDevModeHint()).result.current.open).toBe(true);
  });

  it('closed for good, stays closed in every session on the device', () => {
    const { result } = renderHook(() => useDevModeHint());
    act(() => result.current.closeForGood());
    expect(result.current.open).toBe(false);
    expect(localStorage.getItem(KEY)).not.toBeNull();

    sessionStorage.clear();
    expect(renderHook(() => useDevModeHint()).result.current.open).toBe(false);
  });
});
