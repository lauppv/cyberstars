import { useEffect, useState, type RefObject } from 'react';

// How many times the element has come into view: half of it on screen, and
// not inside a part the page hides, like a pinned story's pictures other than
// the one being read. A picture that plays something once can key it on this
// number to play it again each time a visitor reaches it, rather than having
// played it unseen when the page loaded.
export function useTimesShown(ref: RefObject<HTMLElement | null>): number {
  const [times, setTimes] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let onScreen = false;
    let seen = false;
    const check = () => {
      const now = onScreen && !el.closest('[aria-hidden="true"]');
      if (now && !seen) setTimes((n) => n + 1);
      seen = now;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = !!entry?.isIntersecting;
        check();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    // A pinned story hides and shows its pictures without moving them
    const mo = new MutationObserver(check);
    for (let a = el.parentElement; a; a = a.parentElement) {
      if (a.hasAttribute('aria-hidden')) mo.observe(a, { attributeFilter: ['aria-hidden'] });
    }
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [ref]);

  return times;
}
