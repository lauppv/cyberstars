import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { NotificationDTO } from '@cyberstars/shared/notifications';

const h = vi.hoisted(() => ({
  markSeen: vi.fn(),
  markOneRead: vi.fn(),
  items: [] as NotificationDTO[],
}));
vi.mock('../../services/laniakeaService', () => ({ markSeen: h.markSeen }));
vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({ items: h.items, markOneRead: h.markOneRead }),
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
  it('tells the server once when the game opens', () => {
    const { rerender } = renderHook(() => useRecapsSeen());
    rerender();
    expect(h.markSeen).toHaveBeenCalledTimes(1);
  });

  it('reads the unread recap notification the bell holds, and only that one', () => {
    h.items = [
      n(3, 'LANIAKEA_RECAP'),
      n(2, 'LANIAKEA_RECAP', '2026-10-25T10:00:00Z'),
      n(1, 'FORUM_REPLY'),
    ];
    renderHook(() => useRecapsSeen());
    expect(h.markOneRead.mock.calls).toEqual([[3]]);
  });

  it('reads one that comes in while the game is open', () => {
    const { rerender } = renderHook(() => useRecapsSeen());
    expect(h.markOneRead).not.toHaveBeenCalled();
    h.items = [n(4, 'LANIAKEA_RECAP')];
    rerender();
    expect(h.markOneRead).toHaveBeenCalledWith(4);
  });

  it('keeps the game going when the server cannot be told', async () => {
    h.markSeen.mockRejectedValue(new Error('offline'));
    renderHook(() => useRecapsSeen());
    await waitFor(() => expect(h.markSeen).toHaveBeenCalled());
  });
});
