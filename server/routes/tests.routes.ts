import { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { runTestsSchema } from '../schemas/tests.schema.js';
import { execRateLimitHandler } from './terminal.routes.js';
import { resolveOwnerKey, runTests } from '../controllers/tests.controller.js';

function requireOwner(req: Request, res: Response, next: NextFunction): void {
  if (!resolveOwnerKey(req)) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  next();
}

// Each test run is several docker execs (structure check + user & solution
// programs per case) — cap tighter than single editor runs.
const runTestsLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => resolveOwnerKey(req) ?? 'unknown',
  handler: execRateLimitHandler,
});

const router = Router();

router.post(
  '/:courseKey/:lessonSlug/run',
  optionalAuth,
  requireOwner,
  runTestsLimiter,
  validateBody(runTestsSchema),
  runTests,
);

export default router;
