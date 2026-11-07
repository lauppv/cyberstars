import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('@cyberstars/shared/projects', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@cyberstars/shared/projects')>();
  const step = (id: string) => ({ id, title: id });
  return {
    ...actual,
    PROJECTS: [
      {
        slug: 'shop',
        language: 'python',
        title: 'Shop',
        difficulty: 'easy',
        summary: '',
        steps: [step('a'), step('b')],
      },
      {
        slug: 'bank',
        language: 'python',
        title: 'Bank',
        difficulty: 'hard',
        summary: '',
        steps: [step('a')],
      },
      {
        slug: 'shell',
        language: 'c',
        title: 'Shell',
        difficulty: 'easy',
        summary: '',
        steps: [step('a')],
      },
    ],
  };
});
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('@cyberstars/shared/features', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@cyberstars/shared/features')>()),
  canAccessFeature: vi.fn(),
}));
vi.mock('../services/projectsService', () => ({ getChecks: vi.fn() }));
vi.mock('../components/layout/Topbar', () => ({ Topbar: () => null }));
vi.mock('./NotFoundPage', () => ({ NotFoundPage: () => <p>Not found</p> }));

const { useAuth } = await import('../context/AuthContext');
const { canAccessFeature } = await import('@cyberstars/shared/features');
const projectsService = await import('../services/projectsService');
const { ProjectsPage } = await import('./ProjectsPage');

function renderPage(path = '/projects') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:language" element={<ProjectsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function signedIn(signed = true) {
  vi.mocked(useAuth).mockReturnValue({
    user: signed ? { role: 'ADMIN' } : null,
  } as unknown as ReturnType<typeof useAuth>);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(canAccessFeature).mockReturnValue(true);
  signedIn();
  vi.mocked(projectsService.getChecks).mockResolvedValue([
    { language: 'python', slug: 'shop', stepId: 'a' },
    { language: 'python', slug: 'bank', stepId: 'a' },
    { language: 'c', slug: 'shell', stepId: 'a' },
  ]);
});

describe('ProjectsPage', () => {
  it('shows a card per language, as Algorithms does, each opening its projects', () => {
    renderPage();
    for (const name of ['Python', 'C', 'Java', 'Linux']) {
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(`^${name}`) })).toBeVisible();
    }
    fireEvent.click(screen.getAllByRole('button', { name: /View Projects/ })[2]);
    expect(mockNavigate).toHaveBeenCalledWith('/projects/java');
  });

  it('offers Continue on a started language, to the project still going', async () => {
    renderPage();
    const button = await screen.findAllByRole('button', { name: 'Continue' });
    expect(screen.getByText('Finished: 1 of 2')).toBeInTheDocument();
    fireEvent.click(button[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/projects/python/shop');
  });

  it('keeps the bar on a language with every project finished, its button opening the list', async () => {
    renderPage();
    expect(await screen.findByText('Finished: 1 of 1')).toBeInTheDocument();
    // Python's still going; C's one project is finished, so it has no Continue
    expect(screen.getAllByRole('button', { name: 'Continue' })).toHaveLength(1);
    fireEvent.click(screen.getAllByRole('button', { name: /View Projects/ })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/projects/c');
  });

  it('lists a language’s projects in the drawer with the steps ticked', async () => {
    renderPage('/projects/python');
    const drawer = screen.getByRole('dialog', { name: /Python Projects/ });
    expect(within(drawer).getByText('Projects: 2')).toBeInTheDocument();
    expect(await within(drawer).findByText('Finished: 1 of 2')).toBeInTheDocument();
    const shop = within(drawer).getByRole('link', { name: /Shop/ });
    expect(shop).toHaveTextContent('1Shop1 / 2easy');
    expect(shop).toHaveAttribute('href', '/projects/python/shop');
    expect(within(drawer).getByRole('link', { name: /Bank/ })).toHaveTextContent('✓Bank1 / 1hard');
    expect(within(drawer).queryByText('Shell')).toBeNull();
  });

  it('filters by difficulty, keeping each project’s number', async () => {
    renderPage('/projects/python');
    const drawer = screen.getByRole('dialog');
    await within(drawer).findByText('Finished: 1 of 2');
    fireEvent.click(within(drawer).getByRole('button', { name: 'Hard' }));
    expect(within(drawer).queryByText('Shop')).toBeNull();
    expect(within(drawer).getByRole('link', { name: /Bank/ })).toBeInTheDocument();
    fireEvent.click(within(drawer).getByRole('button', { name: 'Medium' }));
    expect(within(drawer).getByText('No projects match this filter.')).toBeInTheDocument();
  });

  it('says when a language has no projects yet', () => {
    renderPage('/projects/linux');
    expect(within(screen.getByRole('dialog')).getByText('No projects here yet.')).toBeVisible();
  });

  it('shows a guest the projects without ticks', () => {
    signedIn(false);
    renderPage('/projects/python');
    expect(screen.getByRole('link', { name: /Shop/ })).toHaveTextContent('1Shopeasy');
    expect(screen.queryByText(/Finished/)).toBeNull();
    expect(projectsService.getChecks).not.toHaveBeenCalled();
  });

  it('says when the ticks didn’t load, and tries again', async () => {
    vi.mocked(projectsService.getChecks).mockRejectedValueOnce(new Error('down'));
    renderPage('/projects/python');
    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
    const drawer = screen.getByRole('dialog');
    expect(await within(drawer).findByText('Finished: 1 of 2')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('shows only the cards for a language it doesn’t know', () => {
    renderPage('/projects/rust');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: /^Python/ })).toBeInTheDocument();
  });

  it('is a page that doesn’t exist for someone the gate keeps out', () => {
    vi.mocked(canAccessFeature).mockReturnValue(false);
    renderPage('/projects/python');
    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(canAccessFeature).toHaveBeenCalledWith('projects', 'ADMIN', false);
  });
});
