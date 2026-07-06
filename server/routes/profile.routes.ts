import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  updateProfileSchema,
  changePasswordSchema,
  requestEmailChangeSchema,
  confirmEmailChangeSchema,
} from '../schemas/profile.schema.js';
import * as profileController from '../controllers/profile.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Same shape as authLimiter: caps password guessing on the change endpoint.
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10_000 : 10,
  message: { error: 'Too many attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.patch(
  '/',
  authenticateToken,
  validateBody(updateProfileSchema),
  profileController.updateProfile,
);
router.post('/avatar', authenticateToken, upload.single('avatar'), profileController.uploadAvatar);
router.delete('/avatar', authenticateToken, profileController.deleteAvatar);
router.post(
  '/password',
  authenticateToken,
  passwordLimiter,
  validateBody(changePasswordSchema),
  profileController.changePassword,
);
router.post(
  '/email/request',
  authenticateToken,
  passwordLimiter,
  validateBody(requestEmailChangeSchema),
  profileController.requestEmailChange,
);
router.post(
  '/email/confirm',
  authenticateToken,
  passwordLimiter,
  validateBody(confirmEmailChangeSchema),
  profileController.confirmEmailChange,
);
router.delete('/email/pending', authenticateToken, profileController.cancelEmailChange);
router.get('/activity', authenticateToken, profileController.getActivity);

export default router;
