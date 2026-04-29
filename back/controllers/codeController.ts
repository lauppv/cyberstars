import type { Request, Response } from "express";
import * as codeService from "../services/codeExecutionService.js";
import * as testRunner from "../services/testRunnerService.js";
import * as progressService from "../services/progressService.js";

export async function executeCode(req: Request, res: Response): Promise<void> {
  const { code, language } = req.body;
  const output = await codeService.execute(code, language);
  res.json({ output });
}

export async function submitCode(req: Request, res: Response): Promise<void> {
  const { code, language, courseKey, lessonSlug } = req.body;
  const result = await testRunner.runTests(code, language, courseKey, lessonSlug);

  if (result.allPassed && req.user) {
    await progressService.markComplete(req.user.id, courseKey, lessonSlug);
  }

  res.json(result);
}
