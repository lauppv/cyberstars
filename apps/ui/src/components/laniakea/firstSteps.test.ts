import { describe, it, expect } from 'vitest';
import { firstSteps } from './firstSteps';

const lesson = (slug: string, completed = false) => ({ slug, completed });

describe('firstSteps', () => {
  it('counts only the first six lessons and leads to the first of them left', () => {
    const lessons = [
      lesson('print', true),
      lesson('variables-str'),
      lesson('variables-int', true),
      lesson('print-f', true),
      lesson('recap-variables', true),
      lesson('comment', true),
      lesson('if-else', true),
      lesson('for', true),
    ];
    expect(firstSteps(lessons)).toEqual({ done: 5, next: 'variables-str' });
  });

  it('has nothing left once the six are done, and nothing done before progress loads', () => {
    const six = ['a', 'b', 'c', 'd', 'e', 'f'].map((s) => lesson(s, true));
    expect(firstSteps([...six, lesson('g')])).toEqual({ done: 6, next: null });
    expect(firstSteps([])).toEqual({ done: 0, next: null });
  });
});
