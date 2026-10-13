import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as dailyController from '../controllers/daily.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', dailyController.getDaily);

export default router;
