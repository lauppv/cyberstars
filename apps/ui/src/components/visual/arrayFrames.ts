import type { Question } from './checks';
import type { ArrayVisual, MarkerPlaces } from './parseVisual';

// What the array looks like at one step: which box stands at each position (a box keeps the
// id of the position it started at, so a swap slides it), the positions compared, where the
// sorted end begins (the array's length while nothing is sorted), the positions done, where each
// marker stands, the range still in play (null while all of it is) and the words under it. A step
// that asks a question shows it with its answer before anything moves; its swap, sorted end, done
// positions, marker moves and range come on the next frame, so the student knows what is about to
// change. Its markers' places (at) are where the variables stand while it asks, so they come at once
export interface ArrayFrame {
  order: number[];
  compared: number[] | null;
  sortedFrom: number;
  done: number[];
  at: MarkerPlaces;
  range: [number, number] | null;
  title: string | null;
  ask: string | null;
  question: Question | null;
  caption: string;
}

export function arrayFrames(visual: ArrayVisual): ArrayFrame[] {
  let order = visual.values.map((_, i) => i);
  let sortedFrom = visual.values.length;
  let done: number[] = [];
  let at: MarkerPlaces = (visual.markers ?? []).map(() => null);
  let range: [number, number] | null = null;
  let title: string | null = null;
  const frames: ArrayFrame[] = [
    {
      order,
      compared: null,
      sortedFrom,
      done,
      at,
      range,
      title,
      ask: null,
      question: null,
      caption: visual.caption,
    },
  ];
  for (const step of visual.steps) {
    if (step.title !== undefined) title = step.title;
    if (step.at) at = step.at;
    const compared = step.compare ?? null;
    const ask = step.ask ?? null;
    const question = step.question ?? null;
    const caption = step.caption;
    const frame = () => ({
      order,
      compared,
      sortedFrom,
      done,
      at,
      range,
      title,
      ask,
      question,
      caption,
    });
    if (ask) frames.push(frame());
    const moves =
      step.swap ||
      step.sorted !== undefined ||
      step.done !== undefined ||
      step.move !== undefined ||
      step.range !== undefined;
    if (step.swap && step.compare?.length === 2) {
      const [a, b] = step.compare;
      order = [...order];
      [order[a], order[b]] = [order[b], order[a]];
    }
    if (step.sorted !== undefined) sortedFrom = step.sorted;
    if (step.done) done = step.done;
    if (step.move) at = step.move;
    if (step.range) range = step.range;
    if (!ask || moves) frames.push(frame());
  }
  return frames;
}
