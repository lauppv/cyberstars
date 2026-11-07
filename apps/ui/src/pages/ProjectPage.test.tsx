import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import type React from 'react';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('@cyberstars/shared/projects', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@cyberstars/shared/projects')>();
  const steps = [
    { id: 'a', title: 'Alpha' },
    { id: 'b', title: 'Beta step' },
  ];
  const projects = [
    { slug: 'shop', language: 'python', title: 'Shop', difficulty: 'easy', summary: '', steps },
    { slug: 'bank', language: 'python', title: 'Bank', difficulty: 'hard', summary: '', steps },
    { slug: 'tidy', language: 'linux', title: 'Tidy', difficulty: 'easy', summary: '', steps },
  ];
  return {
    ...actual,
    PROJECTS: projects,
    findProject: (language: string, slug: string) =>
      projects.find((p) => p.language === language && p.slug === slug),
  };
});
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('@cyberstars/shared/features', () => ({ canAccessFeature: vi.fn() }));
vi.mock('../services/projectsService', () => ({
  getChecks: vi.fn(),
  setCheck: vi.fn(),
  getProjectText: vi.fn(),
  getCompletions: vi.fn(),
  runTests: vi.fn(),
  checkTerminal: vi.fn(),
}));
vi.mock('../hooks/useRunWait', () => ({
  setRunWait: vi.fn(),
  withRunWait: (_: string, send: (id: string) => Promise<unknown>) => send('run-1'),
}));
vi.mock('../components/judge/ResultPanel', () => ({
  ResultPanel: ({ results, next }: { results: { status: string }; next: React.ReactNode }) => (
    <div>
      <p>Verdict: {results.status}</p>
      {results.status === 'passed' && next}
    </div>
  ),
}));
const execute = vi.fn();
vi.mock('../hooks/useCodeExecution', () => ({
  useCodeExecution: () => ({
    output: '',
    isRunning: false,
    execute,
    stop: vi.fn(),
    sendInput: vi.fn(),
  }),
}));
const useTerminal = vi.fn();
vi.mock('../hooks/useTerminalSession', () => ({
  useTerminalSession: (...a: unknown[]) => {
    useTerminal(...a);
    return {
      lines: [],
      cwd: '/home/student',
      sessionId: 'session-1',
      isReady: true,
      isExecuting: false,
      execute: vi.fn(),
      reset: vi.fn(),
    };
  },
}));
vi.mock('../components/terminal/TerminalPanel', () => ({
  TerminalPanel: ({
    onRunTests,
    testResult,
    nextAfterPass,
  }: {
    onRunTests: () => void;
    testResult: { status: string } | null;
    nextAfterPass: React.ReactNode;
  }) => (
    <div>
      <p>Terminal</p>
      <button onClick={onRunTests}>Check the terminal</button>
      {testResult?.status === 'passed' && nextAfterPass}
    </div>
  ),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: ({ breadcrumb }: { breadcrumb: { course: string; lesson: string } }) => (
    <p>
      {breadcrumb.course} / {breadcrumb.lesson}
    </p>
  ),
}));
vi.mock('./NotFoundPage', () => ({ NotFoundPage: () => <p>Not found</p> }));

const { useAuth } = await import('../context/AuthContext');
const { canAccessFeature } = await import('@cyberstars/shared/features');
const projectsService = await import('../services/projectsService');
const { ProjectPage } = await import('./ProjectPage');

const TEXT = 'Intro text\n\n## Alpha\n\nAlpha body\n\n## Beta step\n\nBeta body\n';

function renderPage(path = '/projects/python/shop') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:language/:slug" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function signedIn(signed = true) {
  vi.mocked(useAuth).mockReturnValue({
    user: signed ? { role: 'ADMIN' } : null,
  } as unknown as ReturnType<typeof useAuth>);
}

const box = (title: string) => screen.getByRole('checkbox', { name: `Mark "${title}" as done` });

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.mocked(canAccessFeature).mockReturnValue(true);
  signedIn();
  vi.mocked(projectsService.getProjectText).mockResolvedValue(TEXT);
  vi.mocked(projectsService.getCompletions).mockResolvedValue([]);
  vi.mocked(projectsService.getChecks).mockResolvedValue([
    { language: 'python', slug: 'shop', stepId: 'a' },
    { language: 'python', slug: 'bank', stepId: 'b' },
  ]);
  vi.mocked(projectsService.setCheck).mockResolvedValue(undefined);
});

describe('ProjectPage', () => {
  it('lays the project out like a lesson, with the steps ticked and the next one open', async () => {
    renderPage();
    expect(screen.getByText('Python Projects / Shop')).toBeInTheDocument();
    expect(screen.getByText('Project 1 of 2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Shop' })).toBeInTheDocument();
    expect(await screen.findByText('Intro text')).toBeInTheDocument();
    await waitFor(() => expect(box('Alpha')).toHaveAttribute('aria-checked', 'true'));
    expect(box('Beta step')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    // The first step still to do is open, the ticked one closed
    expect(screen.getByText('Beta body')).toBeInTheDocument();
    expect(screen.queryByText('Alpha body')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Alpha/ }));
    expect(screen.getByText('Alpha body')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Alpha/ }));
    expect(screen.queryByText('Alpha body')).toBeNull();
  });

  it('keeps a tick on the account', async () => {
    renderPage();
    await waitFor(() => expect(box('Beta step')).not.toBeDisabled());
    fireEvent.click(box('Beta step'));
    expect(box('Beta step')).toHaveAttribute('aria-checked', 'true');
    expect(projectsService.setCheck).toHaveBeenCalledWith('python', 'shop', 'b', true);
    await waitFor(() => expect(box('Beta step')).not.toBeDisabled());
    fireEvent.click(box('Alpha'));
    expect(projectsService.setCheck).toHaveBeenCalledWith('python', 'shop', 'a', false);
    await waitFor(() => expect(screen.getByText('1 / 2')).toBeInTheDocument());
  });

  it('puts a tick back when the server didn’t keep it', async () => {
    vi.mocked(projectsService.setCheck).mockRejectedValue(new Error('down'));
    renderPage();
    await waitFor(() => expect(box('Beta step')).not.toBeDisabled());
    fireEvent.click(box('Beta step'));
    expect(await screen.findByRole('alert')).toHaveTextContent("That tick couldn't be saved");
    expect(box('Beta step')).toHaveAttribute('aria-checked', 'false');
  });

  it('says when the ticks didn’t load, and tries again', async () => {
    vi.mocked(projectsService.getChecks).mockRejectedValueOnce(new Error('down'));
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(box('Alpha')).toHaveAttribute('aria-checked', 'true'));
  });

  it('opens a project whose steps are all ticked on none', async () => {
    vi.mocked(projectsService.getChecks).mockResolvedValue([
      { language: 'python', slug: 'shop', stepId: 'a' },
      { language: 'python', slug: 'shop', stepId: 'b' },
    ]);
    renderPage();
    await waitFor(() => expect(screen.getByText('2 / 2')).toBeInTheDocument());
    expect(screen.queryByText('Alpha body')).toBeNull();
    expect(screen.queryByText('Beta body')).toBeNull();
  });

  it('shows a guest the steps with the first open and no boxes to tick', async () => {
    signedIn(false);
    renderPage();
    expect(await screen.findByText('Alpha body')).toBeInTheDocument();
    expect(screen.getByText("Sign in to keep track of the steps you've done.")).toBeInTheDocument();
    expect(box('Alpha')).toBeDisabled();
    fireEvent.click(box('Alpha'));
    expect(projectsService.getChecks).not.toHaveBeenCalled();
    expect(projectsService.setCheck).not.toHaveBeenCalled();
  });

  it('says when the text didn’t load, and tries again', async () => {
    vi.mocked(projectsService.getProjectText).mockRejectedValueOnce(new Error('down'));
    renderPage();
    expect(await screen.findByText("This project couldn't load.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Intro text')).toBeInTheDocument();
  });

  it('runs the code in the project’s language and keeps it on the device', async () => {
    localStorage.setItem('cyberstars.project.python.shop', 'print(1)');
    renderPage();
    await screen.findByText('Intro text');
    fireEvent.click(screen.getByRole('button', { name: /^▶ ?Run$|^Run$/ }));
    expect(execute).toHaveBeenCalledWith('print(1)', 'python');
  });

  it('moves to the next and previous project, and the tabs switch on a phone', async () => {
    renderPage();
    await screen.findByText('Intro text');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/python/bank');
    fireEvent.click(screen.getByRole('tab', { name: 'Code' }));
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');
  });

  it('leaves the last project’s Next off and goes back from it', async () => {
    renderPage('/projects/python/bank');
    await screen.findByText('Intro text');
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/python/shop');
  });

  it('opens a terminal with the project’s files on a Linux project, no editor', async () => {
    renderPage('/projects/linux/tidy');
    expect(await screen.findByText('Terminal')).toBeInTheDocument();
    expect(useTerminal).toHaveBeenCalledWith('linux', 'tidy', expect.any(Function), 'project');
    expect(screen.queryByRole('button', { name: /Run/ })).toBeNull();
  });

  it('starts no terminal on a project in another language', async () => {
    renderPage();
    await screen.findByText('Intro text');
    expect(useTerminal).not.toHaveBeenCalled();
  });

  it('runs the project’s tests, and a pass finishes the project with its XP', async () => {
    vi.mocked(projectsService.runTests).mockResolvedValue({
      status: 'passed',
    } as Awaited<ReturnType<typeof projectsService.runTests>>);
    renderPage();
    await screen.findByText('Intro text');
    expect(screen.queryByText('Finished')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Run Tests' }));
    expect(await screen.findByText('Project finished: +100 XP')).toBeInTheDocument();
    expect(projectsService.runTests).toHaveBeenCalledWith('python', 'shop', '', 'run-1');
    expect(screen.getByText('Finished')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to output' }));
    expect(screen.queryByText('Verdict: passed')).toBeNull();
  });

  it('keeps a project unfinished on a failing run', async () => {
    vi.mocked(projectsService.runTests).mockResolvedValueOnce({
      status: 'failed',
    } as Awaited<ReturnType<typeof projectsService.runTests>>);
    renderPage();
    await screen.findByText('Intro text');
    fireEvent.click(screen.getByRole('button', { name: 'Run Tests' }));
    expect(await screen.findByText('Verdict: failed')).toBeInTheDocument();
    expect(screen.queryByText('Finished')).toBeNull();
  });

  it('tells a guest whose run passes that the project needs an account', async () => {
    signedIn(false);
    vi.mocked(projectsService.runTests).mockResolvedValue({
      status: 'passed',
    } as Awaited<ReturnType<typeof projectsService.runTests>>);
    renderPage();
    await screen.findByText('Intro text');
    fireEvent.click(screen.getByRole('button', { name: 'Run Tests' }));
    expect(
      await screen.findByText('Every test passes. Sign in to keep the project and its XP.'),
    ).toBeInTheDocument();
    expect(projectsService.getCompletions).not.toHaveBeenCalled();
  });

  it('shows a project the student finished before as finished', async () => {
    vi.mocked(projectsService.getCompletions).mockResolvedValue([
      { language: 'python', slug: 'shop', completedAt: '2026-11-08T10:00:00.000Z' },
    ]);
    renderPage();
    expect(await screen.findByText('Finished')).toBeInTheDocument();
  });

  it('checks a Linux project’s terminal session against its checks', async () => {
    vi.mocked(projectsService.checkTerminal).mockResolvedValue({ status: 'passed', checks: [] });
    renderPage('/projects/linux/tidy');
    fireEvent.click(await screen.findByRole('button', { name: 'Check the terminal' }));
    expect(await screen.findByText('Project finished: +100 XP')).toBeInTheDocument();
    expect(projectsService.checkTerminal).toHaveBeenCalledWith('session-1', 'tidy');
  });

  it.each([
    ['a project it doesn’t know', '/projects/python/nope', true],
    ['someone the gate keeps out', '/projects/python/shop', false],
  ])('is a page that doesn’t exist for %s', (_, path, allowed) => {
    vi.mocked(canAccessFeature).mockReturnValue(allowed);
    renderPage(path);
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });
});
