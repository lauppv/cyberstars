import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileTypeFromBuffer } from 'file-type';
import * as userRepo from '../repositories/user.repository.js';
import { AppError } from '../middleware/errorHandler.js';

const UPLOAD_DIR = path.resolve('uploads/avatars');
await fs.mkdir(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { bio, status } = req.body;

    const data: { bio?: string | null; status?: string | null; statusExpiresAt?: Date | null } = {};

    if (bio !== undefined) {
      data.bio = bio ? String(bio).slice(0, 200) : null;
    }

    if (status !== undefined) {
      if (status) {
        data.status = String(status).slice(0, 80);
        data.statusExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      } else {
        data.status = null;
        data.statusExpiresAt = null;
      }
    }

    await userRepo.updateProfile(userId, data);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const file = req.file;
    if (!file) throw new AppError(400, 'No file uploaded');

    const type = await fileTypeFromBuffer(file.buffer);
    if (!type || !ALLOWED_MIMES.has(type.mime)) {
      throw new AppError(400, 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    const ext = type.ext;
    const filename = `${userId}-${Date.now()}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const user = await userRepo.findById(userId);
    if (user?.avatarUrl) {
      const oldFile = path.join(UPLOAD_DIR, path.basename(user.avatarUrl));
      await fs.unlink(oldFile).catch(() => {});
    }

    await fs.writeFile(filepath, file.buffer);
    const avatarUrl = `/uploads/avatars/${filename}`;
    await userRepo.updateProfile(userId, { avatarUrl });
    res.json({ avatarUrl });
  } catch (err) {
    next(err);
  }
}

export async function deleteAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await userRepo.findById(userId);
    if (user?.avatarUrl) {
      const oldFile = path.join(UPLOAD_DIR, path.basename(user.avatarUrl));
      await fs.unlink(oldFile).catch(() => {});
    }
    await userRepo.updateProfile(userId, { avatarUrl: null });
    res.json({ message: 'Avatar removed' });
  } catch (err) {
    next(err);
  }
}
