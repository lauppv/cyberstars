import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

let wsInstances: MockWebSocket[] = [];

class MockWebSocket {
  url: string;
  closed = false;
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
    const { unmount } = renderHook(() => usePresence());
    expect(wsInstances).toHaveLength(1);
    expect(wsInstances[0].url).toContain('/ws/presence');
    unmount();
    expect(wsInstances[0].closed).toBe(true);
  });

  it('is a no-op when WebSocket is unavailable', () => {
    vi.stubGlobal('WebSocket', undefined);
    const { unmount } = renderHook(() => usePresence());
    expect(wsInstances).toHaveLength(0);
    expect(() => unmount()).not.toThrow();
  });

  it('uses wss:// when served over https', () => {
    vi.stubGlobal('location', { protocol: 'https:', host: 'example.com' });
    renderHook(() => usePresence());
    expect(wsInstances[0].url).toBe('wss://example.com/ws/presence');
    vi.unstubAllGlobals();
    vi.stubGlobal('WebSocket', MockWebSocket);
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
    const { unmount } = renderHook(() => usePresence());
    expect(() => unmount()).not.toThrow();
  });
});
