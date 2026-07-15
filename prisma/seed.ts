import { PrismaClient } from '@prisma/client';
import { courses, lessons } from './curriculum.data.js';

const prisma = new PrismaClient();

const forumCategories = [
  {
    slug: 'announcements',
    name: 'Announcements',
    description: 'Platform updates, new courses, and important news from the CyberStars team.',
    icon: '📣',
    color: '#6C5CE7',
    groupName: 'Community',
    sortOrder: 1,
  },
  {
    slug: 'introductions',
    name: 'Introductions',
    description: 'New to CyberStars? Say hi and meet other coders around your level.',
    icon: '👋',
    color: '#00D68F',
    groupName: 'Community',
    sortOrder: 2,
  },
  {
    slug: 'help-python',
    name: 'Python Help',
    description: 'Stuck on a lesson or a project? Ask questions, share errors, and get unstuck.',
    icon: '🐍',
    color: '#3572A5',
    groupName: 'Help & Support',
    sortOrder: 3,
  },
  {
    slug: 'help-java',
    name: 'Java Help',
    description:
      "Classes, inheritance, streams — and that one NullPointerException that won't go away.",
    icon: '☕',
    color: '#b07219',
    groupName: 'Help & Support',
    sortOrder: 4,
  },
  {
    slug: 'help-c',
    name: 'C Programming Help',
    description:
      'Pointers, segfaults, malloc — the dark arts. Bring your gdb output, leave with answers.',
    icon: '⚙️',
    color: '#888899',
    groupName: 'Help & Support',
    sortOrder: 5,
  },
  {
    slug: 'showcase',
    name: 'Show Your Project',
    description: 'Built something cool? Share it here — even tiny scripts. Reactions encouraged.',
    icon: '🎨',
    color: '#FF6B6B',
    groupName: 'Show & Tell',
    sortOrder: 6,
  },
  {
    slug: 'challenges',
    name: 'Challenges & Contests',
    description:
      'Weekly puzzles, tournament threads, leaderboards. Compare solutions after the deadline.',
    icon: '🏆',
    color: '#FFAA00',
    groupName: 'Show & Tell',
    sortOrder: 7,
  },
  {
    slug: 'lounge',
    name: 'The Lounge',
    description: 'Talk about anything — games, school, that weird dream you had. Be kind.',
    icon: '🛋️',
    color: '#9999B0',
    groupName: 'Off-Topic',
    sortOrder: 8,
  },
];

async function main() {
  for (const course of courses) {
    const { key: _key, ...courseFields } = course;
    await prisma.curriculum.upsert({
      where: { key: course.key },
      create: course,
      update: courseFields,
    });
  }

  for (const lesson of lessons) {
    const { courseKey: _courseKey, slug: _slug, ...lessonFields } = lesson;
    await prisma.lesson.upsert({
      where: { courseKey_slug: { courseKey: lesson.courseKey, slug: lesson.slug } },
      create: lesson,
      update: lessonFields,
    });
  }

  await prisma.lesson.deleteMany({ where: { courseKey: 'algo' } });
  await prisma.curriculum.deleteMany({ where: { key: 'algo' } });

  for (const cat of forumCategories) {
    await prisma.forumCategory.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: {},
    });
  }

  console.log(
    `Seeded ${courses.length} courses, ${lessons.length} lessons, and ${forumCategories.length} forum categories.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
