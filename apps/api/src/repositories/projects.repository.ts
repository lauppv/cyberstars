import { prisma } from '../config/db.js';

// Every step the student ticked, in every project
export function listChecks(
  userId: number,
): Promise<{ language: string; projectSlug: string; stepId: string }[]> {
  return prisma.projectStepCheck.findMany({
    where: { userId },
    select: { language: true, projectSlug: true, stepId: true },
    orderBy: { checkedAt: 'asc' },
  });
}

// Ticking twice keeps the first tick
export async function check(
  userId: number,
  language: string,
  projectSlug: string,
  stepId: string,
): Promise<void> {
  await prisma.projectStepCheck.upsert({
    where: { userId_language_projectSlug_stepId: { userId, language, projectSlug, stepId } },
    create: { userId, language, projectSlug, stepId },
    update: {},
  });
}

// Unticking a step that wasn't ticked does nothing
export async function uncheck(
  userId: number,
  language: string,
  projectSlug: string,
  stepId: string,
): Promise<void> {
  await prisma.projectStepCheck.deleteMany({ where: { userId, language, projectSlug, stepId } });
}

// Every project the student finished
export function listCompletions(
  userId: number,
): Promise<{ language: string; projectSlug: string; completedAt: Date }[]> {
  return prisma.projectCompletion.findMany({
    where: { userId },
    select: { language: true, projectSlug: true, completedAt: true },
    orderBy: { completedAt: 'asc' },
  });
}

// Passing again keeps the first completion
export async function complete(
  userId: number,
  language: string,
  projectSlug: string,
): Promise<void> {
  await prisma.projectCompletion.upsert({
    where: { userId_language_projectSlug: { userId, language, projectSlug } },
    create: { userId, language, projectSlug },
    update: {},
  });
}
