import { Router, type Request } from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireFeatureAccess } from '../middleware/features.js';
import { limiter } from '../middleware/rateLimit.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { projectCheckSchema, projectRunSchema } from '../schemas/projects.schema.js';
import * as projectsController from '../controllers/projects.controller.js';
import { resolveOwnerKey } from '../controllers/tests.controller.js';
import { execRateLimitHandler, guestIpLimiter } from './terminal.routes.js';

// A plain DB read or write per tick, so a loose cap per student;
// authenticateToken runs first, so req.user is always set here.
const projectsLimiter = limiter({
  windowMs: 60_000,
  limit: 120,
  keyGenerator: (req: Request) => String(req.user!.id),
});

// A judge run is several docker execs, capped like a lesson's Run Tests
const runLimiter = limiter({
  windowMs: 60_000,
  limit: 10,
  keyGenerator: (req: Request) => resolveOwnerKey(req) ?? 'unknown',
  handler: execRateLimitHandler,
});

const router = Router();

// Anyone who can run code can run a project's tests, a guest too; only a
// signed-in student's pass finishes the project
router.post(
  '/:language/:slug/run',
  optionalAuth,
  (req, res, next) => {
    if (resolveOwnerKey(req)) return next();
    res.status(401).json({ error: 'No token provided' });
  },
  requireFeatureAccess('projects'),
  guestIpLimiter(60),
  runLimiter,
  validateBody(projectRunSchema),
  projectsController.runTests,
);

// Ticks and completions belong to an account: a guest reads the projects but
// keeps neither
router.use(authenticateToken, requireFeatureAccess('projects'), projectsLimiter);
router.get('/checks', projectsController.listChecks);
router.get('/completions', projectsController.listCompletions);
router.put(
  '/:language/:slug/steps/:stepId',
  validateBody(projectCheckSchema),
  projectsController.setCheck,
);

export default router;
