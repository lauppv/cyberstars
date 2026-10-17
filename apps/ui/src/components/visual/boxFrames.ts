import type { Question } from './checks';
import { findCell, type BoxValue, type BoxesVisual, type Cell } from './parseBoxes';

// What the boxes look like at one step: where each box is (not there yet, on screen, or removed),
// what its cells hold, which boxes are highlighted, and the words under them. Like an array's
// frames, a step that asks a question shows it with its answer before anything changes; what it
// changes comes on the next frame
type BoxPlace = 'hidden' | 'shown' | 'removed';

export interface BoxesFrame {
  places: BoxPlace[];
  cells: Cell[][];
  focus: string[];
  title: string | null;
  ask: string | null;
  question: Question | null;
  caption: string;
}

type Write = { value: BoxValue } | { to: string | null };

export function boxFrames(visual: BoxesVisual): BoxesFrame[] {
  const { boxes } = visual;
  const index = (id: string) => boxes.findIndex((box) => box.id === id);
  let places: BoxPlace[] = boxes.map((box) => (box.shown ? 'shown' : 'hidden'));
  let cells = boxes.map((box) => box.cells);
  let title: string | null = null;
  const frames: BoxesFrame[] = [
    { places, cells, focus: [], title, ask: null, question: null, caption: visual.caption },
  ];
  for (const step of visual.steps) {
    if (step.title !== undefined) title = step.title;
    const focus = step.focus ?? [];
    const ask = step.ask ?? null;
    const question = step.question ?? null;
    const { caption } = step;
    if (ask) frames.push({ places, cells, focus, title, ask, question, caption });
    const writes = [
      ...Object.entries(step.set ?? {}).map(([a, value]): [string, Write] => [a, { value }]),
      ...Object.entries(step.point ?? {}).map(([a, to]): [string, Write] => [a, { to }]),
    ];
    if (writes.length > 0) {
      cells = [...cells];
      for (const [address, write] of writes) {
        const [b, c] = findCell(boxes, address)!;
        cells[b] = cells[b].map((cell, i) =>
          i !== c ? cell : cell.name === undefined ? write : { name: cell.name, ...write },
        );
      }
    }
    if (step.show || step.remove) {
      places = [...places];
      for (const id of step.show ?? []) places[index(id)] = 'shown';
      for (const id of step.remove ?? []) places[index(id)] = 'removed';
    }
    if (!ask || writes.length > 0 || step.show || step.remove) {
      frames.push({ places, cells, focus, title, ask, question, caption });
    }
  }
  return frames;
}
