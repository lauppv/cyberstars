import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { FeaturesSection } from './FeaturesSection';

function renderSection() {
  render(
    <MemoryRouter>
      <FeaturesSection />
    </MemoryRouter>,
  );
}

describe('FeaturesSection', () => {
  it('gives each place a visitor can go a block, a link and a screenshot box', () => {
    renderSection();
    const blocks = screen.getAllByRole('listitem');
    expect(blocks.map((b) => within(b).getByRole('heading').textContent)).toEqual([
      'Courses in four languages',
      'Algorithm challenges',
      'The Almanac',
      "A forum for when you're stuck",
    ]);
    expect(blocks.map((b) => within(b).getByRole('link').getAttribute('href'))).toEqual([
      '/courses',
      '/algorithms',
      '/almanac',
      '/getstarted',
    ]);
    for (const b of blocks) expect(within(b).getByRole('img')).toBeDefined();
  });

  it('says the forum needs an account before leading there', () => {
    renderSection();
    expect(screen.getByText(/Reading and posting need a free account/)).toBeDefined();
    expect(screen.getByRole('link', { name: 'Create a free account' })).toHaveAttribute(
      'href',
      '/getstarted',
    );
  });

  it('presents none of the preview features', () => {
    renderSection();
    expect(screen.queryByText(/messag|connection|leaderboard/i)).toBeNull();
  });
});
