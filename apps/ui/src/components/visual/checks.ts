// What every kind of visual checks the same way while reading its JSON

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isCaption(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}
