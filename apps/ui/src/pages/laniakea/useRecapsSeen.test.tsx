import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  markSeen: vi.fn(),
  clearSection: vi.fn(),
  laniakea: 0,
}));
vi.mock('../../services/laniakeaService', () => ({ markSeen: h.markSeen }));
vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({
    sections: { forum: [], support: [], connections: 0, laniakea: h.laniakea },
    clearSection: h.clearSection,
  }),
}));

import { useRecapsSeen } from './useRecapsSeen';

beforeEach(() => {
  vi.clearAllMocks();
  h.laniakea = 0;
  h.markSeen.mockResolvedValue(undefined);
});

describe('useRecapsSeen', () => {
  it('tells the server once when the board shows, with nothing to clear', () => {
    const { rerender } = renderHook(() => useRecapsSeen(true));
    rerender();
    expect(h.markSeen).toHaveBeenCalledTimes(1);
    expect(h.clearSection).not.toHaveBeenCalled();
  });

  it('tells nothing while the board is not on screen', () => {
    h.laniakea = 3;
    const { rerender } = renderHook(({ shown }) => useRecapsSeen(shown), {
      initialProps: { shown: false },
    });
    expect(h.markSeen).not.toHaveBeenCalled();
    expect(h.clearSection).not.toHaveBeenCalled();
    rerender({ shown: true });
    expect(h.markSeen).toHaveBeenCalledTimes(1);
    expect(h.clearSection).toHaveBeenCalledWith('laniakea');
  });

  it('tells the server again when one comes in while the board shows', () => {
    const { rerender } = renderHook(() => useRecapsSeen(true));
    h.laniakea = 2;
    rerender();
    expect(h.markSeen).toHaveBeenCalledTimes(2);
    expect(h.clearSection).toHaveBeenCalledWith('laniakea');
    h.laniakea = 0;
    rerender();
    expect(h.markSeen).toHaveBeenCalledTimes(2);
  });

  it('keeps the game going when the server cannot be told', async () => {
    h.markSeen.mockRejectedValue(new Error('offline'));
    renderHook(() => useRecapsSeen(true));
    await waitFor(() => expect(h.markSeen).toHaveBeenCalled());
  });
});
