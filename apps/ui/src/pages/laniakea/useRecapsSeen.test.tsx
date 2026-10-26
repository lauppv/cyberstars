import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { NotificationDTO } from '@cyberstars/shared/notifications';

const h = vi.hoisted(() => ({
  markSeen: vi.fn(),
  noteRead: vi.fn(),
  items: [] as NotificationDTO[],
}));
vi.mock('../../services/laniakeaService', () => ({ markSeen: h.markSeen }));
vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({ items: h.items, noteRead: h.noteRead }),
}));

import { useRecapsSeen } from './useRecapsSeen';

function n(
  id: number,
  type: NotificationDTO['type'],
  readAt: string | null = null,
): NotificationDTO {
  return {
    id,
    type,
    entityId: 0,
    data: { count: 2 },
    actor: null,
    readAt,
    createdAt: new Date().toISOString(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  h.items = [];
  h.markSeen.mockResolvedValue(undefined);
});

describe('useRecapsSeen', () => {
  it('tells the server once when the board shows', () => {
    const { rerender } = renderHook(() => useRecapsSeen(true));
    rerender();
    expect(h.markSeen).toHaveBeenCalledTimes(1);
  });

  it('tells nothing while the board is not on screen', () => {
    h.items = [n(3, 'LANIAKEA_RECAP')];
    const { rerender } = renderHook(({ shown }) => useRecapsSeen(shown), {
      initialProps: { shown: false },
    });
    expect(h.markSeen).not.toHaveBeenCalled();
    expect(h.noteRead).not.toHaveBeenCalled();
    rerender({ shown: true });
    expect(h.markSeen).toHaveBeenCalledTimes(1);
    expect(h.noteRead).toHaveBeenCalledWith(3);
  });

  it('shows the unread recap notification read, and only that one', () => {
    h.items = [
      n(3, 'LANIAKEA_RECAP'),
      n(2, 'LANIAKEA_RECAP', '2026-10-25T10:00:00Z'),
      n(1, 'FORUM_REPLY'),
    ];
    renderHook(() => useRecapsSeen(true));
    expect(h.noteRead.mock.calls).toEqual([[3]]);
    expect(h.markSeen).toHaveBeenCalledTimes(1);
  });

  it('tells the server again when one comes in while the board shows', () => {
    const { rerender } = renderHook(() => useRecapsSeen(true));
    h.items = [n(4, 'LANIAKEA_RECAP')];
    rerender();
    expect(h.markSeen).toHaveBeenCalledTimes(2);
    expect(h.noteRead).toHaveBeenCalledWith(4);
    h.items = [n(4, 'LANIAKEA_RECAP', '2026-10-25T10:00:00Z')];
    rerender();
    expect(h.markSeen).toHaveBeenCalledTimes(2);
  });

  it('keeps the game going when the server cannot be told', async () => {
    h.markSeen.mockRejectedValue(new Error('offline'));
    renderHook(() => useRecapsSeen(true));
    await waitFor(() => expect(h.markSeen).toHaveBeenCalled());
  });
});
