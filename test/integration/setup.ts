import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../../server/config/db.js';

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`
    TRUNCATE
      "ForumReaction",
      "ForumPost",
      "ForumThread",
      "SupportMessage",
      "SupportTicket",
      "UserSavedCode",
      "UserLessonProgress",
      "User"
    RESTART IDENTITY CASCADE
  `);
});

afterAll(async () => {
  await prisma.$disconnect();
});
