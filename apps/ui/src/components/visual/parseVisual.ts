// A lesson's ```visual fence holds JSON: the array it starts from, a short word on how the
// algorithm works, and the hand-written steps. Each step can compare two boxes (asking a question
// about them first), swap them and mark the end sorted from a position on; a title, such as the
// pass, stays up until another step changes it. Two optional pointer labels sit under the two
// boxes a step compares, such as "j = {i}" and "j + 1" for the loop's index ({i} is the box's
// position). Anything that doesn't fit comes back null, and the fence shows as plain text. A
// fence of type "boxes" draws boxes and arrows instead, see parseBoxes, and one of type "tree" a
// binary tree, see parseTree. Any of them can carry an id, which keeps the step the student is on
// when the lesson's text comes back in another programming language.

import { isCaption, isRecord } from './checks';
import { parseBoxes, type BoxesVisual } from './parseBoxes';
import { parseTree, type TreeVisual } from './parseTree';

interface ArrayStep {
  title?: string;
  compare?: [number, number];
  ask?: string;
  swap?: boolean;
  sorted?: number;
  caption: string;
}

export interface ArrayVisual {
  type: 'array';
  values: (number | string)[];
  caption: string;
  pointers?: [string, string];
  steps: ArrayStep[];
}

export type Visual = (ArrayVisual | BoxesVisual | TreeVisual) & { id?: string };

function isIndex(value: unknown, length: number): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) < length;
}

function parseStep(raw: unknown, length: number): ArrayStep | null {
  if (!isRecord(raw) || !isCaption(raw.caption)) return null;
  const step: ArrayStep = { caption: raw.caption };
  if (raw.title !== undefined) {
    if (!isCaption(raw.title)) return null;
    step.title = raw.title;
  }
  if (raw.compare !== undefined) {
    const pair = raw.compare;
    if (
      !Array.isArray(pair) ||
      pair.length !== 2 ||
      !isIndex(pair[0], length) ||
      !isIndex(pair[1], length) ||
      pair[0] === pair[1]
    ) {
      return null;
    }
    step.compare = [pair[0], pair[1]];
  }
  if (raw.ask !== undefined) {
    // The question is about the two boxes the step compares
    if (!isCaption(raw.ask) || !step.compare) return null;
    step.ask = raw.ask;
  }
  if (raw.swap !== undefined) {
    // A swap moves the two boxes the step compares, so it needs them
    if (raw.swap !== true || !step.compare) return null;
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
  const visual =
    raw.type === 'boxes' ? parseBoxes(raw) : raw.type === 'tree' ? parseTree(raw) : parseArray(raw);
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
  const parsed: ArrayStep[] = [];
  for (const step of steps) {
    const ok = parseStep(step, values.length);
    if (!ok) return null;
    parsed.push(ok);
  }
  const visual: ArrayVisual = { type: 'array', values, caption: raw.caption, steps: parsed };
  if (pointers) visual.pointers = [pointers[0], pointers[1]];
  return visual;
}
