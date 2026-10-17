import { useCallback, useState, type RefObject } from 'react';

interface Options {
  axis: 'x' | 'y';
  initial: number; // starting size of the first pane, as a percentage of the container
  min: number; // percentage
  max: number; // percentage
  containerRef: RefObject<HTMLElement | null>;
  storageKey?: string; // keeps the size in localStorage, so it comes back on the next visit
}

function storedSize(key: string | undefined, min: number, max: number): number | null {
  if (!key) return null;
  try {
    const value = Number(localStorage.getItem(key));
    return localStorage.getItem(key) !== null && value >= min && value <= max ? value : null;
  } catch {
    return null;
  }
}

function storeSize(key: string | undefined, size: number | null) {
  if (!key) return;
  try {
    if (size === null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(Math.round(size * 10) / 10));
  } catch {
    // storage blocked: the size lasts for this page
  }
}

// Drag-to-resize for a two-pane split. Returns the first pane's size as a
// percentage of the container; the second pane should flex to fill the rest.
// With a storageKey the size is saved when a drag ends, and reset() puts the
// initial size back.
export function useResizeSplit({ axis, initial, min, max, containerRef, storageKey }: Options) {
  const [size, setSize] = useState(() => storedSize(storageKey, min, max) ?? initial);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;
      setDragging(true);
      const prevSelect = document.body.style.userSelect;
      const prevCursor = document.body.style.cursor;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = axis === 'x' ? 'col-resize' : 'row-resize';
      let last: number | null = null;

      const onMove = (ev: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const pct =
          axis === 'x'
            ? ((ev.clientX - rect.left) / rect.width) * 100
            : ((ev.clientY - rect.top) / rect.height) * 100;
        last = Math.min(max, Math.max(min, pct));
        setSize(last);
      };
      const onUp = () => {
        setDragging(false);
        document.body.style.userSelect = prevSelect;
        document.body.style.cursor = prevCursor;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        if (last !== null) storeSize(storageKey, last);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [axis, min, max, containerRef, storageKey],
  );

  const reset = useCallback(() => {
    setSize(initial);
    storeSize(storageKey, null);
  }, [initial, storageKey]);

  return { size, dragging, onPointerDown, reset };
}
