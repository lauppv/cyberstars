import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courses = [
  { key: "python", title: "Python", description: "New to programming? We highly recommend Python", sortOrder: 1 },
  { key: "c", title: "C", description: "Understanding low-level programming", sortOrder: 2 },
  { key: "java", title: "Java", description: "Object Oriented Programming", sortOrder: 3 },
  { key: "algo", title: "Algorithms", description: "Practice with classic LeetCode-style problems — strings, sorting, hash maps", sortOrder: 4 },
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
  { courseKey: "python", slug: "input", title: "Input", sortOrder: 11, hasCodeFile: true },
  { courseKey: "python", slug: "operators", title: "Operators", sortOrder: 12, hasCodeFile: true },
  { courseKey: "python", slug: "booleans", title: "Booleans", sortOrder: 13, hasCodeFile: true },
  { courseKey: "python", slug: "strings-methods", title: "String Methods", sortOrder: 14, hasCodeFile: true },
  { courseKey: "python", slug: "lists", title: "Lists", sortOrder: 15, hasCodeFile: true },
  { courseKey: "python", slug: "lists-for", title: "Looping over Lists", sortOrder: 16, hasCodeFile: true },
  { courseKey: "python", slug: "break-continue", title: "Break and Continue", sortOrder: 17, hasCodeFile: true },
  { courseKey: "python", slug: "return", title: "Return Values", sortOrder: 18, hasCodeFile: true },
  { courseKey: "c", slug: "print", title: "Print", sortOrder: 1, hasCodeFile: true },
  { courseKey: "c", slug: "variables-int", title: "Variables (Integers)", sortOrder: 2, hasCodeFile: true },
  { courseKey: "c", slug: "variables-float", title: "Variables (Floats)", sortOrder: 3, hasCodeFile: true },
  { courseKey: "c", slug: "comment", title: "Comments", sortOrder: 4, hasCodeFile: true },
  { courseKey: "c", slug: "if-else", title: "If/Else", sortOrder: 5, hasCodeFile: true },
  { courseKey: "c", slug: "if-else-if", title: "If/Else If/Else", sortOrder: 6, hasCodeFile: true },
  { courseKey: "c", slug: "for", title: "For Loops", sortOrder: 7, hasCodeFile: true },
  { courseKey: "c", slug: "while", title: "While Loops", sortOrder: 8, hasCodeFile: true },
  { courseKey: "c", slug: "functions", title: "Functions", sortOrder: 9, hasCodeFile: true },
  { courseKey: "c", slug: "input", title: "Input", sortOrder: 10, hasCodeFile: true },
  { courseKey: "c", slug: "operators", title: "Operators", sortOrder: 11, hasCodeFile: true },
  { courseKey: "c", slug: "booleans", title: "Booleans", sortOrder: 12, hasCodeFile: true },
  { courseKey: "c", slug: "strings", title: "Strings", sortOrder: 13, hasCodeFile: true },
  { courseKey: "c", slug: "arrays", title: "Arrays", sortOrder: 14, hasCodeFile: true },
  { courseKey: "c", slug: "arrays-for", title: "Looping over Arrays", sortOrder: 15, hasCodeFile: true },
  { courseKey: "c", slug: "break-continue", title: "Break and Continue", sortOrder: 16, hasCodeFile: true },
  { courseKey: "java", slug: "print", title: "Print", sortOrder: 1, hasCodeFile: true },
  { courseKey: "java", slug: "variables-int", title: "Variables (Numbers)", sortOrder: 2, hasCodeFile: true },
  { courseKey: "java", slug: "variables-str", title: "Variables (Strings)", sortOrder: 3, hasCodeFile: true },
  { courseKey: "java", slug: "concat", title: "String Concatenation", sortOrder: 4, hasCodeFile: true },
  { courseKey: "java", slug: "comment", title: "Comments", sortOrder: 5, hasCodeFile: true },
  { courseKey: "java", slug: "if-else", title: "If/Else", sortOrder: 6, hasCodeFile: true },
  { courseKey: "java", slug: "if-else-if", title: "If/Else If/Else", sortOrder: 7, hasCodeFile: true },
  { courseKey: "java", slug: "for", title: "For Loops", sortOrder: 8, hasCodeFile: true },
  { courseKey: "java", slug: "while", title: "While Loops", sortOrder: 9, hasCodeFile: true },
  { courseKey: "java", slug: "methods", title: "Methods", sortOrder: 10, hasCodeFile: true },
  { courseKey: "java", slug: "input", title: "Input", sortOrder: 11, hasCodeFile: true },
  { courseKey: "java", slug: "operators", title: "Operators", sortOrder: 12, hasCodeFile: true },
  { courseKey: "java", slug: "booleans", title: "Booleans", sortOrder: 13, hasCodeFile: true },
  { courseKey: "java", slug: "strings-methods", title: "String Methods", sortOrder: 14, hasCodeFile: true },
  { courseKey: "java", slug: "arrays", title: "Arrays", sortOrder: 15, hasCodeFile: true },
  { courseKey: "java", slug: "arrays-for", title: "Looping over Arrays", sortOrder: 16, hasCodeFile: true },
  { courseKey: "java", slug: "break-continue", title: "Break and Continue", sortOrder: 17, hasCodeFile: true },

  { courseKey: "algo", slug: "reverse-string", title: "Easy · Reverse a String", sortOrder: 1, hasCodeFile: true },
  { courseKey: "algo", slug: "sum-of-digits", title: "Easy · Sum of Digits", sortOrder: 2, hasCodeFile: true },
  { courseKey: "algo", slug: "count-vowels", title: "Medium · Count Vowels", sortOrder: 3, hasCodeFile: true },
  { courseKey: "algo", slug: "bubble-sort", title: "Medium · Sort the Numbers", sortOrder: 4, hasCodeFile: true },
  { courseKey: "algo", slug: "two-sum", title: "Hard · Two Sum", sortOrder: 5, hasCodeFile: true },
  { courseKey: "algo", slug: "anagram", title: "Hard · Anagram Check", sortOrder: 6, hasCodeFile: true },
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
