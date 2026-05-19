import type { Request, Response, NextFunction } from "express";
import * as codeService from "../services/code-execution.service.js";
import * as testRunner from "../services/test-runner.service.js";
import * as progressService from "../services/progress.service.js";

export async function executeCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, language } = req.body;
    const output = await codeService.execute(code, language);
    res.json({ output });
  } catch (err) {
    next(err);
  }
}

export async function submitCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, language, courseKey, lessonSlug } = req.body;
    const result = await testRunner.runTests(code, language, courseKey, lessonSlug);

    if (result.allPassed && req.user) {
      await progressService.markComplete(req.user.id, courseKey, lessonSlug);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}
