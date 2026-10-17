import { isCaption, isRecord, parseRows, type ValueRow } from './checks';

// A ```visual fence of type "grid" draws a grid of cells, such as a maze: `cells` gives it row by
// row as text, "." for a free cell and "#" for a wall, the way a lesson's input does. A cell is
// named by its row and column, [r, c], from 0. Each step can write a value in free cells (set),
// which stays until another step writes over it, such as a distance, and, for that step only,
// highlight cells being dealt with (focus), found but not dealt with yet (seen) or done, show rows
// of values under the grid, such as a queue, and a line of code. Like a graph's steps it can name
// its pass (title) and ask a question first. Anything that doesn't fit, or that points at a wall
// or outside the grid, comes back null.

// Eight cells a side at most, so a cell is still big enough to read on a phone
const MAX_SIDE = 8;

export type Spot = [number, number];

interface GridStep {
  title?: string;
  ask?: string;
  set?: [number, number, number | string][];
  focus?: Spot[];
  seen?: Spot[];
  done?: Spot[];
  rows?: ValueRow[];
  code?: string;
  caption: string;
}

export interface GridVisual {
  type: 'grid';
  caption: string;
  cells: string[];
  steps: GridStep[];
}

export const spotKey = ([r, c]: Spot) => `${r},${c}`;

function parseCells(raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_SIDE) return null;
  if (!raw.every((row) => typeof row === 'string' && /^[.#]+$/.test(row))) return null;
  const width = (raw[0] as string).length;
  return width <= MAX_SIDE && raw.every((row) => row.length === width) ? [...raw] : null;
}

function parseStep(raw: unknown, cells: string[]): GridStep | null {
  if (!isRecord(raw) || !isCaption(raw.caption)) return null;
  const free = (r: unknown, c: unknown) =>
    Number.isInteger(r) && Number.isInteger(c) && cells[r as number]?.[c as number] === '.';
  const step: GridStep = { caption: raw.caption };
  for (const key of ['title', 'ask', 'code'] as const) {
    const value = raw[key];
    if (value === undefined) continue;
    if (!isCaption(value)) return null;
    step[key] = value;
  }
  for (const key of ['focus', 'seen', 'done'] as const) {
    const list = raw[key];
    if (list === undefined) continue;
    if (!Array.isArray(list) || list.length === 0) return null;
    const spots: Spot[] = [];
    for (const spot of list) {
      if (!Array.isArray(spot) || spot.length !== 2 || !free(spot[0], spot[1])) return null;
      spots.push([spot[0], spot[1]]);
    }
    step[key] = spots;
  }
  if (raw.set !== undefined) {
    const { set } = raw;
    if (!Array.isArray(set) || set.length === 0) return null;
    const values: [number, number, number | string][] = [];
    for (const item of set) {
      if (!Array.isArray(item) || item.length !== 3 || !free(item[0], item[1])) return null;
      const value: unknown = item[2];
      if (!isCaption(value) && !(typeof value === 'number' && Number.isFinite(value))) return null;
      values.push([item[0], item[1], value]);
    }
    step.set = values;
  }
  if (raw.rows !== undefined) {
    const rows = parseRows(raw.rows);
    if (!rows) return null;
    step.rows = rows;
  }
  // A cell is in one state at a time, and comes once in each list
  const states = [...(step.focus ?? []), ...(step.seen ?? []), ...(step.done ?? [])].map(spotKey);
  if (new Set(states).size !== states.length) return null;
  const set = (step.set ?? []).map(([r, c]) => spotKey([r, c]));
  return new Set(set).size === set.length ? step : null;
}

export function parseGrid(raw: Record<string, unknown>): GridVisual | null {
  if (!isCaption(raw.caption)) return null;
  const cells = parseCells(raw.cells);
  if (!cells) return null;
  if (!Array.isArray(raw.steps) || raw.steps.length === 0) return null;
  const steps: GridStep[] = [];
  for (const rawStep of raw.steps) {
    const step = parseStep(rawStep, cells);
    if (!step) return null;
    steps.push(step);
  }
  return { type: 'grid', caption: raw.caption, cells, steps };
}
