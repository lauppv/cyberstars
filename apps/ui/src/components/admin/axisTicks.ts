// The axis in at most four clean steps (1, 2 or 5 times a power of ten) that
// just clear max, so 48 reads 0 / 20 / 40 / 60 and never tops out at 100.
export function axisTicks(max: number): number[] {
  const rough = Math.max(max, 1) / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough)!);
  const steps = Math.max(1, Math.ceil(max / step));
  return Array.from({ length: steps + 1 }, (_, i) => i * step);
}
