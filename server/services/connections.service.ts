import * as repo from '../repositories/connections.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import * as notificationsService from './notifications.service.js';
import { AppError } from '../middleware/errorHandler.js';
import type {
  AcceptedConnection,
  ConnectionRelation,
  ConnectionsOverview,
  ConnectionUser,
  PendingConnection,
} from '../../shared/connections.js';

function shapeUser(u: { id: number; name: string; avatarUrl: string | null }): ConnectionUser {
  return { id: u.id, name: u.name, avatarUrl: u.avatarUrl };
}

// The "other" party relative to `userId`.
function other(row: repo.ConnectionRow, userId: number) {
  return row.requesterId === userId ? row.addressee : row.requester;
}

function shapePending(row: repo.ConnectionRow, userId: number): PendingConnection {
  return {
    id: row.id,
    user: shapeUser(other(row, userId)),
    createdAt: row.createdAt.toISOString(),
  };
}

function shapeAccepted(row: repo.ConnectionRow, userId: number): AcceptedConnection {
  return {
    id: row.id,
    user: shapeUser(other(row, userId)),
    since: (row.respondedAt ?? row.createdAt).toISOString(),
  };
}

export async function getOverview(userId: number): Promise<ConnectionsOverview> {
  const [accepted, incoming, outgoing] = await Promise.all([
    repo.listAccepted(userId),
    repo.listIncoming(userId),
    repo.listOutgoing(userId),
  ]);
  return {
    connections: accepted.map((r) => shapeAccepted(r, userId)),
    incoming: incoming.map((r) => shapePending(r, userId)),
    outgoing: outgoing.map((r) => shapePending(r, userId)),
  };
}

// Send a connection request. Rejects self-requests, unknown targets, and any
// case where a row already exists in either direction (pending or accepted) —
// the caller learns the current state from the profile's relation field.
export async function sendRequest(requesterId: number, addresseeId: number): Promise<void> {
  if (addresseeId === requesterId) throw new AppError(400, 'Cannot connect with yourself');
  const target = await userRepo.findById(addresseeId);
  if (!target) throw new AppError(404, 'User not found');

  const existing = await repo.findBetween(requesterId, addresseeId);
  if (existing) {
    if (existing.status === 'ACCEPTED') throw new AppError(409, 'Already connected');
    throw new AppError(409, 'A request is already pending');
  }

  const row = await repo.create(requesterId, addresseeId);
  void notificationsService.notify({
    recipientIds: [addresseeId],
    actorId: requesterId,
    type: 'CONNECTION_REQUEST',
    entityId: row.id,
  });
}

// Load a pending request the caller is the addressee of, or 404 (so a caller
// can't probe which request ids exist or act on someone else's).
async function requireIncoming(id: number, userId: number): Promise<repo.ConnectionRow> {
  const row = await repo.findById(id);
  if (!row || row.addresseeId !== userId || row.status !== 'PENDING') {
    throw new AppError(404, 'Request not found');
  }
  return row;
}

export async function accept(userId: number, connectionId: number): Promise<void> {
  const row = await requireIncoming(connectionId, userId);
  await repo.accept(row.id);
  // Close the loop: tell the original requester their request was accepted.
  void notificationsService.notify({
    recipientIds: [row.requesterId],
    actorId: userId,
    type: 'CONNECTION_ACCEPTED',
    entityId: row.id,
  });
  // Clear the request's own bell entry for the addressee now that it's handled.
  void notificationsService.markEntityRead(userId, 'CONNECTION_REQUEST', row.id);
}

export async function decline(userId: number, connectionId: number): Promise<void> {
  const row = await requireIncoming(connectionId, userId);
  await repo.remove(row.id);
  void notificationsService.markEntityRead(userId, 'CONNECTION_REQUEST', row.id);
}

// DELETE by the caller: cancels a pending request the caller sent, or removes an
// established connection the caller is part of. Declining an *incoming* request
// goes through `decline` instead (it notifies nothing but must assert addressee).
export async function removeByCaller(userId: number, connectionId: number): Promise<void> {
  const row = await repo.findById(connectionId);
  const canCancel = row && row.status === 'PENDING' && row.requesterId === userId;
  const canRemove =
    row && row.status === 'ACCEPTED' && (row.requesterId === userId || row.addresseeId === userId);
  if (!row || (!canCancel && !canRemove)) throw new AppError(404, 'Connection not found');
  await repo.remove(row.id);
}

// The viewer's relationship to `targetId`, for rendering the profile button.
export async function relationTo(
  viewerId: number | null,
  targetId: number,
): Promise<ConnectionRelation> {
  if (viewerId === null) return 'none';
  if (viewerId === targetId) return 'self';
  const row = await repo.findBetween(viewerId, targetId);
  if (!row) return 'none';
  if (row.status === 'ACCEPTED') return 'connected';
  return row.requesterId === viewerId ? 'pending_outgoing' : 'pending_incoming';
}

// Accepted connections of `targetId` for their public profile, plus the count.
export async function publicConnections(
  targetId: number,
): Promise<{ users: ConnectionUser[]; count: number }> {
  const accepted = await repo.listAccepted(targetId);
  return { users: accepted.map((r) => shapeUser(other(r, targetId))), count: accepted.length };
}
