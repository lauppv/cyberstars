import { isCaption, isRecord } from './checks';
import type { BoxValue } from './parseBoxes';

// A ```visual fence of type "stack" draws a pile of cards, the newest on top, such as the calls
// waiting on each other in a recursion or the values pushed on a stack. A card has its text, such
// as "factorial(3)" or 20, and can have a line under it, such as the expression the call waits on.
// Each step can pop cards off the top, change a card's line and push new cards (in that order),
// and, for that step only, highlight cards (focus), mark cards done, which have their answer, and
// put a short word by a card (tags), such as "base case". Like the other visuals it can name its
// pass (title) and ask a question first. A card is named by an id, given when it is pushed and
// never given again. The stack can start with cards. Anything that doesn't fit, such as a pop of
// more cards than there are or a step naming a card that isn't on the stack, comes back null.

// Seven cards at most, so the pile still fits a phone's screen
const MAX_CARDS = 7;

export interface StackCard {
  id: string;
  text: BoxValue;
  line?: string;
}

interface StackStep {
  title?: string;
  ask?: string;
  pop?: number;
  set?: Record<string, string>;
  push?: StackCard[];
  focus?: string[];
  done?: string[];
  tags?: Record<string, string>;
  caption: string;
}

export interface StackVisual {
  type: 'stack';
  caption: string;
  cards: StackCard[];
  steps: StackStep[];
}

const ID = /^[A-Za-z_][\w-]*$/;

const isValue = (value: unknown): value is BoxValue =>
  isCaption(value) || (typeof value === 'number' && Number.isFinite(value));

function parseCard(raw: unknown): StackCard | null {
  if (!isRecord(raw) || typeof raw.id !== 'string' || !ID.test(raw.id) || !isValue(raw.text)) {
    return null;
  }
  const card: StackCard = { id: raw.id, text: raw.text };
  if (raw.line !== undefined) {
    if (!isCaption(raw.line)) return null;
    card.line = raw.line;
  }
  return card;
}

function parseCards(raw: unknown, used: Set<string>): StackCard[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const cards: StackCard[] = [];
  for (const item of raw) {
    const card = parseCard(item);
    if (!card || used.has(card.id)) return null;
    used.add(card.id);
    cards.push(card);
  }
  return cards;
}

// The cards on the stack before or after the step: a highlight or a tag can be on a card the step
// pops, as it leaves
function parseStep(raw: unknown, pile: string[], used: Set<string>): StackStep | null {
  if (!isRecord(raw) || !isCaption(raw.caption)) return null;
  const step: StackStep = { caption: raw.caption };
  for (const key of ['title', 'ask'] as const) {
    const value = raw[key];
    if (value === undefined) continue;
    if (!isCaption(value)) return null;
    step[key] = value;
  }
  const before = new Set(pile);
  if (raw.pop !== undefined) {
    const { pop } = raw;
    if (!Number.isInteger(pop) || (pop as number) < 1 || (pop as number) > pile.length) return null;
    step.pop = pop as number;
    pile.splice(pile.length - step.pop);
  }
  if (raw.set !== undefined) {
    const { set } = raw;
    if (!isRecord(set) || Object.keys(set).length === 0) return null;
    // A card's line changes while it is still on the stack
    for (const [id, line] of Object.entries(set)) {
      if (!pile.includes(id) || !isCaption(line)) return null;
    }
    step.set = set as Record<string, string>;
  }
  if (raw.push !== undefined) {
    const cards = parseCards(raw.push, used);
    if (!cards) return null;
    step.push = cards;
    pile.push(...cards.map((card) => card.id));
    if (pile.length > MAX_CARDS) return null;
  }
  const onStack = (id: unknown) => typeof id === 'string' && (before.has(id) || pile.includes(id));
  for (const key of ['focus', 'done'] as const) {
    const list = raw[key];
    if (list === undefined) continue;
    if (!Array.isArray(list) || list.length === 0 || !list.every(onStack)) return null;
    if (new Set(list).size !== list.length) return null;
    step[key] = [...list];
  }
  if (step.focus?.some((id) => step.done?.includes(id))) return null;
  if (raw.tags !== undefined) {
    const { tags } = raw;
    if (!isRecord(tags) || Object.keys(tags).length === 0) return null;
    for (const [id, word] of Object.entries(tags)) {
      if (!onStack(id) || !isCaption(word)) return null;
    }
    step.tags = tags as Record<string, string>;
  }
  return step;
}

export function parseStack(raw: Record<string, unknown>): StackVisual | null {
  if (!isCaption(raw.caption)) return null;
  const used = new Set<string>();
  // The stack can start empty, with no cards or an empty list
  let cards: StackCard[] = [];
  if (raw.cards !== undefined && !(Array.isArray(raw.cards) && raw.cards.length === 0)) {
    const parsed = parseCards(raw.cards, used);
    if (!parsed || parsed.length > MAX_CARDS) return null;
    cards = parsed;
  }
  if (!Array.isArray(raw.steps) || raw.steps.length === 0) return null;
  const pile = cards.map((card) => card.id);
  const steps: StackStep[] = [];
  for (const rawStep of raw.steps) {
    const step = parseStep(rawStep, pile, used);
    if (!step) return null;
    steps.push(step);
  }
  return { type: 'stack', caption: raw.caption, cards, steps };
}
