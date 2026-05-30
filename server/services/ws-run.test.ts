import { describe, it, expect, vi, beforeEach } from 'vitest';
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

const { parseTokenCookie, verifyToken, tryStartRun, endRun, handleConnection, extractIp } =
  await import('./ws-run.js');

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
});

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
});

describe('verifyToken', () => {
  it('returns null for null/invalid tokens', () => {
    expect(verifyToken(null)).toBeNull();
    expect(verifyToken('garbage')).toBeNull();
  });
  it('returns the user id for a valid token', () => {
    expect(verifyToken(token(7))).toBe(7);
  });
});

describe('extractIp', () => {
  it('returns x-forwarded-for first entry when present', () => {
    const req = { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }, socket: { remoteAddress: '127.0.0.1' } } as unknown as IncomingMessage;
    expect(extractIp(req)).toBe('1.2.3.4');
  });
  it('falls back to socket.remoteAddress', () => {
    const req = { headers: {}, socket: { remoteAddress: '10.0.0.1' } } as unknown as IncomingMessage;
    expect(extractIp(req)).toBe('10.0.0.1');
  });
});

describe('tryStartRun / endRun', () => {
  it('blocks once active runs exceed the per-user cap', () => {
    const key = 'user:1001';
    for (let i = 0; i < 5; i++) expect(tryStartRun(key, false)).toBe(true);
    expect(tryStartRun(key, false)).toBe(false);
    endRun(key);
    expect(tryStartRun(key, false)).toBe(true);
  });

  it('blocks once the per-window run count is exceeded', () => {
    const key = 'user:1002';
    const now = 5_000_000;
    for (let i = 0; i < 60; i++) {
      expect(tryStartRun(key, false, now)).toBe(true);
      endRun(key);
    }
    expect(tryStartRun(key, false, now)).toBe(false);
  });

  it('applies stricter limits for guests', () => {
    const key = 'ip:192.168.1.1';
    for (let i = 0; i < 2; i++) expect(tryStartRun(key, true)).toBe(true);
    expect(tryStartRun(key, true)).toBe(false);
    endRun(key);
    expect(tryStartRun(key, true)).toBe(true);
  });

  it('blocks guest per-window at 15 runs', () => {
    const key = 'ip:192.168.1.2';
    const now = 6_000_000;
    for (let i = 0; i < 15; i++) {
      expect(tryStartRun(key, true, now)).toBe(true);
      endRun(key);
    }
    expect(tryStartRun(key, true, now)).toBe(false);
  });
});

describe('handleConnection', () => {
  it('allows guest connections (no token) and runs code', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(undefined, '10.0.0.50'));
    expect(ws.close).not.toHaveBeenCalled();
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' }));
    expect(mockRun).toHaveBeenCalledWith(ws, 'print(1)', 'python');
    ws.emit('close');
  });

  it('runs code on a valid run message (authenticated)', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(`token=${token(2001)}`));
    ws.emit('message', JSON.stringify({ type: 'run', code: 'print(1)', language: 'python' }));
    expect(mockRun).toHaveBeenCalledWith(ws, 'print(1)', 'python');
    ws.emit('close');
  });

  it('ignores malformed and non-run messages', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(`token=${token(2002)}`));
    ws.emit('message', 'not json');
    ws.emit('message', JSON.stringify({ type: 'stdin', data: 'x' }));
    expect(mockRun).not.toHaveBeenCalled();
    ws.emit('close');
  });

  it('rejects runs when the user is rate limited', () => {
    const key = 'user:2003';
    for (let i = 0; i < 5; i++) tryStartRun(key, false);
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(`token=${token(2003)}`));
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    expect(mockRun).not.toHaveBeenCalled();
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
  });

  it('rate-limits guests by IP with stricter limits', () => {
    const guestIp = '10.99.99.99';
    const key = `ip:${guestIp}`;
    for (let i = 0; i < 2; i++) tryStartRun(key, true);
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(undefined, guestIp));
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    expect(mockRun).not.toHaveBeenCalled();
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
  });
});
