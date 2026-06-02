// A guest (no account) gets a small lifetime budget of code runs, then is nudged
// to sign up. Counted per browser (the ownerKey is `guest:<guestId>` from an
// httpOnly cookie). In-memory and best-effort: clearing cookies or a server
// restart resets it — this is a sign-up nudge, not a hard wall.
export const GUEST_RUN_BUDGET = Number(process.env.GUEST_RUN_BUDGET ?? 10);

const guestRunCounts = new Map<string, number>();

export function guestRunsRemaining(key: string): number {
  return Math.max(0, GUEST_RUN_BUDGET - (guestRunCounts.get(key) ?? 0));
}

export function recordGuestRun(key: string): void {
  guestRunCounts.set(key, (guestRunCounts.get(key) ?? 0) + 1);
}
