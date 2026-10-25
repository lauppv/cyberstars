import { useEffect, useRef, useState, type RefObject } from 'react';

// How far an element's top is from the bottom of what can be seen of it, less
// `gap`: the bottom of the nearest scrolling box around it (a lesson's text, a
// dialog) or of the window, whichever is higher. Measured again when the page
// or any box scrolls, the window or that box changes size, and when `deps`
// change (an output that grew, since text above it may have moved too). Null
// until measured.
export function useRoomBelow(
  ref: RefObject<HTMLElement | null>,
  gap: number,
  deps: readonly unknown[] = [],
): number | null {
  const [room, setRoom] = useState<number | null>(null);
  const measureRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const box = scrollingBox(el);
    let frame = 0;
    const measure = () => {
      frame = 0;
      const bottom = Math.min(
        window.innerHeight,
        box ? box.getBoundingClientRect().bottom : window.innerHeight,
      );
      setRoom(Math.floor(bottom - el.getBoundingClientRect().top - gap));
    };
    const later = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measureRef.current = later;
    measure();
    // Scrolling doesn't bubble, so listen while it goes down to any box.
    document.addEventListener('scroll', later, { capture: true, passive: true });
    window.addEventListener('resize', later);
    const resized = box && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(later) : null;
    if (box) resized?.observe(box);
    return () => {
      cancelAnimationFrame(frame);
      measureRef.current = () => {};
      document.removeEventListener('scroll', later, { capture: true });
      window.removeEventListener('resize', later);
      resized?.disconnect();
    };
  }, [ref, gap]);

  useEffect(() => {
    measureRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps only say when to measure again
  }, deps);

  return room;
}

function scrollingBox(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
  }
  return null;
}
