// The landing page's placement test (CYB-68): an easy, a medium and a hard
// question from each course, in that order. The words live in the locales
// under placement.questions.<id>; the code is the same in both languages.
export interface PlacementQuestion {
  id: string;
  topic: 'Python' | 'C' | 'Java' | 'Linux';
  code?: string;
  // Which of the four options is right
  correct: number;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: 'py1', topic: 'Python', code: 'print(3 + 4 * 2)', correct: 2 },
  {
    id: 'py2',
    topic: 'Python',
    code: 'nums = [1, 2, 3]\nother = nums\nother.append(4)\nprint(len(nums))',
    correct: 0,
  },
  {
    id: 'py3',
    topic: 'Python',
    code: 'def add(item, bag=[]):\n    bag.append(item)\n    return bag\n\nadd(1)\nprint(add(2))',
    correct: 3,
  },
  { id: 'c1', topic: 'C', code: 'int x = 7 / 2;\nprintf("%d", x);', correct: 1 },
  {
    id: 'c2',
    topic: 'C',
    code: 'int a[] = {10, 20, 30};\nint *p = a;\np++;\nprintf("%d", *p);',
    correct: 2,
  },
  { id: 'c3', topic: 'C', code: 'char s[] = "hi";\nprintf("%zu", sizeof(s));', correct: 0 },
  { id: 'java1', topic: 'Java', correct: 1 },
  {
    id: 'java2',
    topic: 'Java',
    code: 'String a = "hi";\nString b = a;\na = a + "!";\nSystem.out.println(b);',
    correct: 2,
  },
  {
    id: 'java3',
    topic: 'Java',
    code: 'Integer a = 1000;\nInteger b = 1000;\nSystem.out.println(a == b);',
    correct: 1,
  },
  { id: 'linux1', topic: 'Linux', correct: 3 },
  { id: 'linux2', topic: 'Linux', correct: 1 },
  { id: 'linux3', topic: 'Linux', correct: 2 },
];
