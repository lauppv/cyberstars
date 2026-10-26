import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lets an account skip the first-lesson tour and the question of what it
// wants to learn after it, which would otherwise hold it there.
export async function markOnboarded(email: string) {
  const now = new Date();
  await prisma.user.update({
    where: { email },
    data: { onboardedAt: now, interests: ['python'], interestsAt: now },
  });
}

// Marks a course's first lessons completed for an account and returns their
// slugs, in the course's order.
export async function completeLessons(email: string, courseKey: string, count: number) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const lessons = await prisma.lesson.findMany({
    where: { courseKey },
    orderBy: { sortOrder: 'asc' },
    take: count,
  });
  const now = new Date();
  await prisma.userLessonProgress.createMany({
    data: lessons.map((l) => ({
      userId: user.id,
      courseKey,
      lessonSlug: l.slug,
      completed: true,
      completedAt: now,
    })),
  });
  return lessons.map((l) => l.slug);
}

export async function resetDB() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE
      "forum_reactions", "forum_posts", "forum_threads",
      "support_messages", "support_tickets",
      "user_saved_code", "user_lesson_progress", "users"
    RESTART IDENTITY CASCADE
  `);
  await prisma.user.create({
    data: { name: 'Sentinel', email: 'sentinel@test.local', password: 'x', role: 'ADMIN' },
  });
}
