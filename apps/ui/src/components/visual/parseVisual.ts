// A lesson's ```visual fence holds JSON: the array it starts from, a short word on how the
// algorithm works, and the hand-written steps. Each step can compare one or two boxes (asking a
// question about them first), swap two, mark the end sorted from a position on and mark any
// positions done; a title, such as the pass, stays up until another step changes it. Two optional
// pointer labels sit under the two boxes a step compares, such as "j = {i}" and "j + 1" for the
// loop's index ({i} is the box's position). Markers are named variables, such as "left = {i}",
// each on its own row under the array: a step puts them at positions (null hides one) while it
// asks, and moves them after the answer; it can also keep a range in play, fading the boxes
// outside it. Markers, the range and the done positions stay until a step changes them. Anything
// that doesn't fit comes back null, and the fence shows as plain text. A
// fence of type "boxes" draws boxes and arrows instead, see parseBoxes, one of type "tree" a binary
// tree, see parseTree, one of type "graph" a graph, see parseGraph, and one of type "grid" a grid
// of cells, see parseGrid. Any of them can carry an id, which keeps the step the student is on when
// the lesson's text comes back in another programming language.

import { isCaption, isRecord } from './checks';
import { parseBoxes, type BoxesVisual } from './parseBoxes';
import { parseTree, type TreeVisual } from './parseTree';
import { parseGraph, type GraphVisual } from './parseGraph';
import { parseGrid, type GridVisual } from './parseGrid';

// Where each marker stands, by its place in the visual's list of markers
export type MarkerPlaces = (number | null)[];

interface ArrayStep {
  title?: string;
  compare?: [number] | [number, number];
  ask?: string;
  swap?: boolean;
  sorted?: number;
  at?: MarkerPlaces;
  move?: MarkerPlaces;
  range?: [number, number];
  done?: number[];
  caption: string;
}

export interface ArrayVisual {
  type: 'array';
  values: (number | string)[];
  caption: string;
  pointers?: [string, string];
  markers?: string[];
  steps: ArrayStep[];
}

export type Visual = (ArrayVisual | BoxesVisual | TreeVisual | GraphVisual | GridVisual) & {
  id?: string;
};

const PARSERS: Record<string, (raw: Record<string, unknown>) => Visual | null> = {
  boxes: parseBoxes,
  tree: parseTree,
  graph: parseGraph,
  grid: parseGrid,
};

function isIndex(value: unknown, length: number): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) < length;
}

// A place for every marker, each a position or null
function parsePlaces(raw: unknown, length: number, markers: number): MarkerPlaces | null {
  if (!Array.isArray(raw) || raw.length !== markers || markers === 0) return null;
  return raw.every((place) => place === null || isIndex(place, length)) ? [...raw] : null;
}

function parseStep(raw: unknown, length: number, markers: number): ArrayStep | null {
  if (!isRecord(raw) || !isCaption(raw.caption)) return null;
  const step: ArrayStep = { caption: raw.caption };
  if (raw.title !== undefined) {
    if (!isCaption(raw.title)) return null;
    step.title = raw.title;
  }
  if (raw.compare !== undefined) {
    const boxes = raw.compare;
    if (
      !Array.isArray(boxes) ||
      boxes.length < 1 ||
      boxes.length > 2 ||
      !boxes.every((box) => isIndex(box, length)) ||
      boxes[0] === boxes[1]
    ) {
      return null;
    }
    step.compare = boxes.length === 1 ? [boxes[0]] : [boxes[0], boxes[1]];
  }
  if (raw.ask !== undefined) {
    // The question is about the two boxes the step compares
    if (!isCaption(raw.ask) || !step.compare) return null;
    step.ask = raw.ask;
  }
  if (raw.swap !== undefined) {
    // A swap moves the two boxes the step compares, so it needs them
    if (raw.swap !== true || step.compare?.length !== 2) return null;
    step.swap = true;
  }
  if (raw.sorted !== undefined) {
    if (
      !Number.isInteger(raw.sorted) ||
      (raw.sorted as number) < 0 ||
      (raw.sorted as number) > length
    )
      return null;
    step.sorted = raw.sorted as number;
  }
  for (const key of ['at', 'move'] as const) {
    if (raw[key] === undefined) continue;
    const places = parsePlaces(raw[key], length, markers);
    if (!places) return null;
    step[key] = places;
  }
  if (raw.range !== undefined) {
    // From the first position in play to the last; a first past the last leaves none in play
    const range = raw.range;
    if (!Array.isArray(range) || range.length !== 2 || !range.every((i) => isIndex(i, length))) {
      return null;
    }
    step.range = [range[0], range[1]];
  }
  if (raw.done !== undefined) {
    const done = raw.done;
    if (!Array.isArray(done) || !done.every((i) => isIndex(i, length))) return null;
    step.done = [...done];
  }
  return step;
}

export function parseVisual(source: string): Visual | null {
  let raw: unknown;
  try {
    raw = JSON.parse(source);
  } catch {
    return null;
  }
  if (!isRecord(raw)) return null;
  const parse =
    typeof raw.type === 'string' && Object.hasOwn(PARSERS, raw.type)
      ? PARSERS[raw.type]
      : parseArray;
  const visual = parse(raw);
  if (!visual || raw.id === undefined) return visual;
  return isCaption(raw.id) ? { ...visual, id: raw.id } : null;
}

function parseArray(raw: Record<string, unknown>): ArrayVisual | null {
  if (raw.type !== 'array' || !isCaption(raw.caption)) return null;
  const { values, steps } = raw;
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    !values.every((v) => typeof v === 'string' || (typeof v === 'number' && Number.isFinite(v)))
  ) {
    return null;
  }
  if (!Array.isArray(steps) || steps.length === 0) return null;
  const { pointers } = raw;
  if (
    pointers !== undefined &&
    (!Array.isArray(pointers) || pointers.length !== 2 || !pointers.every(isCaption))
  ) {
    return null;
  }
  const { markers } = raw;
  if (
    markers !== undefined &&
    (!Array.isArray(markers) || markers.length === 0 || !markers.every(isCaption))
  ) {
    return null;
  }
  const parsed: ArrayStep[] = [];
  for (const step of steps) {
    const ok = parseStep(step, values.length, markers?.length ?? 0);
    if (!ok) return null;
    parsed.push(ok);
  }
  const visual: ArrayVisual = { type: 'array', values, caption: raw.caption, steps: parsed };
  if (pointers) visual.pointers = [pointers[0], pointers[1]];
  if (markers) visual.markers = [...markers];
  return visual;
}
