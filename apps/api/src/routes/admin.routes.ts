import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { announcementSchema } from '../schemas/admin.schema.js';
import * as adminController from '../controllers/admin.controller.js';
import { getGuestVisits, getVisits } from '../controllers/visits.controller.js';
import { getMissedQuestions } from '../controllers/laniakea.controller.js';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, adminController.getStats);
router.get('/visits', authenticateToken, requireAdmin, getVisits);
router.get('/visits/guests', authenticateToken, requireAdmin, getGuestVisits);
router.get('/laniakea/questions', authenticateToken, requireAdmin, getMissedQuestions);
router.get('/announcements', authenticateToken, requireAdmin, adminController.getAnnouncements);
router.post(
  '/announcements',
  authenticateToken,
  requireAdmin,
  validateBody(announcementSchema),
  adminController.sendAnnouncement,
);

export default router;
