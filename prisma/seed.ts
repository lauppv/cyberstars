import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courses = [
  { key: "python", title: "Python", description: "New to programming? We highly recommend Python", sortOrder: 1 },
  { key: "c", title: "C", description: "Understanding low-level programming", sortOrder: 2 },
  { key: "java", title: "Java", description: "Object Oriented Programming", sortOrder: 3 },
];

const lessons = [
  { courseKey: "python", slug: "print", title: "Print", sortOrder: 1, hasCodeFile: true },
  { courseKey: "python", slug: "variables-str", title: "Variables (Strings)", sortOrder: 2, hasCodeFile: true },
  { courseKey: "python", slug: "variables-int", title: "Variables (Integers)", sortOrder: 3, hasCodeFile: true },
  { courseKey: "python", slug: "print-f", title: "Print F-strings", sortOrder: 4, hasCodeFile: true },
  { courseKey: "python", slug: "comment", title: "Comments", sortOrder: 5, hasCodeFile: true },
  { courseKey: "python", slug: "if-else", title: "If/Else", sortOrder: 6, hasCodeFile: true },
  { courseKey: "python", slug: "if-elif-else", title: "If/Elif/Else", sortOrder: 7, hasCodeFile: true },
  { courseKey: "python", slug: "for", title: "For Loops", sortOrder: 8, hasCodeFile: true },
  { courseKey: "python", slug: "while", title: "While Loops", sortOrder: 9, hasCodeFile: true },
  { courseKey: "python", slug: "functions", title: "Functions", sortOrder: 10, hasCodeFile: true },
  { courseKey: "c", slug: "variables", title: "Variables", sortOrder: 1, hasCodeFile: true },
  { courseKey: "c", slug: "print", title: "Print", sortOrder: 2, hasCodeFile: false },
  { courseKey: "java", slug: "variables", title: "Variables", sortOrder: 1, hasCodeFile: false },
  { courseKey: "java", slug: "print", title: "Print", sortOrder: 2, hasCodeFile: false },
];

async function main() {
  for (const course of courses) {
    await prisma.curriculum.upsert({
      where: { key: course.key },
      create: course,
      update: {},
    });
  }

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { courseKey_slug: { courseKey: lesson.courseKey, slug: lesson.slug } },
      create: lesson,
      update: {},
    });
  }

  console.log(`Seeded ${courses.length} courses and ${lessons.length} lessons.`);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
