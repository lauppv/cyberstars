import { useMemo } from 'react';
import { parentOf, type TreeVisual } from './parseTree';
import type { TreeFrame } from './treeFrames';
import { beats, lerp, useTween } from './tween';
import { CodeLine, Rows, Tag } from './parts';
import { EDGE, LIT, LOOK, R } from './look';

// The tree drawing: an SVG whose units scale with its width. Each level halves the room of the one
// above, so a node's place fixes where it stands and the bottom row decides the width; four levels
// still fit a phone. A heap also gets its list under the tree, a cell per place, lit like its node

const SLOT = 40;
const LEVEL = 52;
// Room above the root and below the bottom row for a tag
const TOP = 20;
const BOTTOM = 20;
// The list under a heap: its cells, the room between them, and the room above for the indexes
const CELL = 28;
const CELL_GAP = 2;
const INDEX = 16;

const depthOf = (place: number) => Math.floor(Math.log2(place + 1));
const childrenOf = (place: number) => [2 * place + 1, 2 * place + 2];

export function TreeView({
  visual,
  frames,
  step,
  box,
  moveMs,
}: {
  visual: TreeVisual;
  frames: TreeFrame[];
  step: number;
  box: number;
  moveMs: number;
}) {
  const { from: fromStep, t } = useTween(step, moveMs);
  const from = frames[fromStep];
  const to = frames[step];

  // As many levels as the deepest node, or empty child, any step shows
  const levels = useMemo(() => {
    let deepest = 0;
    for (const frame of frames) {
      const places = [...Object.keys(frame.nodes).map(Number), ...frame.nulls.flatMap(childrenOf)];
      for (const place of places) deepest = Math.max(deepest, depthOf(place));
    }
    return deepest + 1;
  }, [frames]);
  const hasCode = frames.some((frame) => frame.code !== null);
  const rowCount = Math.max(...frames.map((frame) => frame.rows.length));
  const cells = useMemo(
    () =>
      visual.array
        ? Math.max(...frames.flatMap((frame) => Object.keys(frame.nodes).map(Number))) + 1
        : 0,
    [frames, visual.array],
  );

  const treeWidth = 2 ** (levels - 1) * SLOT;
  const listWidth = cells * CELL + (cells - 1) * CELL_GAP;
  const width = Math.max(treeWidth, listWidth);
  const treeHeight = TOP + 2 * R + (levels - 1) * LEVEL + BOTTOM;
  const listY = treeHeight + INDEX;
  const height = visual.array ? listY + CELL + 4 : treeHeight;
  const at = (place: number): [number, number] => {
    const depth = depthOf(place);
    const across = place - (2 ** depth - 1);
    return [
      (width - treeWidth) / 2 + ((across + 0.5) * treeWidth) / 2 ** depth,
      TOP + R + depth * LEVEL,
    ];
  };
  const inList = (place: number): [number, number] => [
    (width - listWidth) / 2 + place * (CELL + CELL_GAP) + CELL / 2,
    listY + CELL / 2,
  ];

  // What the move has to it: nodes and values that go, values that change place, ones that come
  const ids = (frame: TreeFrame) => new Map(Object.values(frame.nodes).map((v) => [v.id, v]));
  const fromIds = ids(from);
  const toIds = ids(to);
  const placeOf = (frame: TreeFrame, id: number) =>
    Number(Object.keys(frame.nodes).find((place) => frame.nodes[Number(place)].id === id));
  const going = [...fromIds.keys()].filter((id) => !toIds.has(id));
  const coming = [...toIds.keys()].filter((id) => !fromIds.has(id));
  const moving = [...toIds.keys()].filter(
    (id) => fromIds.has(id) && placeOf(from, id) !== placeOf(to, id),
  );
  const [pOut, pMove, pIn] = beats([going.length > 0, moving.length > 0, coming.length > 0], t);

  const was = (place: number) => place in from.nodes;
  const is = (place: number) => place in to.nodes;
  const shown = (place: number) => (was(place) && is(place) ? 1 : was(place) ? 1 - pOut : pIn);
  const allPlaces = [...new Set([...Object.keys(from.nodes), ...Object.keys(to.nodes)])]
    .map(Number)
    .sort((a, b) => a - b);

  const onPath = (place: number) => to.path.includes(place);
  const litEdge = (place: number) => onPath(place) && onPath(parentOf(place));
  // A node being looked at is purple, one already dealt with green
  const stateOf = (place: number) =>
    to.focus.includes(place) || onPath(place)
      ? 'focused'
      : to.done.includes(place)
        ? 'done'
        : 'idle';

  const edges = allPlaces
    .filter((place) => place > 0)
    .map((place) => {
      const parent = parentOf(place);
      const [x1, y1] = at(parent);
      const [x2, y2] = at(place);
      const len = Math.hypot(x2 - x1, y2 - y1);
      const [dx, dy] = [(x2 - x1) / len, (y2 - y1) / len];
      const lit = litEdge(place);
      return (
        <line
          key={`edge-${place}`}
          data-edge={place}
          data-lit={lit || undefined}
          x1={x1 + dx * R}
          y1={y1 + dy * R}
          x2={x2 - dx * R}
          y2={y2 - dy * R}
          strokeWidth={lit ? 2.5 : 1.5}
          opacity={Math.min(shown(place), shown(parent))}
          style={{ stroke: lit ? LIT : EDGE }}
        />
      );
    });

  // A node's empty children, shown with the language's word for nothing
  const nulls = to.nulls.flatMap((place) =>
    childrenOf(place)
      .filter((child) => !is(child))
      .map((child) => {
        const [x1, y1] = at(place);
        const [x2, y2] = at(child);
        const len = Math.hypot(x2 - x1, y2 - y1);
        const [dx, dy] = [(x2 - x1) / len, (y2 - y1) / len];
        return (
          <g key={`null-${child}`} data-null={child}>
            <line
              x1={x1 + dx * R}
              y1={y1 + dy * R}
              x2={x2 - dx * 9}
              y2={y2 - dy * 9}
              strokeWidth={1.25}
              strokeDasharray="3 3"
              style={{ stroke: 'var(--text3)' }}
            />
            <text
              x={x2}
              y={y2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              style={{ fill: 'var(--text3)' }}
            >
              {visual.null}
            </text>
          </g>
        );
      }),
  );

  const nodes = allPlaces.map((place) => {
    const [x, y] = at(place);
    const state = stateOf(place);
    return (
      <circle
        key={`node-${place}`}
        data-node={place}
        data-state={state}
        cx={x}
        cy={y}
        r={R}
        strokeWidth={LOOK[state].width}
        opacity={shown(place)}
        style={{ fill: LOOK[state].fill, stroke: LOOK[state].stroke }}
      />
    );
  });

  // The same places as a list, each cell with its index above it
  const list = visual.array
    ? allPlaces.map((place) => {
        const [x, y] = inList(place);
        const state = stateOf(place);
        return (
          <g key={`cell-${place}`} data-cell={place} data-state={state} opacity={shown(place)}>
            <text
              x={x}
              y={listY - 6}
              textAnchor="middle"
              fontSize={9}
              style={{ fill: 'var(--text3)' }}
            >
              {place}
            </text>
            <rect
              x={x - CELL / 2}
              y={y - CELL / 2}
              width={CELL}
              height={CELL}
              rx={4}
              strokeWidth={LOOK[state].width}
              style={{ fill: LOOK[state].fill, stroke: LOOK[state].stroke }}
            />
          </g>
        );
      })
    : [];

  // The values go on top of the circles (and cells), so a swap carries them from one to the other
  const valuesIn = (view: 'tree' | 'list', spot: (place: number) => [number, number]) =>
    [...new Set([...fromIds.keys(), ...toIds.keys()])].map((id) => {
      const inFrom = fromIds.has(id);
      const inTo = toIds.has(id);
      const [fx, fy] = spot(placeOf(inFrom ? from : to, id));
      const [tx, ty] = inTo ? spot(placeOf(to, id)) : [fx, fy];
      const opacity = inFrom && inTo ? 1 : inFrom ? 1 - pOut : pIn;
      if (opacity <= 0) return null;
      const place = placeOf(inTo ? to : from, id);
      const state = inTo ? stateOf(place) : 'idle';
      return (
        <text
          key={`${view}-${id}`}
          data-value={inTo && view === 'tree' ? place : undefined}
          data-list-value={inTo && view === 'list' ? place : undefined}
          x={lerp(fx, tx, pMove)}
          y={lerp(fy, ty, pMove)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={view === 'tree' ? 14 : 13}
          opacity={opacity}
          style={{ fill: LOOK[state].text }}
        >
          {(inTo ? toIds : fromIds).get(id)!.value}
        </text>
      );
    });
  const values = valuesIn('tree', at);

  // A tag sits below a node with nothing under it, and above one with children
  const tags = Object.entries(to.tags).map(([key, text]) => {
    const place = Number(key);
    const [x, y] = at(place);
    const below = !childrenOf(place).some((child) => is(child) || to.nulls.includes(place));
    return <Tag key={`tag-${place}`} x={x} y={below ? y + R + 11 : y - R - 11} text={text} />;
  });

  return (
    <div className="my-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block mx-auto font-mono"
        style={{ width: `min(100%, ${Math.round((width * box) / SLOT)}px)` }}
        aria-hidden="true"
      >
        {edges}
        {nulls}
        {nodes}
        {values}
        {tags}
        {list}
        {visual.array && valuesIn('list', inList)}
      </svg>
      {rowCount > 0 && <Rows rows={to.rows} count={rowCount} />}
      {hasCode && <CodeLine code={to.code} />}
    </div>
  );
}
