import { AppError } from '@cyberstars-framework/server-kit/errors';
import {
  findProject,
  type ProjectCheckDTO,
  type ProjectLanguage,
} from '@cyberstars/shared/projects';
import * as projectsRepo from '../repositories/projects.repository.js';

// The ticks of steps still in the catalog: a step taken out of a project
// leaves its rows behind, which nobody sees
export async function listChecks(userId: number): Promise<ProjectCheckDTO[]> {
  const rows = await projectsRepo.listChecks(userId);
  return rows
    .filter((row) =>
      findProject(row.language, row.projectSlug)?.steps.some((s) => s.id === row.stepId),
    )
    .map((row) => ({
      language: row.language as ProjectLanguage,
      slug: row.projectSlug,
      stepId: row.stepId,
    }));
}

// Only a step of a project in the catalog can be ticked
export async function setCheck(
  userId: number,
  language: string,
  slug: string,
  stepId: string,
  checked: boolean,
): Promise<void> {
  const project = findProject(language, slug);
  if (!project) throw new AppError(404, 'Project not found');
  if (!project.steps.some((s) => s.id === stepId)) throw new AppError(404, 'Step not found');
  if (checked) await projectsRepo.check(userId, language, slug, stepId);
  else await projectsRepo.uncheck(userId, language, slug, stepId);
}
