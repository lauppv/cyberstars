import { useCallback, useState, type RefObject } from 'react';

interface Options {
  axis: 'x' | 'y';
  initial: number; // starting size of the first pane, as a percentage of the container
  min: number; // percentage
  max: number; // percentage
  containerRef: RefObject<HTMLElement | null>;
  storageKey?: string; // keeps the size in localStorage, so it comes back on the next visit
  // The first pane closes when a drag takes the divider closer than this many
  // pixels to the container's start, and opens again past it
  closeBelow?: number;
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

const closedKey = (key: string | undefined) => (key ? `${key}.closed` : undefined);

function storedClosed(key: string | undefined): boolean {
  if (!key) return false;
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function storeClosed(key: string | undefined, closed: boolean) {
  if (!key) return;
  try {
    if (closed) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  } catch {
    // storage blocked: the choice lasts for this page
  }
}

// Drag-to-resize for a two-pane split. Returns the first pane's size as a
// percentage of the container; the second pane should flex to fill the rest.
// With a storageKey the size is saved when a drag ends, and reset() puts the
// initial size back. With closeBelow a drag to the container's start closes
// the first pane: its size stays the one it had before the drag, which it
// gets back when open() is called or a drag takes it out again.
export function useResizeSplit({
  axis,
  initial,
  min,
  max,
  containerRef,
  storageKey,
  closeBelow,
}: Options) {
  const [size, setSize] = useState(() => storedSize(storageKey, min, max) ?? initial);
  const [closed, setClosed] = useState(
    () => closeBelow !== undefined && storedClosed(closedKey(storageKey)),
  );
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
      const sizeBefore = size;
      let closing = closed;

      const onMove = (ev: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const offset = axis === 'x' ? ev.clientX - rect.left : ev.clientY - rect.top;
        if (closeBelow !== undefined) {
          closing = offset < closeBelow;
          setClosed(closing);
          if (closing) return;
        }
        last = Math.min(
          max,
          Math.max(min, (offset / (axis === 'x' ? rect.width : rect.height)) * 100),
        );
        setSize(last);
      };
      const onUp = () => {
        setDragging(false);
        document.body.style.userSelect = prevSelect;
        document.body.style.cursor = prevCursor;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        if (closing) {
          // Closed, it keeps the size it had for when it opens again
          setSize(sizeBefore);
        } else if (last !== null) {
          storeSize(storageKey, last);
        }
        if (closeBelow !== undefined) storeClosed(closedKey(storageKey), closing);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [axis, min, max, containerRef, storageKey, closeBelow, size, closed],
  );

  const open = useCallback(() => {
    setClosed(false);
    storeClosed(closedKey(storageKey), false);
  }, [storageKey]);

  const reset = useCallback(() => {
    setSize(initial);
    setClosed(false);
    storeSize(storageKey, null);
    storeClosed(closedKey(storageKey), false);
  }, [initial, storageKey]);

  return { size, closed, dragging, onPointerDown, open, reset };
}
