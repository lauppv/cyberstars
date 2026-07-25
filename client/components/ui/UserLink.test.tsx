import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const h = vi.hoisted(() => ({
  auth: { user: { role: 'USER' } as { role: string } | null },
  access: true,
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../../shared/features', () => ({ canAccessFeature: () => h.access }));

import { UserLink } from './UserLink';

beforeEach(() => {
  h.auth = { user: { role: 'USER' } };
  h.access = true;
});

describe('UserLink', () => {
  it('links to the public profile when the gate is open', () => {
    render(
      <MemoryRouter>
        <UserLink userId={7}>Ada</UserLink>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Ada' })).toHaveAttribute('href', '/u/7');
  });

  it('renders plain text when the gate is closed', () => {
    h.access = false;
    render(
      <MemoryRouter>
        <UserLink userId={7} className="author">
          Ada
        </UserLink>
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Ada')).toHaveClass('author');
  });

  it('stops propagation so clicks inside clickable rows do not bubble', () => {
    const rowClick = vi.fn();
    render(
      <MemoryRouter>
        <div onClick={rowClick}>
          <UserLink userId={7}>Ada</UserLink>
        </div>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Ada' }));
    expect(rowClick).not.toHaveBeenCalled();
  });
});
