// A signed-out browser's id: the random UUID the server hands out in the
// `guestId` cookie (app.ts). A guest can send any value instead, so anything
// not shaped like one is no id at all, and the browser is given a new one.
const GUEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isGuestId(value: unknown): value is string {
  return typeof value === 'string' && GUEST_ID.test(value);
}

// The key a guest's runs, tests, terminals and limits go under, in a space of
// its own so it never meets a student's `user:<id>`; null without a valid id
export function guestKey(guestId: unknown): string | null {
  return isGuestId(guestId) ? `guest:${guestId}` : null;
}
