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

const { parseTokenCookie, verifyToken, tryStartRun, endRun, handleConnection } =
  await import('./ws-run.js');

class FakeWs extends EventEmitter {
  OPEN = 1;
  readyState = 1;
  send = vi.fn();
  close = vi.fn();
}

function fakeReq(cookie?: string): IncomingMessage {
  return { headers: cookie ? { cookie } : {} } as unknown as IncomingMessage;
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

describe('tryStartRun / endRun', () => {
  it('blocks once active runs exceed the per-user cap', () => {
    const uid = 1001;
    for (let i = 0; i < 5; i++) expect(tryStartRun(uid)).toBe(true);
    expect(tryStartRun(uid)).toBe(false);
    endRun(uid);
    expect(tryStartRun(uid)).toBe(true);
  });

  it('blocks once the per-window run count is exceeded', () => {
    const uid = 1002;
    const now = 5_000_000;
    for (let i = 0; i < 60; i++) {
      expect(tryStartRun(uid, now)).toBe(true);
      endRun(uid);
    }
    expect(tryStartRun(uid, now)).toBe(false);
  });
});

describe('handleConnection', () => {
  it('closes unauthenticated connections with 4401', () => {
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq());
    expect(ws.close).toHaveBeenCalledWith(4401, 'Unauthorized');
  });

  it('runs code on a valid run message', () => {
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
    const uid = 2003;
    for (let i = 0; i < 5; i++) tryStartRun(uid);
    const ws = new FakeWs();
    handleConnection(ws as unknown as WebSocket, fakeReq(`token=${token(uid)}`));
    ws.emit('message', JSON.stringify({ type: 'run', code: 'x', language: 'python' }));
    expect(mockRun).not.toHaveBeenCalled();
    expect(ws.close).toHaveBeenCalledWith(4429, 'Rate limit');
  });
});
