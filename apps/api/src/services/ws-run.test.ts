import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import jwt from 'jsonwebtoken';
import type { IncomingMessage } from 'http';
import type { WebSocket } from 'ws';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockRun = vi.fn();
vi.mock('./interactive-execution.service.js', () => ({
  handleInteractiveRun: (...args: unknown[]) => mockRun(...args),
}));

// A run that names its lesson goes through the hidden part (harness.test.ts
// covers the wrapping itself).
const mockProgramForRun = vi.fn((code: string, _language: string, lesson: unknown) =>
  lesson ? `wrapped: ${code}` : code,
);
vi.mock('./harness.js', () => ({
  programForRun: (code: string, language: string, lesson: unknown) =>
    mockProgramForRun(code, language, lesson),
}));

const openSessionMock = vi.fn();
const closeSessionMock = vi.fn();
vi.mock('./code-container.service.js', () => ({
  openSession: (...args: unknown[]) => openSessionMock(...args),
  closeSession: (...args: unknown[]) => closeSessionMock(...args),
}));

const registerUserSocketMock = vi.fn();
const unregisterUserSocketMock = vi.fn();
vi.mock('./ws-user.js', () => ({
  registerUserSocket: (...args: unknown[]) => registerUserSocketMock(...args),
  unregisterUserSocket: (...args: unknown[]) => unregisterUserSocketMock(...args),
}));

const getRoleMock = vi.fn();
vi.mock('../repositories/user.repository.js', () => ({
  getRole: (...args: unknown[]) => getRoleMock(...args),
}));

// The upgrade's session check; by default a token signs in whoever it names
const sessionUserIdMock = vi.fn();
vi.mock('./auth.service.js', () => ({
  sessionUserId: (...args: unknown[]) => sessionUserIdMock(...args),
}));

// A stand-in WebSocketServer that hands the upgrade straight to the connection
// handler, so the upgrade router can be driven without real sockets.
vi.mock('ws', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ws')>();
  const { EventEmitter: EE } = await import('node:events');
  class FakeWebSocketServer extends EE {
    close = vi.fn();
    handleUpgrade(
      req: unknown,
      _socket: unknown,
      _head: unknown,
      cb: (ws: unknown, req: unknown) => void,
    ) {
      cb(upgradedSocket, req);
    }
  }
  return { ...actual, WebSocketServer: FakeWebSocketServer };
});

/** The socket the faked WebSocketServer hands to the connection handlers. */
let upgradedSocket: { close: ReturnType<typeof vi.fn>; emit: (event: string) => void };

const {
  parseTokenCookie,
  tryStartRun,
  endRun,
  handleConnection,
  handlePresenceConnection,
  attachRunWebSocket,
  resolveOwner,
  extractIp,
} = await import('./ws-run.js');

const { GUEST_RUN_BUDGET, recordGuestRun } = await import('./guest-budget.service.js');
const { config } = await import('../config/index.js');

class FakeWs extends EventEmitter {
  OPEN = 1;
  readyState = 1;
  send = vi.fn();
  close = vi.fn();
}

function fakeReq(cookie?: string, ip = '127.0.0.1'): IncomingMessage {
  return {
    headers: cookie ? { cookie } : {},
    socket: { remoteAddress: ip },
  } as unknown as IncomingMessage;
}

const token = (id: number) => jwt.sign({ id }, 'test-secret');

beforeEach(() => {
  vi.clearAllMocks();
  mockRun.mockResolvedValue(undefined);
  sessionUserIdMock.mockImplementation(async (t: string | null) =>
    t ? (jwt.verify(t, 'test-secret') as { id: number }).id : null,
  );
});

// lets the upgrade's async session check finish
const settle = () => new Promise((r) => setImmediate(r));

describe('parseTokenCookie', () => {
  it('returns null when no header', () => {
    expect(parseTokenCookie(undefined)).toBeNull();
  });
  it('extracts the token among other cookies', () => {
    expect(parseTokenCookie('a=1; token=abc123; b=2')).toBe('abc123');
  });
  it('returns null when token cookie absent', () => {
    expect(parseTokenCookie('a=1; b=2')).toBeNull();
  });
  it('skips malformed cookie parts that have no = separator', () => {
    expect(parseTokenCookie('flag; token=abc123')).toBe('abc123');
  });
});

describe('extractIp', () => {
  const forwardedReq = {
    headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    socket: { remoteAddress: '127.0.0.1' },
  } as unknown as IncomingMessage;

  it('on production, takes the hop nginx appended, not one the client wrote', () => {
    Object.assign(config, { isProduction: true });
    try {
      expect(extractIp(forwardedReq)).toBe('5.6.7.8');
    } finally {
      Object.assign(config, { isProduction: false });
    }
  });
  it('ignores x-forwarded-for outside production, where no proxy vouches for it', () => {
    expect(extractIp(forwardedReq)).toBe('127.0.0.1');
  });
  it('falls back to socket.remoteAddress', () => {
    const req = {
      headers: {},
      socket: { remoteAddress: '10.0.0.1' },
    } as unknown as IncomingMessage;
    expect(extractIp(req)).toBe('10.0.0.1');
  });
  it('returns "unknown" when neither header nor remoteAddress is set', () => {
    const req = { headers: {}, socket: {} } as unknown as IncomingMessage;
    expect(extractIp(req)).toBe('unknown');
  });
});

describe('resolveOwner', () => {
  it('keys logged-in users by id', () => {
    expect(resolveOwner(fakeReq(), 42)).toEqual({
      ownerKey: 'user:42',
      isGuest: false,
    });
  });

  it('keys guests by their per-browser guestId cookie', () => {
    expect(resolveOwner(fakeReq('guestId=abc-123'), null)).toEqual({
      ownerKey: 'guest:abc-123',
      isGuest: true,
    });
  });

  it('falls back to IP when a guest has no guestId cookie yet', () => {
    expect(resolveOwner(fakeReq(undefined, '9.9.9.9'), null)).toEqual({
      ownerKey: 'ip:9.9.9.9',
      isGuest: true,
    });
  });
});

describe('tryStartRun / endRun', () => {
  // Pins the 10-runs-per-minute limit: change either number and this fails.
  it('allows 10 runs per minute, then blocks with the remaining cooldown', () => {
    const key = 'user:1001';
    const start = 1_000_000;
    for (let i = 0; i < 10; i++) {
      expect(tryStartRun(key, start)).toEqual({ ok: true });
      endRun(key);
    }
    // 11th run, 25s into the window → blocked, 35s of cooldown left.
    expect(tryStartRun(key, start + 25_000)).toEqual({ ok: false, retryAfterMs: 35_000 });
  });

  it('applies the same limit to guests and logged-in users', () => {
    const start = 2_000_000;
    const guest = 'ip:192.168.1.1';
    const user = 'user:1002';
    for (let i = 0; i < 10; i++) {
      expect(tryStartRun(guest, start).ok).toBe(true);
      endRun(guest);
      expect(tryStartRun(user, start).ok).toBe(true);
      endRun(user);
    }
    expect(tryStartRun(guest, start).ok).toBe(false);
    expect(tryStartRun(user, start).ok).toBe(false);
  });

  it('resets the window after 60s', () => {
    const key = 'user:1003';
    const start = 3_000_000;
    for (let i = 0; i < 10; i++) {
      tryStartRun(key, start);
      endRun(key);
    }
    expect(tryStartRun(key, start).ok).toBe(false);
    expect(tryStartRun(key, start + 60_000)).toEqual({ ok: true });
  });

  it('caps concurrent active runs independently of the window', () => {
    const key = 'user:1004';
    const start = 4_000_000;
    for (let i = 0; i < 5; i++) expect(tryStartRun(key, start).ok).toBe(true);
    expect(tryStartRun(key, start)).toEqual({ ok: false, active: true });
    endRun(key);
    expect(tryStartRun(key, start).ok).toBe(true);
  });

  it('endRun is a harmless no-op for a key with no active runs', () => {
    expect(() => endRun('user:never-started')).not.toThrow();
  });
});

describe('handleConnection', () => {
  it('allows guest connections (no token) and runs code', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(undefined, '10.0.0.50'), null);
    expect(ws.close).not.toHaveBeenCalled();
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' }));
    // A guest's network goes along, for the sandboxes it may hold
    expect(mockRun).toHaveBeenCalledWith(ws, 'print(1)', 'python', 'ip:10.0.0.50', '10.0.0.50');
    ws.emit('close');
  });

  it('runs code on a valid run message (authenticated)', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 2001);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' }));
    expect(mockRun).toHaveBeenCalledWith(ws, 'print(1)', 'python', 'user:2001', undefined);
    ws.emit('close');
  });

  it("runs a challenge's function inside its hidden part when the run names the lesson", () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 2003);
    const lesson = { courseKey: 'algo-trees-graphs', lessonSlug: 'max-depth', lang: 'en' };
    ws.emit('message', JSON.stringify({ type: 'run', code: 'f()', language: 'python', lesson }));
    expect(mockProgramForRun).toHaveBeenCalledWith('f()', 'python', lesson);
    expect(mockRun).toHaveBeenCalledWith(ws, 'wrapped: f()', 'python', 'user:2003', undefined);
    ws.emit('close');
  });

  it('ignores malformed and non-run messages', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 2002);
    ws.emit('message', 'not json');
    ws.emit('message', JSON.stringify({ type: 'stdin', data: 'x' }));
    expect(mockRun).not.toHaveBeenCalled();
    ws.emit('close');
  });

  it('parses a Buffer frame the same as a string frame', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 2050);
    ws.emit(
      'message',
      Buffer.from(JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' })),
    );
    expect(mockRun).toHaveBeenCalledWith(ws, 'print(1)', 'python', 'user:2050', undefined);
    ws.emit('close');
  });

  it('ignores further messages once a run has started', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 2051);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' }));
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(2)', language: 'python' }));
    expect(mockRun).toHaveBeenCalledTimes(1);
    ws.emit('close');
  });

  it('skips the error reply when the socket is no longer open', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRun.mockRejectedValueOnce(new Error('boom'));
    const ws = new FakeWs();
    ws.readyState = 3; // CLOSED
    handleConnection(ws as unknown as WebSocket, fakeReq(), 3050);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    await Promise.resolve();
    await Promise.resolve();
    expect(ws.send).not.toHaveBeenCalled();
    ws.emit('close');
    errSpy.mockRestore();
  });

  it('lets a guest run within budget and records the run under their guestId', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq('guestId=budget-ok'), null);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' }));
    expect(mockRun).toHaveBeenCalledWith(ws, 'print(1)', 'python', 'guest:budget-ok', '127.0.0.1');
    ws.emit('close');
  });

  it('blocks a guest over budget with a sign-up nudge and no run', () => {
    const key = 'guest:budget-spent';
    for (let i = 0; i < GUEST_RUN_BUDGET; i++) recordGuestRun(key);
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq('guestId=budget-spent'), null);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' }));
    expect(mockRun).not.toHaveBeenCalled();
    const messages = ws.send.mock.calls.map((c) => JSON.parse(c[0] as string));
    expect(messages.some((m) => m.type === 'stderr' && /free account/.test(m.data))).toBe(true);
    ws.emit('close');
  });

  it('reports an internal error when the run handler rejects', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRun.mockRejectedValueOnce(new Error('boom'));
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 3001);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    await Promise.resolve();
    await Promise.resolve();
    const messages = ws.send.mock.calls.map((c) => JSON.parse(c[0] as string));
    expect(messages.some((m) => m.type === 'stderr' && /Internal error/.test(m.data))).toBe(true);
    ws.emit('close');
    errSpy.mockRestore();
  });

  it('rejects with a cooldown message when the per-minute limit is hit', () => {
    const key = 'user:2003';
    for (let i = 0; i < 10; i++) {
      tryStartRun(key);
      endRun(key);
    }
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 2003);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    expect(mockRun).not.toHaveBeenCalled();
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
    const messages = ws.send.mock.calls.map((c) => JSON.parse(c[0] as string));
    expect(messages.some((m) => m.type === 'stderr' && /per minute/.test(m.data))).toBe(true);
  });

  it('rejects with a busy message when the active-run cap is reached', () => {
    const key = 'user:2004';
    for (let i = 0; i < 5; i++) tryStartRun(key); // saturate concurrent runs
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(), 2004);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    expect(mockRun).not.toHaveBeenCalled();
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
    const messages = ws.send.mock.calls.map((c) => JSON.parse(c[0] as string));
    expect(messages.some((m) => m.type === 'stderr' && /in progress/.test(m.data))).toBe(true);
  });

  it('rate-limits guests by IP with the same limit', () => {
    const guestIp = '10.99.99.99';
    const key = `ip:${guestIp}`;
    for (let i = 0; i < 10; i++) {
      tryStartRun(key);
      endRun(key);
    }
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(undefined, guestIp), null);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    expect(mockRun).not.toHaveBeenCalled();
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
  });
});

describe('guest runs per IP', () => {
  const runAs = (guestId: string, ip: string) => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(`guestId=${guestId}`, ip), null);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    return ws;
  };

  it('stops a guest who rotates guestIds once their IP hits its per-minute cap', () => {
    const ip = '10.50.0.1';
    for (let i = 0; i < 60; i++) runAs(`rot-${i}`, ip).emit('close');
    expect(mockRun).toHaveBeenCalledTimes(60);

    const ws = runAs('rot-60', ip);
    expect(mockRun).toHaveBeenCalledTimes(60);
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
    const messages = ws.send.mock.calls.map((c) => JSON.parse(c[0] as string));
    expect(messages.some((m) => m.type === 'stderr' && /from your network/.test(m.data))).toBe(
      true,
    );
    // The refused attempt is handed back: that guest's own window is untouched.
    expect(tryStartRun('guest:rot-60')).toEqual({ ok: true });
    endRun('guest:rot-60');
  });

  it('counts a whole IPv6 block as one address, so rotating within it buys nothing', () => {
    // Anyone holding a /64 can pick a fresh address in it for every request.
    for (let i = 0; i < 60; i++) runAs(`v6-${i}`, `2001:db8:1:2::${i.toString(16)}`).emit('close');
    expect(mockRun).toHaveBeenCalledTimes(60);

    const ws = runAs('v6-60', '2001:db8:1:2:dead:beef:0:1');
    expect(mockRun).toHaveBeenCalledTimes(60);
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
  });

  it('reads an IPv4 address mapped into IPv6 as that IPv4 address', () => {
    for (let i = 0; i < 60; i++) runAs(`mapped-${i}`, '10.50.0.4').emit('close');
    runAs('mapped-60', '::ffff:10.50.0.4');
    expect(mockRun).toHaveBeenCalledTimes(60);
  });

  it('caps concurrent guest runs per IP, and frees the slot when a run ends', () => {
    const ip = '10.50.0.2';
    const open = Array.from({ length: 10 }, (_, i) => runAs(`busy-${i}`, ip));
    expect(mockRun).toHaveBeenCalledTimes(10);
    runAs('busy-10', ip);
    expect(mockRun).toHaveBeenCalledTimes(10);

    open[0].emit('close');
    runAs('busy-11', ip);
    expect(mockRun).toHaveBeenCalledTimes(11);
  });

  it('leaves logged-in users out of the per-IP guest gate', () => {
    const ip = '10.50.0.3';
    for (let i = 0; i < 10; i++) runAs(`crowd-${i}`, ip);
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(undefined, ip), 3001);
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    expect(mockRun).toHaveBeenCalledTimes(11);
  });
});

describe('handlePresenceConnection', () => {
  it('opens a session on connect and closes it on disconnect (authenticated)', () => {
    const ws = new FakeWs();
    handlePresenceConnection(ws as unknown as WebSocket, fakeReq(), 7);
    expect(openSessionMock).toHaveBeenCalledWith('user:7');
    expect(closeSessionMock).not.toHaveBeenCalled();
    ws.emit('close');
    expect(closeSessionMock).toHaveBeenCalledWith('user:7');
  });

  it('keys guests by IP', () => {
    const ws = new FakeWs();
    handlePresenceConnection(ws as unknown as WebSocket, fakeReq(undefined, '8.8.8.8'), null);
    expect(openSessionMock).toHaveBeenCalledWith('ip:8.8.8.8');
    ws.emit('close');
    expect(closeSessionMock).toHaveBeenCalledWith('ip:8.8.8.8');
  });
});

describe('attachRunWebSocket', () => {
  it('rejects unknown upgrade paths and detaches the listener on close', () => {
    const server = new EventEmitter() as unknown as Parameters<typeof attachRunWebSocket>[0];
    const handle = attachRunWebSocket(server);
    const socket = { destroy: vi.fn() };

    (server as unknown as EventEmitter).emit(
      'upgrade',
      { url: '/nope', headers: {} },
      socket,
      Buffer.alloc(0),
    );
    expect(socket.destroy).toHaveBeenCalled();

    expect((server as unknown as EventEmitter).listenerCount('upgrade')).toBe(1);
    handle.close();
    expect((server as unknown as EventEmitter).listenerCount('upgrade')).toBe(0);
  });
});

describe('upgrade origin check', () => {
  /** Sends one /ws/run upgrade with the given Origin header through the router. */
  async function upgradeFrom(origin?: string) {
    const server = new EventEmitter();
    attachRunWebSocket(server as unknown as Parameters<typeof attachRunWebSocket>[0]);
    const ws = new FakeWs();
    upgradedSocket = ws as unknown as typeof upgradedSocket;
    const socket = { write: vi.fn(), destroy: vi.fn() };
    server.emit(
      'upgrade',
      {
        url: '/ws/run',
        headers: origin === undefined ? {} : { origin },
        socket: { remoteAddress: '127.0.0.1' },
      },
      socket,
      Buffer.alloc(0),
    );
    await settle();
    ws.emit('message', JSON.stringify({ type: 'run', language: 'python', code: 'print(1)' }));
    return socket;
  }

  it('refuses a socket opened by a website not on the list', async () => {
    const socket = await upgradeFrom('https://evil.example');
    expect(socket.write).toHaveBeenCalledWith(expect.stringMatching(/^HTTP\/1\.1 403 /));
    expect(socket.destroy).toHaveBeenCalled();
    expect(mockRun).not.toHaveBeenCalled();
  });

  it('refuses the opaque origin of a sandboxed page', async () => {
    await upgradeFrom('null');
    expect(mockRun).not.toHaveBeenCalled();
  });

  it('accepts a socket opened by a listed website', async () => {
    const socket = await upgradeFrom(config.allowedOrigins[0]);
    expect(socket.destroy).not.toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });

  it('accepts a client that sends no origin', async () => {
    await upgradeFrom(undefined);
    expect(mockRun).toHaveBeenCalled();
  });
});

describe('upgrade routing', () => {
  /** Drives one upgrade through the real path router with a faked socket. */
  async function upgrade(url: string, cookie?: string, socket = { destroy: vi.fn() }) {
    const server = new EventEmitter();
    attachRunWebSocket(server as unknown as Parameters<typeof attachRunWebSocket>[0]);
    const ws = new FakeWs();
    upgradedSocket = ws as unknown as typeof upgradedSocket;
    server.emit(
      'upgrade',
      { url, headers: cookie ? { cookie } : {}, socket: { remoteAddress: '127.0.0.1' } },
      socket,
      Buffer.alloc(0),
    );
    await settle();
    return ws;
  }

  it('routes /ws/run to the run handler', async () => {
    const ws = await upgrade('/ws/run');
    ws.emit('message', JSON.stringify({ type: 'run', language: 'python', code: 'print(1)' }));
    expect(mockRun).toHaveBeenCalled();
  });

  it('routes /ws/presence to the presence handler', async () => {
    await upgrade('/ws/presence', `token=${token(7)}`);
    expect(sessionUserIdMock).toHaveBeenCalledWith(token(7));
    expect(openSessionMock).toHaveBeenCalledWith('user:7');
  });

  it('treats a session ended by a password change as a guest', async () => {
    sessionUserIdMock.mockResolvedValue(null);
    await upgrade('/ws/presence', `token=${token(7)}`);
    expect(openSessionMock).toHaveBeenCalledWith('ip:127.0.0.1');
  });

  it('drops the upgrade when the session check fails', async () => {
    sessionUserIdMock.mockRejectedValue(new Error('db down'));
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const socket = { destroy: vi.fn() };
    await upgrade('/ws/user', `token=${token(7)}`, socket);
    expect(socket.destroy).toHaveBeenCalled();
    expect(registerUserSocketMock).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('rejects a /ws/user upgrade from an ended session', async () => {
    sessionUserIdMock.mockResolvedValue(null);
    const ws = await upgrade('/ws/user', `token=${token(7)}`);
    await vi.waitFor(() => expect(ws.close).toHaveBeenCalledWith(4401, 'Unauthorized'));
    expect(registerUserSocketMock).not.toHaveBeenCalled();
  });

  it('rejects a /ws/user upgrade with no session', async () => {
    const ws = await upgrade('/ws/user');
    await vi.waitFor(() => expect(ws.close).toHaveBeenCalledWith(4401, 'Unauthorized'));
    expect(registerUserSocketMock).not.toHaveBeenCalled();
  });

  it('registers a /ws/user socket and unregisters it on close', async () => {
    const ws = await upgrade('/ws/user', `token=${token(7)}`);
    await vi.waitFor(() => expect(registerUserSocketMock).toHaveBeenCalledWith(7, ws));

    ws.emit('close');
    expect(unregisterUserSocketMock).toHaveBeenCalledWith(7, ws);
  });

  describe('on production', () => {
    beforeEach(() => {
      Object.assign(config, { isProduction: true });
    });
    afterEach(() => {
      Object.assign(config, { isProduction: false });
    });

    it('closes the socket for a user outside the preview gate', async () => {
      getRoleMock.mockResolvedValue('USER');
      const ws = await upgrade('/ws/user', `token=${token(7)}`);

      await vi.waitFor(() => expect(ws.close).toHaveBeenCalledWith(4404, 'Not found'));
      expect(getRoleMock).toHaveBeenCalledWith(7);
      expect(registerUserSocketMock).not.toHaveBeenCalled();
    });

    it('lets an admin through the preview gate', async () => {
      getRoleMock.mockResolvedValue('ADMIN');
      const ws = await upgrade('/ws/user', `token=${token(7)}`);

      await vi.waitFor(() => expect(registerUserSocketMock).toHaveBeenCalledWith(7, ws));
    });
  });
});
