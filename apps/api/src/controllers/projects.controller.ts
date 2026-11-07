import type { Request, Response, NextFunction } from 'express';
import * as projectsService from '../services/projects.service.js';

export async function listChecks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await projectsService.listChecks(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function setCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { language, slug, stepId } = req.params as Record<string, string>;
    await projectsService.setCheck(req.user!.id, language, slug, stepId, req.body.checked);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
