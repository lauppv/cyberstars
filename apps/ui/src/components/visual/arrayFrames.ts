import type { ArrayVisual } from './parseVisual';

// What the array looks like at one step: which box stands at each position (a box keeps the
// id of the position it started at, so a swap slides it), the two positions compared, and
// where the sorted end begins (the array's length while nothing is sorted)
export interface ArrayFrame {
  order: number[];
  compared: [number, number] | null;
  sortedFrom: number;
  caption: string;
}

export function arrayFrames(visual: ArrayVisual): ArrayFrame[] {
  let order = visual.values.map((_, i) => i);
  let sortedFrom = visual.values.length;
  const frames: ArrayFrame[] = [{ order, compared: null, sortedFrom, caption: visual.caption }];
  for (const step of visual.steps) {
    if (step.swap && step.compare) {
      const [a, b] = step.compare;
      order = [...order];
      [order[a], order[b]] = [order[b], order[a]];
    }
    if (step.sorted !== undefined) sortedFrom = step.sorted;
    frames.push({ order, compared: step.compare ?? null, sortedFrom, caption: step.caption });
  }
  return frames;
}
