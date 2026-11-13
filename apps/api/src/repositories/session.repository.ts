import type { StoredSession } from '@cyberstars-framework/auth/auth';
import type { UserRole } from '@cyberstars/shared/auth';
import { prisma } from '../config/db.js';

// The signed-in browsers, one `sessions` row each, as the auth package keeps
// them (services/auth.ts)

export async function create(session: {
  id: string;
  userId: number;
  secretHash: string;
  createdAt: Date;
}): Promise<void> {
  await prisma.session.create({ data: { ...session, lastSeenAt: session.createdAt } });
}

// The session with the account's role now, in one query
export async function find(id: string): Promise<StoredSession<UserRole> | null> {
  const row = await prisma.session.findUnique({
    where: { id },
    select: {
      userId: true,
      secretHash: true,
      createdAt: true,
      lastSeenAt: true,
      user: { select: { role: true } },
    },
  });
  if (!row) return null;
  const { user, ...session } = row;
  return { ...session, role: user.role };
}

export async function touch(id: string, lastSeenAt: Date): Promise<void> {
  await prisma.session.updateMany({ where: { id }, data: { lastSeenAt } });
}

// deleteMany, so a session another request ended first is no error
export async function remove(id: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id } });
}

export async function removeForUser(userId: number): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function removeExpired(lastSeenBefore: Date, createdBefore: Date): Promise<number> {
  const { count } = await prisma.session.deleteMany({
    where: { OR: [{ lastSeenAt: { lt: lastSeenBefore } }, { createdAt: { lt: createdBefore } }] },
  });
  return count;
}
