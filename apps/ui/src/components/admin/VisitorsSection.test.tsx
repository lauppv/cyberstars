import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { AdminVisitsDTO } from '@cyberstars/shared/visits';

const getVisits = vi.fn();
vi.mock('../../services/visitsService', () => ({ getVisits }));

const { VisitorsSection } = await import('./VisitorsSection');

const dto: AdminVisitsDTO = {
  range: 30,
  days: [
    { day: '2026-11-01', visitors: 3, views: 5, newAccounts: 0 },
    { day: '2026-11-02', visitors: 7, views: 9, newAccounts: 2 },
  ],
  pages: [{ key: '/lesson/python/print', visitors: 4, views: 6 }],
  sources: [
    { key: 'hackernews', visitors: 3, views: 3 },
    { key: 'direct', visitors: 2, views: 2 },
    { key: 'example.org', visitors: 1, views: 1 },
  ],
  auth: [
    { key: 'guest', visitors: 8, views: 12 },
    { key: 'signedIn', visitors: 2, views: 2 },
  ],
  lang: [{ key: 'ro', visitors: 3, views: 4 }],
};

beforeEach(() => {
  getVisits.mockReset().mockResolvedValue(dto);
});

describe('VisitorsSection', () => {
  it('shows the charts, the pages, the sources and the split', async () => {
    render(<VisitorsSection className="" reload={0} />);
    expect(await screen.findByText('/lesson/python/print')).toBeInTheDocument();
    expect(getVisits).toHaveBeenCalledWith(30);
    expect(screen.getByRole('img', { name: 'Visitors a day' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'New accounts a day' })).toBeInTheDocument();
    expect(screen.getByText('6 views · 4 visitors')).toBeInTheDocument();
    expect(screen.getByText('Hacker News')).toBeInTheDocument();
    expect(screen.getByText('Direct')).toBeInTheDocument();
    expect(screen.getByText('example.org')).toBeInTheDocument();
    expect(screen.getByText('Guests 8')).toBeInTheDocument();
    expect(screen.getByText('Signed in 2')).toBeInTheDocument();
    expect(screen.getByText('English 0')).toBeInTheDocument();
    expect(screen.getByText('Romanian 3')).toBeInTheDocument();
  });

  it('switches to 90 days and loads again on a refresh', async () => {
    const { rerender } = render(<VisitorsSection className="" reload={0} />);
    await screen.findByText('/lesson/python/print');

    fireEvent.click(screen.getByRole('button', { name: '90 days' }));
    expect(getVisits).toHaveBeenLastCalledWith(90);
    expect(screen.getByRole('button', { name: '90 days' })).toHaveAttribute('aria-pressed', 'true');

    rerender(<VisitorsSection className="" reload={1} />);
    expect(getVisits).toHaveBeenCalledTimes(3);
  });

  it('says there is nothing yet when the numbers could not be loaded or are empty', async () => {
    getVisits.mockRejectedValueOnce(new Error('403'));
    const { unmount } = render(<VisitorsSection className="" reload={0} />);
    expect(screen.getByText('No data yet')).toBeInTheDocument();
    unmount();

    getVisits.mockResolvedValueOnce({ ...dto, pages: [], sources: [] });
    render(<VisitorsSection className="" reload={0} />);
    await screen.findByText('Most visited pages');
    expect(screen.getAllByText('No data yet')).toHaveLength(2);
  });
});
