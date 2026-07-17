import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { getNotifications, markRead, markOneRead } = await import('./notificationsService');

beforeEach(() => vi.clearAllMocks());

describe('notificationsService', () => {
  it('requests the first page with the default take', async () => {
    mockApi.get.mockResolvedValue({ items: [], unreadCount: 0 });
    await getNotifications();
    expect(mockApi.get).toHaveBeenCalledWith('/api/notifications?take=20');
  });

  it('appends the before cursor when paginating', async () => {
    mockApi.get.mockResolvedValue({ items: [], unreadCount: 0 });
    await getNotifications(10, 42);
    expect(mockApi.get).toHaveBeenCalledWith('/api/notifications?take=10&before=42');
  });

  it('posts the upToId to mark all read', async () => {
    mockApi.post.mockResolvedValue({ ok: true });
    await markRead(99);
    expect(mockApi.post).toHaveBeenCalledWith('/api/notifications/read', { upToId: 99 });
  });

  it('posts to the per-item read endpoint', async () => {
    mockApi.post.mockResolvedValue({ ok: true });
    await markOneRead(7);
    expect(mockApi.post).toHaveBeenCalledWith('/api/notifications/7/read');
  });
});
