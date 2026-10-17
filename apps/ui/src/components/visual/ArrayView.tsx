import { useLayoutEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import type { ArrayVisual } from './parseVisual';
import type { ArrayFrame } from './arrayFrames';

// The array drawing, shared by the lesson player and the landing page

const GAP = 8;

// A box stands at its position by a transform
const at = (pos: number, lift = '0') =>
  `translateX(calc(${pos} * (100% + ${GAP}px))) translateY(${lift})`;

export function ArrayView({
  values,
  pointers,
  frame,
  box,
  swapMs,
}: {
  values: ArrayVisual['values'];
  pointers?: ArrayVisual['pointers'];
  frame: ArrayFrame;
  box: number;
  swapMs: number;
}) {
  const n = values.length;
  const boxes = useRef(new Map<number, HTMLDivElement>());
  const shown = useRef(frame.order);

  // A swap plays in three beats, so it reads as one: the box moving right rises, passes over the
  // other, which slides along the row, then lands; the pointers below stay clear of both. Only a
  // swap of two plays: Start over, or a jump of several steps, puts the boxes in place at once,
  // and so does reduced motion
  useLayoutEffect(() => {
    const before = shown.current;
    shown.current = frame.order;
    const moved = frame.order.flatMap((id, to) => {
      const from = before.indexOf(id);
      return from === to ? [] : [{ id, from, to }];
    });
    if (moved.length !== 2) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    for (const { id, from, to } of moved) {
      const lift = to > from ? '-110%' : '0';
      boxes.current
        .get(id)
        ?.animate?.(
          [
            { transform: at(from) },
            { transform: at(from, lift), offset: 0.25 },
            { transform: at(to, lift), offset: 0.75 },
            { transform: at(to) },
          ],
          { duration: swapMs, easing: 'ease-in-out' },
        );
    }
  }, [frame.order, swapMs]);

  // The boxes shrink to fit a narrow screen, staying square
  const full = n * box + (n - 1) * GAP;
  const width = `min(100%, ${full}px)`;
  const boxWidth = `calc((100% - ${(n - 1) * GAP}px) / ${n})`;
  return (
    <div
      className="mx-auto font-mono"
      style={{ width, marginTop: Math.round(box * 1.1) + 8 }}
      aria-hidden="true"
    >
      <div className="relative" style={{ aspectRatio: `${full} / ${box}` }}>
        {frame.order.map((id, pos) => {
          const sorted = pos >= frame.sortedFrom;
          const compared = !sorted && frame.compared?.includes(pos);
          return (
            <div
              key={id}
              ref={(el) => {
                if (el) boxes.current.set(id, el);
                else boxes.current.delete(id);
              }}
              data-box={id}
              data-state={sorted ? 'sorted' : compared ? 'compared' : 'idle'}
              className={`absolute top-0 left-0 h-full flex items-center justify-center rounded-[var(--radius-sm)] ${
                sorted
                  ? 'border-2 border-[var(--success)] bg-[rgba(59,167,118,0.25)] text-[#c4f0da]'
                  : compared
                    ? 'border-2 border-[var(--accent)] bg-[rgba(108,92,231,0.25)] text-[#cdc6ff]'
                    : 'border border-[var(--border)] bg-[var(--glass)] text-[var(--text)]'
              }`}
              style={{ width: boxWidth, transform: at(pos), fontSize: Math.round(box * 0.38) }}
            >
              {values[id]}
            </div>
          );
        })}
      </div>
      {/* Under the two boxes compared, which position the loop is on; they step right with it */}
      {pointers && (
        <div className="relative h-11 mt-2">
          {frame.compared?.map((pos, i) => (
            <div
              key={i}
              data-pointer={i}
              className="absolute top-0 left-0 flex flex-col items-center text-[var(--accent)] transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ width: boxWidth, transform: at(pos) }}
            >
              <ArrowUp size={16} strokeWidth={2.5} />
              <span className="text-[13px] font-semibold whitespace-nowrap">
                {pointers[i].replace('{i}', String(pos))}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="h-4" />
    </div>
  );
}
