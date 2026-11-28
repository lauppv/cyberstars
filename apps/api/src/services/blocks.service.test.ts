import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = {
  existsBetween: vi.fn(),
  isBlockedBy: vi.fn(),
  blockedIds: vi.fn(),
  listBlocked: vi.fn(),
  block: vi.fn(),
  unblock: vi.fn(),
};
const mockConnectionsRepo = { findBetween: vi.fn() };
const mockUserRepo = { findById: vi.fn() };
const mockNotifications = { markEntityRead: vi.fn() };

vi.mock('../repositories/blocks.repository.js', () => mockRepo);
vi.mock('../repositories/connections.repository.js', () => mockConnectionsRepo);
vi.mock('../repositories/user.repository.js', () => mockUserRepo);
vi.mock('./notifications.service.js', () => mockNotifications);

const { block, list, unblock } = await import('./blocks.service.js');

beforeEach(() => {
  vi.clearAllMocks();
  mockUserRepo.findById.mockResolvedValue({ id: 2, role: 'USER' });
  mockConnectionsRepo.findBetween.mockResolvedValue(null);
});

describe('blocks.service block', () => {
  it('refuses blocking oneself or someone who does not exist', async () => {
    await expect(block(1, 1)).rejects.toMatchObject({ statusCode: 400 });
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(block(1, 2)).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.block).not.toHaveBeenCalled();
  });

  it('refuses blocking a moderator, an admin or the founder', async () => {
    for (const role of ['MODERATOR', 'ADMIN', 'FOUNDER']) {
      mockUserRepo.findById.mockResolvedValue({ id: 2, role });
      await expect(block(1, 2)).rejects.toMatchObject({ statusCode: 403 });
    }
    expect(mockRepo.block).not.toHaveBeenCalled();
  });

  it('blocks, and reads the bell entry of a request the blocked one sent', async () => {
    mockConnectionsRepo.findBetween.mockResolvedValue({
      id: 50,
      requesterId: 2,
      addresseeId: 1,
      status: 'PENDING',
    });
    await block(1, 2);
    expect(mockRepo.block).toHaveBeenCalledWith(1, 2);
    expect(mockNotifications.markEntityRead).toHaveBeenCalledWith(1, 'CONNECTION_REQUEST', 50);
  });

  it('leaves the bell alone for an accepted connection or a request the blocker sent', async () => {
    mockConnectionsRepo.findBetween.mockResolvedValue({
      id: 50,
      requesterId: 1,
      addresseeId: 2,
      status: 'PENDING',
    });
    await block(1, 2);
    mockConnectionsRepo.findBetween.mockResolvedValue({
      id: 51,
      requesterId: 2,
      addresseeId: 1,
      status: 'ACCEPTED',
    });
    await block(1, 2);
    expect(mockNotifications.markEntityRead).not.toHaveBeenCalled();
  });
});

describe('blocks.service list and unblock', () => {
  it('shapes the blocked people for Settings', async () => {
    mockRepo.listBlocked.mockResolvedValue([
      {
        createdAt: new Date('2026-11-28T10:00:00.000Z'),
        blocked: { id: 2, name: 'Ben', avatarUrl: null },
      },
    ]);
    await expect(list(1)).resolves.toEqual([
      { id: 2, name: 'Ben', avatarUrl: null, blockedAt: '2026-11-28T10:00:00.000Z' },
    ]);
  });

  it('unblocks', async () => {
    await unblock(1, 2);
    expect(mockRepo.unblock).toHaveBeenCalledWith(1, 2);
  });
});
