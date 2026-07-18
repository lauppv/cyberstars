import type { Request, Response, NextFunction } from 'express';
import * as publicProfileService from '../services/public-profile.service.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getPublicProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new AppError(400, 'Invalid user id');
    const profile = await publicProfileService.getPublicProfile(id, req.user?.id ?? null);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}
