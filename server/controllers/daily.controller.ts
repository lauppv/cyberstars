import type { Request, Response } from 'express';
import * as dailyService from '../services/daily.service.js';

export async function getDaily(req: Request, res: Response): Promise<void> {
  const daily = await dailyService.getDaily(req.user!.id);
  res.json(daily);
}
