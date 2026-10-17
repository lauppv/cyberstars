// What every kind of visual checks the same way while reading its JSON

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isCaption(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

const isValue = (value: unknown): value is number | string =>
  typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));

// A row of values under a drawing, with its name, such as a queue or the visits so far
export interface ValueRow {
  label: string;
  values: (number | string)[];
}

export function parseRows(raw: unknown): ValueRow[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const rows: ValueRow[] = [];
  for (const row of raw) {
    if (!isRecord(row) || !isCaption(row.label) || !Array.isArray(row.values)) return null;
    if (!row.values.every(isValue)) return null;
    rows.push({ label: row.label, values: [...row.values] });
  }
  return rows;
}

// The choices a step gives its question, so the student answers before seeing the answer, and the
// right one by its place among them
export interface Question {
  choices: string[];
  answer: number;
}

// Undefined when the step gives no choices, null when they don't fit: two to four different ones,
// a right one among them, and a question they answer
export function parseQuestion(
  raw: Record<string, unknown>,
  ask: string | undefined,
): Question | null | undefined {
  const { choices, answer } = raw;
  if (choices === undefined && answer === undefined) return undefined;
  if (
    !ask ||
    !Array.isArray(choices) ||
    choices.length < 2 ||
    choices.length > 4 ||
    !choices.every(isCaption) ||
    new Set(choices).size !== choices.length
  ) {
    return null;
  }
  if (!Number.isInteger(answer) || (answer as number) < 0 || (answer as number) >= choices.length) {
    return null;
  }
  return { choices: [...choices], answer: answer as number };
}
