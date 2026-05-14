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
  { courseKey: "python", slug: "dictionaries", title: "Dictionaries", sortOrder: 19, hasCodeFile: true },
  { courseKey: "python", slug: "dictionaries-loop", title: "Looping over Dictionaries", sortOrder: 20, hasCodeFile: true },
  { courseKey: "python", slug: "tuples", title: "Tuples", sortOrder: 21, hasCodeFile: true },
  { courseKey: "python", slug: "sets", title: "Sets", sortOrder: 22, hasCodeFile: true },
  { courseKey: "python", slug: "nested-loops", title: "Nested Loops", sortOrder: 23, hasCodeFile: true },
  { courseKey: "python", slug: "list-comprehension", title: "List Comprehension", sortOrder: 24, hasCodeFile: true },
  { courseKey: "python", slug: "scope", title: "Scope", sortOrder: 25, hasCodeFile: true },
  { courseKey: "python", slug: "default-params", title: "Default Parameters", sortOrder: 26, hasCodeFile: true },
  { courseKey: "python", slug: "multiple-return", title: "Multiple Return Values", sortOrder: 27, hasCodeFile: true },
  { courseKey: "python", slug: "try-except", title: "Try / Except", sortOrder: 28, hasCodeFile: true },
  { courseKey: "python", slug: "builtin-functions", title: "Built-in Functions", sortOrder: 29, hasCodeFile: true },
  { courseKey: "python", slug: "problem-decomposition", title: "Problem Decomposition", sortOrder: 30, hasCodeFile: true },
  { courseKey: "python", slug: "pattern-counter", title: "Pattern: Counter", sortOrder: 31, hasCodeFile: true },
  { courseKey: "python", slug: "pattern-accumulator", title: "Pattern: Accumulator", sortOrder: 32, hasCodeFile: true },
  { courseKey: "python", slug: "pattern-flag", title: "Pattern: Flag", sortOrder: 33, hasCodeFile: true },
  { courseKey: "python", slug: "linear-search", title: "Linear Search", sortOrder: 34, hasCodeFile: true },
  { courseKey: "python", slug: "frequency-dict", title: "Frequency Dictionary", sortOrder: 35, hasCodeFile: true },
  { courseKey: "python", slug: "bubble-sort", title: "Bubble Sort", sortOrder: 36, hasCodeFile: true },
  { courseKey: "python", slug: "selection-sort", title: "Selection Sort", sortOrder: 37, hasCodeFile: true },
  { courseKey: "python", slug: "string-reverse", title: "Reverse a String", sortOrder: 38, hasCodeFile: true },
  { courseKey: "python", slug: "palindrome", title: "Palindrome", sortOrder: 39, hasCodeFile: true },
  { courseKey: "python", slug: "anagram", title: "Anagram", sortOrder: 40, hasCodeFile: true },
  { courseKey: "python", slug: "list-filter-transform", title: "Filter and Transform", sortOrder: 41, hasCodeFile: true },
  { courseKey: "python", slug: "two-pointers", title: "Two Pointers", sortOrder: 42, hasCodeFile: true },
  { courseKey: "python", slug: "recursion-intro", title: "Recursion", sortOrder: 43, hasCodeFile: true },
  { courseKey: "python", slug: "recursion-practice", title: "Recursion Practice", sortOrder: 44, hasCodeFile: true },
  { courseKey: "python", slug: "matrix-basics", title: "Matrices (2D Lists)", sortOrder: 45, hasCodeFile: true },
  { courseKey: "python", slug: "binary-search", title: "Binary Search", sortOrder: 46, hasCodeFile: true },
  { courseKey: "python", slug: "project-guessing-game", title: "Project: Guessing Game", sortOrder: 47, hasCodeFile: true },
  { courseKey: "python", slug: "project-quiz", title: "Project: Quiz Game", sortOrder: 48, hasCodeFile: true },
  { courseKey: "python", slug: "project-todo", title: "Project: To-Do List", sortOrder: 49, hasCodeFile: true },
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
  { courseKey: "java", slug: "return-values", title: "Return Values", sortOrder: 18, hasCodeFile: true },
  { courseKey: "java", slug: "method-overloading", title: "Method Overloading", sortOrder: 19, hasCodeFile: true },
  { courseKey: "java", slug: "nested-loops", title: "Nested Loops", sortOrder: 20, hasCodeFile: true },
  { courseKey: "java", slug: "arraylist", title: "ArrayList", sortOrder: 21, hasCodeFile: true },
  { courseKey: "java", slug: "arraylist-loops", title: "Looping over ArrayLists", sortOrder: 22, hasCodeFile: true },
  { courseKey: "java", slug: "hashmap", title: "HashMap", sortOrder: 23, hasCodeFile: true },
  { courseKey: "java", slug: "hashmap-loops", title: "Looping over HashMaps", sortOrder: 24, hasCodeFile: true },
  { courseKey: "java", slug: "math-class", title: "The Math Class", sortOrder: 25, hasCodeFile: true },
  { courseKey: "java", slug: "classes-objects", title: "Classes and Objects", sortOrder: 26, hasCodeFile: true },
  { courseKey: "java", slug: "constructors", title: "Constructors", sortOrder: 27, hasCodeFile: true },
  { courseKey: "java", slug: "classes-methods", title: "Methods Inside Classes", sortOrder: 28, hasCodeFile: true },
  { courseKey: "java", slug: "getters-setters", title: "Getters and Setters", sortOrder: 29, hasCodeFile: true },
  { courseKey: "java", slug: "tostring", title: "toString()", sortOrder: 30, hasCodeFile: true },
  { courseKey: "java", slug: "static-keyword", title: "The static Keyword", sortOrder: 31, hasCodeFile: true },
  { courseKey: "java", slug: "final-keyword", title: "The final Keyword", sortOrder: 32, hasCodeFile: true },
  { courseKey: "java", slug: "scope-and-access", title: "Scope and Access", sortOrder: 33, hasCodeFile: true },
  { courseKey: "java", slug: "null", title: "null", sortOrder: 34, hasCodeFile: true },
  { courseKey: "java", slug: "wrapper-classes", title: "Wrapper Classes", sortOrder: 35, hasCodeFile: true },
  { courseKey: "java", slug: "inheritance", title: "Inheritance", sortOrder: 36, hasCodeFile: true },
  { courseKey: "java", slug: "inheritance-override", title: "Overriding Methods", sortOrder: 37, hasCodeFile: true },
  { courseKey: "java", slug: "polymorphism", title: "Polymorphism", sortOrder: 38, hasCodeFile: true },
  { courseKey: "java", slug: "abstract-classes", title: "Abstract Classes", sortOrder: 39, hasCodeFile: true },
  { courseKey: "java", slug: "interfaces", title: "Interfaces", sortOrder: 40, hasCodeFile: true },
  { courseKey: "java", slug: "casting", title: "Type Casting", sortOrder: 41, hasCodeFile: true },
  { courseKey: "java", slug: "exceptions", title: "Try / Catch", sortOrder: 42, hasCodeFile: true },
  { courseKey: "java", slug: "string-format", title: "String.format()", sortOrder: 43, hasCodeFile: true },
  { courseKey: "java", slug: "collections-sort", title: "Sorting Collections", sortOrder: 44, hasCodeFile: true },
  { courseKey: "java", slug: "for-each-advanced", title: "Enhanced Patterns", sortOrder: 45, hasCodeFile: true },
  { courseKey: "java", slug: "enums", title: "Enums", sortOrder: 46, hasCodeFile: true },
  { courseKey: "java", slug: "switch", title: "Switch Statements", sortOrder: 47, hasCodeFile: true },
  { courseKey: "java", slug: "project-inventory", title: "Project: Inventory System", sortOrder: 48, hasCodeFile: true },
  { courseKey: "java", slug: "project-battle", title: "Project: Battle Simulator", sortOrder: 49, hasCodeFile: true },
  { courseKey: "java", slug: "project-student-grades", title: "Project: Student Gradebook", sortOrder: 50, hasCodeFile: true },

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
