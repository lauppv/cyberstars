import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

let wsInstances: MockWebSocket[] = [];

class MockWebSocket {
  url: string;
  closed = false;
  onclose: (() => void) | null = null;
  constructor(url: string) {
    this.url = url;
    wsInstances.push(this);
  }
  close() {
    this.closed = true;
  }
}

vi.stubGlobal('WebSocket', MockWebSocket);

const { usePresence } = await import('./usePresence');

beforeEach(() => {
  wsInstances = [];
  vi.stubGlobal('WebSocket', MockWebSocket);
});

describe('usePresence', () => {
  it('opens one presence socket and closes it on unmount', () => {
    const { unmount } = renderHook(() => usePresence(null));
    expect(wsInstances).toHaveLength(1);
    expect(wsInstances[0].url).toContain('/ws/presence');
    unmount();
    expect(wsInstances[0].closed).toBe(true);
  });

  it('is a no-op when WebSocket is unavailable', () => {
    vi.stubGlobal('WebSocket', undefined);
    const { unmount } = renderHook(() => usePresence(null));
    expect(wsInstances).toHaveLength(0);
    expect(() => unmount()).not.toThrow();
  });

  it('uses wss:// when served over https', () => {
    vi.stubGlobal('location', { protocol: 'https:', host: 'example.com' });
    renderHook(() => usePresence(null));
    expect(wsInstances[0].url).toBe('wss://example.com/ws/presence');
    vi.unstubAllGlobals();
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  it('waits until it knows who is signed in', () => {
    renderHook(() => usePresence(undefined));
    expect(wsInstances).toHaveLength(0);
  });

  it('opens a new socket when the account changes', () => {
    const { rerender } = renderHook(({ id }) => usePresence(id), {
      initialProps: { id: null as number | null },
    });
    rerender({ id: 7 });
    expect(wsInstances).toHaveLength(2);
    expect(wsInstances[0].closed).toBe(true);
    expect(wsInstances[1].closed).toBe(false);
  });

  it('opens it again after the server drops it, but not once unmounted', () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => usePresence(null));
    wsInstances[0].onclose?.();
    vi.advanceTimersByTime(3000);
    expect(wsInstances).toHaveLength(2);
    unmount();
    wsInstances[1].onclose?.();
    vi.advanceTimersByTime(3000);
    expect(wsInstances).toHaveLength(2);
    vi.useRealTimers();
  });

  it('stops a pending reconnect on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => usePresence(null));
    wsInstances[0].onclose?.();
    unmount();
    vi.advanceTimersByTime(3000);
    expect(wsInstances).toHaveLength(1);
    vi.useRealTimers();
  });

  it('swallows a constructor error', () => {
    vi.stubGlobal(
      'WebSocket',
      class {
        constructor() {
          throw new Error('blocked');
        }
      },
    );
    const { unmount } = renderHook(() => usePresence(null));
    expect(() => unmount()).not.toThrow();
  });
});
