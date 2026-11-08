import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationType } from '@prisma/client';
import { BELL_TYPES, SECTION_TYPES } from '@cyberstars/shared/notifications';
import type { UnreadSections } from '@cyberstars/shared/notifications';

const mockRepo = {
  findUnreadFor: vi.fn(),
  collapse: vi.fn(),
  create: vi.fn(),
  pruneOverCap: vi.fn(),
  countUnread: vi.fn(),
  list: vi.fn(),
  markReadUpTo: vi.fn(),
  markOneRead: vi.fn(),
  markReadByEntity: vi.fn(),
  clearExcerpt: vi.fn(),
  createAnnouncement: vi.fn(),
  listAnnouncements: vi.fn(),
  listNotices: vi.fn(),
  markShown: vi.fn(),
  listUnreadSections: vi.fn(),
  markSectionRead: vi.fn(),
};
const mockWs = { pushToUser: vi.fn(), isUserOnline: vi.fn() };

vi.mock('../repositories/notifications.repository.js', () => mockRepo);
vi.mock('./ws-user.js', () => mockWs);

const {
  notify,
  announce,
  listAnnouncements,
  getPage,
  markRead,
  markOneRead,
  markEntityRead,
  redactExcerpt,
  getNotices,
  markShown,
  markSectionRead,
} = await import('./notifications.service.js');

const NO_SECTIONS: UnreadSections = { forum: [], support: [], connections: 0, laniakea: 0 };

// The unread-count frame's payload: the bell's count and the sidebar's
function state(unreadCount: number, sections: UnreadSections = NO_SECTIONS) {
  return { unreadCount, sections };
}

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
  mockRepo.listUnreadSections.mockResolvedValue([]);
});

describe('notifications.service notify', () => {
  it('creates a bell row and pushes new + unread-count frames to each recipient', async () => {
    mockRepo.create.mockResolvedValue(row({ type: 'POLL_ANSWER', data: { text: 'Yes' } }));
    await notify({ recipientIds: [10, 11], actorId: 2, type: 'POLL_ANSWER', entityId: 5 });
    expect(mockRepo.create).toHaveBeenCalledTimes(2);
    expect(mockRepo.pruneOverCap).toHaveBeenCalledWith(10, 100);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'new',
      payload: expect.objectContaining({ id: 1, type: 'POLL_ANSWER' }),
    });
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'unread-count',
      payload: state(3),
    });
  });

  it('pushes only the counts for a sidebar row, never a bell row', async () => {
    mockRepo.listUnreadSections.mockResolvedValue([
      { type: 'FORUM_REPLY', entityId: 5, data: { title: 'Thread', count: 1 } },
    ]);
    await notify({ recipientIds: [10], actorId: 2, type: 'FORUM_REPLY', entityId: 5 });
    expect(mockWs.pushToUser).toHaveBeenCalledTimes(1);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'unread-count',
      payload: state(3, { ...NO_SECTIONS, forum: [{ entityId: 5, title: 'Thread' }] }),
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
    await notify({ recipientIds: [10], actorId: 4, type: 'FORUM_REPLY', entityId: 5 });
    expect(mockRepo.collapse).toHaveBeenCalledWith(existing, 4, { count: 2 });
  });

  it('replaces the count of the unread row with one the event carries', async () => {
    const existing = row({ id: 9, data: { count: 2 } });
    mockRepo.findUnreadFor.mockResolvedValue(existing);
    await notify({ recipientIds: [10], type: 'LANIAKEA_RECAP', entityId: 0, data: { count: 5 } });
    expect(mockRepo.collapse).toHaveBeenCalledWith(existing, null, { count: 5 });
  });

  it('collapses with a null actor when the event has no actorId', async () => {
    const existing = row({ id: 9, data: { title: 'Thread', count: 1 } });
    mockRepo.findUnreadFor.mockResolvedValue(existing);
    await notify({ recipientIds: [10], type: 'FORUM_REPLY', entityId: 5 });
    expect(mockRepo.collapse).toHaveBeenCalledWith(existing, null, { title: 'Thread', count: 2 });
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
    await expect(notify({ recipientIds: [10], type: 'FORUM_REPLY', entityId: 5 })).resolves.toBe(0);
    spy.mockRestore();
  });

  it('one recipient failing does not block the others', async () => {
    mockRepo.create.mockRejectedValueOnce(new Error('db down')).mockResolvedValue(row());
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await notify({ recipientIds: [10, 11], type: 'FORUM_REPLY', entityId: 5 })).toBe(1);
    expect(mockRepo.create).toHaveBeenCalledTimes(2);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(
      11,
      expect.objectContaining({ type: 'unread-count' }),
    );
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

describe('where each notification type shows', () => {
  it('puts every type in the bell or in exactly one sidebar section', () => {
    const placed = [...BELL_TYPES, ...Object.values(SECTION_TYPES).flat()];
    expect([...placed].sort()).toEqual(Object.values(NotificationType).sort());
  });
});

describe('notifications.service unread sections', () => {
  it('folds the unread sidebar rows into what each row shows', async () => {
    mockRepo.list.mockResolvedValue([]);
    mockRepo.listUnreadSections.mockResolvedValue([
      { type: 'LANIAKEA_RECAP', entityId: 0, data: { count: 4 } },
      { type: 'FORUM_SOLUTION', entityId: 7, data: { title: 'Loops' } },
      { type: 'SUPPORT_REPLY', entityId: 3, data: { title: 'Login' } },
      { type: 'CONNECTION_ACCEPTED', entityId: 12, data: null },
      { type: 'FORUM_REPLY', entityId: 7, data: { title: 'Loops', count: 2 } },
      { type: 'FORUM_REPLY', entityId: 2, data: { title: 'Arrays' } },
      { type: 'SUPPORT_STATUS', entityId: 3, data: { title: 'Login' } },
      { type: 'CONNECTION_REQUEST', entityId: 11, data: null },
      { type: 'LANIAKEA_RECAP', entityId: 0, data: { count: 1 } },
    ]);
    const page = await getPage(10, 20);
    expect(mockRepo.listUnreadSections).toHaveBeenCalledWith(10);
    expect(page.sections).toEqual({
      forum: [
        { entityId: 7, title: 'Loops' },
        { entityId: 2, title: 'Arrays' },
      ],
      support: [{ entityId: 3, title: 'Login' }],
      connections: 2,
      laniakea: 4,
    });
  });

  it('falls back to an empty title and a single recap when the data lacks them', async () => {
    mockRepo.list.mockResolvedValue([]);
    mockRepo.listUnreadSections.mockResolvedValue([
      { type: 'SUPPORT_TICKET_NEW', entityId: 3, data: null },
      { type: 'LANIAKEA_RECAP', entityId: 0, data: {} },
    ]);
    const page = await getPage(10, 20);
    expect(page.sections.support).toEqual([{ entityId: 3, title: '' }]);
    expect(page.sections.laniakea).toBe(1);
  });

  it('markSectionRead reads the section by its types and pushes the counts', async () => {
    mockRepo.markSectionRead.mockResolvedValue(2);
    mockRepo.countUnread.mockResolvedValue(1);
    await markSectionRead(10, 'forum', 7);
    expect(mockRepo.markSectionRead).toHaveBeenCalledWith(10, ['FORUM_REPLY', 'FORUM_SOLUTION'], 7);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'unread-count',
      payload: state(1),
    });
  });

  it('markSectionRead reads a whole section when no entity is given', async () => {
    mockRepo.markSectionRead.mockResolvedValue(1);
    await markSectionRead(10, 'connections');
    expect(mockRepo.markSectionRead).toHaveBeenCalledWith(
      10,
      ['CONNECTION_REQUEST', 'CONNECTION_ACCEPTED'],
      undefined,
    );
  });

  it('markSectionRead pushes nothing when nothing was unread', async () => {
    mockRepo.markSectionRead.mockResolvedValue(0);
    await markSectionRead(10, 'support', 3);
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
  });
});

describe('notifications.service notices', () => {
  it('shapes the rows the dashboard still has to show, in their order', async () => {
    mockRepo.listNotices.mockResolvedValue([
      row({ id: 3, type: 'ANNOUNCEMENT', entityId: 1, data: { text: 'Hi' } }),
      row({ id: 5, type: 'POLL', entityId: 2, data: { text: 'Which?' } }),
    ]);
    const notices = await getNotices(10);
    expect(mockRepo.listNotices).toHaveBeenCalledWith(10);
    expect(notices.map((n) => [n.id, n.type, n.data])).toEqual([
      [3, 'ANNOUNCEMENT', { text: 'Hi' }],
      [5, 'POLL', { text: 'Which?' }],
    ]);
    expect(notices[0].createdAt).toBe('2026-07-17T10:00:00.000Z');
  });

  it('markShown stamps the ids and pushes nothing, the unread count stays', async () => {
    mockRepo.markShown.mockResolvedValue(2);
    await markShown(10, [3, 5]);
    expect(mockRepo.markShown).toHaveBeenCalledWith(10, [3, 5]);
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
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
      payload: state(0),
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
      payload: state(2),
    });
  });

  it('markOneRead pushes nothing when the row was already read', async () => {
    mockRepo.markOneRead.mockResolvedValue(0);
    await markOneRead(10, 7);
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
  });

  it('markEntityRead pushes fresh counts when a row was cleared', async () => {
    mockRepo.markReadByEntity.mockResolvedValue(1);
    mockRepo.countUnread.mockResolvedValue(4);
    await markEntityRead(10, 'CONNECTION_REQUEST', 5);
    expect(mockRepo.markReadByEntity).toHaveBeenCalledWith(10, 'CONNECTION_REQUEST', 5);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(10, {
      channel: 'notification',
      type: 'unread-count',
      payload: state(4),
    });
  });

  it('markEntityRead pushes nothing when there was no matching unread row', async () => {
    mockRepo.markReadByEntity.mockResolvedValue(0);
    await markEntityRead(10, 'CONNECTION_REQUEST', 5);
    expect(mockWs.pushToUser).not.toHaveBeenCalled();
  });

  it('markEntityRead never throws (fire-and-forget)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRepo.markReadByEntity.mockRejectedValue(new Error('db down'));
    await expect(markEntityRead(10, 'CONNECTION_REQUEST', 5)).resolves.toBeUndefined();
    spy.mockRestore();
  });
});

describe('notifications.service announce', () => {
  const sent = (userId: number) =>
    row({ id: 100 + userId, userId, type: 'ANNOUNCEMENT', entityId: 0, data: { text: 'Hi' } });

  it('inserts it for everyone at once and pushes it only to those online', async () => {
    mockRepo.createAnnouncement.mockResolvedValue([sent(10), sent(11)]);
    mockWs.isUserOnline.mockImplementation((id: number) => id === 11);
    const count = await announce(2, 'Hi');
    expect(count).toBe(2);
    expect(mockRepo.createAnnouncement).toHaveBeenCalledWith(2, 'Hi');
    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockRepo.countUnread).toHaveBeenCalledTimes(1);
    expect(mockWs.pushToUser).not.toHaveBeenCalledWith(10, expect.anything());
    expect(mockWs.pushToUser).toHaveBeenCalledWith(11, {
      channel: 'notification',
      type: 'new',
      payload: expect.objectContaining({ id: 111, type: 'ANNOUNCEMENT', data: { text: 'Hi' } }),
    });
    expect(mockWs.pushToUser).toHaveBeenCalledWith(11, {
      channel: 'notification',
      type: 'unread-count',
      payload: state(3),
    });
  });

  it('still counts it sent when a live push fails for one user', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRepo.createAnnouncement.mockResolvedValue([sent(10), sent(11)]);
    mockWs.isUserOnline.mockReturnValue(true);
    mockRepo.countUnread.mockRejectedValueOnce(new Error('boom'));
    await expect(announce(2, 'Hi')).resolves.toBe(2);
    expect(mockWs.pushToUser).toHaveBeenCalledWith(11, expect.anything());
    spy.mockRestore();
  });

  it('throws when the insert fails, so the admin hears of it', async () => {
    mockRepo.createAnnouncement.mockRejectedValue(new Error('db down'));
    await expect(announce(2, 'Hi')).rejects.toThrow('db down');
  });
});

describe('notifications.service listAnnouncements', () => {
  it('lists the last 50, naming the author while their account is there', async () => {
    const at = new Date('2026-10-28T10:00:00.000Z');
    mockRepo.listAnnouncements.mockResolvedValue([
      { id: 2, text: 'New course', createdAt: at, author: { name: 'Ada' } },
      { id: 1, text: 'Hello', createdAt: at, author: null },
    ]);
    expect(await listAnnouncements()).toEqual([
      { id: 2, text: 'New course', authorName: 'Ada', createdAt: '2026-10-28T10:00:00.000Z' },
      { id: 1, text: 'Hello', authorName: null, createdAt: '2026-10-28T10:00:00.000Z' },
    ]);
    expect(mockRepo.listAnnouncements).toHaveBeenCalledWith(50);
  });
});
