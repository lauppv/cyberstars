import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StringIndexTable } from './StringIndexTable';

describe('StringIndexTable', () => {
  it('renders one cell per character with its index', () => {
    const { container } = render(<StringIndexTable text="abc" highlight={[]} />);
    const cells = container.querySelectorAll(':scope > div > div > div');
    expect(cells.length).toBe(3);
    expect(cells[0].textContent).toBe('a0');
    expect(cells[2].textContent).toBe('c2');
  });

  it('renders a space character as a non-breaking space, not collapsed', () => {
    const { container } = render(<StringIndexTable text="a b" highlight={[]} />);
    const charBoxes = container.querySelectorAll(':scope > div > div > div > div:first-child');
    expect(charBoxes[1].textContent).toBe(' ');
  });

  it('applies highlighted styling to indices present in highlight', () => {
    const { container } = render(<StringIndexTable text="abc" highlight={[1]} />);
    const charBoxes = container.querySelectorAll(':scope > div > div > div > div:first-child');
    expect((charBoxes[1] as HTMLElement).style.border).toBe('2px solid rgb(108, 92, 231)');
    expect((charBoxes[0] as HTMLElement).style.border).toBe('1px solid rgba(108, 92, 231, 0.3)');
  });

  it('leaves non-highlighted indices with the default styling', () => {
    const { container } = render(<StringIndexTable text="abc" highlight={[]} />);
    const charBoxes = container.querySelectorAll(':scope > div > div > div > div:first-child');
    charBoxes.forEach((box) => {
      expect((box as HTMLElement).style.background).toBe('rgba(17, 24, 32, 0.6)');
      expect((box as HTMLElement).style.color).toBe('rgb(230, 233, 239)');
    });
    const indexLabels = container.querySelectorAll(':scope > div > div > div > div:last-child');
    expect((indexLabels[0] as HTMLElement).style.color).toBe('rgb(122, 130, 144)');
  });

  it('applies highlighted color to both the char box and the index label', () => {
    const { container } = render(<StringIndexTable text="abc" highlight={[0]} />);
    const charBoxes = container.querySelectorAll(':scope > div > div > div > div:first-child');
    const indexLabels = container.querySelectorAll(':scope > div > div > div > div:last-child');
    expect((charBoxes[0] as HTMLElement).style.background).toBe('rgba(108, 92, 231, 0.25)');
    expect((charBoxes[0] as HTMLElement).style.color).toBe('rgb(205, 198, 255)');
    expect((indexLabels[0] as HTMLElement).style.color).toBe('rgb(154, 140, 255)');
  });
});
