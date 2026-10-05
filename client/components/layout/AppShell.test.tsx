import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('./Sidebar', () => ({
  Sidebar: ({ state, onNavigate }: { state: string; onNavigate: () => void }) => (
    <aside data-testid="sidebar" data-state={state}>
      <button onClick={onNavigate}>go</button>
    </aside>
  ),
}));

import { AppShell, useSidebar } from './AppShell';

let wide = true;

function Probe() {
  const sidebar = useSidebar();
  if (!sidebar) return <span>no shell</span>;
  return <button onClick={sidebar.toggle}>toggle {sidebar.state}</button>;
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
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: wide, media: q }));
});

describe('AppShell', () => {
  it('leaves the bare routes without chrome', () => {
    for (const path of ['/getstarted', '/welcome', '/laniakea']) {
      const { unmount } = renderShell(path);
      expect(screen.queryByTestId('sidebar')).toBeNull();
      expect(screen.getByText('no shell')).toBeInTheDocument();
      unmount();
    }
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
});
