import { Router } from 'express';
import multer from 'multer';
import { limiter } from '../middleware/rateLimit.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import {
  updateProfileSchema,
  saveInterestsSchema,
  saveCodeLanguageSchema,
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
const passwordLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many attempts, try again later' },
});

const router = Router();

router.patch(
  '/',
  authenticateToken,
  validateBody(updateProfileSchema),
  profileController.updateProfile,
);
router.put(
  '/interests',
  authenticateToken,
  validateBody(saveInterestsSchema),
  profileController.saveInterests,
);
router.put(
  '/code-language',
  authenticateToken,
  validateBody(saveCodeLanguageSchema),
  profileController.saveCodeLanguage,
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
