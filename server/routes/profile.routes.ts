import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updateProfileSchema } from '../schemas/profile.schema.js';
import * as profileController from '../controllers/profile.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
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

export default router;
