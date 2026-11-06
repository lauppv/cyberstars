import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CourseMark } from './CourseMark';
import { courseMeta } from '../../constants/courses';

describe('CourseMark', () => {
  it("draws the course's symbol in its colour", () => {
    const { container } = render(<CourseMark courseKey="java" />);
    expect(container.querySelector('svg')!.getAttribute('color')).toBe(courseMeta('java').color);
    expect(container.querySelector('svg path')).not.toBeNull();
  });

  it("gives an algorithm set its language's symbol", () => {
    const plain = render(<CourseMark courseKey="c" />).container;
    const algo = render(<CourseMark courseKey="algo-c" />).container;
    expect(algo.querySelector('svg')!.innerHTML).toBe(plain.querySelector('svg')!.innerHTML);
  });

  it('is decoration, hidden from screen readers', () => {
    const { container } = render(<CourseMark courseKey="python" size={28} />);
    const tile = container.firstElementChild as HTMLElement;
    expect(tile.getAttribute('aria-hidden')).toBe('true');
    expect(tile.style.width).toBe('28px');
  });
});
