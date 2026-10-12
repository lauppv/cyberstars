import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProblemSection } from './ProblemSection';

describe('ProblemSection', () => {
  it('names three things that make starting out hard', () => {
    render(<ProblemSection />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Starting to code is harder than it should be',
      }),
    ).toBeDefined();
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Five tabs before the first line',
      'Setup before anything else',
      "No one tells you if it's right",
    ]);
  });
});
