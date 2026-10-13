import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('../components/layout/Topbar', () => ({ Topbar: () => <nav /> }));

const { NotFoundPage } = await import('./NotFoundPage');

describe('NotFoundPage', () => {
  it('says the page is missing and leads home', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Go to the home page' }).getAttribute('href')).toBe(
      '/',
    );
  });
});
