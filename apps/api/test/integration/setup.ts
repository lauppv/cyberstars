import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../../src/config/db.js';

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`
    TRUNCATE
      "notifications",
      "page_visits",
      "visit_salts",
      "visit_totals",
      "visit_steps",
      "guest_visits",
      "lesson_submissions",
      "tutor_messages",
      "tutor_conversations",
      "usage_windows",
      "laniakea_planets",
      "laniakea_players",
      "laniakea_question_stats",
      "dm_reactions",
      "direct_messages",
      "conversations",
      "connections",
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
  // First registered user auto-promotes to ADMIN; insert a sentinel so
  // all createAuthenticatedAgent() calls produce regular USER accounts.
  await prisma.user.create({
    data: { name: 'Sentinel', email: 'sentinel@test.local', password: 'x', role: 'ADMIN' },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
