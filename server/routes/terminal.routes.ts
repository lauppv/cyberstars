import { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createSessionSchema, execSchema } from '../schemas/terminal.schema.js';
import {
  resolveOwnerKey,
  createSession,
  exec,
  destroy,
} from '../controllers/terminal.controller.js';

// When the per-user terminal exec limit is hit, mirror the editor's wording and
// tell the user how many seconds remain until the window resets.
export function execRateLimitHandler(req: Request, res: Response): void {
  const resetMs = (req.rateLimit?.resetTime?.getTime() ?? Date.now()) - Date.now();
  const seconds = Math.max(1, Math.ceil(resetMs / 1000));
  res.status(429).json({ error: `Too many attempts — try again in ${seconds}s.` });
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

// Each exec is a real docker exec fork; cap per user or guest.
const terminalExecLimiter = rateLimit({
  windowMs: 60_000,
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: execRateLimitHandler,
});

const router = Router();

router.post(
  '/session',
  optionalAuth,
  requireOwner,
  validateBody(createSessionSchema),
  createSession,
);
router.post(
  '/exec',
  optionalAuth,
  requireOwner,
  terminalExecLimiter,
  validateBody(execSchema),
  exec,
);
router.delete('/session/:sessionId', optionalAuth, requireOwner, destroy);

export default router;
