import { isCaption, isRecord, parseQuestion, type Question } from './checks';

// A ```visual fence of type "boxes" draws named boxes in a row with arrows between them: a
// variable holding a value, a pointer holding an arrow to another box (or the null word, "NULL"
// unless the fence names another), or a node of two fields stacked, such as a linked list's data
// over its next. The boxes are listed in the order they stand. One not shown yet keeps its place
// empty, so the row doesn't shift as boxes come, and a removed one gives its place up. Each step
// can show boxes, set a value, point an arrow somewhere else and remove boxes (in that order),
// highlight some (focus) and ask a question first, with a title kept like an array's pass. A box
// is addressed by its id, a node's field by "id.field". Anything that doesn't fit, or an arrow left
// on screen pointing at a box that isn't, comes back null.

export type BoxValue = number | string;

export type Cell = { name?: string } & ({ value: BoxValue } | { to: string | null });

export interface Box {
  id: string;
  name?: string;
  shown: boolean;
  cells: Cell[];
}

interface BoxesStep {
  title?: string;
  focus?: string[];
  ask?: string;
  question?: Question;
  show?: string[];
  set?: Record<string, BoxValue>;
  point?: Record<string, string | null>;
  remove?: string[];
  caption: string;
}

export interface BoxesVisual {
  type: 'boxes';
  caption: string;
  null: string;
  boxes: Box[];
  steps: BoxesStep[];
}

const ID = /^[A-Za-z_][\w-]*$/;

const isId = (value: unknown): value is string => typeof value === 'string' && ID.test(value);

const isValue = (value: unknown): value is BoxValue =>
  typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));

// A cell holds a value or an arrow, never both
function parseCell(raw: Record<string, unknown>, name?: string): Cell | null {
  const named = name === undefined ? {} : { name };
  if ('value' in raw === 'to' in raw) return null;
  if ('value' in raw) return isValue(raw.value) ? { ...named, value: raw.value } : null;
  return raw.to === null || isId(raw.to) ? { ...named, to: raw.to } : null;
}

function parseBox(raw: unknown): Box | null {
  if (!isRecord(raw) || !isId(raw.id)) return null;
  if (raw.shown !== undefined && typeof raw.shown !== 'boolean') return null;
  const box = { id: raw.id, shown: raw.shown === true };
  if (raw.fields === undefined) {
    if (raw.name !== undefined && !isCaption(raw.name)) return null;
    const cell = parseCell(raw);
    if (!cell) return null;
    return raw.name === undefined
      ? { ...box, cells: [cell] }
      : { ...box, name: raw.name, cells: [cell] };
  }
  // A node: two fields, stacked, each named as in the code; the names stand in for a box's name
  const { fields } = raw;
  if (raw.name !== undefined || 'value' in raw || 'to' in raw) return null;
  if (!Array.isArray(fields) || fields.length !== 2) return null;
  const cells: Cell[] = [];
  for (const field of fields) {
    if (!isRecord(field) || !isId(field.name)) return null;
    const cell = parseCell(field, field.name);
    if (!cell) return null;
    cells.push(cell);
  }
  if (cells[0].name === cells[1].name) return null;
  return { ...box, cells };
}

// Where an address leads: a box of one cell by its id, a node's field by "id.field"
export function findCell(boxes: Box[], address: string): [number, number] | null {
  const [id, field, ...rest] = address.split('.');
  if (rest.length > 0) return null;
  const b = boxes.findIndex((box) => box.id === id);
  if (b < 0) return null;
  const { cells } = boxes[b];
  const c =
    field === undefined
      ? cells.length === 1
        ? 0
        : -1
      : cells.findIndex((cell) => cell.name === field);
  return c < 0 ? null : [b, c];
}

function idList(raw: unknown, ids: Set<string>): string[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  if (!raw.every((id) => typeof id === 'string' && ids.has(id))) return null;
  return new Set(raw).size === raw.length ? [...raw] : null;
}

function parseStep(raw: unknown, boxes: Box[]): BoxesStep | null {
  if (!isRecord(raw) || !isCaption(raw.caption)) return null;
  const ids = new Set(boxes.map((box) => box.id));
  const step: BoxesStep = { caption: raw.caption };
  for (const key of ['title', 'ask'] as const) {
    const value = raw[key];
    if (value === undefined) continue;
    if (!isCaption(value)) return null;
    step[key] = value;
  }
  const question = parseQuestion(raw, step.ask);
  if (question === null) return null;
  if (question) step.question = question;
  for (const key of ['focus', 'show', 'remove'] as const) {
    if (raw[key] === undefined) continue;
    const list = idList(raw[key], ids);
    if (!list) return null;
    step[key] = list;
  }
  if (raw.set !== undefined) {
    const { set } = raw;
    if (!isRecord(set) || Object.keys(set).length === 0) return null;
    const values: Record<string, BoxValue> = {};
    for (const [address, value] of Object.entries(set)) {
      const at = findCell(boxes, address);
      if (!at || !('value' in boxes[at[0]].cells[at[1]]) || !isValue(value)) return null;
      values[address] = value;
    }
    step.set = values;
  }
  if (raw.point !== undefined) {
    const { point } = raw;
    if (!isRecord(point) || Object.keys(point).length === 0) return null;
    const arrows: Record<string, string | null> = {};
    for (const [address, to] of Object.entries(point)) {
      const at = findCell(boxes, address);
      if (!at || !('to' in boxes[at[0]].cells[at[1]])) return null;
      if (to !== null && !(typeof to === 'string' && ids.has(to))) return null;
      arrows[address] = to;
    }
    step.point = arrows;
  }
  return step;
}

// Plays the steps through: a box comes once and goes once, only a box on screen changes, and
// every arrow on screen lands on a box that is there
function holds(boxes: Box[], steps: BoxesStep[]): boolean {
  const ids = new Set(boxes.map((box) => box.id));
  const place = new Map(boxes.map((box) => [box.id, box.shown ? 'shown' : 'hidden']));
  const arrows = new Map<string, string | null>();
  for (const box of boxes) {
    for (const cell of box.cells) {
      if (!('to' in cell)) continue;
      if (cell.to !== null && !ids.has(cell.to)) return false;
      arrows.set(cell.name === undefined ? box.id : `${box.id}.${cell.name}`, cell.to);
    }
  }
  const landed = () =>
    [...arrows].every(([address, to]) => {
      const from = address.split('.')[0];
      return place.get(from) !== 'shown' || to === null || place.get(to) === 'shown';
    });
  if (!landed()) return false;
  for (const step of steps) {
    for (const id of step.show ?? []) {
      if (place.get(id) !== 'hidden') return false;
      place.set(id, 'shown');
    }
    const writes = [...Object.keys(step.set ?? {}), ...Object.keys(step.point ?? {})];
    if (writes.some((address) => place.get(address.split('.')[0]) !== 'shown')) return false;
    for (const [address, to] of Object.entries(step.point ?? {})) arrows.set(address, to);
    for (const id of step.remove ?? []) {
      if (place.get(id) !== 'shown') return false;
      place.set(id, 'removed');
    }
    if (!landed()) return false;
  }
  return true;
}

export function parseBoxes(raw: Record<string, unknown>): BoxesVisual | null {
  if (!isCaption(raw.caption)) return null;
  if (raw.null !== undefined && !isCaption(raw.null)) return null;
  const { boxes: rawBoxes, steps: rawSteps } = raw;
  if (!Array.isArray(rawBoxes) || rawBoxes.length === 0) return null;
  const boxes: Box[] = [];
  for (const rawBox of rawBoxes) {
    const box = parseBox(rawBox);
    if (!box) return null;
    boxes.push(box);
  }
  if (new Set(boxes.map((box) => box.id)).size !== boxes.length) return null;
  if (!Array.isArray(rawSteps) || rawSteps.length === 0) return null;
  const steps: BoxesStep[] = [];
  for (const rawStep of rawSteps) {
    const step = parseStep(rawStep, boxes);
    if (!step) return null;
    steps.push(step);
  }
  if (!holds(boxes, steps)) return null;
  return { type: 'boxes', caption: raw.caption, null: raw.null ?? 'NULL', boxes, steps };
}
