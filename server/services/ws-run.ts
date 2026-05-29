import type { IncomingMessage, Server as HttpServer } from 'http';
import { WebSocketServer, type WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import type { TokenPayload } from '../../shared/auth.js';
import { handleInteractiveRun } from './interactive-execution.service.js';

// Reject oversized frames before they are buffered/parsed.
const MAX_PAYLOAD_BYTES = 128 * 1024;
// Limits are keyed per identity: `user:<id>` for authenticated users,
// `anon:<ip>` for guests. Running code is open to guests (only progress needs
// an account); the per-key limits keep guests from spawning docker unbounded.
// The app runs as a single process.
const MAX_ACTIVE_RUNS_PER_KEY = 5;
const MAX_RUNS_PER_WINDOW = 60;
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

// Rate-limit identity: authenticated users by id, guests by client IP.
// NOTE: behind a proxy this trusts X-Forwarded-For; nginx must set a
// trustworthy client-IP header (otherwise guests share one bucket).
export function clientKey(req: IncomingMessage): string {
  const userId = verifyToken(parseTokenCookie(req.headers.cookie));
  if (userId !== null) return `user:${userId}`;
  const xff = req.headers['x-forwarded-for'];
  const ip =
    (typeof xff === 'string' && xff.length > 0 ? xff.split(',')[0].trim() : undefined) ??
    req.socket?.remoteAddress ??
    'unknown';
  return `anon:${ip}`;
}

const recentRuns = new Map<string, number[]>();
const activeRuns = new Map<string, number>();

export function tryStartRun(key: string, now = Date.now()): boolean {
  const window = (recentRuns.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recentRuns.set(key, window);
  if (window.length >= MAX_RUNS_PER_WINDOW) return false;
  if ((activeRuns.get(key) ?? 0) >= MAX_ACTIVE_RUNS_PER_KEY) return false;
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
  // Running code is open to guests; we rate-limit per identity instead of
  // requiring an account (only saving progress needs one).
  const key = clientKey(req);

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
    if (!tryStartRun(key)) {
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
      endRun(key);
      counted = false;
    }
  });
}

export function attachRunWebSocket(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server, path: '/ws/run', maxPayload: MAX_PAYLOAD_BYTES });
  wss.on('connection', handleConnection);
  return wss;
}
