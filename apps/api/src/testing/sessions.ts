import crypto from 'node:crypto';
import { vi } from 'vitest';
import type { UserRole } from '@cyberstars/shared/auth';

// A signed-in user for a unit test, without a database: the session store
// (repositories/session.repository.ts) faked to know one token. A test mocks
// the repository with fakeSessionRepo and sends SESSION_COOKIE:
//
//   vi.mock('../repositories/session.repository.js', async () =>
//     (await import('../testing/sessions.js')).fakeSessionRepo(42),
//   );

const ID = 'a'.repeat(22);
const SECRET = 's'.repeat(43);

export const SESSION_TOKEN = `${ID}.${SECRET}`;

// The cookie as a browser sends it over HTTP (no __Host- prefix)
export const SESSION_COOKIE = `session=${SESSION_TOKEN}`;

export function fakeSessionRepo(userId: number, role: UserRole = 'USER') {
  const secretHash = crypto.createHash('sha256').update(SECRET).digest('hex');
  return {
    create: vi.fn(),
    find: vi.fn(async (id: string) =>
      id === ID
        ? { userId, secretHash, createdAt: new Date(), lastSeenAt: new Date(), role }
        : null,
    ),
    touch: vi.fn(),
    remove: vi.fn(),
    removeForUser: vi.fn(),
    removeExpired: vi.fn(async () => 0),
  };
}
