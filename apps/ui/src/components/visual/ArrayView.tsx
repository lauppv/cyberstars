import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { ArrowUp } from 'lucide-react';
import type { ArrayVisual } from './parseVisual';
import type { ArrayFrame } from './arrayFrames';

// The array drawing, shared by the lesson player and the landing page

// The gap between boxes at full size; on a narrow screen it shrinks with the boxes, so ten
// boxes still fit 360px
const GAP = 8;

// A box stands at its position by a transform
const at = (pos: number, lift = '0', gap = 'var(--gap)') =>
  `translateX(calc(${pos} * (100% + ${gap}))) translateY(${lift})`;

const label = (text: string, pos: number) => text.replace('{i}', String(pos));

export function ArrayView({
  values,
  pointers,
  markers,
  frame,
  box,
  swapMs,
  lift = true,
}: {
  values: ArrayVisual['values'];
  pointers?: ArrayVisual['pointers'];
  markers?: ArrayVisual['markers'];
  frame: ArrayFrame;
  box: number;
  swapMs: number;
  // Room above the boxes for one to rise over another in a swap; a visual without swaps needs none
  lift?: boolean;
}) {
  const n = values.length;
  const full = n * box + (n - 1) * GAP;
  const root = useRef<HTMLDivElement>(null);
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
    // The keyframes take the gap in pixels, as the drawing has it now
    const gap = `${Math.min(GAP, (GAP * (root.current?.clientWidth || full)) / full)}px`;
    for (const { id, from, to } of moved) {
      const rise = to > from ? '-110%' : '0';
      boxes.current
        .get(id)
        ?.animate?.(
          [
            { transform: at(from, '0', gap) },
            { transform: at(from, rise, gap), offset: 0.25 },
            { transform: at(to, rise, gap), offset: 0.75 },
            { transform: at(to, '0', gap) },
          ],
          { duration: swapMs, easing: 'ease-in-out' },
        );
    }
  }, [frame.order, swapMs, full]);

  // The boxes shrink to fit a narrow screen, staying square, and their numbers with them, so the
  // longest still fits inside its box. The drawing is a size container, so the boxes size
  // themselves on its width (cqw)
  const width = `min(100%, ${full}px)`;
  const boxWidth = `calc((100% - ${n - 1} * var(--gap)) / ${n})`;
  const longest = Math.max(...values.map((v) => String(v).length));
  const fontSize = `min(${Math.round(box * 0.38)}px, calc(var(--box) * ${(1.2 / longest).toFixed(3)}))`;
  const range = frame.range;
  return (
    <div
      ref={root}
      className="mx-auto font-mono"
      style={
        {
          width,
          marginTop: lift ? Math.round(box * 1.1) + 8 : 0,
          containerType: 'inline-size',
          '--gap': `min(${GAP}px, ${((GAP * 100) / full).toFixed(4)}cqw)`,
          '--box': `calc((100cqw - ${n - 1} * var(--gap)) / ${n})`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="relative" style={{ height: 'var(--box)' }}>
        {frame.order.map((id, pos) => {
          const sorted = pos >= frame.sortedFrom || frame.done.includes(pos);
          const compared = !sorted && frame.compared?.includes(pos);
          // Outside the range still in play, a box fades
          const out = range !== null && (pos < range[0] || pos > range[1]);
          return (
            <div
              key={id}
              ref={(el) => {
                if (el) boxes.current.set(id, el);
                else boxes.current.delete(id);
              }}
              data-box={id}
              data-state={sorted ? 'sorted' : compared ? 'compared' : 'idle'}
              data-out={out || undefined}
              className={`absolute top-0 left-0 h-full flex items-center justify-center rounded-[var(--radius-sm)] transition-opacity duration-500 motion-reduce:transition-none ${
                out ? 'opacity-30' : ''
              } ${
                sorted
                  ? 'border-2 border-[var(--success)] bg-[rgba(59,167,118,0.25)] text-[#c4f0da]'
                  : compared
                    ? 'border-2 border-[var(--accent)] bg-[rgba(108,92,231,0.25)] text-[#cdc6ff]'
                    : 'border border-[var(--border)] bg-[var(--glass)] text-[var(--text)]'
              }`}
              style={{ width: boxWidth, transform: at(pos), fontSize }}
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
                {label(pointers[i], pos)}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Each marker on its own row, so none covers another; its name sits on the side of the
          arrow with more room, so it never runs past the drawing */}
      {markers && (
        <div className="mt-2">
          {markers.map((name, i) => {
            const pos = frame.at[i];
            return (
              <div key={i} className="relative h-6">
                {pos !== null && (
                  <div
                    data-marker={i}
                    className="absolute top-0 left-0 h-full flex items-center justify-center text-[var(--accent)] transition-transform duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: boxWidth, transform: at(pos) }}
                  >
                    <span className="relative flex items-center">
                      <ArrowUp size={14} strokeWidth={2.5} />
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 text-[13px] font-semibold whitespace-nowrap ${
                          pos < n / 2 ? 'left-full ml-0.5' : 'right-full mr-0.5'
                        }`}
                      >
                        {label(name, pos)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="h-4" />
    </div>
  );
}
