import type { WebSocket } from 'ws';
import type { UserSocketFrame } from '../../shared/notifications.js';

// One shared per-user event socket (/ws/user), keyed by user id with a Set of
// sockets so multiple tabs of the same user all receive live frames. Shared by
// notifications (and, later, direct messaging) — one registry, one connection.
const registry = new Map<number, Set<WebSocket>>();

export function registerUserSocket(userId: number, ws: WebSocket): void {
  let set = registry.get(userId);
  if (!set) {
    set = new Set();
    registry.set(userId, set);
  }
  set.add(ws);
}

export function unregisterUserSocket(userId: number, ws: WebSocket): void {
  const set = registry.get(userId);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) registry.delete(userId);
}

// Deliver a frame to every open socket the user has. A no-op when they are
// offline — the DB is the source of truth, so they see it on the next fetch.
export function pushToUser(userId: number, frame: UserSocketFrame): void {
  const set = registry.get(userId);
  if (!set) return;
  const data = JSON.stringify(frame);
  for (const ws of set) {
    if (ws.readyState === ws.OPEN) ws.send(data);
  }
}

export function clearUserSockets(): void {
  registry.clear();
}
