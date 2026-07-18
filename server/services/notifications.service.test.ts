import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = {
  findUnreadFor: vi.fn(),
  collapse: vi.fn(),
  create: vi.fn(),
  pruneOverCap: vi.fn(),
  countUnread: vi.fn(),
  list: vi.fn(),
  markReadUpTo: vi.fn(),
  markOneRead: vi.fn(),
  clearExcerpt: vi.fn(),
};
const mockWs = { pushToUser: vi.fn() };

vi.mock('../repositories/notifications.repository.js', () => mockRepo);
vi.mock('./ws-user.js', () => mockWs);

const { notify, getPage, markRead, markOneRead, redactExcerpt } =
  await import('./notifications.service.js');

function row(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 1,
    userId: 10,
    actorId: 2,
    type: 'FORUM_REPLY',
    entityId: 5,
    data: { title: 'Thread' },
    readAt: null,
    createdAt: new Date('2026-07-17T10:00:00.000Z'),
    actor: { name: 'Ada', avatarUrl: '/a.png' },
    ...over,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockRepo.create.mockResolvedValue(row());
  mockRepo.collapse.mockResolvedValue(row({ data: { title: 'Thread', count: 2 } }));
  mockRepo.findUnreadFor.mockResolvedValue(null);
  mockRepo.pruneOverCap.mockResolvedValue(undefined);
  mockRepo.countUnread.mockResolvedValue(3);
});

describe('notifications.service notify', () => {
  it('creates a row and pushes new + unread-count frames to each recipient', async () => {
    await notify({ recipientIds: [10, 11], actorId: 2, type: 'FORUM_REPLY', entityId: 5 });
    expect(mockRepo.create).toHaveBeenCalledTimes(2);
    expect(mockRepo.pruneOverCap).toHaveBeenCalledWith(10, 100);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'new',
      payload: expect.objectContaining({ id: 1, type: 'FORUM_REPLY' }),
    });
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'unread-count',
      payload: { unreadCount: 3 },
    });
  });

  it('excludes the actor from its own notification', async () => {
    await notify({ recipientIds: [2, 10], actorId: 2, type: 'FORUM_REPLY', entityId: 5 });
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ userId: 10 }));
  });

  it('dedupes repeated recipient ids', async () => {
    await notify({ recipientIds: [10, 10, 10], type: 'SUPPORT_REPLY', entityId: 5 });
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });

  it('collapses a repeat collapsible event into a replacement of the unread row', async () => {
    const existing = row({ id: 9, data: { title: 'Thread', count: 1 } });
    mockRepo.findUnreadFor.mockResolvedValue(existing);
    await notify({ recipientIds: [10], actorId: 2, type: 'FORUM_REPLY', entityId: 5 });
    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockRepo.collapse).toHaveBeenCalledWith(existing, 2, {
      title: 'Thread',
      count: 2,
    });
  });

  it('collapses from a bare unread row with no prior data or count', async () => {
    const existing = row({ id: 9, data: null });
    mockRepo.findUnreadFor.mockResolvedValue(existing);
    await notify({ recipientIds: [10], actorId: 4, type: 'DM_MESSAGE', entityId: 5 });
    expect(mockRepo.collapse).toHaveBeenCalledWith(existing, 4, { count: 2 });
  });

  it('does not collapse non-collapsible types even with an unread row present', async () => {
    mockRepo.findUnreadFor.mockResolvedValue(row());
    await notify({ recipientIds: [10], actorId: 2, type: 'SUPPORT_STATUS', entityId: 5 });
    expect(mockRepo.findUnreadFor).not.toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });

  it('never throws when the repository fails', async () => {
    mockRepo.create.mockRejectedValue(new Error('db down'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(
      notify({ recipientIds: [10], type: 'FORUM_REPLY', entityId: 5 }),
    ).resolves.toBeUndefined();
    spy.mockRestore();
  });

  it('one recipient failing does not block the others', async () => {
    mockRepo.create.mockRejectedValueOnce(new Error('db down')).mockResolvedValue(row());
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await notify({ recipientIds: [10, 11], type: 'FORUM_REPLY', entityId: 5 });
    expect(mockRepo.create).toHaveBeenCalledTimes(2);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(11, expect.objectContaining({ type: 'new' }));
    spy.mockRestore();
  });
});

describe('notifications.service redactExcerpt', () => {
  it('delegates to the repository', async () => {
    mockRepo.clearExcerpt.mockResolvedValue(undefined);
    await redactExcerpt('FORUM_REPLY', 5, 42);
    expect(mockRepo.clearExcerpt).toHaveBeenCalledWith('FORUM_REPLY', 5, 42);
  });

  it('never throws (fire-and-forget)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRepo.clearExcerpt.mockRejectedValue(new Error('db down'));
    await expect(redactExcerpt('FORUM_REPLY', 5, 42)).resolves.toBeUndefined();
    spy.mockRestore();
  });
});

describe('notifications.service getPage', () => {
  it('shapes rows and returns the unread count', async () => {
    mockRepo.list.mockResolvedValue([
      row(),
      row({ id: 2, actor: null, data: null, readAt: new Date('2026-07-17T09:00:00.000Z') }),
    ]);
    const page = await getPage(10, 20);
    expect(page.unreadCount).toBe(3);
    expect(page.items[0]).toEqual({
      id: 1,
      type: 'FORUM_REPLY',
      entityId: 5,
      data: { title: 'Thread' },
      actor: { name: 'Ada', avatarUrl: '/a.png' },
      readAt: null,
      createdAt: '2026-07-17T10:00:00.000Z',
    });
    expect(page.items[1].actor).toBeNull();
    expect(page.items[1].data).toBeNull();
    expect(page.items[1].readAt).toBe('2026-07-17T09:00:00.000Z');
  });
});

describe('notifications.service mark helpers', () => {
  it('markRead marks up-to-id and pushes the fresh unread count', async () => {
    mockRepo.markReadUpTo.mockResolvedValue(4);
    mockRepo.countUnread.mockResolvedValue(0);
    expect(await markRead(10, 99)).toBe(4);
    expect(mockRepo.markReadUpTo).toHaveBeenCalledWith(10, 99);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'unread-count',
      payload: { unreadCount: 0 },
    });
  });

  it('markOneRead pushes the fresh unread count when a row was marked', async () => {
    mockRepo.markOneRead.mockResolvedValue(1);
    mockRepo.countUnread.mockResolvedValue(2);
    await markOneRead(10, 7);
    expect(mockRepo.markOneRead).toHaveBeenCalledWith(10, 7);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'unread-count',
      payload: { unreadCount: 2 },
    });
  });

  it('markOneRead pushes nothing when the row was already read', async () => {
    mockRepo.markOneRead.mockResolvedValue(0);
    await markOneRead(10, 7);
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
  });
});
