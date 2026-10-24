import { useEffect, useState } from 'react';
import type { TFunction } from 'i18next';
import type { LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { countdownTo, splitWait, type PlanetStatus } from './planetStatus';

// A wait as the student reads it: "2d 5h", "3h 12m" or "4:05".
export function formatWait(t: TFunction, ms: number): string {
  const { unit, a, b } = splitWait(ms);
  return t(`laniakea.wait.${unit}`, { a, b: unit === 'ms' ? String(b).padStart(2, '0') : b });
}

// What a planet's status says, with its countdown when it has one.
export function statusText(
  t: TFunction,
  planet: LaniakeaPlanet,
  status: PlanetStatus,
  now: number,
): string {
  const until = countdownTo(planet, status);
  return t(`laniakea.status.${status}`, {
    wait: until === null ? '' : formatWait(t, until - now),
  });
}

// The time now on the server's clock, `offset` ms from the device's, read
// again every `everyMs`.
export function useNow(offset: number, everyMs = 1000): number {
  const [now, setNow] = useState(() => Date.now() + offset);
  useEffect(() => {
    setNow(Date.now() + offset); // eslint-disable-line react-hooks/set-state-in-effect
    const id = setInterval(() => setNow(Date.now() + offset), everyMs);
    return () => clearInterval(id);
  }, [offset, everyMs]);
  return now;
}

// The game's units read as kilometres, for flavour.
export function km(units: number): string {
  return Math.round(units * 10).toLocaleString();
}
