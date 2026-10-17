import type { Question, ValueRow } from './checks';
import { spotKey, type GridVisual, type Spot } from './parseGrid';

// What the grid looks like at one step: the value written in each cell, by "r,c", and what the
// step highlights. Like a graph's frames, a step that asks a question shows it with its answer
// before its values are written; they come on the next frame, with the same highlights
export interface GridFrame {
  values: Record<string, number | string>;
  focus: Spot[];
  seen: Spot[];
  done: Spot[];
  rows: ValueRow[];
  code: string | null;
  title: string | null;
  ask: string | null;
  question: Question | null;
  caption: string;
}

export function gridFrames(visual: GridVisual): GridFrame[] {
  let values: Record<string, number | string> = {};
  let title: string | null = null;
  const frames: GridFrame[] = [
    {
      values,
      focus: [],
      seen: [],
      done: [],
      rows: [],
      code: null,
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
      seen: step.seen ?? [],
      done: step.done ?? [],
      rows: step.rows ?? [],
      code: step.code ?? null,
      title,
      ask: step.ask ?? null,
      question: step.question ?? null,
      caption: step.caption,
    };
    if (step.ask) frames.push({ values, ...shown });
    if (step.set) {
      values = { ...values };
      for (const [r, c, value] of step.set) values[spotKey([r, c])] = value;
    }
    if (!step.ask || step.set) frames.push({ values, ...shown });
  }
  return frames;
}
