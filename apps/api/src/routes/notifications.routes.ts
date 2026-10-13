import { Router } from 'express';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { markReadSchema } from '../schemas/notifications.schema.js';
import * as notificationsController from '../controllers/notifications.controller.js';

const router = Router();

// Notifications require an identity (no guests) and pass the preview gate: on
// prod a non-admin gets 404, so the feature stays hidden until launch.
router.use(authenticateToken, requireFeatureAccess('notifications'));

router.get('/', notificationsController.getNotifications);
router.post('/read', validateBody(markReadSchema), notificationsController.markRead);
router.post('/:id/read', notificationsController.markOneRead);

export default router;
