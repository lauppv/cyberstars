import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../../server/config/db.js';

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`
    TRUNCATE
      "forum_reactions",
      "forum_posts",
      "forum_threads",
      "support_messages",
      "support_tickets",
      "user_saved_code",
      "user_lesson_progress",
      "users"
    RESTART IDENTITY CASCADE
  `);
});

afterAll(async () => {
  await prisma.$disconnect();
});
