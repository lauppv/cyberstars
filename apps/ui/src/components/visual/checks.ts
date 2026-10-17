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
