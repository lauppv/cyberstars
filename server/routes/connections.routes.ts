import { Router } from 'express';
import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { sendRequestSchema } from '../schemas/connections.schema.js';
import * as connectionsController from '../controllers/connections.controller.js';

// Keyed per user, not per IP: students share NAT behind school routers, so an IP
// window would be split across a whole room. authenticateToken runs first, so
// req.user is always set here.
const perUser = (req: Request) => String(req.user!.id);

// Sending a request creates a row and fires a notification, so cap it — this is
// the only endpoint that lets a caller reach arbitrary user ids.
const sendLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 30,
  keyGenerator: perUser,
});

const router = Router();

// Connections require an identity (no guests) and pass the preview gate: on prod
// a non-admin gets 404, so the feature stays hidden until launch.
router.use(authenticateToken, requireFeatureAccess('connections'));

router.get('/', connectionsController.getOverview);
router.post('/', sendLimiter, validateBody(sendRequestSchema), connectionsController.sendRequest);
router.post('/:id/accept', connectionsController.accept);
router.post('/:id/decline', connectionsController.decline);
router.delete('/:id', connectionsController.remove);

export default router;
