import { Router, type Request, type Response, type NextFunction } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
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
const runTestsLimiter = limiter({
  windowMs: 60_000,
  limit: 10,
  keyGenerator: (req: Request) => resolveOwnerKey(req) ?? 'unknown',
  handler: execRateLimitHandler,
});

// History reads are plain DB lookups, so cap looser than runs, per user.
// authenticateToken runs first, so req.user is always set here.
const historyLimiter = limiter({
  windowMs: 60_000,
  limit: 60,
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
