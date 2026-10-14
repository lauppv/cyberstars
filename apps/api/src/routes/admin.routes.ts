import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller.js';
import { getVisits } from '../controllers/visits.controller.js';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, adminController.getStats);
router.get('/visits', authenticateToken, requireAdmin, getVisits);

export default router;
