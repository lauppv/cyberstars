import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, adminController.getStats);

export default router;
