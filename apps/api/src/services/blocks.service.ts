import * as repo from '../repositories/blocks.repository.js';
import * as connectionsRepo from '../repositories/connections.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import * as notificationsService from './notifications.service.js';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import type { BlockedUser } from '@cyberstars/shared/blocks';

// What a blocked student sees when a message or a request to the one who
// blocked them doesn't go through: the same words whoever blocked whom, so it
// never says they were blocked
export const MESSAGE_NOT_SENT = 'Message could not be sent';
export const REQUEST_NOT_SENT = 'Request could not be sent';
export const REACTION_NOT_ADDED = 'Reaction could not be added';

export const existsBetween = repo.existsBetween;
export const isBlockedBy = repo.isBlockedBy;
export const blockedIds = repo.blockedIds;

export async function list(userId: number): Promise<BlockedUser[]> {
  const rows = await repo.listBlocked(userId);
  return rows.map((r) => ({
    id: r.blocked.id,
    name: r.blocked.name,
    avatarUrl: r.blocked.avatarUrl,
    blockedAt: r.createdAt.toISOString(),
  }));
}

export async function block(blockerId: number, blockedId: number): Promise<void> {
  if (blockedId === blockerId) throw new AppError(400, 'Cannot block yourself');
  const target = await userRepo.findById(blockedId);
  if (!target) throw new AppError(404, 'User not found');

  const connection = await connectionsRepo.findBetween(blockerId, blockedId);
  await repo.block(blockerId, blockedId);
  // A request the blocked one sent is gone with the block, so its bell entry
  // is done with, as when it's declined
  if (connection?.status === 'PENDING' && connection.addresseeId === blockerId) {
    void notificationsService.markEntityRead(blockerId, 'CONNECTION_REQUEST', connection.id);
  }
}

export function unblock(blockerId: number, blockedId: number): Promise<void> {
  return repo.unblock(blockerId, blockedId);
}
