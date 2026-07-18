import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { UserSocketFrame } from '../../shared/notifications';

let wsInstances: MockWebSocket[] = [];

class MockWebSocket {
  url: string;
  closed = false;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: ((e: { code: number }) => void) | null = null;
  constructor(url: string) {
    this.url = url;
    wsInstances.push(this);
  }
  close() {
    this.closed = true;
  }
}

const frame: UserSocketFrame = {
  channel: 'notification',
  type: 'unread-count',
  payload: { unreadCount: 5 },
};

beforeEach(() => {
  wsInstances = [];
  vi.stubGlobal('WebSocket', MockWebSocket);
  vi.stubGlobal('location', { protocol: 'http:', host: 'localhost' });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const { useUserSocket } = await import('./useUserSocket');

describe('useUserSocket', () => {
  it('does not open a socket when disabled', () => {
    renderHook(() => useUserSocket(false, vi.fn()));
    expect(wsInstances).toHaveLength(0);
  });

  it('opens /ws/user and forwards parsed frames to the handler', () => {
    const onFrame = vi.fn();
    renderHook(() => useUserSocket(true, onFrame));
    expect(wsInstances[0].url).toBe('ws://localhost/ws/user');
    wsInstances[0].onmessage?.({ data: JSON.stringify(frame) });
    expect(onFrame).toHaveBeenCalledWith(frame);
  });

  it('ignores malformed frames', () => {
    const onFrame = vi.fn();
    renderHook(() => useUserSocket(true, onFrame));
    wsInstances[0].onmessage?.({ data: 'not-json' });
    expect(onFrame).not.toHaveBeenCalled();
  });

  it('reconnects after the socket closes', () => {
    vi.useFakeTimers();
    renderHook(() => useUserSocket(true, vi.fn()));
    expect(wsInstances).toHaveLength(1);
    wsInstances[0].onclose?.({ code: 1006 });
    vi.advanceTimersByTime(3000);
    expect(wsInstances).toHaveLength(2);
  });

  it.each([4401, 4404])('does not reconnect after a deliberate refusal (%i)', (code) => {
    vi.useFakeTimers();
    renderHook(() => useUserSocket(true, vi.fn()));
    wsInstances[0].onclose?.({ code });
    vi.advanceTimersByTime(3000);
    expect(wsInstances).toHaveLength(1);
  });

  it('closes the socket and cancels reconnect on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useUserSocket(true, vi.fn()));
    const ws = wsInstances[0];
    unmount();
    expect(ws.closed).toBe(true);
    ws.onclose?.({ code: 1006 });
    vi.advanceTimersByTime(3000);
    expect(wsInstances).toHaveLength(1);
  });

  it('uses wss:// over https', () => {
    vi.stubGlobal('location', { protocol: 'https:', host: 'example.com' });
    renderHook(() => useUserSocket(true, vi.fn()));
    expect(wsInstances[0].url).toBe('wss://example.com/ws/user');
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
    expect(() => renderHook(() => useUserSocket(true, vi.fn()))).not.toThrow();
  });

  it('is a no-op when WebSocket is unavailable', () => {
    vi.stubGlobal('WebSocket', undefined);
    const { unmount } = renderHook(() => useUserSocket(true, vi.fn()));
    expect(() => unmount()).not.toThrow();
  });
});
