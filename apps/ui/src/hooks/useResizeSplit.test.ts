import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useResizeSplit } from './useResizeSplit';

const KEY = 'cyberstars.test.split';

function container() {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1000, height: 500 }) as DOMRect;
  return { current: el };
}

function drag(onPointerDown: (e: React.PointerEvent) => void, clientX: number) {
  act(() => onPointerDown({ preventDefault() {} } as React.PointerEvent));
  act(() => {
    window.dispatchEvent(new MouseEvent('pointermove', { clientX }));
  });
  act(() => {
    window.dispatchEvent(new MouseEvent('pointerup'));
  });
}

beforeEach(() => {
  localStorage.clear();
});

describe('useResizeSplit', () => {
  it('follows a drag, inside its bounds, without saving when it has no key', () => {
    const ref = container();
    const { result } = renderHook(() =>
      useResizeSplit({ axis: 'x', initial: 50, min: 20, max: 80, containerRef: ref }),
    );
    expect(result.current.size).toBe(50);
    drag(result.current.onPointerDown, 300);
    expect(result.current.size).toBe(30);
    drag(result.current.onPointerDown, 950);
    expect(result.current.size).toBe(80);
    expect(localStorage.length).toBe(0);
  });

  it('keeps the size under its key once a drag ends, and starts from it next time', () => {
    const ref = container();
    const options = {
      axis: 'x',
      initial: 25,
      min: 15,
      max: 50,
      containerRef: ref,
      storageKey: KEY,
    } as const;
    const first = renderHook(() => useResizeSplit(options));
    drag(first.result.current.onPointerDown, 400);
    expect(localStorage.getItem(KEY)).toBe('40');
    const second = renderHook(() => useResizeSplit(options));
    expect(second.result.current.size).toBe(40);
  });

  it('puts the initial size back on reset and forgets the saved one', () => {
    localStorage.setItem(KEY, '40');
    const { result } = renderHook(() =>
      useResizeSplit({
        axis: 'x',
        initial: 25,
        min: 15,
        max: 50,
        containerRef: container(),
        storageKey: KEY,
      }),
    );
    expect(result.current.size).toBe(40);
    act(() => result.current.reset());
    expect(result.current.size).toBe(25);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('ignores a saved size outside its bounds', () => {
    for (const saved of ['95', 'wide', '']) {
      localStorage.setItem(KEY, saved);
      const { result } = renderHook(() =>
        useResizeSplit({
          axis: 'y',
          initial: 85,
          min: 40,
          max: 92,
          containerRef: container(),
          storageKey: KEY,
        }),
      );
      expect(result.current.size).toBe(85);
    }
  });
});
