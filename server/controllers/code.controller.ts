import type { Request, Response, NextFunction } from 'express';
import * as codeService from '../services/code-execution.service.js';

export async function executeCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, language } = req.body;
    const output = await codeService.execute(code, language);
    res.json({ output });
  } catch (err) {
    next(err);
  }
}
