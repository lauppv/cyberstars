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
    // With no closeBelow it never closes, at the start it stops at its min
    drag(result.current.onPointerDown, 0);
    expect(result.current.size).toBe(20);
    expect(result.current.closed).toBe(false);
    expect(localStorage.length).toBe(0);
  });

  it('closes when dragged to the start, keeping its size for when it opens again', () => {
    const ref = container();
    const options = {
      axis: 'x',
      initial: 25,
      min: 15,
      max: 50,
      containerRef: ref,
      storageKey: KEY,
      closeBelow: 80,
    } as const;
    const first = renderHook(() => useResizeSplit(options));
    drag(first.result.current.onPointerDown, 400);
    expect(first.result.current.size).toBe(40);
    // Past its min, but not yet under closeBelow: still open, at its min
    drag(first.result.current.onPointerDown, 100);
    expect(first.result.current.size).toBe(15);
    expect(first.result.current.closed).toBe(false);
    drag(first.result.current.onPointerDown, 400);
    drag(first.result.current.onPointerDown, 79);
    expect(first.result.current.closed).toBe(true);
    expect(first.result.current.size).toBe(40);
    expect(localStorage.getItem(KEY)).toBe('40');
    expect(localStorage.getItem(`${KEY}.closed`)).toBe('1');

    // The next visit starts closed, and open() gives the size back
    const second = renderHook(() => useResizeSplit(options));
    expect(second.result.current.closed).toBe(true);
    act(() => second.result.current.open());
    expect(second.result.current.closed).toBe(false);
    expect(second.result.current.size).toBe(40);
    expect(localStorage.getItem(`${KEY}.closed`)).toBeNull();

    // A drag out of closed opens it where it ends
    drag(second.result.current.onPointerDown, 0);
    expect(second.result.current.closed).toBe(true);
    drag(second.result.current.onPointerDown, 300);
    expect(second.result.current.closed).toBe(false);
    expect(second.result.current.size).toBe(30);
    expect(localStorage.getItem(`${KEY}.closed`)).toBeNull();

    // Reset opens it too
    drag(second.result.current.onPointerDown, 10);
    act(() => second.result.current.reset());
    expect(second.result.current.closed).toBe(false);
    expect(second.result.current.size).toBe(25);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(localStorage.getItem(`${KEY}.closed`)).toBeNull();
  });

  it('ignores a saved closed state without closeBelow', () => {
    localStorage.setItem(`${KEY}.closed`, '1');
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
    expect(result.current.closed).toBe(false);
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
