import type { Question } from './checks';
import type { StackCard, StackVisual } from './parseStack';

// What the stack looks like at one step: its cards from the bottom up (a queue's from the front), each with its line as it
// stands, and what the step highlights. Like the other frames, a step that asks a question shows it
// with its answer before anything changes; its pops, lines and pushes come on the next frame, with
// the same highlights
export interface StackFrame {
  cards: StackCard[];
  focus: string[];
  done: string[];
  tags: Record<string, string>;
  title: string | null;
  ask: string | null;
  question: Question | null;
  caption: string;
}

export function stackFrames(visual: StackVisual): StackFrame[] {
  let cards = visual.cards;
  let title: string | null = null;
  const frames: StackFrame[] = [
    {
      cards,
      focus: [],
      done: [],
      tags: {},
      title,
      ask: null,
      question: null,
      caption: visual.caption,
    },
  ];
  for (const step of visual.steps) {
    if (step.title !== undefined) title = step.title;
    const shown = {
      focus: step.focus ?? [],
      done: step.done ?? [],
      tags: step.tags ?? {},
      title,
      ask: step.ask ?? null,
      question: step.question ?? null,
      caption: step.caption,
    };
    if (step.ask) frames.push({ cards, ...shown });
    const changes = step.pop !== undefined || step.set !== undefined || step.push !== undefined;
    if (changes) {
      const { set = {} } = step;
      const pop = step.pop ?? 0;
      // A stack's cards leave from the top, the end of the list; a queue's from the front
      cards = (visual.queue ? cards.slice(pop) : cards.slice(0, cards.length - pop))
        .map((card) => (Object.hasOwn(set, card.id) ? { ...card, line: set[card.id] } : card))
        .concat(step.push ?? []);
    }
    if (!step.ask || changes) frames.push({ cards, ...shown });
  }
  return frames;
}
