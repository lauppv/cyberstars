import { Children, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// The cards of Courses, Algorithms and Projects as a coverflow: one card in
// front, its neighbours turned away on either side, and below them where the
// student is in the row, so the first and the last card are plain to see
export function SetGrid({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const cards = Children.toArray(children);
  const [front, setFront] = useState(0);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);
  const total = cards.length;
  const go = (i: number) => setFront(Math.max(0, Math.min(total - 1, i)));

  return (
    // In the middle of the window: its height less the topbar (3rem) and the
    // page's own padding (2rem + 4rem)
    <div className="flex flex-col justify-center gap-5 min-h-[calc(100dvh-9rem)]">
      <div
        className="grid overflow-x-clip py-2 [perspective:1200px] touch-pan-y"
        onPointerDown={(e) => (swipe.current = { x: e.clientX, moved: false })}
        onPointerUp={(e) => {
          const dx = e.clientX - (swipe.current?.x ?? e.clientX);
          if (Math.abs(dx) > 50 && swipe.current) {
            swipe.current.moved = true;
            go(front + (dx < 0 ? 1 : -1));
          }
        }}
        // A swipe that ends on a card isn't a click on it
        onClickCapture={(e) => {
          if (swipe.current?.moved) e.stopPropagation();
          swipe.current = null;
        }}
      >
        {cards.map((card, i) => {
          const d = i - front;
          const a = Math.abs(d);
          return (
            <div
              key={i}
              data-testid="set-slot"
              onClick={d ? () => go(i) : undefined}
              className={`[grid-area:1/1] grid w-full max-w-[440px] justify-self-center rounded-[var(--radius-lg)] transition-[transform,opacity,filter,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
                d
                  ? 'cursor-pointer shadow-[0_12px_30px_-10px_rgb(0_0_0/0.6)]'
                  : 'shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_28px_60px_-12px_rgb(0_0_0/0.75),0_0_50px_-10px_color-mix(in_srgb,var(--accent)_35%,transparent)]'
              } ${a > 2 ? 'pointer-events-none' : ''}`}
              style={{
                transform: `translateX(${d * 62}%) translateZ(${-a * 170}px) rotateY(${-d * 38}deg)`,
                opacity: a > 2 ? 0 : 1 - a * 0.28,
                // The cards behind go soft, so the front one stands out
                filter: d ? `blur(${a * 1.5}px) brightness(${1 - a * 0.2})` : 'none',
                zIndex: total - a,
              }}
            >
              {/* Only the front card takes clicks and the keyboard; a click on
              a side card brings it to the front */}
              <div inert={d !== 0} className="grid">
                {card}
              </div>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(front - 1)}
            disabled={front === 0}
            aria-label={t('common.previous')}
            className="p-1 bg-transparent border-0 cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition-colors disabled:opacity-30 disabled:cursor-default disabled:hover:text-[var(--text3)]"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-1.5">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={t('common.position', { n: i + 1, total })}
                aria-current={i === front ? 'true' : undefined}
                className={`h-1.5 rounded-full border-0 p-0 cursor-pointer transition-all ${
                  i === front ? 'w-6 bg-[var(--accent)]' : 'w-3 bg-[var(--border)]'
                }`}
              />
            ))}
          </div>
          <span className="text-[12px] text-[var(--text3)] tabular-nums min-w-[3ch]">
            {front + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => go(front + 1)}
            disabled={front === total - 1}
            aria-label={t('common.next')}
            className="p-1 bg-transparent border-0 cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition-colors disabled:opacity-30 disabled:cursor-default disabled:hover:text-[var(--text3)]"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
