import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

// The bottom-right corner, shared by every toast (the tutor's, a lesson's XP and
// badge, the tour's notice) and the notice about a waiting run, so they stack
// one above the other instead of covering each other. `first` puts a piece on
// top of the stack.
function host(): HTMLElement {
  let el = document.getElementById('corner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'corner';
    el.className =
      'fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 max-w-[calc(100vw-40px)] pointer-events-none';
    document.body.append(el);
  }
  return el;
}

export function Corner({ first, children }: { first?: boolean; children: ReactNode }) {
  return createPortal(
    <div className={`pointer-events-auto max-w-full ${first ? 'order-first' : ''}`}>
      {children}
    </div>,
    host(),
  );
}
