import { prisma } from '../config/db.js';

// A student's window for one action, as stored.
export interface UsageRow {
  action: string;
  windowStart: Date;
  used: number;
}

export interface Taken {
  windowStart: Date;
  // Units used in the window, these included.
  used: number;
  // How many of the units asked for were taken: fewer when not enough were left.
  taken: number;
}

export function listForUser(userId: number): Promise<UsageRow[]> {
  return prisma.usageWindow.findMany({
    where: { userId },
    select: { action: true, windowStart: true, used: true },
  });
}

// Takes up to `want` units, as many as are left under `limit`. The row is
// locked for the transaction, so two requests can't both take the last unit. A
// window `windowMs` old or more has ended, and this use opens a new one at `now`.
export function take(
  userId: number,
  action: string,
  want: number,
  limit: number,
  windowMs: number,
  now: Date,
): Promise<Taken> {
  return prisma.$transaction(async (tx) => {
    await tx.usageWindow.createMany({
      data: [{ userId, action, windowStart: now, used: 0 }],
      skipDuplicates: true,
    });
    const [row] = await tx.$queryRaw<{ window_start: Date; used: number }[]>`
      SELECT window_start, used FROM usage_windows
      WHERE user_id = ${userId} AND action = ${action}
      FOR UPDATE`;
    const ended = now.getTime() - row.window_start.getTime() >= windowMs;
    const windowStart = ended ? now : row.window_start;
    const before = ended ? 0 : row.used;
    const taken = Math.max(0, Math.min(want, limit - before));
    if (taken > 0) {
      await tx.usageWindow.update({
        where: { userId_action: { userId, action } },
        data: { windowStart, used: before + taken },
      });
    }
    return { windowStart, used: before + taken, taken };
  });
}

// Returns units to the window they were taken from. A window that has started
// again since keeps its own count.
export async function giveBack(
  userId: number,
  action: string,
  windowStart: Date,
  units: number,
): Promise<void> {
  await prisma.usageWindow.updateMany({
    where: { userId, action, windowStart },
    data: { used: { decrement: units } },
  });
}
