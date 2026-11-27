import { PLACEMENT_QUESTION_COUNT } from '@cyberstars/shared/placement';

// The landing page's placement test (CYB-68): the student picks the courses
// they want to learn, then answers questions only from those. The words live
// in the locales under placement.questions.<id>; the code is the same in both
// languages.
export const PLACEMENT_COURSES = ['python', 'c', 'java', 'linux', 'web', 'algorithms'] as const;

export type PlacementCourse = (typeof PLACEMENT_COURSES)[number];

export interface PlacementQuestion {
  id: string;
  course: PlacementCourse;
  code?: string;
  // Which of the four options is right
  correct: number;
}

// Ten questions per course, from easy to hard: three easy, four medium and
// three hard
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: 'py1', course: 'python', code: 'print(3 + 4 * 2)', correct: 2 },
  { id: 'py4', course: 'python', code: 'print("ha" * 3)', correct: 1 },
  {
    id: 'py5',
    course: 'python',
    code: 'total = 0\nfor i in range(4):\n    total += i\nprint(total)',
    correct: 2,
  },
  {
    id: 'py2',
    course: 'python',
    code: 'nums = [1, 2, 3]\nother = nums\nother.append(4)\nprint(len(nums))',
    correct: 0,
  },
  { id: 'py6', course: 'python', code: 'word = "python"\nprint(word[1:4])', correct: 1 },
  { id: 'py7', course: 'python', code: 'print(len(set([1, 2, 2, 3, 3, 3])))', correct: 3 },
  {
    id: 'py8',
    course: 'python',
    code: 'print([x * x for x in range(5) if x % 2 == 0])',
    correct: 0,
  },
  {
    id: 'py9',
    course: 'python',
    code: 'words = ["kiwi", "fig", "banana"]\nprint(sorted(words, key=len))',
    correct: 2,
  },
  {
    id: 'py10',
    course: 'python',
    code: 'class Robot:\n    count = 0\n\n    def __init__(self):\n        Robot.count += 1\n\na = Robot()\nb = Robot()\nprint(a.count)',
    correct: 3,
  },
  {
    id: 'py3',
    course: 'python',
    code: 'def add(item, bag=[]):\n    bag.append(item)\n    return bag\n\nadd(1)\nprint(add(2))',
    correct: 3,
  },
  { id: 'c1', course: 'c', code: 'int x = 7 / 2;\nprintf("%d", x);', correct: 1 },
  { id: 'c4', course: 'c', code: 'int x = 5;\nx += 3;\nprintf("%d", x * 2);', correct: 0 },
  { id: 'c5', course: 'c', code: 'for (int i = 0; i < 3; i++)\n    printf("%d", i);', correct: 2 },
  { id: 'c6', course: 'c', code: 'char c = \'A\' + 2;\nprintf("%c", c);', correct: 3 },
  {
    id: 'c7',
    course: 'c',
    code: 'void change(int x) {\n    x = 100;\n}\n\nint main(void) {\n    int n = 5;\n    change(n);\n    printf("%d", n);\n}',
    correct: 1,
  },
  {
    id: 'c2',
    course: 'c',
    code: 'int a[] = {10, 20, 30};\nint *p = a;\np++;\nprintf("%d", *p);',
    correct: 2,
  },
  {
    id: 'c8',
    course: 'c',
    code: 'struct point { int x, y; };\n\nstruct point p = {1, 2};\nstruct point *q = &p;\nq->x = 9;\nprintf("%d %d", p.x, p.y);',
    correct: 0,
  },
  {
    id: 'c9',
    course: 'c',
    code: 'int next(void) {\n    static int n = 0;\n    return ++n;\n}\n\nint main(void) {\n    next();\n    next();\n    printf("%d", next());\n}',
    correct: 2,
  },
  { id: 'c3', course: 'c', code: 'char s[] = "hi";\nprintf("%zu", sizeof(s));', correct: 0 },
  { id: 'c10', course: 'c', code: 'fork();\nfork();\nprintf("hi\\n");', correct: 3 },
  { id: 'java1', course: 'java', correct: 1 },
  {
    id: 'java5',
    course: 'java',
    code: 'String word = "Java";\nSystem.out.println(word.length());',
    correct: 0,
  },
  { id: 'java4', course: 'java', code: 'System.out.println("5" + 3);', correct: 2 },
  {
    id: 'java7',
    course: 'java',
    code: 'int[] nums = {4, 8, 15};\nSystem.out.println(nums[nums.length - 1]);',
    correct: 1,
  },
  {
    id: 'java6',
    course: 'java',
    code: 'int count = 0;\nfor (int i = 1; i <= 10; i += 3) {\n    count++;\n}\nSystem.out.println(count);',
    correct: 3,
  },
  {
    id: 'java2',
    course: 'java',
    code: 'String a = "hi";\nString b = a;\na = a + "!";\nSystem.out.println(b);',
    correct: 2,
  },
  {
    id: 'java8',
    course: 'java',
    code: 'Map<String, Integer> stock = new HashMap<>();\nstock.put("apple", 3);\nstock.put("apple", 5);\nSystem.out.println(stock.size() + " " + stock.get("apple"));',
    correct: 1,
  },
  {
    id: 'java9',
    course: 'java',
    code: 'class Animal {\n    String sound() { return "..."; }\n}\n\nclass Dog extends Animal {\n    String sound() { return "Woof"; }\n}\n\nAnimal a = new Dog();\nSystem.out.println(a.sound());',
    correct: 0,
  },
  {
    id: 'java10',
    course: 'java',
    code: 'List<Integer> nums = List.of(1, 2, 3, 4, 5);\nint sum = nums.stream()\n    .filter(n -> n % 2 == 1)\n    .map(n -> n * 10)\n    .reduce(0, Integer::sum);\nSystem.out.println(sum);',
    correct: 3,
  },
  {
    id: 'java3',
    course: 'java',
    code: 'Integer a = 1000;\nInteger b = 1000;\nSystem.out.println(a == b);',
    correct: 1,
  },
  { id: 'linux1', course: 'linux', correct: 3 },
  { id: 'linux4', course: 'linux', correct: 1 },
  { id: 'linux5', course: 'linux', correct: 0 },
  { id: 'linux2', course: 'linux', correct: 1 },
  { id: 'linux6', course: 'linux', correct: 2 },
  { id: 'linux7', course: 'linux', correct: 1 },
  { id: 'linux8', course: 'linux', correct: 3 },
  { id: 'linux3', course: 'linux', correct: 2 },
  {
    id: 'linux9',
    course: 'linux',
    code: '$ cat scores.txt\ntom 12\namy 7\nlee 9\n$ sort -n -k2 scores.txt | head -1',
    correct: 0,
  },
  {
    id: 'linux10',
    course: 'linux',
    code: "$ cat sales.txt\nmon 5\ntue 3\nwed 4\n$ awk '{ sum += $2 } END { print sum }' sales.txt",
    correct: 2,
  },
  { id: 'web1', course: 'web', correct: 2 },
  { id: 'web2', course: 'web', correct: 3 },
  { id: 'web3', course: 'web', correct: 0 },
  {
    id: 'web4',
    course: 'web',
    code: 'let text = "";\nfor (let i = 0; i < 3; i++) {\n  text += i;\n}\nconsole.log(text);',
    correct: 1,
  },
  { id: 'web5', course: 'web', correct: 1 },
  {
    id: 'web6',
    course: 'web',
    code: '.box {\n  width: 200px;\n  padding: 10px;\n  border: 5px solid black;\n}',
    correct: 2,
  },
  {
    id: 'web7',
    course: 'web',
    code: '<p id="note" class="info">Hello</p>\n\n<style>\n  #note { color: green; }\n  .info { color: blue; }\n  p { color: red; }\n</style>',
    correct: 2,
  },
  {
    id: 'web8',
    course: 'web',
    code: 'const prices = [2, 4, 6];\nconst total = prices\n  .map((p) => p * 2)\n  .reduce((sum, p) => sum + p, 0);\nconsole.log(total);',
    correct: 1,
  },
  {
    id: 'web9',
    course: 'web',
    code: 'const count = 0;\nconsole.log(count || 10);\nconsole.log(count ?? 10);',
    correct: 0,
  },
  {
    id: 'web10',
    course: 'web',
    code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");',
    correct: 3,
  },
  {
    id: 'algo1',
    course: 'algorithms',
    code: 'def mystery(text):\n    return text[::-1]\n\nprint(mystery("star"))',
    correct: 1,
  },
  { id: 'algo2', course: 'algorithms', correct: 2 },
  { id: 'algo3', course: 'algorithms', correct: 3 },
  { id: 'algo4', course: 'algorithms', correct: 3 },
  { id: 'algo5', course: 'algorithms', correct: 1 },
  {
    id: 'algo6',
    course: 'algorithms',
    code: 'def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(6))',
    correct: 3,
  },
  { id: 'algo7', course: 'algorithms', correct: 1 },
  { id: 'algo8', course: 'algorithms', correct: 0 },
  { id: 'algo9', course: 'algorithms', code: '    1\n   / \\\n  2   3\n / \\\n4   5', correct: 3 },
  {
    id: 'algo10',
    course: 'algorithms',
    code: 'A -> B  4\nA -> C  1\nC -> B  2\nB -> D  1',
    correct: 1,
  },
];

// The test for the picked courses: the ten questions shared out between them
// as evenly as ten allows, each course's share spread over its easy to hard
// questions. Grouped by course, in the order of PLACEMENT_COURSES.
export function pickQuestions(picked: readonly PlacementCourse[]): PlacementQuestion[] {
  const courses = PLACEMENT_COURSES.filter((c) => picked.includes(c));
  return courses.flatMap((course, i) => {
    const pool = PLACEMENT_QUESTIONS.filter((q) => q.course === course);
    const share =
      Math.floor(PLACEMENT_QUESTION_COUNT / courses.length) +
      (i < PLACEMENT_QUESTION_COUNT % courses.length ? 1 : 0);
    return Array.from(
      { length: share },
      (_, j) => pool[Math.round(((j + 0.5) * pool.length) / share - 0.5)],
    );
  });
}
