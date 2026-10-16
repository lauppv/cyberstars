import { PLACEMENT_QUESTION_COUNT } from '@cyberstars/shared/placement';

// The placement test's score, kept in this browser between the test and
// signing up, then sent with the sign-up. A blocked storage keeps nothing,
// and the account is made as if the visitor skipped the test.
const KEY = 'cyberstars.placement';

export function savePlacementScore(score: number): void {
  try {
    localStorage.setItem(KEY, String(score));
  } catch {
    // storage may be blocked; the account then starts without a level
  }
}

export function readPlacementScore(): number | undefined {
  try {
    const score = Number(localStorage.getItem(KEY) ?? NaN);
    return Number.isInteger(score) && score >= 0 && score <= PLACEMENT_QUESTION_COUNT
      ? score
      : undefined;
  } catch {
    return undefined;
  }
}

export function clearPlacementScore(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear when storage is blocked
  }
}
