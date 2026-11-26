import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { ReactNode } from 'react';
import type { AdminStatsDTO } from '@cyberstars/shared/admin';

vi.mock('../components/layout/Topbar', () => ({ Topbar: () => <nav>Topbar</nav> }));
vi.mock('../components/admin/VisitorsSection', () => ({
  VisitorsSection: ({ afterCharts }: { afterCharts?: ReactNode }) => afterCharts ?? null,
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
    total: 12,
    newLast7Days: 1,
    newLast30Days: 3,
  },
  progress: { totalCompletions: 0, byCourse: [], topLessons: [] },
  codeExec: {
    activeContainers: 0,
    maxContainers: 4,
    perLanguage: {},
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

  it('shows the messages sent to the tutor, 7 then 30 days, last in the users row', async () => {
    getStats.mockResolvedValue(stats);
    renderPage();
    const tutor = await screen.findByText('Messages to the tutor (7 days)');
    expect(tutor.previousElementSibling).toHaveTextContent('37');
    expect(
      screen.getByText('Messages to the tutor (30 days)').previousElementSibling,
    ).toHaveTextContent('90');
    const row = tutor.closest('div')!.parentElement!;
    expect(Array.from(row.children, (c) => c.lastElementChild?.textContent)).toEqual([
      'Total users',
      'New (7 days)',
      'New (30 days)',
      'Messages to the tutor (7 days)',
      'Messages to the tutor (30 days)',
    ]);
    expect(screen.queryByText('Active (with progress)')).not.toBeInTheDocument();
  });

  it('keeps the announcements and polls card at the foot, after the stats', async () => {
    getStats.mockResolvedValue(stats);
    renderPage();
    const users = await screen.findByText('Total users');
    expect(
      users.compareDocumentPosition(screen.getByText('Announcements and polls')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('shows how many users and guests are online now under the users row, with no roles', async () => {
    getStats.mockResolvedValue(stats);
    renderPage();
    expect(await screen.findByText('Online now: 3 signed in · 5 guests')).toBeInTheDocument();
    expect(screen.queryByText(/^Bot/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Founder/)).not.toBeInTheDocument();
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
    expect(await screen.findByText('Total users')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(getStats).toHaveBeenLastCalledWith(true);
  });

  it('keeps the stats it has when a refresh fails', async () => {
    getStats.mockResolvedValueOnce(stats).mockRejectedValueOnce(new Error('500'));
    renderPage();
    expect(await screen.findByText('Total users')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Total users')).toBeInTheDocument();
  });
});
