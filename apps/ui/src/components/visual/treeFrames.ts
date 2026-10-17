import type { Question } from './checks';
import type { BoxValue } from './parseBoxes';
import type { TreeRow, TreeVisual } from './parseTree';

// What the tree looks like at one step: the value at each place, with an id that follows the value
// when a swap or a move carries it (a value that is set anew gets a new one), and what the step
// highlights.
// Like an array's frames, a step that asks a question shows it with its answer before the tree
// changes; the change comes on the next frame, with the same highlights
interface TreeValue {
  id: number;
  value: BoxValue;
}

export interface TreeFrame {
  nodes: Record<number, TreeValue>;
  focus: number[];
  done: number[];
  path: number[];
  nulls: number[];
  tags: Record<number, string>;
  rows: TreeRow[];
  code: string | null;
  title: string | null;
  ask: string | null;
  question: Question | null;
  caption: string;
}

export function treeFrames(visual: TreeVisual): TreeFrame[] {
  let next = 0;
  const fresh = (value: BoxValue): TreeValue => ({ id: next++, value });
  let nodes: Record<number, TreeValue> = {};
  for (const [place, value] of Object.entries(visual.nodes)) nodes[Number(place)] = fresh(value);
  let title: string | null = null;
  const frames: TreeFrame[] = [
    {
      nodes,
      focus: [],
      done: [],
      path: [],
      nulls: [],
      tags: {},
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
      done: step.done ?? [],
      path: step.path ?? [],
      nulls: step.nulls ?? [],
      tags: step.tags ?? {},
      rows: step.rows ?? [],
      code: step.code ?? null,
      title,
      ask: step.ask ?? null,
      question: step.question ?? null,
      caption: step.caption,
    };
    if (step.ask) frames.push({ nodes, ...shown });
    const changes = step.remove || step.set || step.move || step.swap || step.add;
    if (changes) {
      nodes = { ...nodes };
      for (const place of step.remove ?? []) delete nodes[place];
      for (const [place, value] of Object.entries(step.set ?? {})) {
        nodes[Number(place)] = fresh(value);
      }
      if (step.move) {
        const [source, target] = step.move;
        nodes[target] = nodes[source];
        delete nodes[source];
      }
      if (step.swap) {
        const [a, b] = step.swap;
        [nodes[a], nodes[b]] = [nodes[b], nodes[a]];
      }
      for (const [place, value] of Object.entries(step.add ?? {})) {
        nodes[Number(place)] = fresh(value);
      }
    }
    if (!step.ask || changes) frames.push({ nodes, ...shown });
  }
  return frames;
}
