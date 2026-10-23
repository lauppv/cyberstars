import { Router } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { optionalAuth } from '../middleware/auth.js';
import { runWaiting } from '../controllers/runs.controller.js';

// A page asks about once a second while one of its runs waits, and only one
// waits at a time, so this leaves room for a few tabs
const waitingLimiter = limiter({
  windowMs: 60_000,
  limit: 300,
});

const router = Router();

router.get('/:runId/waiting', waitingLimiter, optionalAuth, runWaiting);

export default router;
