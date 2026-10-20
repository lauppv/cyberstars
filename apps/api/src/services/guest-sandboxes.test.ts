import { describe, it, expect, vi } from 'vitest';
import { addGuestSandboxSource, makeRoomForGuest } from './guest-sandboxes.js';

// One source standing in for the services, holding whatever a test puts in it
const held = new Map<string, { lastActivity: number; busy: boolean; close: () => void }[]>();
addGuestSandboxSource((ip) => held.get(ip) ?? []);

function sandbox(lastActivity: number, busy = false) {
  return { lastActivity, busy, close: vi.fn() };
}

describe('makeRoomForGuest', () => {
  it('leaves a network under its limit alone', () => {
    const a = sandbox(1);
    held.set('1.1.1.1', [a]);
    makeRoomForGuest('1.1.1.1', 2);
    expect(a.close).not.toHaveBeenCalled();
  });

  it("closes the network's least recently used idle sandbox at the limit", () => {
    const busyOld = sandbox(1, true);
    const idleNew = sandbox(5);
    const idleOld = sandbox(3);
    held.set('2.2.2.2', [busyOld, idleNew, idleOld]);
    makeRoomForGuest('2.2.2.2', 3);
    expect(idleOld.close).toHaveBeenCalled();
    expect(idleNew.close).not.toHaveBeenCalled();
    expect(busyOld.close).not.toHaveBeenCalled();
  });

  it('closes as many as it takes when a network holds more than the limit', () => {
    const sandboxes = [sandbox(1), sandbox(2), sandbox(3)];
    held.set('3.3.3.3', sandboxes);
    makeRoomForGuest('3.3.3.3', 2);
    expect(sandboxes.map((s) => s.close.mock.calls.length)).toEqual([1, 1, 0]);
  });

  it('turns the guest away with a 429 when every sandbox is busy', () => {
    held.set('4.4.4.4', [sandbox(1, true), sandbox(2, true)]);
    expect(() => makeRoomForGuest('4.4.4.4', 2)).toThrow(
      expect.objectContaining({
        statusCode: 429,
        message:
          'Too many guest runs from your network right now. Try again in a minute, or sign in.',
      }),
    );
  });

  it('counts only the network asked about', () => {
    const other = sandbox(1);
    held.set('5.5.5.5', [other]);
    makeRoomForGuest('6.6.6.6', 1);
    expect(other.close).not.toHaveBeenCalled();
  });
});
