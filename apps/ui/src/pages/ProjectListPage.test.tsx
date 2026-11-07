import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
const { ProjectListPage } = await import('./ProjectListPage');

function renderPage(language = 'python') {
  render(
    <MemoryRouter initialEntries={[`/projects/${language}`]}>
      <Routes>
        <Route path="/projects/:language" element={<ProjectListPage />} />
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

describe('ProjectListPage', () => {
  it('lists the language’s projects with the steps ticked and those finished', async () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /Python Projects/ })).toBeInTheDocument();
    expect(screen.getByText('Projects: 2')).toBeInTheDocument();
    expect(await screen.findByText('Finished: 1 of 2')).toBeInTheDocument();
    const shop = screen.getByRole('button', { name: /Shop/ });
    expect(shop).toHaveTextContent('1Shop1 / 2easy');
    expect(screen.getByRole('button', { name: /Bank/ })).toHaveTextContent('✓Bank1 / 1hard');
    expect(screen.queryByText('Shell')).toBeNull();
    fireEvent.click(shop);
    expect(mockNavigate).toHaveBeenCalledWith('/projects/python/shop');
  });

  it('filters by difficulty, keeping each project’s number', async () => {
    renderPage();
    await screen.findByText('Finished: 1 of 2');
    fireEvent.click(screen.getByRole('button', { name: 'Hard' }));
    expect(screen.queryByText('Shop')).toBeNull();
    expect(screen.getByRole('button', { name: /Bank/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Medium' }));
    expect(screen.getByText('No projects match this filter.')).toBeInTheDocument();
  });

  it('says when a language has no projects yet', () => {
    renderPage('linux');
    expect(screen.getByText('No projects here yet.')).toBeInTheDocument();
  });

  it('shows a guest the list without ticks', () => {
    signedIn(false);
    renderPage();
    expect(screen.getByRole('button', { name: /Shop/ })).toHaveTextContent('1Shopeasy');
    expect(screen.queryByText(/Finished/)).toBeNull();
    expect(projectsService.getChecks).not.toHaveBeenCalled();
  });

  it('says when the ticks didn’t load, and tries again', async () => {
    vi.mocked(projectsService.getChecks).mockRejectedValueOnce(new Error('down'));
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Finished: 1 of 2')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it.each([
    ['a language it doesn’t know', 'rust', true],
    ['someone the gate keeps out', 'python', false],
  ])('is a page that doesn’t exist for %s', (_, language, allowed) => {
    vi.mocked(canAccessFeature).mockReturnValue(allowed);
    renderPage(language);
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });
});
