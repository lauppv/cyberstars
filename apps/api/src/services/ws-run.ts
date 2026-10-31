import type { IncomingMessage, Server as HttpServer } from 'http';
import type { Duplex } from 'stream';
import { WebSocketServer, type WebSocket } from 'ws';
import { ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/index.js';
import { programForRun } from './harness.js';
import { languageOf } from '../runtimes/registry.js';
import { sandbox } from './sandbox.js';
import { GUEST_RUN_BUDGET, guestRunsRemaining, recordGuestRun } from './guest-budget.service.js';
import { registerUserSocket, unregisterUserSocket } from './ws-user.js';
import { canAccessFeature } from '@cyberstars/shared/features';
import * as userRepo from '../repositories/user.repository.js';
import { sessionUserId } from './auth.service.js';

// Reject oversized frames before they are buffered/parsed.
const MAX_PAYLOAD_BYTES = 128 * 1024;
// Same limits for everyone (guest or logged-in): a fixed 60s window that opens
// on the first run and allows up to MAX_RUNS_PER_WINDOW runs before blocking
// until it resets. MAX_ACTIVE_RUNS caps concurrent in-flight runs on top of that.
const MAX_ACTIVE_RUNS = 5;
const MAX_RUNS_PER_WINDOW = 10;
const RATE_WINDOW_MS = 60_000;
// A guest's id is just a cookie, and anyone can make up a fresh one for every
// connection, which would sidestep the per-owner limits and the guest budget.
// So guest runs also share one gate per IP: loose enough for a classroom of
// guests behind one NAT, tight enough that rotating ids buys a script nothing.
const GUEST_IP_LIMITS: RunLimits = {
  maxActive: Number(process.env.GUEST_IP_MAX_ACTIVE_RUNS ?? 10),
  perWindow: Number(process.env.GUEST_IP_RUNS_PER_WINDOW ?? 60),
};

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

// The client's address, as seen by the one proxy (nginx) in front of the app in
// production. nginx appends the address it saw to X-Forwarded-For, so only the
// last entry is trustworthy: anything before it was written by the client. Same
// rule as Express's `trust proxy` setting, which is only on in production.
export function extractIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (config.isProduction && typeof forwarded === 'string') {
    const hops = forwarded.split(',');
    return hops[hops.length - 1].trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

export type RunGate =
  | { ok: true }
  | { ok: false; retryAfterMs: number }
  | { ok: false; active: true };

interface RunLimits {
  maxActive: number;
  perWindow: number;
}

const OWNER_LIMITS: RunLimits = { maxActive: MAX_ACTIVE_RUNS, perWindow: MAX_RUNS_PER_WINDOW };

const windows = new Map<string, { start: number; count: number }>();
const activeRuns = new Map<string, number>();
let lastPrune = 0;

// Expired windows are dropped once per window length, so keys that never come
// back (one per minted guest id) don't pile up for the life of the process.
function pruneWindows(now: number): void {
  if (now - lastPrune < RATE_WINDOW_MS) return;
  lastPrune = now;
  for (const [key, window] of windows) {
    if (now - window.start >= RATE_WINDOW_MS) windows.delete(key);
  }
}

export function tryStartRun(key: string, now = Date.now(), limits = OWNER_LIMITS): RunGate {
  if ((activeRuns.get(key) ?? 0) >= limits.maxActive) {
    return { ok: false, active: true };
  }
  pruneWindows(now);
  let window = windows.get(key);
  if (!window || now - window.start >= RATE_WINDOW_MS) {
    window = { start: now, count: 0 };
    windows.set(key, window);
  }
  if (window.count >= limits.perWindow) {
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

// Hand back a run that tryStartRun granted but that won't start after all.
function undoStartRun(key: string): void {
  endRun(key);
  const window = windows.get(key);
  if (window && window.count > 0) window.count -= 1;
}

// Resolve who a connection belongs to. Logged-in users key by id; guests key by
// a per-browser `guestId` cookie (so guests behind a shared IP don't collide on
// the same container), falling back to IP only when no cookie is present yet.
// `userId` is the session the upgrade checked, null for a guest.
export function resolveOwner(
  req: IncomingMessage,
  userId: number | null,
): { ownerKey: string; isGuest: boolean } {
  if (userId !== null) return { ownerKey: `user:${userId}`, isGuest: false };
  const guestId = parseCookie(req.headers.cookie, 'guestId');
  return { ownerKey: guestId ? `guest:${guestId}` : `ip:${extractIp(req)}`, isGuest: true };
}

export function handleConnection(ws: WebSocket, req: IncomingMessage, userId: number | null): void {
  const { ownerKey: rateKey, isGuest } = resolveOwner(req, userId);
  // An IPv6 holder picks any address in their block at will, so the gate keys
  // the block (/56, like the HTTP limiters) rather than the single address.
  const guestIp = isGuest ? ipKeyGenerator(extractIp(req)) : undefined;
  const ipKey = guestIp ? `guest-ip:${guestIp}` : null;

  let started = false;
  let counted = false;

  ws.on('message', (raw) => {
    if (started) return;
    let msg: { type?: string; code?: string; language?: string; lesson?: unknown };
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
    const ipGate: RunGate =
      gate.ok && ipKey ? tryStartRun(ipKey, Date.now(), GUEST_IP_LIMITS) : { ok: true };
    if (gate.ok && !ipGate.ok) undoStartRun(rateKey);
    if (!gate.ok || !ipGate.ok) {
      const data = !gate.ok
        ? 'retryAfterMs' in gate
          ? `Rate limit: max ${MAX_RUNS_PER_WINDOW} runs per minute. Try again in ${Math.ceil(
              gate.retryAfterMs / 1000,
            )}s.\n`
          : 'Too many runs in progress, wait for one to finish.\n'
        : 'Too many guest runs from your network right now. Try again in a minute, or sign in.\n';
      ws.send(JSON.stringify({ type: 'stderr', data }));
      ws.send(JSON.stringify({ type: 'exit', code: 1 }));
      ws.close(4429, 'Rate limit');
      return;
    }
    started = true;
    counted = true;
    if (isGuest) recordGuestRun(rateKey);
    const program = programForRun(msg.code, msg.language, msg.lesson);
    // The page names a course or a language; the sandbox knows only languages
    const language = languageOf(msg.language);
    sandbox.run(ws, program, language, rateKey, guestIp).catch((err) => {
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
      if (ipKey) endRun(ipKey);
      counted = false;
    }
  });
}

// A presence connection carries no messages; its lifetime is the signal that the
// owner is on a lesson page. When their last presence socket closes (tab closed),
// closeSession tears down their idle run container promptly.
export function handlePresenceConnection(
  ws: WebSocket,
  req: IncomingMessage,
  userId: number | null,
): void {
  const { ownerKey } = resolveOwner(req, userId);
  sandbox.openSession(ownerKey);
  ws.on('close', () => sandbox.closeSession(ownerKey));
}

// The shared per-user event socket. Requires a logged-in user and passes the
// preview gate (on prod, admins only), same rule as the REST endpoints. The
// gate check is async, so it runs after the upgrade and closes the socket if the
// user isn't allowed. No messages are read from the client; the server pushes.
async function handleUserConnection(
  ws: WebSocket,
  _req: IncomingMessage,
  userId: number | null,
): Promise<void> {
  if (userId === null) {
    ws.close(4401, 'Unauthorized');
    return;
  }
  const isProd = config.isProduction;
  const role = isProd ? await userRepo.getRole(userId) : undefined;
  // The socket carries both notifications and messaging; open it if the user can
  // reach either feature. NOTE: pushed frames are NOT gated per channel. If the
  // two features' gates ever diverge, pushToUser needs a per-recipient channel
  // filter, or the ungated feature's frames leak to users who only have the other.
  if (
    !canAccessFeature('notifications', role, isProd) &&
    !canAccessFeature('messaging', role, isProd)
  ) {
    ws.close(4404, 'Not found');
    return;
  }
  registerUserSocket(userId, ws);
  ws.on('close', () => unregisterUserSocket(userId, ws));
}

export function attachRunWebSocket(server: HttpServer): { close: () => void } {
  // Two paths share one HTTP server, so route upgrades manually (a `ws` server
  // can't reliably co-host paths via the `path` option; frames get crossed).
  const runWss = new WebSocketServer({ noServer: true, maxPayload: MAX_PAYLOAD_BYTES });
  const presenceWss = new WebSocketServer({ noServer: true, maxPayload: 1024 });
  const userWss = new WebSocketServer({ noServer: true, maxPayload: 1024 });
  runWss.on('connection', handleConnection);
  presenceWss.on('connection', handlePresenceConnection);
  userWss.on('connection', handleUserConnection);

  const onUpgrade = async (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    // A browser always says which website opened the socket. Refuse any site not
    // on the list before the upgrade, or a page elsewhere could run code or read
    // a student's feed from its visitors' browsers. A client with no Origin isn't
    // a browser and could send any; the run limits are the defence against it.
    const { origin } = req.headers;
    if (origin !== undefined && !config.allowedOrigins.includes(origin)) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
      socket.destroy();
      return;
    }
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    const wss =
      pathname === '/ws/run'
        ? runWss
        : pathname === '/ws/presence'
          ? presenceWss
          : pathname === '/ws/user'
            ? userWss
            : null;
    if (!wss) {
      socket.destroy();
      return;
    }
    // The session is checked once, before the upgrade, so a handler has it
    // before the first message: an ended or expired one is a guest
    let userId: number | null;
    try {
      userId = await sessionUserId(parseTokenCookie(req.headers.cookie));
    } catch (err) {
      console.error('[ws] session check failed:', err);
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req, userId));
  };
  server.on('upgrade', onUpgrade);

  return {
    close: () => {
      server.off('upgrade', onUpgrade);
      runWss.close();
      presenceWss.close();
      userWss.close();
    },
  };
}
