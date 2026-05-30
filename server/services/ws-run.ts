import type { IncomingMessage, Server as HttpServer } from 'http';
import { WebSocketServer, type WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import type { TokenPayload } from '../../shared/auth.js';
import { handleInteractiveRun } from './interactive-execution.service.js';

// Reject oversized frames before they are buffered/parsed.
const MAX_PAYLOAD_BYTES = 128 * 1024;
const MAX_ACTIVE_RUNS = 5;
const MAX_RUNS_PER_WINDOW = 60;
const GUEST_MAX_RUNS_PER_WINDOW = 15;
const GUEST_MAX_ACTIVE_RUNS = 2;
const RATE_WINDOW_MS = 60_000;

export function parseTokenCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === 'token') {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}

export function verifyToken(token: string | null): number | null {
  if (!token) return null;
  try {
    return (jwt.verify(token, config.jwt.secret) as TokenPayload).id;
  } catch {
    return null;
  }
}

export function extractIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

const recentRuns = new Map<string, number[]>();
const activeRuns = new Map<string, number>();

export function tryStartRun(key: string, isGuest: boolean, now = Date.now()): boolean {
  const maxWindow = isGuest ? GUEST_MAX_RUNS_PER_WINDOW : MAX_RUNS_PER_WINDOW;
  const maxActive = isGuest ? GUEST_MAX_ACTIVE_RUNS : MAX_ACTIVE_RUNS;
  const window = (recentRuns.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recentRuns.set(key, window);
  if (window.length >= maxWindow) return false;
  if ((activeRuns.get(key) ?? 0) >= maxActive) return false;
  window.push(now);
  activeRuns.set(key, (activeRuns.get(key) ?? 0) + 1);
  return true;
}

export function endRun(key: string): void {
  const remaining = (activeRuns.get(key) ?? 0) - 1;
  if (remaining <= 0) activeRuns.delete(key);
  else activeRuns.set(key, remaining);
}

export function handleConnection(ws: WebSocket, req: IncomingMessage): void {
  const userId = verifyToken(parseTokenCookie(req.headers.cookie));
  const isGuest = userId === null;
  const rateKey = isGuest ? `ip:${extractIp(req)}` : `user:${userId}`;

  let started = false;
  let counted = false;

  ws.on('message', (raw) => {
    if (started) return;
    let msg: { type?: string; code?: string; language?: string };
    try {
      msg = JSON.parse(typeof raw === 'string' ? raw : raw.toString());
    } catch {
      return;
    }
    if (msg.type !== 'run' || typeof msg.code !== 'string' || typeof msg.language !== 'string') {
      return;
    }
    if (!tryStartRun(rateKey, isGuest)) {
      ws.send(JSON.stringify({ type: 'stderr', data: 'Too many runs — please wait a moment.\n' }));
      ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      ws.close(4429, 'Rate limit');
      return;
    }
    started = true;
    counted = true;
    handleInteractiveRun(ws, msg.code, msg.language).catch((err) => {
      console.error('[ws/run] execution error:', err);
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'stderr', data: 'Internal error.\n' }));
        ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      }
    });
  });

  ws.on('close', () => {
    if (counted) {
      endRun(rateKey);
      counted = false;
    }
  });
}

export function attachRunWebSocket(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server, path: '/ws/run', maxPayload: MAX_PAYLOAD_BYTES });
  wss.on('connection', handleConnection);
  return wss;
}
