import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { optionalAuth } from '../middleware/auth.js';
import { runWaiting } from '../controllers/runs.controller.js';

// A page asks about once a second while one of its runs waits, and only one
// waits at a time, so this leaves room for a few tabs
const waitingLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.get('/:runId/waiting', waitingLimiter, optionalAuth, runWaiting);

export default router;
