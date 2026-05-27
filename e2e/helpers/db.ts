import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
