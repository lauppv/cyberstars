import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import type { AdminVisitsDTO } from '@cyberstars/shared/visits';

const getVisits = vi.fn();
const getGuestVisits = vi.fn();
vi.mock('../../services/visitsService', () => ({ getVisits, getGuestVisits }));

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
  clicks: [{ key: 'run', visitors: 2, views: 5 }],
  placement: {
    opened: 6,
    started: 4,
    answered: [4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2],
    getStarted: 1,
  },
};

beforeEach(() => {
  getVisits.mockReset().mockResolvedValue(dto);
  getGuestVisits.mockReset().mockResolvedValue({ visits: [], next: null });
  localStorage.clear();
});

describe('VisitorsSection', () => {
  it('lines up the placement test from opening it to Get started', async () => {
    render(<VisitorsSection className="" reload={0} />);
    const funnel = (await screen.findByText('Placement test')).parentElement!;
    const rows = within(funnel)
      .getAllByRole('listitem')
      .map((li) => li.textContent);
    expect(rows).toHaveLength(15);
    expect(rows[0]).toBe('Opened the test6');
    expect(rows[1]).toBe('Pressed Start4');
    expect(rows[2]).toBe('Got past question 14');
    expect(rows[13]).toBe('Submitted2');
    expect(rows[14]).toBe('Pressed Get started1');
  });

  it('shows the charts, the pages, the sources and the split', async () => {
    render(<VisitorsSection className="" reload={0} />);
    expect(await screen.findByText('/lesson/python/print')).toBeInTheDocument();
    expect(getVisits).toHaveBeenCalledWith(30);
    expect(screen.getByRole('img', { name: 'Visitors a day' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'New accounts a day' })).toBeInTheDocument();
    expect(screen.getByText('6 views · 4 visitors')).toBeInTheDocument();
    expect(screen.getByText('Hacker News', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Direct', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('example.org', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Guests 8')).toBeInTheDocument();
    expect(screen.getByText('Signed in 2')).toBeInTheDocument();
    expect(screen.getByText('English 0')).toBeInTheDocument();
    expect(screen.getByText('Romanian 3')).toBeInTheDocument();
    expect(screen.getByText('5 presses · 2 visits')).toBeInTheDocument();
  });

  it('lists the guest visits for the same range, filtered by the sources above', async () => {
    render(<VisitorsSection className="" reload={0} />);
    await screen.findByText('Guest visits');
    // The list is asked for from an effect, a moment after the heading shows
    await waitFor(() => expect(getGuestVisits).toHaveBeenCalledWith(30, undefined));
    const filter = screen.getByRole('combobox', { name: 'Where visitors come from' });
    expect([...filter.querySelectorAll('option')].map((o) => o.textContent)).toEqual([
      'All sources',
      'Hacker News',
      'Direct',
      'example.org',
    ]);
  });

  it('says whether this browser is counted and switches it', async () => {
    localStorage.setItem('cyberstars.counted', 'no');
    render(<VisitorsSection className="" reload={0} />);
    expect(screen.getByText(/This browser isn't counted/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Count it' }));
    expect(localStorage.getItem('cyberstars.counted')).toBe('yes');
    expect(screen.getByText(/This browser's visits are counted/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Stop counting it' }));
    expect(localStorage.getItem('cyberstars.counted')).toBe('no');
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

    getVisits.mockResolvedValueOnce({ ...dto, pages: [], sources: [], clicks: [] });
    render(<VisitorsSection className="" reload={0} />);
    await screen.findByText('Most visited pages');
    // pages, sources, buttons and the guest visits
    expect(await screen.findAllByText('No data yet')).toHaveLength(4);
  });
});
