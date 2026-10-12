import { useCallback, useState, type RefObject } from 'react';

interface Options {
  axis: 'x' | 'y';
  initial: number; // starting size of the first pane, as a percentage of the container
  min: number; // percentage
  max: number; // percentage
  containerRef: RefObject<HTMLElement | null>;
}

// Drag-to-resize for a two-pane split. Returns the first pane's size as a
// percentage of the container; the second pane should flex to fill the rest.
export function useResizeSplit({ axis, initial, min, max, containerRef }: Options) {
  const [size, setSize] = useState(initial);
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

      const onMove = (ev: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const pct =
          axis === 'x'
            ? ((ev.clientX - rect.left) / rect.width) * 100
            : ((ev.clientY - rect.top) / rect.height) * 100;
        setSize(Math.min(max, Math.max(min, pct)));
      };
      const onUp = () => {
        setDragging(false);
        document.body.style.userSelect = prevSelect;
        document.body.style.cursor = prevCursor;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [axis, min, max, containerRef],
  );

  return { size, dragging, onPointerDown };
}
