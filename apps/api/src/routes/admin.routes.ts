import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller.js';
import { getGuestVisits, getVisits } from '../controllers/visits.controller.js';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, adminController.getStats);
router.get('/visits', authenticateToken, requireAdmin, getVisits);
router.get('/visits/guests', authenticateToken, requireAdmin, getGuestVisits);

export default router;
