import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createSessionSchema, execSchema } from '../schemas/terminal.schema.js';
import * as ctrl from '../controllers/terminal.controller.js';

// When the per-user terminal exec limit is hit, mirror the editor's wording and
// tell the user how many seconds remain until the window resets.
export function execRateLimitHandler(req: Request, res: Response): void {
  const resetMs = (req.rateLimit?.resetTime?.getTime() ?? Date.now()) - Date.now();
  const seconds = Math.max(1, Math.ceil(resetMs / 1000));
  res.status(429).json({ error: `Too many attempts — try again in ${seconds}s.` });
}

// Each exec is a real docker exec fork; cap per authenticated user.
const terminalExecLimiter = rateLimit({
  windowMs: 60_000,
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => String(req.user!.id),
  handler: execRateLimitHandler,
});

const router = Router();

router.post('/session', authenticateToken, validateBody(createSessionSchema), ctrl.createSession);
router.post('/exec', authenticateToken, terminalExecLimiter, validateBody(execSchema), ctrl.exec);
router.delete('/session/:sessionId', authenticateToken, ctrl.destroy);

export default router;
