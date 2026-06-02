import type { IncomingMessage, Server as HttpServer } from 'http';
import type { Duplex } from 'stream';
import { WebSocketServer, type WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import type { TokenPayload } from '../../shared/auth.js';
import { handleInteractiveRun } from './interactive-execution.service.js';
import { openSession, closeSession } from './code-container.service.js';
import { GUEST_RUN_BUDGET, guestRunsRemaining, recordGuestRun } from './guest-budget.service.js';

// Reject oversized frames before they are buffered/parsed.
const MAX_PAYLOAD_BYTES = 128 * 1024;
// Same limits for everyone (guest or logged-in): a fixed 60s window that opens
// on the first run and allows up to MAX_RUNS_PER_WINDOW runs before blocking
// until it resets. MAX_ACTIVE_RUNS caps concurrent in-flight runs on top of that.
const MAX_ACTIVE_RUNS = 5;
const MAX_RUNS_PER_WINDOW = 10;
const RATE_WINDOW_MS = 60_000;

function parseCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}

export function parseTokenCookie(cookieHeader: string | undefined): string | null {
  return parseCookie(cookieHeader, 'token');
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

export type RunGate =
  | { ok: true }
  | { ok: false; retryAfterMs: number }
  | { ok: false; active: true };

const windows = new Map<string, { start: number; count: number }>();
const activeRuns = new Map<string, number>();

export function tryStartRun(key: string, now = Date.now()): RunGate {
  if ((activeRuns.get(key) ?? 0) >= MAX_ACTIVE_RUNS) {
    return { ok: false, active: true };
  }
  let window = windows.get(key);
  if (!window || now - window.start >= RATE_WINDOW_MS) {
    window = { start: now, count: 0 };
    windows.set(key, window);
  }
  if (window.count >= MAX_RUNS_PER_WINDOW) {
    return { ok: false, retryAfterMs: window.start + RATE_WINDOW_MS - now };
  }
  window.count += 1;
  activeRuns.set(key, (activeRuns.get(key) ?? 0) + 1);
  return { ok: true };
}

export function endRun(key: string): void {
  const remaining = (activeRuns.get(key) ?? 0) - 1;
  if (remaining <= 0) activeRuns.delete(key);
  else activeRuns.set(key, remaining);
}

// Resolve who a connection belongs to. Logged-in users key by id; guests key by
// a per-browser `guestId` cookie (so guests behind a shared IP don't collide on
// the same container), falling back to IP only when no cookie is present yet.
export function resolveOwner(req: IncomingMessage): { ownerKey: string; isGuest: boolean } {
  const userId = verifyToken(parseTokenCookie(req.headers.cookie));
  if (userId !== null) return { ownerKey: `user:${userId}`, isGuest: false };
  const guestId = parseCookie(req.headers.cookie, 'guestId');
  return { ownerKey: guestId ? `guest:${guestId}` : `ip:${extractIp(req)}`, isGuest: true };
}

export function handleConnection(ws: WebSocket, req: IncomingMessage): void {
  const { ownerKey: rateKey, isGuest } = resolveOwner(req);

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
    if (isGuest && guestRunsRemaining(rateKey) <= 0) {
      ws.send(
        JSON.stringify({
          type: 'stderr',
          data: `You have used all ${GUEST_RUN_BUDGET} free runs. Create a free account to keep running code.\n`,
        }),
      );
      ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      return;
    }
    const gate = tryStartRun(rateKey);
    if (!gate.ok) {
      const data =
        'retryAfterMs' in gate
          ? `Rate limit: max ${MAX_RUNS_PER_WINDOW} runs per minute. Try again in ${Math.ceil(
              gate.retryAfterMs / 1000,
            )}s.\n`
          : 'Too many runs in progress — wait for one to finish.\n';
      ws.send(JSON.stringify({ type: 'stderr', data }));
      ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      ws.close(4429, 'Rate limit');
      return;
    }
    started = true;
    counted = true;
    if (isGuest) recordGuestRun(rateKey);
    handleInteractiveRun(ws, msg.code, msg.language, rateKey).catch((err) => {
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

// A presence connection carries no messages — its lifetime is the signal that the
// owner is on a lesson page. When their last presence socket closes (tab closed),
// closeSession tears down their idle run container promptly.
export function handlePresenceConnection(ws: WebSocket, req: IncomingMessage): void {
  const { ownerKey } = resolveOwner(req);
  openSession(ownerKey);
  ws.on('close', () => closeSession(ownerKey));
}

export function attachRunWebSocket(server: HttpServer): { close: () => void } {
  // Two paths share one HTTP server, so route upgrades manually (a `ws` server
  // can't reliably co-host paths via the `path` option — frames get crossed).
  const runWss = new WebSocketServer({ noServer: true, maxPayload: MAX_PAYLOAD_BYTES });
  const presenceWss = new WebSocketServer({ noServer: true, maxPayload: 1024 });
  runWss.on('connection', handleConnection);
  presenceWss.on('connection', handlePresenceConnection);

  const onUpgrade = (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    if (pathname === '/ws/run') {
      runWss.handleUpgrade(req, socket, head, (ws) => runWss.emit('connection', ws, req));
    } else if (pathname === '/ws/presence') {
      presenceWss.handleUpgrade(req, socket, head, (ws) => presenceWss.emit('connection', ws, req));
    } else {
      socket.destroy();
    }
  };
  server.on('upgrade', onUpgrade);

  return {
    close: () => {
      server.off('upgrade', onUpgrade);
      runWss.close();
      presenceWss.close();
    },
  };
}
