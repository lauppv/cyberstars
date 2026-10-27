import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router';
import { MaintenanceScreen } from './MaintenanceScreen';
import { setMaintenance } from '../../hooks/useMaintenance';

const deploy = () => new Response('', { status: 503, headers: { 'X-Maintenance': '1' } });

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/courses']}>
      <Link to="/algorithms">Algorithms</Link>
      <MaintenanceScreen />
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  act(() => setMaintenance(false));
});

describe('MaintenanceScreen', () => {
  it('stays away without a deploy and asks nothing on the first page', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    renderScreen();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows up when a page change runs into a deploy', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(deploy());
    renderScreen();
    await act(async () => fireEvent.click(screen.getByRole('link', { name: 'Algorithms' })));
    expect(fetchSpy).toHaveBeenCalledWith('/api/time', { method: 'HEAD', cache: 'no-store' });
    expect(await screen.findByRole('alertdialog')).toHaveTextContent("We're applying an update");
  });

  it('asks every few seconds and goes away once the backend answers', async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(deploy());
    renderScreen();
    act(() => setMaintenance(true));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(3000));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    fetchSpy.mockResolvedValue(new Response('{}', { status: 200 }));
    await act(() => vi.advanceTimersByTimeAsync(3000));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
