import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import type { GuestVisitDTO } from '@cyberstars/shared/visits';

const getGuestVisits = vi.fn();
vi.mock('../../services/visitsService', () => ({ getGuestVisits }));

const { GuestVisits } = await import('./GuestVisits');

const visit = (
  id: number,
  steps: GuestVisitDTO['steps'],
  source: string | null = 'reddit',
  startedAt: string | null = '2026-11-30T12:05:00Z',
) => ({
  id,
  day: '2026-11-30',
  startedAt,
  source,
  lang: 'en',
  steps,
});

const page = (target: string) => ({ kind: 'page' as const, target });
const click = (target: string) => ({ kind: 'click' as const, target });
const scroll = (target: string) => ({ kind: 'scroll' as const, target });

function show(reload = 0) {
  return render(
    <GuestVisits
      range={30}
      sources={['reddit', 'google']}
      sourceName={(key) => (key === 'reddit' ? 'Reddit' : key)}
      reload={reload}
    />,
  );
}

beforeEach(() => getGuestVisits.mockReset());

describe('GuestVisits', () => {
  it('shows each visit with when it started, where it came from and its steps in order, repeats folded', async () => {
    getGuestVisits.mockResolvedValue({
      visits: [
        visit(9, [
          page('/'),
          scroll('25'),
          scroll('75'),
          click('start-learning'),
          page('/lesson/python/print'),
          click('run'),
          click('run'),
          click('run'),
          click('run-tests'),
        ]),
      ],
      next: null,
    });
    show();
    const item = (await screen.findByText('2026-11-30 · 14:05 · Reddit · en')).closest('li')!;
    const steps = within(item)
      .getAllByRole('listitem')
      .map((li) => li.textContent?.replace('→', '').trim());
    expect(steps).toEqual([
      '/',
      'scrolled 75%',
      'start-learning',
      '/lesson/python/print',
      'run ×3',
      'run-tests',
    ]);
  });

  it('folds a run through the placement test into how far the guest got', async () => {
    getGuestVisits.mockResolvedValue({
      visits: [
        visit(4, [
          page('/'),
          click('test-me'),
          page('/placement'),
          click('placement-start'),
          click('placement-q1'),
          click('placement-q2'),
          click('placement-q3'),
        ]),
        visit(3, [
          page('/placement'),
          click('placement-start'),
          ...Array.from({ length: 11 }, (_, i) => click(`placement-q${i + 1}`)),
          click('placement-submit'),
          click('placement-get-started'),
          page('/getstarted'),
        ]),
      ],
      next: null,
    });
    show();
    await screen.findAllByText(/2026-11-30/);
    const visits = screen.getAllByText(/2026-11-30/).map((meta) =>
      within(meta.closest('li')!)
        .getAllByRole('listitem')
        .map((li) => li.textContent?.replace('→', '').trim()),
    );
    expect(visits).toEqual([
      ['/', 'test-me', '/placement', 'placement-start', 'placement test 3/12'],
      [
        '/placement',
        'placement-start',
        'placement test 12/12',
        'placement-get-started',
        '/getstarted',
      ],
    ]);
  });

  it('leaves the source out of a visit that started inside the app', async () => {
    getGuestVisits.mockResolvedValue({ visits: [visit(1, [page('/')], null)], next: null });
    show();
    expect(await screen.findByText('2026-11-30 · 14:05 · en')).toBeInTheDocument();
  });

  it('shows no time on a visit from before start times were kept', async () => {
    getGuestVisits.mockResolvedValue({
      visits: [visit(1, [page('/')], 'reddit', null)],
      next: null,
    });
    show();
    expect(await screen.findByText('2026-11-30 · Reddit · en')).toBeInTheDocument();
  });

  it('filters by source and loads the next page under the last', async () => {
    getGuestVisits
      .mockResolvedValueOnce({ visits: [visit(30, [page('/')])], next: 30 })
      .mockResolvedValueOnce({ visits: [visit(12, [page('/courses')])], next: null })
      .mockResolvedValueOnce({ visits: [visit(5, [page('/almanac')])], next: null });
    show();
    fireEvent.click(await screen.findByRole('button', { name: 'Show more' }));
    expect(await screen.findByText('/courses')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(getGuestVisits).toHaveBeenLastCalledWith(30, undefined, 30);
    expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reddit' } });
    expect(await screen.findByText('/almanac')).toBeInTheDocument();
    expect(getGuestVisits).toHaveBeenLastCalledWith(30, 'reddit');
    expect(screen.queryByText('/courses')).not.toBeInTheDocument();
  });

  it('asks for the next page once at a time, and drops it when the source changed meanwhile', async () => {
    let answerMore!: (page: { visits: GuestVisitDTO[]; next: number | null }) => void;
    getGuestVisits
      .mockResolvedValueOnce({ visits: [visit(30, [page('/')])], next: 30 })
      .mockReturnValueOnce(new Promise((resolve) => (answerMore = resolve)))
      .mockResolvedValueOnce({ visits: [visit(5, [page('/almanac')])], next: null });
    show();
    const button = await screen.findByRole('button', { name: 'Show more' });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(getGuestVisits).toHaveBeenCalledTimes(2);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reddit' } });
    expect(await screen.findByText('/almanac')).toBeInTheDocument();
    answerMore({ visits: [visit(12, [page('/courses')])], next: null });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText('/courses')).not.toBeInTheDocument();
  });

  it('keeps showing the picked source once it leaves the list', async () => {
    getGuestVisits.mockResolvedValue({ visits: [], next: null });
    const { rerender } = show();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reddit' } });
    rerender(<GuestVisits range={30} sources={['google']} sourceName={(key) => key} reload={1} />);
    const filter = screen.getByRole('combobox') as HTMLSelectElement;
    expect(filter.value).toBe('reddit');
    expect([...filter.options].map((o) => o.value)).toEqual(['', 'google', 'reddit']);
    expect(getGuestVisits).toHaveBeenLastCalledWith(30, 'reddit');
  });

  it('says there is nothing yet when the list is empty or could not be loaded', async () => {
    getGuestVisits.mockResolvedValueOnce({ visits: [], next: null });
    const { unmount } = show();
    expect(await screen.findByText('No data yet')).toBeInTheDocument();
    unmount();

    getGuestVisits.mockRejectedValueOnce(new Error('403'));
    show();
    expect(screen.getByText('No data yet')).toBeInTheDocument();
  });

  it('keeps the list when the next page could not be loaded', async () => {
    getGuestVisits
      .mockResolvedValueOnce({ visits: [visit(30, [page('/')])], next: 30 })
      .mockRejectedValueOnce(new Error('offline'));
    show();
    fireEvent.click(await screen.findByRole('button', { name: 'Show more' }));
    expect(await screen.findByText('/')).toBeInTheDocument();
  });
});
