import { Router, type Request, type Response, type NextFunction } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { createSessionSchema, execSchema, checkSchema } from '../schemas/terminal.schema.js';
import {
  resolveOwnerKey,
  createSession,
  exec,
  checkTests,
  destroy,
} from '../controllers/terminal.controller.js';

// When the per-user terminal exec limit is hit, mirror the editor's wording and
// tell the user how many seconds remain until the window resets.
export function execRateLimitHandler(req: Request, res: Response): void {
  const resetMs = (req.rateLimit?.resetTime?.getTime() ?? Date.now()) - Date.now();
  const seconds = Math.max(1, Math.ceil(resetMs / 1000));
  res.status(429).json({ error: `Too many attempts, try again in ${seconds}s.` });
}

// Check that the request carries an authenticated user or a guestId before
// running any further middleware (validation etc.) so unauthenticated requests
// get a 401 rather than a 400 from schema validation.
function requireOwner(req: Request, res: Response, next: NextFunction): void {
  if (!resolveOwnerKey(req)) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  next();
}

function keyGenerator(req: Request): string {
  return resolveOwnerKey(req) ?? 'unknown';
}

// A guest's id is just a cookie a script can rotate, which sidesteps the
// per-owner limiters. Guests therefore also share a budget per client IP, loose
// enough for a classroom of guests behind one NAT; logged-in users skip it.
// Keyed by `req.ip`, which `trust proxy` resolves to the address nginx saw.
export function guestIpLimiter(limit: number) {
  return limiter({
    windowMs: 60_000,
    limit: limit,
    skip: (req: Request) => req.user != null,
    handler: execRateLimitHandler,
  });
}

// Each exec is a real docker exec fork; cap per user or guest.
const terminalExecLimiter = limiter({
  windowMs: 60_000,
  limit: 30,
  keyGenerator,
  handler: execRateLimitHandler,
});

// Each session spins up a fresh 128 MB sandbox container (the most expensive
// terminal operation), so cap it tightly per owner to keep a burst of creates
// from OOMing the box (the global cap in the service is the last line of defence).
const sessionLimiter = limiter({
  windowMs: 60_000,
  limit: 5,
  keyGenerator,
  handler: execRateLimitHandler,
});

// A check is one docker exec (all state probes batched), so cap like the code
// judge's Run Tests (10/min/owner) rather than the looser per-command exec cap.
const checkLimiter = limiter({
  windowMs: 60_000,
  limit: 10,
  keyGenerator,
  handler: execRateLimitHandler,
});

const router = Router();

router.post(
  '/session',
  optionalAuth,
  requireOwner,
  guestIpLimiter(30),
  sessionLimiter,
  validateBody(createSessionSchema),
  createSession,
);
router.post(
  '/exec',
  optionalAuth,
  requireOwner,
  guestIpLimiter(180),
  terminalExecLimiter,
  validateBody(execSchema),
  exec,
);
router.post(
  '/check',
  optionalAuth,
  requireOwner,
  guestIpLimiter(60),
  checkLimiter,
  validateBody(checkSchema),
  checkTests,
);
router.delete('/session/:sessionId', optionalAuth, requireOwner, destroy);

export default router;
