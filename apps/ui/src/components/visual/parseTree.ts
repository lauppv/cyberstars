import { isCaption, isRecord, parseRows, type ValueRow } from './checks';
import type { BoxValue } from './parseBoxes';

// A ```visual fence of type "tree" draws a binary tree. A node is named by its place, numbered
// level by level from 0 at the root, so the children of place i are 2i + 1 and 2i + 2, as in a
// heap; a node keeps its place on screen, so nothing moves when the tree grows. `nodes` is the tree
// it starts with (it can be empty); `array: true` also lays the tree out as a list under it, place
// by place, as a heap is stored. Each step can remove nodes, set a value, move a value to another
// node (its own node goes), swap two values and add nodes (in that order), and, for that step only,
// highlight nodes (focus), mark nodes done, light a path down from a node to one of its
// descendants, show a node's empty children with the null word ("null" unless the fence names
// another), put a short word by a node (tags), show rows of values under the tree, such as the
// visits so far or a queue, and a line of code. Like an array's steps it can name its pass (title)
// and ask a question first. Every node but the root hangs from its parent at every step. Anything
// that doesn't fit comes back null.

// Four levels below the root at most, so the bottom row still fits a phone
const MAX_PLACE = 30;

export type TreeRow = ValueRow;

interface TreeStep {
  title?: string;
  ask?: string;
  remove?: number[];
  set?: Record<number, BoxValue>;
  move?: [number, number];
  swap?: [number, number];
  add?: Record<number, BoxValue>;
  focus?: number[];
  done?: number[];
  path?: number[];
  nulls?: number[];
  tags?: Record<number, string>;
  rows?: TreeRow[];
  code?: string;
  caption: string;
}

export interface TreeVisual {
  type: 'tree';
  caption: string;
  null: string;
  array: boolean;
  nodes: Record<number, BoxValue>;
  steps: TreeStep[];
}

export const parentOf = (place: number) => Math.floor((place - 1) / 2);

const isPlace = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) >= 0 && (value as number) <= MAX_PLACE;

const isValue = (value: unknown): value is BoxValue =>
  typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));

// An object keyed by place, such as { "0": 8, "1": 3 }
function byPlace<T>(raw: unknown, ok: (value: unknown) => value is T): Record<number, T> | null {
  if (!isRecord(raw)) return null;
  const out: Record<number, T> = {};
  for (const [key, value] of Object.entries(raw)) {
    const place = /^\d+$/.test(key) ? Number(key) : NaN;
    if (!isPlace(place) || !ok(value)) return null;
    out[place] = value;
  }
  return out;
}

function places(raw: unknown): number[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || !raw.every(isPlace)) return null;
  return new Set(raw).size === raw.length ? [...raw] : null;
}

function parseStep(raw: unknown): TreeStep | null {
  if (!isRecord(raw) || !isCaption(raw.caption)) return null;
  const step: TreeStep = { caption: raw.caption };
  for (const key of ['title', 'ask', 'code'] as const) {
    const value = raw[key];
    if (value === undefined) continue;
    if (!isCaption(value)) return null;
    step[key] = value;
  }
  for (const key of ['remove', 'focus', 'done', 'path', 'nulls'] as const) {
    if (raw[key] === undefined) continue;
    const list = places(raw[key]);
    if (!list) return null;
    step[key] = list;
  }
  for (const key of ['set', 'add'] as const) {
    if (raw[key] === undefined) continue;
    const values = byPlace(raw[key], isValue);
    if (!values || Object.keys(values).length === 0) return null;
    step[key] = values;
  }
  if (raw.tags !== undefined) {
    const tags = byPlace(raw.tags, isCaption);
    if (!tags || Object.keys(tags).length === 0) return null;
    step.tags = tags;
  }
  for (const key of ['move', 'swap'] as const) {
    if (raw[key] === undefined) continue;
    const pair = places(raw[key]);
    if (!pair || pair.length !== 2) return null;
    step[key] = [pair[0], pair[1]];
  }
  if (raw.rows !== undefined) {
    const rows = parseRows(raw.rows);
    if (!rows) return null;
    step.rows = rows;
  }
  // A path goes down the tree, each node a child of the one before it
  if (step.path?.some((place, k) => k > 0 && parentOf(place) !== step.path![k - 1])) return null;
  return step;
}

// Plays the steps through: a node is added where there is none, changed or removed where there is
// one, every node hangs from its parent, and a step only points at nodes on screen after it
function holds(start: Record<number, BoxValue>, steps: TreeStep[]): boolean {
  const there = new Set(Object.keys(start).map(Number));
  const hangs = () => [...there].every((place) => place === 0 || there.has(parentOf(place)));
  if (!hangs()) return false;
  for (const step of steps) {
    for (const place of step.remove ?? []) if (!there.delete(place)) return false;
    const changed = [
      ...Object.keys(step.set ?? {}).map(Number),
      ...(step.move ?? []),
      ...(step.swap ?? []),
    ];
    if (changed.some((place) => !there.has(place))) return false;
    if (step.move) there.delete(step.move[0]);
    for (const place of Object.keys(step.add ?? {}).map(Number)) {
      if (there.has(place)) return false;
      there.add(place);
    }
    if (!hangs()) return false;
    const shown = [
      ...(step.focus ?? []),
      ...(step.done ?? []),
      ...(step.path ?? []),
      ...(step.nulls ?? []),
      ...Object.keys(step.tags ?? {}).map(Number),
    ];
    if (shown.some((place) => !there.has(place))) return false;
  }
  return true;
}

export function parseTree(raw: Record<string, unknown>): TreeVisual | null {
  if (!isCaption(raw.caption)) return null;
  if (raw.null !== undefined && !isCaption(raw.null)) return null;
  if (raw.array !== undefined && typeof raw.array !== 'boolean') return null;
  const nodes = byPlace(raw.nodes, isValue);
  if (!nodes) return null;
  if (!Array.isArray(raw.steps) || raw.steps.length === 0) return null;
  const steps: TreeStep[] = [];
  for (const rawStep of raw.steps) {
    const step = parseStep(rawStep);
    if (!step) return null;
    steps.push(step);
  }
  if (!holds(nodes, steps)) return null;
  return {
    type: 'tree',
    caption: raw.caption,
    null: raw.null ?? 'null',
    array: raw.array === true,
    nodes,
    steps,
  };
}
