import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { saveCodeSchema } from '../schemas/progress.schema.js';
import * as progressController from '../controllers/progress.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/:courseKey', progressController.getCourseProgress);
router.post('/:courseKey/:lessonSlug/complete', progressController.markComplete);
router.get('/:courseKey/:lessonSlug/code', progressController.getSavedCode);
router.put(
  '/:courseKey/:lessonSlug/code',
  validateBody(saveCodeSchema),
  progressController.saveCode,
);
router.post('/:courseKey/:lessonSlug/access', progressController.trackAccess);

export default router;
