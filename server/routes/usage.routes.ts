import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUsage, consumeSolution } from '../controllers/usage.controller.js';

const router = Router();

router.get('/', authenticateToken, getUsage);
router.post('/solution', authenticateToken, consumeSolution);

export default router;
