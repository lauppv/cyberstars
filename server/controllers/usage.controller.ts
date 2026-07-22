import type { Request, Response, NextFunction } from 'express';
import * as userRepo from '../repositories/user.repository.js';
import { isAdmin } from '../../shared/auth.js';
import { consume, getSummary } from '../services/usage.service.js';

export async function getUsage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const admin = isAdmin(await userRepo.getRole(userId));
    res.json(getSummary(userId, admin));
  } catch (err) {
    next(err);
  }
}

// Records one Show Solution reveal and returns the refreshed usage summary. The
// solution content itself is a static public file — this endpoint exists only to
// meter and gate reveals (429 once the daily cap is hit).
export async function consumeSolution(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const admin = isAdmin(await userRepo.getRole(userId));
    res.json(consume(userId, 'showSolution', admin));
  } catch (err) {
    next(err);
  }
}
