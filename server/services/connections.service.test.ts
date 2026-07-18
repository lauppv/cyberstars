import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = {
  findBetween: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  accept: vi.fn(),
  remove: vi.fn(),
  listAccepted: vi.fn(),
  listIncoming: vi.fn(),
  listOutgoing: vi.fn(),
};
const mockUserRepo = { findById: vi.fn() };
const mockNotifications = { notify: vi.fn(), markEntityRead: vi.fn() };

vi.mock('../repositories/connections.repository.js', () => mockRepo);
vi.mock('../repositories/user.repository.js', () => mockUserRepo);
vi.mock('./notifications.service.js', () => mockNotifications);

const { getOverview, sendRequest, accept, decline, removeByCaller, relationTo, publicConnections } =
  await import('./connections.service.js');

// requester=1 (Ada), addressee=2 (Ben) by default.
function row(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 50,
    requesterId: 1,
    addresseeId: 2,
    status: 'PENDING',
    createdAt: new Date('2026-07-18T10:00:00.000Z'),
    respondedAt: null,
    requester: { id: 1, name: 'Ada', avatarUrl: '/a.png' },
    addressee: { id: 2, name: 'Ben', avatarUrl: null },
    ...over,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sendRequest', () => {
  it('rejects connecting with yourself', async () => {
    await expect(sendRequest(1, 1)).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it('404s when the target user does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(sendRequest(1, 99)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('409s when a pending request already exists', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 2 });
    mockRepo.findBetween.mockResolvedValue(row({ status: 'PENDING' }));
    await expect(sendRequest(1, 2)).rejects.toMatchObject({ statusCode: 409 });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it('409s when already connected', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 2 });
    mockRepo.findBetween.mockResolvedValue(row({ status: 'ACCEPTED' }));
    await expect(sendRequest(1, 2)).rejects.toMatchObject({ statusCode: 409 });
  });

  it('creates the row and notifies the addressee', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 2 });
    mockRepo.findBetween.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(row());
    await sendRequest(1, 2);
    expect(mockRepo.create).toHaveBeenCalledWith(1, 2);
    expect(mockNotifications.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientIds: [2],
        actorId: 1,
        type: 'CONNECTION_REQUEST',
        entityId: 50,
      }),
    );
  });
});

describe('accept', () => {
  it('404s when the request is not addressed to the caller', async () => {
    mockRepo.findById.mockResolvedValue(row({ addresseeId: 2 }));
    // caller 9 is not the addressee
    await expect(accept(9, 50)).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.accept).not.toHaveBeenCalled();
  });

  it('404s when the row is already accepted', async () => {
    mockRepo.findById.mockResolvedValue(row({ status: 'ACCEPTED' }));
    await expect(accept(2, 50)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('accepts and notifies the original requester', async () => {
    mockRepo.findById.mockResolvedValue(row());
    mockRepo.accept.mockResolvedValue(row({ status: 'ACCEPTED' }));
    await accept(2, 50);
    expect(mockRepo.accept).toHaveBeenCalledWith(50);
    expect(mockNotifications.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientIds: [1],
        actorId: 2,
        type: 'CONNECTION_ACCEPTED',
        entityId: 50,
      }),
    );
    expect(mockNotifications.markEntityRead).toHaveBeenCalledWith(2, 'CONNECTION_REQUEST', 50);
  });
});

describe('decline', () => {
  it('deletes the incoming request', async () => {
    mockRepo.findById.mockResolvedValue(row());
    await decline(2, 50);
    expect(mockRepo.remove).toHaveBeenCalledWith(50);
    expect(mockNotifications.notify).not.toHaveBeenCalled();
  });

  it('404s for a non-addressee', async () => {
    mockRepo.findById.mockResolvedValue(row());
    await expect(decline(1, 50)).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('removeByCaller', () => {
  it('cancels a pending request the caller sent', async () => {
    mockRepo.findById.mockResolvedValue(row({ status: 'PENDING', requesterId: 1 }));
    await removeByCaller(1, 50);
    expect(mockRepo.remove).toHaveBeenCalledWith(50);
  });

  it('removes an accepted connection either participant is part of', async () => {
    mockRepo.findById.mockResolvedValue(row({ status: 'ACCEPTED' }));
    await removeByCaller(2, 50);
    expect(mockRepo.remove).toHaveBeenCalledWith(50);
  });

  it('404s when the caller only received the pending request (must decline)', async () => {
    mockRepo.findById.mockResolvedValue(row({ status: 'PENDING', requesterId: 1, addresseeId: 2 }));
    await expect(removeByCaller(2, 50)).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepo.remove).not.toHaveBeenCalled();
  });

  it('404s when the row does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(removeByCaller(1, 50)).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('relationTo', () => {
  it('returns none for a logged-out viewer', async () => {
    expect(await relationTo(null, 2)).toBe('none');
    expect(mockRepo.findBetween).not.toHaveBeenCalled();
  });

  it('returns self on own profile', async () => {
    expect(await relationTo(2, 2)).toBe('self');
  });

  it('returns none when no row exists', async () => {
    mockRepo.findBetween.mockResolvedValue(null);
    expect(await relationTo(1, 2)).toBe('none');
  });

  it('returns connected for an accepted row', async () => {
    mockRepo.findBetween.mockResolvedValue(row({ status: 'ACCEPTED' }));
    expect(await relationTo(1, 2)).toBe('connected');
  });

  it('distinguishes outgoing from incoming pending requests', async () => {
    mockRepo.findBetween.mockResolvedValue(row({ status: 'PENDING', requesterId: 1 }));
    expect(await relationTo(1, 2)).toBe('pending_outgoing');
    expect(await relationTo(2, 1)).toBe('pending_incoming');
  });
});

describe('getOverview / publicConnections shape the other party', () => {
  it('overview picks the other user for each list', async () => {
    mockRepo.listAccepted.mockResolvedValue([row({ status: 'ACCEPTED', respondedAt: new Date() })]);
    mockRepo.listIncoming.mockResolvedValue([
      row({
        id: 60,
        requesterId: 3,
        addresseeId: 1,
        requester: { id: 3, name: 'Cyd', avatarUrl: null },
      }),
    ]);
    mockRepo.listOutgoing.mockResolvedValue([]);
    const o = await getOverview(1);
    expect(o.connections[0].user.id).toBe(2);
    expect(o.incoming[0].user.id).toBe(3);
    expect(o.outgoing).toEqual([]);
  });

  it('falls back to createdAt for an accepted row missing respondedAt', async () => {
    mockRepo.listAccepted.mockResolvedValue([row({ status: 'ACCEPTED', respondedAt: null })]);
    mockRepo.listIncoming.mockResolvedValue([]);
    mockRepo.listOutgoing.mockResolvedValue([]);
    const o = await getOverview(1);
    expect(o.connections[0].since).toBe('2026-07-18T10:00:00.000Z');
  });

  it('publicConnections lists the target’s counterparties with a count', async () => {
    mockRepo.listAccepted.mockResolvedValue([
      row({
        status: 'ACCEPTED',
        requesterId: 2,
        addresseeId: 5,
        addressee: { id: 5, name: 'Deb', avatarUrl: null },
      }),
    ]);
    const res = await publicConnections(2);
    expect(res.count).toBe(1);
    expect(res.users[0].id).toBe(5);
  });
});
