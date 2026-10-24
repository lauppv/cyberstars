import { FOREVER_LEVEL, type LaniakeaPlanet } from '@cyberstars/shared/laniakea';

// What a planet means to the student right now:
//   locked       its lesson isn't done, so it can't be reached yet
//   soon         its lesson is done but it has no questions yet
//   conquerable  ready for its first test
//   retry        a test failed a moment ago, the next try opens soon
//   recap        theirs, and its next recap is open
//   owned        theirs, waiting for its next recap
//   forever      theirs for good
export type PlanetStatus =
  | 'locked'
  | 'soon'
  | 'conquerable'
  | 'retry'
  | 'recap'
  | 'owned'
  | 'forever';

export function statusOf(planet: LaniakeaPlanet, now: number): PlanetStatus {
  if (!planet.lessonDone) return 'locked';
  if (!planet.hasQuiz) return 'soon';
  if (planet.retryAt && Date.parse(planet.retryAt) > now) return 'retry';
  if (planet.level < 1) return 'conquerable';
  if (planet.level >= FOREVER_LEVEL) return 'forever';
  if (planet.nextRecapAt && Date.parse(planet.nextRecapAt) <= now) return 'recap';
  return 'owned';
}

export function isOwned(planet: LaniakeaPlanet): boolean {
  return planet.level >= 1;
}

// A test can be opened on it now.
export function canFly(status: PlanetStatus): boolean {
  return (
    status === 'conquerable' || status === 'recap' || status === 'owned' || status === 'forever'
  );
}

// The moment the planet's countdown runs to, if it has one.
export function countdownTo(planet: LaniakeaPlanet, status: PlanetStatus): number | null {
  if (status === 'retry') return Date.parse(planet.retryAt!);
  if (status === 'owned' && planet.nextRecapAt) return Date.parse(planet.nextRecapAt);
  return null;
}

// A wait split into the two largest units it has: days and hours, hours and
// minutes, or minutes and seconds.
export function splitWait(ms: number): { unit: 'dh' | 'hm' | 'ms'; a: number; b: number } {
  const s = Math.max(0, Math.ceil(ms / 1000));
  if (s >= 86400)
    return { unit: 'dh', a: Math.floor(s / 86400), b: Math.floor((s % 86400) / 3600) };
  if (s >= 3600) return { unit: 'hm', a: Math.floor(s / 3600), b: Math.floor((s % 3600) / 60) };
  return { unit: 'ms', a: Math.floor(s / 60), b: s % 60 };
}

export type BoardSort = 'next' | 'order' | 'level';

const NEXT_RANK: Record<PlanetStatus, number> = {
  recap: 0,
  conquerable: 1,
  retry: 2,
  owned: 3,
  forever: 4,
  soon: 5,
  locked: 6,
};

// The planets the board lists, those whose lesson is done, sorted: what can be
// done now first, then by the soonest countdown; in lesson order; or the
// furthest moved first.
export function boardPlanets(
  planets: LaniakeaPlanet[],
  sort: BoardSort,
  now: number,
): LaniakeaPlanet[] {
  const order = new Map(planets.map((p, i) => [p.slug, i]));
  const listed = planets.filter((p) => p.lessonDone);
  const byOrder = (a: LaniakeaPlanet, b: LaniakeaPlanet) => order.get(a.slug)! - order.get(b.slug)!;
  if (sort === 'order') return listed.sort(byOrder);
  if (sort === 'level') return listed.sort((a, b) => b.level - a.level || byOrder(a, b));
  return listed.sort((a, b) => {
    const sa = statusOf(a, now);
    const sb = statusOf(b, now);
    if (sa !== sb) return NEXT_RANK[sa] - NEXT_RANK[sb];
    const ca = countdownTo(a, sa);
    const cb = countdownTo(b, sb);
    if (ca !== null && cb !== null && ca !== cb) return ca - cb;
    return byOrder(a, b);
  });
}
