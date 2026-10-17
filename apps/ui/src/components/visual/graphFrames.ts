import type { ValueRow } from './checks';
import type { Edge, GraphVisual } from './parseGraph';

// What the graph looks like at one step: the edges on screen, in the order they came, and what the
// step highlights. Like a tree's frames, a step that asks a question shows it with its answer
// before its edges come; they come on the next frame, with the same highlights
export interface GraphFrame {
  edges: Edge[];
  focus: number[];
  seen: number[];
  done: number[];
  used: [number, number][];
  tags: Record<number, string>;
  rows: ValueRow[];
  code: string | null;
  title: string | null;
  ask: string | null;
  caption: string;
}

export function graphFrames(visual: GraphVisual): GraphFrame[] {
  let edges = visual.edges;
  let title: string | null = null;
  const frames: GraphFrame[] = [
    {
      edges,
      focus: [],
      seen: [],
      done: [],
      used: [],
      tags: {},
      rows: [],
      code: null,
      title,
      ask: null,
      caption: visual.caption,
    },
  ];
  for (const step of visual.steps) {
    if (step.title !== undefined) title = step.title;
    const shown = {
      focus: step.focus ?? [],
      seen: step.seen ?? [],
      done: step.done ?? [],
      used: step.used ?? [],
      tags: step.tags ?? {},
      rows: step.rows ?? [],
      code: step.code ?? null,
      title,
      ask: step.ask ?? null,
      caption: step.caption,
    };
    if (step.ask) frames.push({ edges, ...shown });
    if (step.add) edges = [...edges, ...step.add];
    if (!step.ask || step.add) frames.push({ edges, ...shown });
  }
  return frames;
}

// The adjacency list of the edges on screen: each edge adds its end to the list of its start, and
// in an undirected graph its start to the list of its end too
export function adjacency(n: number, edges: Edge[], directed: boolean): Edge[][] {
  const lists: Edge[][] = Array.from({ length: n }, () => []);
  for (const edge of edges) {
    const [u, v, w] = edge;
    lists[u].push(edge);
    if (!directed) lists[v].push(w === undefined ? [v, u] : [v, u, w]);
  }
  return lists;
}
