import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { AdminStatsDTO } from '@cyberstars/shared/admin';

vi.mock('../components/layout/Topbar', () => ({ Topbar: () => <nav>Topbar</nav> }));
vi.mock('../components/admin/VisitorsSection', () => ({ VisitorsSection: () => null }));
vi.mock('../components/admin/MissedQuestions', () => ({ MissedQuestions: () => null }));
vi.mock('../components/admin/AnnouncementSection', () => ({
  AnnouncementSection: () => <section>Announcement</section>,
}));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'ADMIN' }, isLoading: false }),
}));
vi.mock('../context/CurriculumContext', () => ({ useCurriculum: () => ({ courses: [] }) }));

const getStats = vi.fn();
vi.mock('../services/adminService', () => ({ getStats }));

const { AdminPage } = await import('./AdminPage');

const stats: AdminStatsDTO = {
  users: {
    total: 12,
    byRole: { USER: 10, MODERATOR: 0, ADMIN: 1, FOUNDER: 1 },
    newLast7Days: 1,
    newLast30Days: 3,
    active: 5,
  },
  progress: { totalCompletions: 0, byCourse: [], topLessons: [] },
  forum: { threads: 0, posts: 0, reactions: 0 },
  support: { total: 0, byStatus: { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 } },
  codeExec: {
    activeContainers: 0,
    maxContainers: 4,
    runningNow: 0,
    perLanguage: {},
    busySlots: 0,
    maxBusySlots: 2,
    openSessions: 0,
  },
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
  it('lets an admin write an announcement even when the stats fail', async () => {
    getStats.mockRejectedValueOnce(new Error('500'));
    renderPage();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Announcement')).toBeInTheDocument();
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
