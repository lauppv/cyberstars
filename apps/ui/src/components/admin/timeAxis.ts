// Where the dates go under a chart of days or weeks, in two rows: the fine one
// names the points (a day's number, or a month on the weekly charts) and the
// one below says which month or year they're in, once, where it starts.
export type AxisLabel = { i: number; label: string };

// The room a label needs from the next one, in px at 10px text; the bold
// month or year below wants a little more, so two in a row still read apart.
const GAP = { day: 20, month: 36, context: 48 };

const date = (day: string) => new Date(`${day}T12:00:00Z`);

// The smallest of the steps that leaves gap px between labels spaced px apart.
function pickStep(spacing: number, gap: number, steps: number[]) {
  return steps.find((k) => k * spacing >= gap) ?? steps[steps.length - 1];
}

export function timeAxis(
  days: string[],
  weekly: boolean,
  plotWidth: number,
  lang: string,
): { ticks: AxisLabel[]; context: AxisLabel[] } {
  if (days.length === 0) return { ticks: [], context: [] };
  const px = days.length > 1 ? plotWidth / (days.length - 1) : plotWidth;
  const last = days.length - 1;
  const dates = days.map(date);
  const month = (d: Date) => d.toLocaleDateString(lang, { month: 'short', timeZone: 'UTC' });
  const year = (d: Date) => String(d.getUTCFullYear());

  let ticks: AxisLabel[];
  if (!weekly && days.length <= 31) {
    // A month: every day by its number, or every few counted back from today.
    const k = pickStep(px, GAP.day, [1, 2, 3, 5, 7, 10, 15]);
    ticks = dates
      .map((d, i) => ({ i, label: String(d.getUTCDate()) }))
      .filter(({ i }) => (last - i) % k === 0);
  } else if (!weekly) {
    // A quarter: the Mondays, every one or every few counted back from the last.
    const mondays = dates.flatMap((d, i) => (d.getUTCDay() === 1 ? [i] : []));
    const k = pickStep(7 * px, GAP.day, [1, 2, 4]);
    ticks = mondays
      .filter((_, n) => (mondays.length - 1 - n) % k === 0)
      .map((i) => ({ i, label: String(dates[i].getUTCDate()) }));
  } else {
    // By week: the first week of each month, by the month's name, thinned to
    // every second, third or sixth month of the calendar when they're too close.
    const starts = dates.flatMap((d, i) =>
      i > 0 && d.getUTCMonth() !== dates[i - 1].getUTCMonth() ? [i] : [],
    );
    const k = pickStep((52 / 12) * px, GAP.month, [1, 2, 3, 6, 12]);
    ticks = starts
      .filter((i) => dates[i].getUTCMonth() % k === 0)
      .map((i) => ({ i, label: month(dates[i]) }));
  }

  // The month (or the year, by week) at the first point and wherever it turns.
  const name = weekly ? year : month;
  const turns = dates.flatMap((d, i) => (i > 0 && name(d) !== name(dates[i - 1]) ? [i] : []));
  const context = turns.map((i) => ({ i, label: name(dates[i]) }));
  // The first point's own name only if it doesn't run into the first turn.
  if (turns.length === 0 || turns[0] * px >= GAP.context)
    context.unshift({ i: 0, label: name(dates[0]) });

  return { ticks, context };
}
