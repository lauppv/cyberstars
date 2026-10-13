import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FreeSection } from './FreeSection';

describe('FreeSection', () => {
  it('says there is no paid plan and no card', () => {
    render(<FreeSection />);
    expect(screen.getByRole('heading', { name: 'Free. Open source.' })).toBeDefined();
    const points = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(points).toContain('No paid plan');
    expect(points).toContain('No card');
  });

  it('names and links the two licences on their own', () => {
    render(<FreeSection />);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'No paid plan',
      'No card',
      'BSD 3-Clause',
      'CC BY-SA 4.0',
    ]);
    expect(screen.getByRole('link', { name: 'BSD 3-Clause' })).toHaveAttribute(
      'href',
      'https://github.com/lauppv/cyberstars/blob/main/LICENSE',
    );
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute(
      'href',
      'https://github.com/lauppv/cyberstars/blob/main/LICENSE-content.md',
    );
  });
});
