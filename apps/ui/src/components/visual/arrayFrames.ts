import type { ArrayVisual } from './parseVisual';

// What the array looks like at one step: which box stands at each position (a box keeps the
// id of the position it started at, so a swap slides it), the two positions compared, where the
// sorted end begins (the array's length while nothing is sorted), and the words under it. A step
// that asks a question shows it with its answer before anything moves; its swap, or its sorted
// end, comes on the next frame, so the student knows what is about to change
export interface ArrayFrame {
  order: number[];
  compared: [number, number] | null;
  sortedFrom: number;
  title: string | null;
  ask: string | null;
  caption: string;
}

export function arrayFrames(visual: ArrayVisual): ArrayFrame[] {
  let order = visual.values.map((_, i) => i);
  let sortedFrom = visual.values.length;
  let title: string | null = null;
  const frames: ArrayFrame[] = [
    { order, compared: null, sortedFrom, title, ask: null, caption: visual.caption },
  ];
  for (const step of visual.steps) {
    if (step.title !== undefined) title = step.title;
    const compared = step.compare ?? null;
    const ask = step.ask ?? null;
    const caption = step.caption;
    if (ask) frames.push({ order, compared, sortedFrom, title, ask, caption });
    if (step.swap && step.compare) {
      const [a, b] = step.compare;
      order = [...order];
      [order[a], order[b]] = [order[b], order[a]];
    }
    if (step.sorted !== undefined) sortedFrom = step.sorted;
    if (!ask || step.swap || step.sorted !== undefined) {
      frames.push({ order, compared, sortedFrom, title, ask, caption });
    }
  }
  return frames;
}
