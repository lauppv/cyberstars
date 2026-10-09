import { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { runTestsSchema } from '../schemas/tests.schema.js';
import { execRateLimitHandler, guestIpLimiter } from './terminal.routes.js';
import {
  getSubmission,
  listSubmissions,
  resolveOwnerKey,
  runTests,
} from '../controllers/tests.controller.js';

function requireOwner(req: Request, res: Response, next: NextFunction): void {
  if (!resolveOwnerKey(req)) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  next();
}

// Each test run is several docker execs (structure check + user & solution
// programs per case), so cap tighter than single editor runs.
const runTestsLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => resolveOwnerKey(req) ?? 'unknown',
  handler: execRateLimitHandler,
});

// History reads are plain DB lookups, so cap looser than runs, per user.
// authenticateToken runs first, so req.user is always set here.
const historyLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => String(req.user!.id),
});

const router = Router();

// Submission history is per account: guests keep none, so both reads need a login.
router.get('/submissions/:id', authenticateToken, historyLimiter, getSubmission);
router.get(
  '/:courseKey/:lessonSlug/submissions',
  authenticateToken,
  historyLimiter,
  listSubmissions,
);

router.post(
  '/:courseKey/:lessonSlug/run',
  optionalAuth,
  requireOwner,
  guestIpLimiter(60),
  runTestsLimiter,
  validateBody(runTestsSchema),
  runTests,
);

export default router;
