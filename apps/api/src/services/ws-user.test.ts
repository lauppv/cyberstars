import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { WebSocket } from 'ws';
import {
  registerUserSocket,
  unregisterUserSocket,
  pushToUser,
  clearUserSockets,
  closeUserSockets,
} from './ws-user.js';

function fakeSocket(open = true) {
  return {
    OPEN: 1,
    readyState: open ? 1 : 3,
    send: vi.fn(),
    close: vi.fn(),
  } as unknown as WebSocket & {
    send: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };
}

const frame = {
  channel: 'notification' as const,
  type: 'unread-count' as const,
  payload: { unreadCount: 2 },
};

beforeEach(() => clearUserSockets());

describe('ws-user registry', () => {
  it('delivers a frame to every open socket the user has', () => {
    const a = fakeSocket();
    const b = fakeSocket();
    registerUserSocket(1, a);
    registerUserSocket(1, b);
    pushToUser(1, frame);
    expect(a.send).toHaveBeenCalledWith(JSON.stringify(frame));
    expect(b.send).toHaveBeenCalledWith(JSON.stringify(frame));
  });

  it('skips sockets that are not open', () => {
    const closed = fakeSocket(false);
    registerUserSocket(1, closed);
    pushToUser(1, frame);
    expect(closed.send).not.toHaveBeenCalled();
  });

  it('is a no-op when the user has no sockets', () => {
    expect(() => pushToUser(999, frame)).not.toThrow();
  });

  it('drops the user entry once the last socket unregisters', () => {
    const a = fakeSocket();
    registerUserSocket(1, a);
    unregisterUserSocket(1, a);
    pushToUser(1, frame);
    expect(a.send).not.toHaveBeenCalled();
  });

  it('unregister is a no-op for an unknown user', () => {
    expect(() => unregisterUserSocket(42, fakeSocket())).not.toThrow();
  });

  it('closes every socket of a user whose sessions ended, so tabs try again', () => {
    const a = fakeSocket();
    const b = fakeSocket();
    const other = fakeSocket();
    registerUserSocket(1, a);
    registerUserSocket(1, b);
    registerUserSocket(2, other);
    closeUserSockets(1);
    expect(a.close).toHaveBeenCalledWith(4000, 'Session ended');
    expect(b.close).toHaveBeenCalledWith(4000, 'Session ended');
    expect(other.close).not.toHaveBeenCalled();
  });

  it('closing a user with no sockets is a no-op', () => {
    expect(() => closeUserSockets(999)).not.toThrow();
  });
});
