import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import type { LaniakeaState } from '@cyberstars/shared/laniakea';
import { testPlanet } from './testPlanets';
import type { ExplorerEvents } from './scene/explorer';

const h = vi.hoisted(() => ({
  getLaniakea: vi.fn(),
  startQuiz: vi.fn(),
  answerQuiz: vi.fn(),
  markSeen: vi.fn(),
  loadThree: vi.fn(),
  engine: {
    setMarks: vi.fn(),
    setTarget: vi.fn(),
    setActive: vi.fn(),
    dispose: vi.fn(),
  },
  events: null as ExplorerEvents | null,
  createExplorer: vi.fn(),
}));

vi.mock('../../services/laniakeaService', () => ({
  getLaniakea: h.getLaniakea,
  startQuiz: h.startQuiz,
  answerQuiz: h.answerQuiz,
  markSeen: h.markSeen,
}));
vi.mock('./scene/loadThree', () => ({ loadThree: h.loadThree }));
vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({ items: [], noteRead: vi.fn() }),
}));
vi.mock('./scene/explorer', () => ({ createExplorer: h.createExplorer }));
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      {
        key: 'python',
        title: 'Python',
        lessons: [
          { slug: 'print', title: 'Print' },
          { slug: 'variables-str', title: 'Variables (Strings)' },
          { slug: 'variables-int', title: 'Variables (Integers)' },
          { slug: 'print-f', title: 'Print F-strings' },
          { slug: 'recap-variables', title: 'Recap: Player Card' },
          { slug: 'comment', title: 'Comments' },
          { slug: 'lists', title: 'Lists' },
          { slug: 'for', title: 'For Loops' },
        ],
      },
    ],
  }),
}));

import { LaniakeaPage } from './LaniakeaPage';

const NOW = '2026-10-24T12:00:00.000Z';

function state(over: Partial<LaniakeaState> = {}): LaniakeaState {
  return {
    courseKey: 'python',
    unlocked: true,
    lessonsDone: 6,
    unlockAt: 6,
    nextLesson: null,
    serverNow: NOW,
    planets: [
      testPlanet({ slug: 'print' }),
      testPlanet({ slug: 'lists', level: 2, nextRecapAt: '2026-10-25T12:00:00.000Z' }),
      testPlanet({ slug: 'for', lessonDone: false }),
    ],
    ...over,
  };
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/laniakea']}>
      <Routes>
        <Route path="/laniakea" element={<LaniakeaPage />} />
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/lesson/:course/:slug" element={<div>A lesson</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

const key = (code: string) => fireEvent.keyDown(document, { code });

// The page with the game open and the ship flying
async function flying() {
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: /Take the helm/ }));
  await waitFor(() => expect(h.createExplorer).toHaveBeenCalled());
}

beforeEach(() => {
  vi.clearAllMocks();
  h.events = null;
  h.getLaniakea.mockResolvedValue(state());
  h.markSeen.mockResolvedValue(undefined);
  h.loadThree.mockResolvedValue({});
  h.createExplorer.mockImplementation((_t, _m, _s, _touch, events: ExplorerEvents) => {
    h.events = events;
    return h.engine;
  });
});

describe('LaniakeaPage', () => {
  it('says what opens the game before First steps, and leads to the lesson left', async () => {
    h.getLaniakea.mockResolvedValue(
      state({
        unlocked: false,
        lessonsDone: 5,
        nextLesson: 'variables-int',
        planets: [testPlanet({ lessonDone: false }), testPlanet({ slug: 'lists' })],
      }),
    );
    renderPage();
    expect(
      await screen.findByText('Laniakea opens after the first 6 Python lessons'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/^The first 6 lessons make one planet, First steps/),
    ).toBeInTheDocument();
    expect(screen.getByText('5 of 6 done')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    const next = screen.getByRole('link', { name: 'Continue with Python' });
    expect(next).toHaveAttribute('href', '/lesson/python/variables-int');
    fireEvent.click(next);
    expect(screen.getByText('A lesson')).toBeInTheDocument();
    expect(h.loadThree).not.toHaveBeenCalled();
    expect(h.markSeen).not.toHaveBeenCalled();
  });

  it('tells the server the game is open, so the bell drops its recaps', async () => {
    renderPage();
    await screen.findByRole('button', { name: /Take the helm/ });
    await waitFor(() => expect(h.markSeen).toHaveBeenCalledTimes(1));
  });

  it('offers to try again when the game cannot be read, and tells the server only once it shows', async () => {
    h.getLaniakea.mockRejectedValueOnce(new Error('down'));
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(h.markSeen).not.toHaveBeenCalled();
    expect(await screen.findByRole('button', { name: /Take the helm/ })).toBeInTheDocument();
    await waitFor(() => expect(h.markSeen).toHaveBeenCalledTimes(1));
  });

  it('starts the ship from the intro and hands the scene the planets, their marks and the controls', async () => {
    await flying();
    const [, , spots, touch] = h.createExplorer.mock.calls[0];
    expect(spots.map((s: { slug: string }) => s.slug)).toEqual(['print', 'lists', 'for']);
    expect(touch).toBeNull();
    await waitFor(() =>
      expect(h.engine.setMarks).toHaveBeenLastCalledWith({
        print: 'open',
        lists: 'owned',
        for: 'none',
      }),
    );
    expect(h.engine.setActive).toHaveBeenLastCalledWith(true);
  });

  it('takes Enter for the helm too', async () => {
    renderPage();
    await screen.findByRole('button', { name: /Take the helm/ });
    expect(screen.queryByRole('note')).toBeNull();
    // The page hears keys from an effect of the render that shows the intro,
    // the same one that tells the server, which can run after the button shows
    await waitFor(() => expect(h.markSeen).toHaveBeenCalled());
    key('Enter');
    await waitFor(() => expect(screen.queryByRole('button', { name: /Take the helm/ })).toBeNull());
  });

  it('pauses with Escape and stops the ship meanwhile', async () => {
    await flying();
    key('Escape');
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(h.engine.setActive).toHaveBeenLastCalledWith(false);
    fireEvent.click(screen.getByRole('button', { name: /Resume/ }));
    expect(h.engine.setActive).toHaveBeenLastCalledWith(true);
  });

  it('opens and closes the board with B, and makes a planet the target', async () => {
    await flying();
    expect(screen.getByRole('region', { name: 'Board' })).toBeInTheDocument();
    key('KeyB');
    expect(screen.queryByRole('region', { name: 'Board' })).toBeNull();
    key('KeyB');
    fireEvent.click(screen.getByRole('button', { name: /^First steps · Lessons 1–6/ }));
    expect(h.engine.setTarget).toHaveBeenLastCalledWith('print');
    act(() => h.events!.onPose({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] }, 0));
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('lands on the planet ahead with E once it is in reach, and opens its test', async () => {
    h.startQuiz.mockReturnValue(new Promise(() => {}));
    await flying();
    act(() => h.events!.onAim({ slug: 'print', distance: 2000, inReach: false }));
    key('KeyE');
    expect(h.startQuiz).not.toHaveBeenCalled();
    act(() => h.events!.onAim({ slug: 'print', distance: 300, inReach: true }));
    key('KeyE');
    expect(await screen.findByRole('dialog', { name: 'First steps' })).toBeInTheDocument();
    expect(h.startQuiz).toHaveBeenCalledWith('print', 'en');
    expect(h.engine.setActive).toHaveBeenLastCalledWith(false);
  });

  it('never opens a test on a planet out of reach of the student', async () => {
    await flying();
    act(() => h.events!.onAim({ slug: 'for', distance: 300, inReach: true }));
    key('KeyE');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('takes in the planet a test moved and celebrates one kept for good', async () => {
    h.startQuiz.mockResolvedValue({
      slug: 'lists',
      mode: 'recap',
      questions: Array.from({ length: 10 }, () => ({
        text: 'Q?',
        code: null,
        output: null,
        options: ['a', 'b', 'c', 'd'],
      })),
      answers: Array(9).fill({ choice: 0, correct: true, correctChoice: 0 }),
    });
    const kept = testPlanet({ slug: 'lists', level: 8 });
    h.answerQuiz.mockResolvedValue({
      choice: 0,
      correct: true,
      correctChoice: 0,
      status: 'passed',
      planet: kept,
      leveledUp: true,
    });
    await flying();
    act(() => h.events!.onAim({ slug: 'lists', distance: 300, inReach: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Land' }));
    fireEvent.click((await screen.findAllByRole('button', { name: /a$/ }))[0]);
    fireEvent.click(await screen.findByRole('button', { name: 'See the result' }));
    h.getLaniakea.mockResolvedValue(state({ planets: [testPlanet(), kept] }));
    fireEvent.click(screen.getByRole('button', { name: 'Back to the ship' }));

    expect(await screen.findByText('Achievement: Lists is yours for good')).toBeInTheDocument();
    await waitFor(() =>
      expect(h.engine.setMarks).toHaveBeenLastCalledWith(
        expect.objectContaining({ lists: 'forever' }),
      ),
    );
  });

  it('shows the pose the scene reports on the map and the speed panel', async () => {
    await flying();
    act(() => h.events!.onPose({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] }, 2));
    expect(screen.getByText('Velocity').nextSibling).toHaveTextContent('1,200');
  });

  it('asks before Q goes back to the dashboard, and a second Q leaves', async () => {
    await flying();
    key('KeyQ');
    expect(screen.getByRole('alertdialog', { name: 'Leave Laniakea?' })).toBeInTheDocument();
    expect(h.engine.setActive).toHaveBeenLastCalledWith(false);
    key('KeyQ');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('keeps flying when the student stays', async () => {
    await flying();
    key('KeyQ');
    key('Escape');
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.queryByText('Paused')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Exit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Keep flying' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.queryByText('Dashboard')).toBeNull();
  });

  it('says so when the 3D engine cannot load', async () => {
    h.loadThree.mockRejectedValue(new Error('offline'));
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't start/);
  });

  it('lets the scene go when the page closes', async () => {
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: /Take the helm/ }));
    await waitFor(() => expect(h.createExplorer).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'Exit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Back to the dashboard' }));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(h.engine.dispose).toHaveBeenCalled();
  });

  it('flies with the stick and the throttle on a touch screen', async () => {
    const matchMedia = vi.fn(() => ({ matches: true }));
    vi.stubGlobal('matchMedia', matchMedia);
    renderPage();
    expect(await screen.findByRole('note')).toHaveTextContent('Built for PC and laptop');
    fireEvent.click(await screen.findByRole('button', { name: /Take the helm/ }));
    await waitFor(() => expect(h.createExplorer).toHaveBeenCalled());
    expect(h.createExplorer.mock.calls[0][3]).toMatchObject({
      stick: expect.any(HTMLElement),
      throttleUp: expect.any(HTMLElement),
    });
    expect(screen.getByRole('button', { name: 'Fly forward' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Board/ }));
    const innerWidth = window.innerWidth;
    window.innerWidth = 400;
    fireEvent.click(screen.getByRole('button', { name: /^First steps/ }));
    window.innerWidth = innerWidth;
    expect(screen.queryByRole('region', { name: 'Board' })).toBeNull();
    expect(h.engine.setTarget).toHaveBeenLastCalledWith('print');
    expect(screen.queryByText('Velocity')).toBeNull();
    vi.unstubAllGlobals();
  });
});
