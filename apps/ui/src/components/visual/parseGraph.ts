import { isCaption, isRecord, parseRows, type ValueRow } from './checks';

// A ```visual fence of type "graph" draws a graph whose vertices stand where the fence puts them,
// so a graph looks the same every time. Vertex i is named i, as the lessons number them, and stands
// at `vertices[i]`, a column and a row on a grid of even steps (halves are fine). `edges` are on
// screen from the start, each [from, to], or [from, to, weight] in a weighted graph; with
// `directed: true` they have arrows. `list: true` shows the adjacency list under the graph and
// `matrix: true` the adjacency matrix, both made from the edges on screen, in the order they came.
// Each step can add edges and, for that step only, highlight vertices being dealt with (focus),
// found but not dealt with yet (seen) or done, light the edges it uses (and their places in the
// list and the matrix), put a short word by a vertex (tags), such as its distance, show rows of
// values under the graph, such as a queue or a stack, and a line of code. Like a tree's steps it
// can name its pass (title) and ask a question first. Anything that doesn't fit, such as an edge
// that runs through a vertex it doesn't join, comes back null.

const MAX_VERTICES = 10;
// How far a vertex can stand from the corner, in steps of the grid
const MAX_AT = 6;
// The least room between an edge and a vertex it doesn't join, in steps of the grid: more than the
// circle's radius, so the line never touches it
const CLEAR = 0.3;

export type Edge = [number, number] | [number, number, number];

interface GraphStep {
  title?: string;
  ask?: string;
  add?: Edge[];
  focus?: number[];
  seen?: number[];
  done?: number[];
  used?: [number, number][];
  tags?: Record<number, string>;
  rows?: ValueRow[];
  code?: string;
  caption: string;
}

export interface GraphVisual {
  type: 'graph';
  caption: string;
  directed: boolean;
  list: boolean;
  matrix: boolean;
  vertices: [number, number][];
  edges: Edge[];
  steps: GraphStep[];
}

// The same key for both ways of an edge, since a graph never has both: an undirected edge is one,
// and a directed graph with both would draw two arrows on one line
export const edgeKey = (u: number, v: number) => (u < v ? `${u}-${v}` : `${v}-${u}`);

function parseVertices(raw: unknown): [number, number][] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_VERTICES) return null;
  const at: [number, number][] = [];
  for (const spot of raw) {
    if (!Array.isArray(spot) || spot.length !== 2) return null;
    if (!spot.every((n) => typeof n === 'number' && n >= 0 && n <= MAX_AT && (n * 2) % 1 === 0)) {
      return null;
    }
    at.push([spot[0], spot[1]]);
  }
  return at;
}

const isVertex = (value: unknown, n: number): value is number =>
  Number.isInteger(value) && (value as number) >= 0 && (value as number) < n;

function vertexList(raw: unknown, n: number): number[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || !raw.every((v) => isVertex(v, n))) return null;
  return new Set(raw).size === raw.length ? [...raw] : null;
}

function parseEdge(raw: unknown, n: number): Edge | null {
  if (!Array.isArray(raw) || (raw.length !== 2 && raw.length !== 3)) return null;
  const [u, v, w] = raw;
  if (!isVertex(u, n) || !isVertex(v, n) || u === v) return null;
  if (raw.length === 2) return [u, v];
  return typeof w === 'number' && Number.isFinite(w) ? [u, v, w] : null;
}

function edgeList(raw: unknown, n: number): Edge[] | null {
  if (!Array.isArray(raw)) return null;
  const edges: Edge[] = [];
  for (const item of raw) {
    const edge = parseEdge(item, n);
    if (!edge) return null;
    edges.push(edge);
  }
  return edges;
}

function parseStep(raw: unknown, n: number): GraphStep | null {
  if (!isRecord(raw) || !isCaption(raw.caption)) return null;
  const step: GraphStep = { caption: raw.caption };
  for (const key of ['title', 'ask', 'code'] as const) {
    const value = raw[key];
    if (value === undefined) continue;
    if (!isCaption(value)) return null;
    step[key] = value;
  }
  for (const key of ['focus', 'seen', 'done'] as const) {
    if (raw[key] === undefined) continue;
    const list = vertexList(raw[key], n);
    if (!list) return null;
    step[key] = list;
  }
  if (raw.add !== undefined) {
    const add = edgeList(raw.add, n);
    if (!add || add.length === 0) return null;
    step.add = add;
  }
  if (raw.used !== undefined) {
    const used = edgeList(raw.used, n);
    if (!used || used.length === 0 || used.some((edge) => edge.length !== 2)) return null;
    step.used = used.map(([u, v]) => [u, v]);
  }
  if (raw.tags !== undefined) {
    if (!isRecord(raw.tags)) return null;
    const tags: Record<number, string> = {};
    for (const [key, text] of Object.entries(raw.tags)) {
      const vertex = /^\d+$/.test(key) ? Number(key) : NaN;
      if (!isVertex(vertex, n) || !isCaption(text)) return null;
      tags[vertex] = text;
    }
    if (Object.keys(tags).length === 0) return null;
    step.tags = tags;
  }
  if (raw.rows !== undefined) {
    const rows = parseRows(raw.rows);
    if (!rows) return null;
    step.rows = rows;
  }
  // A vertex is in one state at a time
  const states = [...(step.focus ?? []), ...(step.seen ?? []), ...(step.done ?? [])];
  if (new Set(states).size !== states.length) return null;
  return step;
}

// How far the point p is from the segment a b
function distance(p: [number, number], a: [number, number], b: [number, number]): number {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const t = Math.max(
    0,
    Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)),
  );
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

// Plays the steps through: an edge comes once, every edge or none has a weight, no edge runs
// through a vertex it doesn't join, and a step only uses edges on screen after it, the way they
// go in a directed graph
function holds(visual: Omit<GraphVisual, 'type' | 'caption' | 'list' | 'matrix'>): boolean {
  const { vertices, directed } = visual;
  const apart = vertices.every((a, i) =>
    vertices.every((b, j) => j <= i || Math.hypot(a[0] - b[0], a[1] - b[1]) >= 2 * CLEAR),
  );
  if (!apart) return false;
  const all = [...visual.edges, ...visual.steps.flatMap((step) => step.add ?? [])];
  if (all.length > 0 && !all.every((edge) => edge.length === all[0].length)) return false;
  const clear = all.every(([u, v]) =>
    vertices.every((p, w) => w === u || w === v || distance(p, vertices[u], vertices[v]) >= CLEAR),
  );
  if (!clear) return false;
  const there = new Map<string, Edge>();
  const add = (edges: Edge[]) =>
    edges.every((edge) => {
      const key = edgeKey(edge[0], edge[1]);
      if (there.has(key)) return false;
      there.set(key, edge);
      return true;
    });
  if (!add(visual.edges)) return false;
  for (const step of visual.steps) {
    if (!add(step.add ?? [])) return false;
    for (const [u, v] of step.used ?? []) {
      const edge = there.get(edgeKey(u, v));
      if (!edge || (directed && edge[0] !== u)) return false;
    }
  }
  return true;
}

export function parseGraph(raw: Record<string, unknown>): GraphVisual | null {
  if (!isCaption(raw.caption)) return null;
  for (const key of ['directed', 'list', 'matrix'] as const) {
    if (raw[key] !== undefined && typeof raw[key] !== 'boolean') return null;
  }
  const vertices = parseVertices(raw.vertices);
  if (!vertices) return null;
  const n = vertices.length;
  const edges = raw.edges === undefined ? [] : edgeList(raw.edges, n);
  if (!edges) return null;
  if (!Array.isArray(raw.steps) || raw.steps.length === 0) return null;
  const steps: GraphStep[] = [];
  for (const rawStep of raw.steps) {
    const step = parseStep(rawStep, n);
    if (!step) return null;
    steps.push(step);
  }
  const directed = raw.directed === true;
  if (!holds({ vertices, edges, steps, directed })) return null;
  return {
    type: 'graph',
    caption: raw.caption,
    directed,
    list: raw.list === true,
    matrix: raw.matrix === true,
    vertices,
    edges,
    steps,
  };
}
