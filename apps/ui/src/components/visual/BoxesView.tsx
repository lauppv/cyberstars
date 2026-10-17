import { useMemo } from 'react';
import type { BoxesVisual, Cell } from './parseBoxes';
import type { BoxesFrame } from './boxFrames';
import { beats, lerp, useTween } from './tween';

// The boxes-and-arrows drawing: an SVG whose units scale with its width, so the row shrinks to fit
// a narrow screen. Every box is one cell wide (a node stacks its two fields), so a head and four
// nodes still fit a phone

const CELL = 40;
// Room for an arrow between two boxes
const GAP = 24;
// Room above the boxes for their names, and below a node for its second field's name
const TOP = 16;
const BOTTOM = 16;
// Room at the sides for a field's name a little wider than its box ("urmator")
const SIDE = 4;
// How far an arrow that skips a box dips to pass under it, and the radius of its corners
const DIP = 46;
const CORNER = 8;

const ARROW = 'var(--text2)';

const slotX = (slot: number) => 1 + slot * (CELL + GAP);

// Each box's place in the row: a box not shown yet keeps its place, a removed one gives it up
function slotsOf(frame: BoxesFrame): number[] {
  let next = 0;
  return frame.places.map((place) => (place === 'removed' ? -1 : next++));
}

// How far an arrow from the box at slot `from` dips: not at all to the box next to it
function dipOf(from: number, to: number): number {
  return to === from + 1 ? 0 : DIP;
}

const sameContent = (a: Cell, b: Cell) =>
  'value' in a
    ? 'value' in b && a.value === b.value
    : 'to' in b && (a.to === null) === (b.to === null);

// What a move between two frames has to it: boxes that go, boxes that slide, boxes that come, and
// cells whose content or arrow changes (its old one goes, its new one comes)
function needs(
  from: BoxesFrame,
  to: BoxesFrame,
  fromSlots: number[],
  toSlots: number[],
): [boolean, boolean, boolean] {
  let out = false;
  let move = false;
  let come = false;
  from.places.forEach((place, b) => {
    const was = place === 'shown';
    const is = to.places[b] === 'shown';
    if (was && !is) out = true;
    if (!was && is) come = true;
    if (!was || !is) return;
    if (fromSlots[b] !== toSlots[b]) move = true;
    from.cells[b].forEach((cell, c) => {
      const next = to.cells[b][c];
      const retargeted = 'to' in cell && 'to' in next && cell.to !== next.to;
      if (!sameContent(cell, next) || retargeted) out = come = true;
    });
  });
  return [out, move, come];
}

interface ArrowShape {
  d: string;
  tip: [number, number];
  dir: [number, number];
}

// An arrow from a pointer cell's dot, in the middle of the box at `from`, to the left side of the
// box it points at: straight to the box next to it; to one further on it goes down in the gap
// after its box, passes under the boxes in between and their names, and comes up in the gap before
// the target, so it still arrives level. As the dip shrinks to 0 it flattens into a straight line.
// One pointing back leaves from below
function arrowShape(from: number, sy: number, target: number, dip: number): ArrowShape {
  const sx = from + CELL / 2;
  if (target > from) {
    const ex = target - 1;
    const r = Math.min(CORNER, dip / 2);
    const down = from + CELL + CORNER;
    const up = target - CORNER;
    const low = sy + dip;
    return {
      d: [
        `M ${sx} ${sy} H ${down - r} Q ${down} ${sy} ${down} ${sy + r}`,
        `V ${low - r} Q ${down} ${low} ${down + r} ${low}`,
        `H ${up - r} Q ${up} ${low} ${up} ${low - r}`,
        `V ${sy + r} Q ${up} ${sy} ${up + r} ${sy} H ${ex}`,
      ].join(' '),
      tip: [ex, sy],
      dir: [1, 0],
    };
  }
  const by = sy + CELL / 2;
  const tx = target + CELL / 2;
  const low = by + DIP * 0.6;
  return {
    d: `M ${sx} ${by} C ${sx} ${low} ${tx} ${low} ${tx} ${by + 1}`,
    tip: [tx, by + 1],
    dir: [0, -1],
  };
}

function Arrow({
  shape,
  opacity,
  drawn,
  from,
  to,
}: {
  shape: ArrowShape;
  opacity: number;
  drawn: number;
  from: string;
  to: string;
}) {
  const [x, y] = shape.tip;
  const [dx, dy] = shape.dir;
  const bx = x - dx * 7;
  const by = y - dy * 7;
  const head = `${x},${y} ${bx - dy * 4},${by + dx * 4} ${bx + dy * 4},${by - dx * 4}`;
  return (
    <g data-arrow={from} data-to={to} opacity={opacity}>
      <path
        d={shape.d}
        fill="none"
        style={{ stroke: ARROW }}
        strokeWidth={1.75}
        pathLength={1}
        strokeDasharray={drawn < 1 ? '1 1' : undefined}
        strokeDashoffset={drawn < 1 ? 1 - drawn : undefined}
      />
      <polygon points={head} style={{ fill: ARROW }} opacity={drawn} />
    </g>
  );
}

export function BoxesView({
  visual,
  frames,
  step,
  box,
  moveMs,
}: {
  visual: BoxesVisual;
  frames: BoxesFrame[];
  step: number;
  box: number;
  moveMs: number;
}) {
  const { from: fromStep, t } = useTween(step, moveMs);
  const from = frames[fromStep];
  const to = frames[step];
  const n = visual.boxes.length;
  const rows = visual.boxes.some((b) => b.cells.length === 2) ? 2 : 1;
  const slots = useMemo(() => frames.map(slotsOf), [frames]);
  const fromSlots = slots[fromStep];
  const toSlots = slots[step];
  const [pOut, pMove, pIn] = beats(needs(from, to, fromSlots, toSlots), t);

  const cellY = (cells: number, c: number) => TOP + (rows - cells + c) * CELL;
  const pointerY = TOP + (rows - 1) * CELL + CELL / 2;

  // Room below for an arrow that dips, when any step has one
  const dips = useMemo(
    () =>
      frames.some((frame, f) =>
        frame.cells.some(
          (cells, b) =>
            frame.places[b] === 'shown' &&
            cells.some((cell) => {
              if (!('to' in cell) || cell.to === null) return false;
              const target = visual.boxes.findIndex((other) => other.id === cell.to);
              return dipOf(slots[f][b], slots[f][target]) > 0;
            }),
        ),
      ),
    [frames, slots, visual.boxes],
  );
  const width = slotX(n - 1) + CELL + 1;
  const base = TOP + rows * CELL + (rows === 2 ? BOTTOM : 4);
  const height = dips ? Math.max(base, pointerY + DIP + 4) : base;

  const was = (b: number) => from.places[b] === 'shown';
  const is = (b: number) => to.places[b] === 'shown';
  const xNow = (b: number) =>
    was(b) && is(b)
      ? lerp(slotX(fromSlots[b]), slotX(toSlots[b]), pMove)
      : slotX(was(b) ? fromSlots[b] : toSlots[b]);
  const indexOf = (id: string) => visual.boxes.findIndex((b) => b.id === id);

  const boxes = visual.boxes.map((def, b) => {
    if (!was(b) && !is(b)) return null;
    const opacity = was(b) && is(b) ? 1 : was(b) ? 1 - pOut : pIn;
    const focused = to.focus.includes(def.id);
    const k = def.cells.length;
    const text = focused ? '#cdc6ff' : 'var(--text)';
    // What a cell shows, fading from the old to the new when it changes
    const contents = (c: number) => {
      const old = from.cells[b][c];
      const now = to.cells[b][c];
      if (!was(b)) return [{ cell: now, opacity: 1 }];
      if (!is(b) || sameContent(old, now)) return [{ cell: is(b) ? now : old, opacity: 1 }];
      return [
        { cell: old, opacity: 1 - pOut },
        { cell: now, opacity: pIn },
      ];
    };
    return (
      <g
        key={def.id}
        data-box={def.id}
        data-state={focused ? 'focused' : 'idle'}
        transform={`translate(${xNow(b)} 0)`}
        opacity={opacity}
      >
        <rect
          x={0.5}
          y={cellY(k, 0)}
          width={CELL - 1}
          height={k * CELL}
          rx={6}
          strokeWidth={focused ? 2 : 1}
          style={{
            fill: focused ? 'rgba(108,92,231,0.25)' : 'var(--glass)',
            stroke: focused ? 'var(--accent)' : 'var(--border)',
          }}
        />
        {k === 2 && (
          <line
            x1={0.5}
            x2={CELL - 0.5}
            y1={cellY(k, 1)}
            y2={cellY(k, 1)}
            strokeWidth={1}
            style={{ stroke: focused ? 'var(--accent)' : 'var(--border)' }}
          />
        )}
        {(def.name ?? def.cells[0].name) && (
          <text
            x={CELL / 2}
            y={cellY(k, 0) - 5}
            textAnchor="middle"
            fontSize={11}
            style={{ fill: 'var(--text3)' }}
          >
            {def.name ?? def.cells[0].name}
          </text>
        )}
        {k === 2 && (
          <text
            x={CELL / 2}
            y={cellY(k, 2) + 12}
            textAnchor="middle"
            fontSize={11}
            style={{ fill: 'var(--text3)' }}
          >
            {def.cells[1].name}
          </text>
        )}
        {def.cells.map((_, c) =>
          contents(c).map(({ cell, opacity: shown }, i) => {
            if (shown <= 0) return null;
            const cy = cellY(k, c) + CELL / 2;
            if ('value' in cell) {
              return (
                <text
                  key={`${c}-${i}`}
                  data-value={`${def.id}.${c}`}
                  x={CELL / 2}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  opacity={shown}
                  style={{ fill: text }}
                >
                  {cell.value}
                </text>
              );
            }
            return cell.to === null ? (
              <text
                key={`${c}-${i}`}
                data-null={`${def.id}.${c}`}
                x={CELL / 2}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                opacity={shown}
                style={{ fill: 'var(--text3)' }}
              >
                {visual.null}
              </text>
            ) : (
              <circle
                key={`${c}-${i}`}
                cx={CELL / 2}
                cy={cy}
                r={3.5}
                opacity={shown}
                style={{ fill: ARROW }}
              />
            );
          }),
        )}
      </g>
    );
  });

  // Arrows go over the boxes, from the dot in the middle of their cell
  const arrows = visual.boxes.flatMap((def, b) =>
    def.cells.flatMap((_, c) => {
      const address = def.cells.length === 1 ? def.id : `${def.id}.${def.cells[c].name}`;
      const old = from.cells[b][c];
      const now = to.cells[b][c];
      const oldTo = was(b) && 'to' in old ? old.to : null;
      const newTo = is(b) && 'to' in now ? now.to : null;
      const sy = pointerY;
      if (oldTo !== null && oldTo === newTo) {
        const target = indexOf(newTo);
        const dip = lerp(
          dipOf(fromSlots[b], fromSlots[target]),
          dipOf(toSlots[b], toSlots[target]),
          pMove,
        );
        const shape = arrowShape(xNow(b), sy, xNow(target), dip);
        return [
          <Arrow key={address} shape={shape} opacity={1} drawn={1} from={address} to={newTo} />,
        ];
      }
      const drawn = [];
      if (oldTo !== null && pOut < 1) {
        const target = indexOf(oldTo);
        const shape = arrowShape(
          slotX(fromSlots[b]),
          sy,
          slotX(fromSlots[target]),
          dipOf(fromSlots[b], fromSlots[target]),
        );
        drawn.push(
          <Arrow
            key={`${address}-old`}
            shape={shape}
            opacity={1 - pOut}
            drawn={1}
            from={address}
            to={oldTo}
          />,
        );
      }
      if (newTo !== null && pIn > 0) {
        const target = indexOf(newTo);
        const shape = arrowShape(
          slotX(toSlots[b]),
          sy,
          slotX(toSlots[target]),
          dipOf(toSlots[b], toSlots[target]),
        );
        drawn.push(
          <Arrow key={address} shape={shape} opacity={1} drawn={pIn} from={address} to={newTo} />,
        );
      }
      return drawn;
    }),
  );

  return (
    <svg
      viewBox={`${-SIDE} 0 ${width + 2 * SIDE} ${height}`}
      className="block mx-auto my-4 font-mono"
      style={{ width: `min(100%, ${Math.round(((width + 2 * SIDE) * box) / CELL)}px)` }}
      aria-hidden="true"
    >
      {boxes}
      {arrows}
    </svg>
  );
}
