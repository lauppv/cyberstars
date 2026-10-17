// The words under every kind of visual: the question with its answer, which stay up while the
// move they announce plays; the first step tells in a few words how the algorithm works
export function Words({
  frame,
  live,
  big,
}: {
  frame: { ask: string | null; caption: string };
  live: boolean;
  big: boolean;
}) {
  return (
    <div
      aria-live={live ? 'polite' : undefined}
      className={`text-[var(--text)] ${big ? 'text-[19px] min-h-[3.4em]' : 'text-[15px] min-h-[3.2em]'}`}
    >
      {frame.ask && <p className="font-semibold">{frame.ask}</p>}
      <p className={frame.ask ? 'text-[var(--text2)]' : ''}>{frame.caption}</p>
    </div>
  );
}
