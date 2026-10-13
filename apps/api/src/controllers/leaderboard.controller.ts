import type { Request, Response, NextFunction } from 'express';
import * as leaderboardService from '../services/leaderboard.service.js';
import { leaderboardQuerySchema } from '../schemas/leaderboard.schema.js';

export async function getLeaderboard(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { take, skip } = leaderboardQuerySchema.parse(req.query);
    const page = await leaderboardService.getPage(take, skip);
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function getMyRank(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entry = await leaderboardService.getMyRank(req.user!.id);
    res.json(entry);
  } catch (err) {
    next(err);
  }
}
