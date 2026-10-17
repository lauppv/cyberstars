import { useMemo } from 'react';
import { edgeKey, type Edge, type GraphVisual } from './parseGraph';
import { adjacency, type GraphFrame } from './graphFrames';
import { beats, useTween } from './tween';
import { CodeLine, Rows, Tag, type Row } from './parts';
import { EDGE, LIT, LOOK, R, tagWidth, type NodeState } from './look';

// The graph drawing: an SVG whose units scale with its width, its vertices drawn like a tree's
// nodes, each where the visual puts it. A vertex's tag sits at the corner of it furthest from its
// edges, so it covers none of them. The adjacency matrix goes under the graph, a cell per pair with
// the indexes above and beside it, and the adjacency list under that, a row per vertex. A new edge
// fades in at the speed picked, and one taken back by Previous fades out

// The room between two steps of the grid the vertices stand on
const STEP = 60;
const PAD = R + 6;
// Where a tag starts, beside the vertex's middle
const TAG_X = R * 0.6;
// The corners a tag can take, in the order they are tried: above right, above left, below right,
// below left
const CORNERS: [number, number][] = [
  [1, -1],
  [-1, -1],
  [1, 1],
  [-1, 1],
];
const ARROW = 8;
// The matrix: its cells and the room for the indexes
const CELL = 24;
const INDEX = 16;
// Units to a box, as in the tree's drawing, so a vertex is as big as a tree's node
const SLOT = 40;

export function GraphView({
  visual,
  frames,
  step,
  box,
  moveMs,
}: {
  visual: GraphVisual;
  frames: GraphFrame[];
  step: number;
  box: number;
  moveMs: number;
}) {
  const { from: fromStep, t } = useTween(step, moveMs);
  const from = frames[fromStep];
  const to = frames[step];
  const { vertices, directed } = visual;
  const n = vertices.length;

  const widestTag = useMemo(
    () => Math.max(0, ...frames.flatMap((frame) => Object.values(frame.tags).map(tagWidth))),
    [frames],
  );
  const rowCount = (visual.list ? n : 0) + Math.max(...frames.map((frame) => frame.rows.length));
  const hasCode = frames.some((frame) => frame.code !== null);

  const xs = vertices.map(([x]) => x);
  const ys = vertices.map(([, y]) => y);
  const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
  const side = Math.max(PAD, TAG_X + widestTag + 4);
  const top = widestTag > 0 ? R + 12 : PAD;
  const [left, right, bottom] = [side, side, top];
  const graphWidth = (Math.max(...xs) - minX) * STEP + left + right;
  const graphHeight = (Math.max(...ys) - minY) * STEP + top + bottom;
  const matrixWidth = INDEX + n * CELL;
  const width = visual.matrix ? Math.max(graphWidth, matrixWidth) : graphWidth;
  const matrixTop = graphHeight + 8;
  const height = visual.matrix ? matrixTop + INDEX + n * CELL + 4 : graphHeight;
  const at = (v: number): [number, number] => [
    (width - graphWidth) / 2 + left + (vertices[v][0] - minX) * STEP,
    top + (vertices[v][1] - minY) * STEP,
  ];

  // An edge the step uses lights up either way in an undirected graph. Its place in the matrix and
  // the list lights up only the way the step names it, so a step can light 1's neighbours without
  // lighting 1 in theirs
  const named = (u: number, v: number) => to.used.some(([a, b]) => a === u && b === v);
  const isUsed = (u: number, v: number) => named(u, v) || (!directed && named(v, u));

  const fromKeys = new Set(from.edges.map(([u, v]) => edgeKey(u, v)));
  const toKeys = new Set(to.edges.map(([u, v]) => edgeKey(u, v)));
  const going = from.edges.filter(([u, v]) => !toKeys.has(edgeKey(u, v)));
  const coming = to.edges.filter(([u, v]) => !fromKeys.has(edgeKey(u, v)));
  const [pOut, , pIn] = beats([going.length > 0, false, coming.length > 0], t);

  const stateOf = (v: number): NodeState =>
    to.focus.includes(v)
      ? 'focused'
      : to.done.includes(v)
        ? 'done'
        : to.seen.includes(v)
          ? 'seen'
          : 'idle';

  const drawEdge = (edge: Edge, opacity: number) => {
    const [u, v, w] = edge;
    const [x1, y1] = at(u);
    const [x2, y2] = at(v);
    const len = Math.hypot(x2 - x1, y2 - y1);
    const [dx, dy] = [(x2 - x1) / len, (y2 - y1) / len];
    const lit = isUsed(u, v);
    const colour = lit ? LIT : EDGE;
    // A directed edge stops short of its end, where the arrowhead's tip touches the circle
    const [tx, ty] = [x2 - dx * R, y2 - dy * R];
    const end = directed ? ARROW - 1 : 0;
    const [mx, my] = [(x1 + x2) / 2, (y1 + y2) / 2];
    const label = w === undefined ? '' : String(w);
    const labelWidth = label.length * 6.2 + 8;
    return (
      <g
        key={`edge-${edgeKey(u, v)}`}
        data-edge={`${u}-${v}`}
        data-lit={lit || undefined}
        opacity={opacity}
      >
        <line
          x1={x1 + dx * R}
          y1={y1 + dy * R}
          x2={tx - dx * end}
          y2={ty - dy * end}
          strokeWidth={lit ? 2.5 : 1.5}
          style={{ stroke: colour }}
        />
        {directed && (
          <polygon
            data-arrow
            points={[
              [tx, ty],
              [tx - dx * ARROW - dy * 4, ty - dy * ARROW + dx * 4],
              [tx - dx * ARROW + dy * 4, ty - dy * ARROW - dx * 4],
            ]
              .map((p) => p.join(','))
              .join(' ')}
            style={{ fill: colour }}
          />
        )}
        {label && (
          <g data-weight={label}>
            <rect
              x={mx - labelWidth / 2}
              y={my - 7}
              width={labelWidth}
              height={14}
              rx={7}
              strokeWidth={1}
              style={{ fill: 'var(--bg2)', stroke: colour }}
            />
            <text
              x={mx}
              y={my}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={10}
              style={{ fill: lit ? '#cdc6ff' : 'var(--text2)' }}
            >
              {label}
            </text>
          </g>
        )}
      </g>
    );
  };

  const edges = [
    ...to.edges.map((edge) => drawEdge(edge, fromKeys.has(edgeKey(edge[0], edge[1])) ? 1 : pIn)),
    ...going.map((edge) => drawEdge(edge, 1 - pOut)),
  ];

  const nodes = vertices.map((_, v) => {
    const [x, y] = at(v);
    const state = stateOf(v);
    return (
      <g key={`vertex-${v}`}>
        <circle
          data-vertex={v}
          data-state={state}
          cx={x}
          cy={y}
          r={R}
          strokeWidth={LOOK[state].width}
          style={{ fill: LOOK[state].fill, stroke: LOOK[state].stroke }}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
          style={{ fill: LOOK[state].text }}
        >
          {v}
        </text>
      </g>
    );
  });

  // Each vertex's corner, the one whose direction is furthest from every edge it has at any step
  const corners = useMemo(() => {
    const ends = new Map<number, number[]>();
    for (const [u, v] of frames.flatMap((frame) => frame.edges)) {
      ends.set(u, [...(ends.get(u) ?? []), v]);
      ends.set(v, [...(ends.get(v) ?? []), u]);
    }
    return vertices.map(([x, y], v) => {
      const away = (corner: [number, number]) =>
        Math.min(
          Infinity,
          ...(ends.get(v) ?? []).map((w) => {
            const [dx, dy] = [vertices[w][0] - x, vertices[w][1] - y];
            return 1 - (dx * corner[0] + dy * corner[1]) / Math.hypot(dx, dy) / Math.SQRT2;
          }),
        );
      return CORNERS.reduce((best, corner) => (away(corner) > away(best) + 1e-9 ? corner : best));
    });
  }, [frames, vertices]);
  const tags = Object.entries(to.tags).map(([key, text]) => {
    const [x, y] = at(Number(key));
    const [sx, sy] = corners[Number(key)];
    return (
      <Tag
        key={`tag-${key}`}
        x={x + sx * (TAG_X + tagWidth(text) / 2)}
        y={y + sy * (R + 1)}
        text={text}
      />
    );
  });

  // The matrix holds 1 for an edge, or its weight, and 0 for none
  const weights = new Map<string, number>();
  for (const [u, v, w] of to.edges) {
    weights.set(`${u}-${v}`, w ?? 1);
    if (!directed) weights.set(`${v}-${u}`, w ?? 1);
  }
  const matrixLeft = (width - matrixWidth) / 2 + INDEX;
  const matrix = visual.matrix
    ? vertices.flatMap((_, u) => [
        <text
          key={`col-${u}`}
          x={matrixLeft + u * CELL + CELL / 2}
          y={matrixTop + INDEX - 5}
          textAnchor="middle"
          fontSize={9}
          style={{ fill: 'var(--text3)' }}
        >
          {u}
        </text>,
        <text
          key={`row-${u}`}
          x={matrixLeft - 6}
          y={matrixTop + INDEX + u * CELL + CELL / 2}
          textAnchor="end"
          dominantBaseline="central"
          fontSize={9}
          style={{ fill: 'var(--text3)' }}
        >
          {u}
        </text>,
        ...vertices.map((__, v) => {
          const value = weights.get(`${u}-${v}`) ?? 0;
          const lit = named(u, v);
          const look = LOOK[lit ? 'focused' : 'idle'];
          const [x, y] = [matrixLeft + v * CELL, matrixTop + INDEX + u * CELL];
          return (
            <g key={`cell-${u}-${v}`} data-matrix={`${u}-${v}`} data-lit={lit || undefined}>
              <rect
                x={x + 1}
                y={y + 1}
                width={CELL - 2}
                height={CELL - 2}
                rx={3}
                strokeWidth={look.width}
                style={{ fill: look.fill, stroke: look.stroke }}
              />
              <text
                x={x + CELL / 2}
                y={y + CELL / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                style={{ fill: lit ? look.text : value === 0 ? 'var(--text3)' : 'var(--text)' }}
              >
                {value}
              </text>
            </g>
          );
        }),
      ])
    : [];

  // The list: each vertex with its neighbours, in the order their edges came
  const list: Row[] = visual.list
    ? adjacency(n, to.edges, directed).map((edges, u) => ({
        label: `${u}:`,
        values: edges.map(([, v, w]) => (w === undefined ? v : `(${v}, ${w})`)),
        lit: edges.flatMap(([, v], i) => (named(u, v) ? [i] : [])),
      }))
    : [];

  return (
    <div className="my-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block mx-auto font-mono"
        style={{ width: `min(100%, ${Math.round((width * box) / SLOT)}px)` }}
        aria-hidden="true"
      >
        {edges}
        {nodes}
        {tags}
        {matrix}
      </svg>
      {rowCount > 0 && <Rows rows={[...list, ...to.rows]} count={rowCount} />}
      {hasCode && <CodeLine code={to.code} />}
    </div>
  );
}
