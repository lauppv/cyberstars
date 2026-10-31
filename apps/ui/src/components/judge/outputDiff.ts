import { diffArrays, diffChars } from 'diff';

// A run of characters in one output line, marked when it differs from the
// other output.
export interface Piece {
  text: string;
  marked: boolean;
}

export interface OutputDiff {
  /** Expected output, line by line: marked where the student's output misses it. */
  expected: Piece[][];
  /** The student's output, line by line: marked where it is wrong or extra. */
  actual: Piece[][];
}

// A test keeps up to 1 MB per output. Past this size the outputs show as plain
// text: the diff would cost more than it helps, and freeze the tab.
const MAX_CHARS = 50_000;
// One budget for the whole diff, lines and characters, so a long output whose
// every line differs can't stack up one timeout per line.
const BUDGET_MS = 100;

// Lines that match stay plain. A line missing or extra is marked whole; a line
// that differs is paired with its counterpart and marked character by character,
// so `Plauer` against `Player` marks just the `u` and the `y`. Null when the
// outputs are too large or the diff runs out of time: show them as plain text.
export function diffOutputs(
  expected: string,
  actual: string,
  budgetMs = BUDGET_MS,
): OutputDiff | null {
  if (expected.length + actual.length > MAX_CHARS) return null;
  const deadline = performance.now() + budgetMs;
  const timeout = () => Math.max(0, deadline - performance.now());
  if (timeout() === 0) return null;

  const lines = diffArrays(expected.split('\n'), actual.split('\n'), { timeout: timeout() });
  if (!lines) return null;

  const out: OutputDiff = { expected: [], actual: [] };
  let missing: string[] = [];
  let extra: string[] = [];

  // A stretch of changed lines: pair them in order, mark the rest whole.
  const flush = (): boolean => {
    const paired = Math.min(missing.length, extra.length);
    for (let i = 0; i < paired; i++) {
      const left = timeout();
      const chars = left > 0 ? diffChars(missing[i], extra[i], { timeout: left }) : undefined;
      if (!chars) return false;
      out.expected.push(
        chars.filter((c) => !c.added).map((c) => ({ text: c.value, marked: c.removed })),
      );
      out.actual.push(
        chars.filter((c) => !c.removed).map((c) => ({ text: c.value, marked: c.added })),
      );
    }
    for (const line of missing.slice(paired)) out.expected.push([{ text: line, marked: true }]);
    for (const line of extra.slice(paired)) out.actual.push([{ text: line, marked: true }]);
    missing = [];
    extra = [];
    return true;
  };

  for (const change of lines) {
    if (change.removed) missing.push(...change.value);
    else if (change.added) extra.push(...change.value);
    else {
      if (!flush()) return null;
      for (const line of change.value) {
        out.expected.push([{ text: line, marked: false }]);
        out.actual.push([{ text: line, marked: false }]);
      }
    }
  }
  return flush() ? out : null;
}
