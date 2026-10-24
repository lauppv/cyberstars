import { FOREVER_LEVEL, type LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import type { PlanetStatus } from './planetStatus';
import type { PlanetMark } from './scene/planets';

// How a planet is marked follows whose it is: one of the student's stays blue
// even while a failed practice test holds it, and gold once kept for good.
export function markOf(planet: LaniakeaPlanet, status: PlanetStatus): PlanetMark {
  if (planet.level >= FOREVER_LEVEL) return 'forever';
  if (planet.level >= 1) return status === 'recap' ? 'recap' : 'owned';
  return planet.lessonDone && planet.hasQuiz ? 'open' : 'none';
}

// The same colours on the board's dots and the map: blue for the student's
// planets, gold for those kept for good, white for those ready to conquer and
// grey for the rest.
export const MARK_COLOR: Record<PlanetMark, string> = {
  none: 'rgba(150, 155, 180, 0.5)',
  open: '#e6ebff',
  owned: '#4da3ff',
  recap: '#8fcbff',
  forever: '#ffcc55',
};
