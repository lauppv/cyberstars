import type { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service.js';

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // An admin can force a cache-bypassing recompute via ?fresh=1 (rare, gated).
    const stats = await adminService.getStats(req.query.fresh === '1');
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
