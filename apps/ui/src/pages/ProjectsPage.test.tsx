import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { role: 'ADMIN' } }) }));
vi.mock('@cyberstars/shared/features', () => ({ canAccessFeature: vi.fn() }));
vi.mock('../components/layout/Topbar', () => ({ Topbar: () => null }));
vi.mock('./NotFoundPage', () => ({ NotFoundPage: () => <p>Not found</p> }));

const { canAccessFeature } = await import('@cyberstars/shared/features');
const { ProjectsPage } = await import('./ProjectsPage');

function renderPage() {
  render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(canAccessFeature).mockReturnValue(true);
});

describe('ProjectsPage', () => {
  it('shows a card per language, as Algorithms does, each opening its list', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    for (const name of ['Python', 'C', 'Java', 'Linux']) {
      expect(screen.getByRole('heading', { name: `${name} Projects` })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('button', { name: /^Java Projects/ }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/java');
  });

  it('is a page that doesn’t exist for someone the gate keeps out', () => {
    vi.mocked(canAccessFeature).mockReturnValue(false);
    renderPage();
    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(canAccessFeature).toHaveBeenCalledWith('projects', 'ADMIN', false);
  });
});
