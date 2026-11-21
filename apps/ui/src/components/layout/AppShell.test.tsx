import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const h = vi.hoisted(() => ({
  auth: { isLoggedIn: true, isLoading: false } as {
    isLoggedIn: boolean;
    isLoading: boolean;
    user?: { onboardedAt: string | null };
  },
  tutor: null as null | { open: boolean; historyOpen?: boolean },
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../context/TutorContext', () => ({ useTutor: () => h.tutor }));
vi.mock('../tutor/TutorPanel', () => ({ TutorPanel: () => <aside aria-label="Tutor" /> }));
vi.mock('../tutor/TutorWelcomeBack', () => ({ TutorWelcomeBack: () => null }));
vi.mock('./Sidebar', () => ({
  Sidebar: ({
    state,
    floating,
    onNavigate,
  }: {
    state: string;
    floating?: boolean;
    onNavigate: () => void;
  }) => (
    <aside data-testid="sidebar" data-state={state} data-floating={floating ? 'yes' : 'no'}>
      <button onClick={onNavigate}>go</button>
    </aside>
  ),
}));

import { AppShell, useFloatingSidebar, useSidebar } from './AppShell';

let wide = true;

function Probe() {
  const sidebar = useSidebar();
  if (!sidebar) return <span>no shell</span>;
  return <button onClick={sidebar.toggle}>toggle {sidebar.state}</button>;
}

function Floating({ on }: { on: boolean }) {
  useFloatingSidebar(on);
  return <Probe />;
}

function renderFloating(on = true) {
  const view = render(
    <MemoryRouter initialEntries={['/lesson/python/print']}>
      <AppShell>
        <Floating on={on} />
      </AppShell>
    </MemoryRouter>,
  );
  return {
    ...view,
    float: (next: boolean) =>
      view.rerender(
        <MemoryRouter initialEntries={['/lesson/python/print']}>
          <AppShell>
            <Floating on={next} />
          </AppShell>
        </MemoryRouter>,
      ),
  };
}

function renderShell(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppShell>
        <Probe />
      </AppShell>
    </MemoryRouter>,
  );
}

const state = () => screen.getByTestId('sidebar').getAttribute('data-state');

beforeEach(() => {
  localStorage.clear();
  wide = true;
  h.auth = { isLoggedIn: true, isLoading: false };
  h.tutor = null;
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: wide, media: q }));
});

describe('AppShell', () => {
  it('puts the open tutor beside the page and pushes it aside once there is room', () => {
    h.tutor = { open: true };
    renderShell('/courses');
    expect(screen.getByRole('complementary', { name: 'Tutor' })).toBeInTheDocument();
    const page = screen.getByText(/toggle/).parentElement;
    expect(page).toHaveClass('@container', 'lg:pr-[400px]');
    expect(page).not.toHaveClass('xl:pr-[640px]');
  });

  it('pushes the page further for the history, a step later with the sidebar open', () => {
    h.tutor = { open: true, historyOpen: true };
    renderShell('/courses');
    expect(screen.getByText(/toggle/).parentElement).toHaveClass('lg:pr-[400px]', 'xl:pr-[640px]');
  });

  it('pushes the page from 768px while the sidebar is closed', () => {
    localStorage.setItem('cyberstars.sidebar', 'closed');
    h.tutor = { open: true };
    const { unmount } = renderShell('/courses');
    expect(screen.getByText(/toggle/).parentElement).toHaveClass('md:pr-[400px]');
    unmount();

    h.tutor = { open: true, historyOpen: true };
    renderShell('/courses');
    expect(screen.getByText(/toggle/).parentElement).toHaveClass('md:pr-[400px]', 'lg:pr-[640px]');
  });

  it('shows no tutor while its panel is closed', () => {
    h.tutor = { open: false };
    renderShell('/courses');
    expect(screen.queryByRole('complementary', { name: 'Tutor' })).toBeNull();
    expect(screen.getByText(/toggle/).parentElement).not.toHaveClass('lg:pr-[400px]');
  });

  it('leaves the bare routes without chrome', () => {
    for (const path of ['/getstarted', '/laniakea']) {
      const { unmount } = renderShell(path);
      expect(screen.queryByTestId('sidebar')).toBeNull();
      expect(screen.getByText('no shell')).toBeInTheDocument();
      unmount();
    }
  });

  it('shows the welcome page to a visitor without chrome', () => {
    h.auth = { isLoggedIn: false, isLoading: false };
    renderShell('/');
    expect(screen.queryByTestId('sidebar')).toBeNull();
    expect(screen.getByText('no shell')).toBeInTheDocument();
  });

  it('keeps home bare while it is not known yet who is signed in', () => {
    h.auth = { isLoggedIn: false, isLoading: true };
    renderShell('/');
    expect(screen.queryByTestId('sidebar')).toBeNull();
  });

  it('gives a visitor the sidebar everywhere past the welcome page', () => {
    h.auth = { isLoggedIn: false, isLoading: false };
    renderShell('/courses');
    expect(state()).toBe('wide');
  });

  it('gives a new account held on the tour lesson no sidebar', () => {
    h.auth = { isLoggedIn: true, isLoading: false, user: { onboardedAt: null } };
    renderShell('/lesson/python/print');
    expect(state()).toBe('closed');
    expect(screen.getByText(/toggle/).parentElement).not.toHaveClass('md:pl-[240px]');
  });

  it('starts unfolded where there is room when nothing is remembered', () => {
    renderShell();
    expect(state()).toBe('wide');
  });

  it('starts closed when it was left closed', () => {
    localStorage.setItem('cyberstars.sidebar', 'closed');
    renderShell();
    expect(state()).toBe('closed');
  });

  it('remembers the choice on a wide screen', () => {
    renderShell();
    fireEvent.click(screen.getByText(/toggle/));
    expect(state()).toBe('closed');
    expect(localStorage.getItem('cyberstars.sidebar')).toBe('closed');
    fireEvent.click(screen.getByText(/toggle/));
    expect(state()).toBe('open');
    expect(localStorage.getItem('cyberstars.sidebar')).toBe('open');
  });

  it('stays beside the page after navigating on a wide screen', () => {
    renderShell();
    fireEvent.click(screen.getByText(/toggle/));
    fireEvent.click(screen.getByText(/toggle/));
    fireEvent.click(screen.getByText('go'));
    expect(state()).toBe('open');
  });

  it('opens as a drawer on a phone and closes after navigating', () => {
    wide = false;
    renderShell();
    fireEvent.click(screen.getByText(/toggle/));
    expect(state()).toBe('open');
    fireEvent.click(screen.getByText('go'));
    expect(state()).toBe('closed');
  });

  it('closes the drawer from the backdrop and on Escape', () => {
    wide = false;
    const { container } = renderShell();
    fireEvent.click(screen.getByText(/toggle/));
    fireEvent.click(container.querySelector('button[aria-hidden="true"]')!);
    expect(state()).toBe('closed');

    fireEvent.click(screen.getByText(/toggle/));
    act(() => {
      fireEvent.keyDown(document, { key: 'Enter' });
    });
    expect(state()).toBe('open');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(state()).toBe('closed');
  });

  it('holds the page still under the drawer and closes when a finger lifts beside it', () => {
    wide = false;
    const { container } = renderShell();
    expect(document.documentElement.dataset.drawer).toBeUndefined();
    fireEvent.click(screen.getByText(/toggle/));
    expect(document.documentElement.dataset.drawer).toBe('open');

    const lifted = fireEvent.touchEnd(container.querySelector('button[aria-hidden="true"]')!);
    expect(lifted).toBe(false);
    expect(state()).toBe('closed');
    expect(document.documentElement.dataset.drawer).toBeUndefined();
  });

  it('keeps working when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    renderShell();
    expect(state()).toBe('wide');
    fireEvent.click(screen.getByText(/toggle/));
    expect(state()).toBe('closed');
    vi.restoreAllMocks();
  });

  describe('floating (dev mode)', () => {
    const backdrop = (container: HTMLElement) =>
      container.querySelector('button[aria-hidden="true"]') as HTMLElement | null;

    it('starts closed even when it was left open, and opens over the page', () => {
      localStorage.setItem('cyberstars.sidebar', 'open');
      const { container } = renderFloating();
      expect(state()).toBe('closed');
      expect(screen.getByTestId('sidebar')).toHaveAttribute('data-floating', 'yes');

      fireEvent.click(screen.getByText(/toggle/));
      expect(state()).toBe('open');
      expect(screen.getByText(/toggle/).parentElement).not.toHaveClass('md:pl-[240px]');
      expect(backdrop(container)).toHaveClass('z-[65]');
      expect(backdrop(container)).not.toHaveClass('md:hidden');
    });

    it('leaves the remembered choice alone', () => {
      localStorage.setItem('cyberstars.sidebar', 'closed');
      renderFloating();
      fireEvent.click(screen.getByText(/toggle/));
      expect(localStorage.getItem('cyberstars.sidebar')).toBe('closed');
    });

    it('closes after navigating, from the backdrop and on Escape, on a wide screen too', () => {
      const { container } = renderFloating();
      fireEvent.click(screen.getByText(/toggle/));
      fireEvent.click(screen.getByText('go'));
      expect(state()).toBe('closed');

      fireEvent.click(screen.getByText(/toggle/));
      fireEvent.click(backdrop(container)!);
      expect(state()).toBe('closed');

      fireEvent.click(screen.getByText(/toggle/));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(state()).toBe('closed');
    });

    it('goes back to the remembered sidebar once it stops floating, and starts closed next time', () => {
      const { float } = renderFloating();
      fireEvent.click(screen.getByText(/toggle/));
      float(false);
      expect(state()).toBe('wide');
      expect(screen.getByTestId('sidebar')).toHaveAttribute('data-floating', 'no');
      expect(screen.getByText(/toggle/).parentElement).toHaveClass('md:pl-[240px]');

      float(true);
      expect(state()).toBe('closed');
    });
  });
});
