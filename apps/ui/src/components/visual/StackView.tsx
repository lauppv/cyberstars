import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { StackCard } from './parseStack';
import type { StackFrame } from './stackFrames';
import { LIT, LOOK, type NodeState } from './look';
import { beats, lerp, useTween } from './tween';

// The stack drawing. A stack is cards piled from a floor up, the newest on top, as wide as the room
// allows up to a size that scales with the player's box, so a pile of five fits a phone; a card
// keeps its place while it is on the stack, since cards only come and go at the top. A queue is
// square cards in a row, the front on the left: they come in at the back and leave from the front,
// and the rest slide forward; the row shrinks with the room, like the array's boxes. With `ends`
// the stack's top card says so, and the queue's front and back are named under them. A move of one
// step plays with the shared tween in up to three beats: what leaves goes out (up off a stack, left
// out of a queue) and a line that changes fades out, then a queue's cards slide forward, then what
// comes drops or slides in and the new line fades in. Reduced motion or a jump puts everything in
// place at once

function stateOf(frame: StackFrame, id: string): NodeState {
  return frame.focus.includes(id) ? 'focused' : frame.done.includes(id) ? 'done' : 'idle';
}

const PILL: CSSProperties = {
  background: 'var(--bg2)',
  border: `1px solid ${LIT}`,
  color: '#cdc6ff',
};

function Card({
  card,
  frame,
  place,
  opacity,
  line,
  ends,
  queue,
  centred,
  size,
}: {
  card: StackCard;
  frame: StackFrame;
  place: CSSProperties;
  opacity: number;
  // The card's line, or two while it changes, each with how far it shows
  line: { text: string; opacity: number }[];
  // What the card's end is called, such as "top" or "front"
  ends: string[];
  queue: boolean;
  // A card with just a value has it in the middle
  centred: boolean;
  size: string;
}) {
  const state = stateOf(frame, card.id);
  const look = LOOK[state];
  const tag = frame.tags[card.id];
  const pills = queue ? [tag] : [...ends, tag];
  return (
    <div
      data-card={card.id}
      data-state={state}
      className={`absolute flex flex-col justify-center rounded-[var(--radius-sm)] ${centred ? 'items-center' : 'px-3'}`}
      style={{
        ...place,
        opacity,
        background: look.fill,
        border: `${look.width}px solid ${look.stroke}`,
      }}
    >
      <span className="leading-tight" style={{ color: look.text, fontSize: `calc(${size} * 0.3)` }}>
        {card.text}
      </span>
      {line.length > 0 && (
        <span className="relative leading-tight" style={{ fontSize: `calc(${size} * 0.26)` }}>
          {/* Holds the line's height while it changes */}
          <span className="invisible">{line[line.length - 1].text}</span>
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
      )}
      {pills.some(Boolean) && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 font-sans">
          {pills.map(
            (pill, i) =>
              pill && (
                <span
                  key={i}
                  data-tag={pill}
                  className="rounded-full px-2"
                  style={{ ...PILL, fontSize: `calc(${size} * 0.22)` }}
                >
                  {pill}
                </span>
              ),
          )}
        </span>
      )}
      {queue && ends.length > 0 && (
        <span
          data-end={card.id}
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-sans text-[var(--text3)]"
          style={{ fontSize: `calc(${size} * 0.24)` }}
        >
          {ends.join(', ')}
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
  queue,
  ends,
}: {
  frames: StackFrame[];
  step: number;
  box: number;
  moveMs: number;
  queue: boolean;
  ends: boolean;
}) {
  const { t: translate } = useTranslation();
  const { from: fromStep, t } = useTween(step, moveMs);
  const from = frames[fromStep];
  const to = frames[step];
  const longest = Math.max(1, ...frames.map((f) => f.cards.length));

  const was = new Map(from.cards.map((card) => [card.id, card]));
  const is = new Set(to.cards.map((card) => card.id));
  const gone = from.cards.filter((card) => !is.has(card.id));
  const come = to.cards.filter((card) => !was.has(card.id));
  const changed = to.cards.some((card) => was.has(card.id) && was.get(card.id)!.line !== card.line);
  const slides = to.cards.some(
    (card, i) => was.has(card.id) && from.cards.indexOf(was.get(card.id)!) !== i,
  );
  const [pOut, pMove, pIn] = beats(
    [gone.length > 0 || changed, slides, come.length > 0 || changed],
    t,
  );

  const endsOf = (i: number, count: number) => {
    if (!ends) return [];
    if (!queue) return i === count - 1 ? [translate('lesson.visualTop')] : [];
    return [
      ...(i === 0 ? [translate('lesson.visualFront')] : []),
      ...(i === count - 1 ? [translate('lesson.visualBack')] : []),
    ];
  };

  // A stack's card stands at its height on the pile and moves up and down; a queue's at its place in
  // the row and moves sideways. `away` is how far a card that comes or goes is from its place, 0 to 1
  const height = box * 1.15;
  const gap = box * 0.12;
  const placeOf = (at: number, away: number, leaving: boolean): CSSProperties =>
    queue
      ? {
          left: `${(at * 100) / longest}%`,
          width: `calc(${100 / longest}% - 6px)`,
          top: 0,
          aspectRatio: '1',
          transform: away ? `translateX(${(leaving ? -60 : 60) * away}%)` : undefined,
        }
      : {
          left: 0,
          right: 0,
          bottom: at * (height + gap),
          height,
          transform: away ? `translateY(${-height * 0.6 * away}px)` : undefined,
        };
  // A queue's card is as big as its place in the row, which is the room inside the lane (its
  // border and padding take 10px) shared out; a stack's is as the player's box
  const slot = `((100cqw - 10px) / ${longest})`;
  const size = queue ? `calc${slot}` : `${box}px`;
  // A stack of values, with no line on any card, is a narrow pile
  const plain = frames.every((f) => f.cards.every((card) => card.line === undefined));
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
      const at = old ? lerp(from.cards.indexOf(old), i, pMove) : i;
      return (
        <Card
          key={card.id}
          card={card}
          frame={to}
          place={placeOf(at, old ? 0 : 1 - pIn, false)}
          opacity={old ? 1 : pIn}
          line={line}
          ends={endsOf(i, to.cards.length)}
          queue={queue}
          centred={queue || plain}
          size={size}
        />
      );
    }),
    ...gone.map((card) =>
      pOut >= 1 ? null : (
        <Card
          key={card.id}
          card={card}
          frame={from}
          place={placeOf(from.cards.indexOf(card), pOut, true)}
          opacity={1 - pOut}
          line={lineOf(card.line)}
          ends={[]}
          queue={queue}
          centred={queue || plain}
          size={size}
        />
      ),
    ),
  ];

  if (queue) {
    return (
      <div
        className="my-4 mx-auto font-mono @container"
        style={{ width: `min(100%, ${longest * box * 1.3 + 10}px)` }}
        aria-hidden="true"
      >
        {/* The queue's lane, outlined so an empty queue still shows */}
        <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--border)] p-1">
          <div className="relative" style={{ height: `calc(${slot} - 6px)` }}>
            {cards}
          </div>
        </div>
        {/* Room for the names of the ends under the row */}
        <div style={{ height: ends ? `calc(${size} * 0.24 * 1.6 + 4px)` : 0 }} />
      </div>
    );
  }
  return (
    <div
      className="my-4 mx-auto font-mono"
      style={{ width: `min(100%, ${box * (plain ? 3.2 : 6.5)}px)` }}
    >
      <div
        className="relative"
        style={{ height: longest * (height + gap) - gap + height * 0.3 }}
        aria-hidden="true"
      >
        {cards}
      </div>
      <div className="mt-1.5 border-t-2 border-[var(--border)]" aria-hidden="true" />
    </div>
  );
}
