import { spotKey, type GridVisual, type Spot } from './parseGrid';
import type { GridFrame } from './gridFrames';
import { CodeLine, Rows } from './parts';
import { LOOK, type NodeState } from './look';

// The grid drawing: an SVG whose units scale with its width, a square per cell, a wall filled in
// and a free cell lit like a graph's vertex, with the value written in it. Nothing moves, so it
// changes the same way with reduced motion or without

const CELL = 36;
const GAP = 3;
// Units to a box, as in the tree's and the graph's drawings
const SLOT = 40;

export function GridView({
  visual,
  frames,
  step,
  box,
}: {
  visual: GridVisual;
  frames: GridFrame[];
  step: number;
  box: number;
}) {
  const frame = frames[step];
  const { cells } = visual;
  const rowCount = Math.max(...frames.map((f) => f.rows.length));
  const hasCode = frames.some((f) => f.code !== null);
  const width = cells[0].length * (CELL + GAP) - GAP;
  const height = cells.length * (CELL + GAP) - GAP;

  const has = (spots: Spot[], key: string) => spots.some((spot) => spotKey(spot) === key);
  const stateOf = (key: string): NodeState =>
    has(frame.focus, key)
      ? 'focused'
      : has(frame.done, key)
        ? 'done'
        : has(frame.seen, key)
          ? 'seen'
          : 'idle';

  const squares = cells.flatMap((row, r) =>
    [...row].map((cell, c) => {
      const key = spotKey([r, c]);
      const [x, y] = [c * (CELL + GAP), r * (CELL + GAP)];
      if (cell === '#') {
        return (
          <rect
            key={key}
            data-wall={key}
            x={x}
            y={y}
            width={CELL}
            height={CELL}
            rx={4}
            style={{ fill: 'var(--border)' }}
          />
        );
      }
      const state = stateOf(key);
      const value = frame.values[key];
      return (
        <g key={key} data-cell={key} data-state={state}>
          <rect
            x={x + 0.5}
            y={y + 0.5}
            width={CELL - 1}
            height={CELL - 1}
            rx={4}
            strokeWidth={LOOK[state].width}
            style={{ fill: LOOK[state].fill, stroke: LOOK[state].stroke }}
          />
          {value !== undefined && (
            <text
              x={x + CELL / 2}
              y={y + CELL / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              style={{ fill: LOOK[state].text }}
            >
              {value}
            </text>
          )}
        </g>
      );
    }),
  );

  return (
    <div className="my-4">
      <svg
        viewBox={`-1 -1 ${width + 2} ${height + 2}`}
        className="block mx-auto font-mono"
        style={{ width: `min(100%, ${Math.round(((width + 2) * box) / SLOT)}px)` }}
        aria-hidden="true"
      >
        {squares}
      </svg>
      {rowCount > 0 && <Rows rows={frame.rows} count={rowCount} />}
      {hasCode && <CodeLine code={frame.code} />}
    </div>
  );
}
