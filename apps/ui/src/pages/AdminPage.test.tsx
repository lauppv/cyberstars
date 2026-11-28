import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { AdminStatsDTO } from '@cyberstars/shared/admin';

vi.mock('../components/layout/Topbar', () => ({ Topbar: () => <nav>Topbar</nav> }));
vi.mock('../components/admin/VisitorsSection', () => ({
  VisitorsSection: () => null,
}));
vi.mock('../components/admin/NoticesSection', () => ({
  NoticesSection: () => <section>Announcements and polls</section>,
}));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'ADMIN' }, isLoading: false }),
}));
vi.mock('../context/CurriculumContext', () => ({ useCurriculum: () => ({ courses: [] }) }));

const getStats = vi.fn();
vi.mock('../services/adminService', () => ({ getStats }));

const { AdminPage } = await import('./AdminPage');

const stats: AdminStatsDTO = {
  tutor: { promptsLast7Days: 37, promptsLast30Days: 90 },
  users: {
    total: 19,
    byRole: { FOUNDER: 1, ADMIN: 2, USER: 12, BOT: 4 },
    emailVerified: 9,
    newLast7Days: 1,
    newLast30Days: 3,
  },
  progress: { totalCompletions: 0, byCourse: [], topLessons: [] },
  codeExec: {
    activeContainers: 0,
    maxContainers: 4,
    perLanguage: { python: 2, java: 1 },
    busySlots: 0,
    maxBusySlots: 2,
  },
  online: { users: 3, guests: 5 },
  generatedAt: '2026-11-02T10:00:00Z',
};

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminPage />
    </MemoryRouter>,
  );
}

beforeEach(() => getStats.mockReset());

describe('AdminPage', () => {
  it('lets an admin write an announcement or a poll even when the stats fail', async () => {
    getStats.mockRejectedValueOnce(new Error('500'));
    renderPage();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Announcements and polls')).toBeInTheDocument();
  });

  it('keeps the announcements and polls card at the foot, after the stats', async () => {
    getStats.mockResolvedValue(stats);
    renderPage();
    const users = await screen.findByText('Accounts per role');
    expect(
      users.compareDocumentPosition(screen.getByText('Announcements and polls')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('shows every count in one table, a column per subject and a line per count', async () => {
    getStats.mockResolvedValue(stats);
    renderPage();
    await screen.findByText('Accounts per role');
    const columns = screen.getAllByRole('group');
    const lines = (column: HTMLElement) =>
      within(column)
        .getAllByRole('listitem')
        .map((li) => [...li.children].map((c) => c.textContent));
    expect(columns.map((column) => [column.firstChild?.textContent, lines(column)])).toEqual([
      [
        'Users',
        [
          ['Total', '19'],
          ['New (7 days)', '1'],
          ['New (30 days)', '3'],
        ],
      ],
      [
        'Accounts per role',
        [
          ['User', '12'],
          ['Founder', '1'],
          ['Admin', '2'],
          ['Bots', '4'],
        ],
      ],
      [
        'Emails',
        [
          ['Verified', '9'],
          ['Unverified', '10'],
        ],
      ],
      [
        'Online now',
        [
          ['Signed in', '3'],
          ['Guests', '5'],
        ],
      ],
      [
        'Messages to the tutor',
        [
          ['7 days', '37'],
          ['30 days', '90'],
        ],
      ],
      [
        'Code execution (live)',
        [
          ['Active containers', '0/4'],
          ['Busy sandboxes', '0/2'],
          ['python', '2'],
          ['java', '1'],
        ],
      ],
    ]);
    expect(
      screen
        .getByRole('group', { name: 'Online now' })
        .querySelector('[class*="--success"], [class*="--warning"]'),
    ).toBeNull();
    expect(screen.queryByText('Active (with progress)')).not.toBeInTheDocument();
  });

  it('lists no runtime in the code execution column when none is running', async () => {
    getStats.mockResolvedValue({ ...stats, codeExec: { ...stats.codeExec, perLanguage: {} } });
    renderPage();
    const codeExec = await screen.findByRole('group', { name: 'Code execution (live)' });
    expect(within(codeExec).getAllByRole('listitem')).toHaveLength(2);
    expect(within(codeExec).queryByText('Per runtime')).not.toBeInTheDocument();
    expect(within(codeExec).queryByText('No data yet')).not.toBeInTheDocument();
  });

  it('puts the time of the data last, under the announcements and polls', async () => {
    getStats.mockResolvedValue(stats);
    renderPage();
    const asOf = await screen.findByText(/^Data as of/);
    expect(
      screen.getByText('Announcements and polls').compareDocumentPosition(asOf) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('leaves out the open sessions, the forum and support, and the missed questions', async () => {
    getStats.mockResolvedValue(stats);
    renderPage();
    expect(await screen.findByText('Busy sandboxes')).toBeInTheDocument();
    expect(screen.queryByText('Open sessions')).not.toBeInTheDocument();
    expect(screen.queryByText('Forum & Support')).not.toBeInTheDocument();
    expect(screen.queryByText(/Laniakea/)).not.toBeInTheDocument();
  });

  it('says the stats could not be loaded, and clears it once a refresh brings them', async () => {
    getStats.mockRejectedValueOnce(new Error('500')).mockResolvedValueOnce(stats);
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load these numbers.");

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(await screen.findByText('Accounts per role')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(getStats).toHaveBeenLastCalledWith(true);
  });

  it('keeps the stats it has when a refresh fails', async () => {
    getStats.mockResolvedValueOnce(stats).mockRejectedValueOnce(new Error('500'));
    renderPage();
    expect(await screen.findByText('Accounts per role')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Accounts per role')).toBeInTheDocument();
  });
});
