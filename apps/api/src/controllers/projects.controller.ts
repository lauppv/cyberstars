import type { Request, Response, NextFunction } from 'express';
import * as projectsService from '../services/projects.service.js';
import { runProjectTests } from '../services/lesson-tests.service.js';
import { resolveOwnerKey } from './tests.controller.js';
import { guestIpOf } from './terminal.controller.js';
import { requestWaitKey } from './runs.controller.js';

// Finishing is server-authoritative, as for a lesson: only a passing verdict
// marks a project done, and only for a signed-in student. A storage failure
// doesn't cost the student the verdict; their next pass writes it.
export async function completeIfPassed(
  req: Request,
  passed: boolean,
  language: string,
  slug: string,
): Promise<void> {
  if (!passed || !req.user?.id) return;
  try {
    await projectsService.complete(req.user.id, language, slug);
  } catch (err) {
    console.error(`[projects] failed to save ${language}/${slug} for user ${req.user.id}:`, err);
  }
}

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

export async function listCompletions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json(await projectsService.listCompletions(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function runTests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { language, slug } = req.params as Record<string, string>;
    const result = await runProjectTests(
      resolveOwnerKey(req)!,
      language,
      slug,
      req.body.code,
      guestIpOf(req),
      requestWaitKey(req),
    );
    await completeIfPassed(req, result.status === 'passed', language, slug);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
