import type { StackCard } from './parseStack';
import type { StackFrame } from './stackFrames';
import { LIT, LOOK, type NodeState } from './look';
import { beats, useTween } from './tween';

// The stack drawing: cards piled from a floor up, the newest on top, as wide as the room allows up
// to a size that scales with the player's box, so a pile of five fits a phone. A card keeps its
// place while it is on the stack, since cards only come and go at the top. A move of one step plays
// in up to two beats with the shared tween: what is popped rises and fades out and a line that
// changes fades out, then what is pushed drops in and fades in with the new line. Reduced motion or
// a jump puts everything in place at once

function stateOf(frame: StackFrame, id: string): NodeState {
  return frame.focus.includes(id) ? 'focused' : frame.done.includes(id) ? 'done' : 'idle';
}

function Card({
  card,
  frame,
  bottom,
  height,
  lift,
  opacity,
  line,
  box,
}: {
  card: StackCard;
  frame: StackFrame;
  bottom: number;
  height: number;
  lift: number;
  opacity: number;
  // The card's line, or two while it changes, each with how far it shows
  line: { text: string; opacity: number }[];
  box: number;
}) {
  const state = stateOf(frame, card.id);
  const look = LOOK[state];
  const tag = frame.tags[card.id];
  return (
    <div
      data-card={card.id}
      data-state={state}
      className="absolute inset-x-0 flex flex-col justify-center rounded-[var(--radius-sm)] px-3"
      style={{
        bottom,
        height,
        opacity,
        transform: lift ? `translateY(${-lift}px)` : undefined,
        background: look.fill,
        border: `${look.width}px solid ${look.stroke}`,
      }}
    >
      <span className="leading-tight" style={{ color: look.text, fontSize: box * 0.3 }}>
        {card.text}
      </span>
      <span className="relative leading-tight" style={{ fontSize: box * 0.26 }}>
        {/* Holds the line's height while it is empty or changing */}
        <span className="invisible">{line[line.length - 1]?.text || ' '}</span>
        {line.map(({ text, opacity: shown }, i) => (
          <span
            key={i}
            data-line={card.id}
            className="absolute left-0 top-0 text-[var(--text2)]"
            style={{ opacity: shown }}
          >
            {text}
          </span>
        ))}
      </span>
      {tag && (
        <span
          data-tag={tag}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 font-sans"
          style={{
            fontSize: box * 0.22,
            background: 'var(--bg2)',
            border: `1px solid ${LIT}`,
            color: '#cdc6ff',
          }}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

export function StackView({
  frames,
  step,
  box,
  moveMs,
}: {
  frames: StackFrame[];
  step: number;
  box: number;
  moveMs: number;
}) {
  const { from: fromStep, t } = useTween(step, moveMs);
  const from = frames[fromStep];
  const to = frames[step];
  const height = box * 1.15;
  const gap = box * 0.12;
  const deepest = Math.max(1, ...frames.map((f) => f.cards.length));
  const lift = height * 0.6;

  const was = new Map(from.cards.map((card) => [card.id, card]));
  const is = new Set(to.cards.map((card) => card.id));
  const popped = from.cards.filter((card) => !is.has(card.id));
  const pushed = to.cards.filter((card) => !was.has(card.id));
  const changed = to.cards.some((card) => was.has(card.id) && was.get(card.id)!.line !== card.line);
  const [pOut, , pIn] = beats(
    [popped.length > 0 || changed, false, pushed.length > 0 || changed],
    t,
  );

  const bottomOf = (i: number) => i * (height + gap);
  const lineOf = (text?: string) => (text === undefined ? [] : [{ text, opacity: 1 }]);

  const cards = [
    ...to.cards.map((card, i) => {
      const old = was.get(card.id);
      const line =
        old && old.line !== card.line
          ? [
              ...lineOf(old.line).map((l) => ({ ...l, opacity: 1 - pOut })),
              ...lineOf(card.line).map((l) => ({ ...l, opacity: pIn })),
            ]
          : lineOf(card.line);
      return (
        <Card
          key={card.id}
          card={card}
          frame={to}
          bottom={bottomOf(i)}
          height={height}
          lift={old ? 0 : lift * (1 - pIn)}
          opacity={old ? 1 : pIn}
          line={line}
          box={box}
        />
      );
    }),
    ...popped.map((card) =>
      pOut >= 1 ? null : (
        <Card
          key={card.id}
          card={card}
          frame={from}
          bottom={bottomOf(from.cards.indexOf(card))}
          height={height}
          lift={lift * pOut}
          opacity={1 - pOut}
          line={lineOf(card.line)}
          box={box}
        />
      ),
    ),
  ];

  return (
    <div className="my-4 mx-auto font-mono" style={{ width: `min(100%, ${box * 6.5}px)` }}>
      <div
        className="relative"
        style={{ height: deepest * (height + gap) - gap + lift * 0.5 }}
        aria-hidden="true"
      >
        {cards}
      </div>
      <div className="mt-1.5 border-t-2 border-[var(--border)]" aria-hidden="true" />
    </div>
  );
}
