import type { Request, Response, NextFunction } from 'express';
import * as visitsService from '../services/visits.service.js';
import * as userRepo from '../repositories/user.repository.js';
import { isAdmin } from '@cyberstars/shared/auth';
import { VISIT_RANGES } from '@cyberstars/shared/visits';

// The app's report of a page it showed. Counting must never get in the way of
// the visitor, so a failure is only logged and the answer is always a 204.
// An admin's own visits (the admin page, testing a lesson) aren't counted:
// they'd only blur what strangers do.
export async function recordPageView(req: Request, res: Response): Promise<void> {
  try {
    if (req.user && isAdmin(await userRepo.getRole(req.user.id))) {
      res.status(204).end();
      return;
    }
    await visitsService.recordPageView(
      req.body,
      req.ip ?? '',
      req.get('user-agent'),
      req.user !== undefined,
    );
  } catch (err) {
    console.error('[visits] could not record a page view:', err);
  }
  res.status(204).end();
}

export async function getVisits(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const asked = Number(req.query.range);
    const range = VISIT_RANGES.find((r) => r === asked) ?? VISIT_RANGES[0];
    res.json(await visitsService.report(range));
  } catch (err) {
    next(err);
  }
}
