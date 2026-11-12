import type { Request, Response, NextFunction } from 'express';
import { codeMaxLength } from '@cyberstars/shared/webFiles';

// The code a lesson's request carries fits its course: a web lesson's site
// holds several pages, so it has more room than another lesson's program
// (CYB-113). Runs after validateBody, whose schema allows the biggest.
export function codeFitsCourse(req: Request, res: Response, next: NextFunction): void {
  const max = codeMaxLength(req.params.courseKey as string);
  const code: unknown = req.body?.code;
  if (typeof code === 'string' && code.length > max) {
    res.status(400).json({ error: `The code may have at most ${max} characters` });
    return;
  }
  next();
}
