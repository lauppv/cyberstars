import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import i18n from 'i18next';
import type { ConnectionsOverview } from '@cyberstars/shared/connections';
import { ApiClientError } from '../services/apiClient';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, role: 'USER' }, isLoading: false }),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../services/connectionsService', () => ({
  getOverview: vi.fn(),
  accept: vi.fn(),
  decline: vi.fn(),
  remove: vi.fn(),
}));

const connectionsService = await import('../services/connectionsService');
const mockGetOverview = vi.mocked(connectionsService.getOverview);
const mockAccept = vi.mocked(connectionsService.accept);
const mockDecline = vi.mocked(connectionsService.decline);
const mockRemove = vi.mocked(connectionsService.remove);

const { ConnectionsPage } = await import('./ConnectionsPage');

const person = (id: number, name: string) => ({ id, name, avatarUrl: null });

const overview: ConnectionsOverview = {
  incoming: [{ id: 11, user: person(2, 'Nova'), createdAt: '2026-10-20T10:00:00.000Z' }],
  connections: [{ id: 12, user: person(3, 'Orion'), since: '2026-10-20T10:00:00.000Z' }],
  outgoing: [{ id: 13, user: person(4, 'Vega'), createdAt: '2026-10-20T10:00:00.000Z' }],
};
const empty: ConnectionsOverview = { incoming: [], connections: [], outgoing: [] };
const ok = { ok: true };

function renderPage() {
  return render(
    <MemoryRouter>
      <ConnectionsPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetOverview.mockResolvedValue(overview);
});

// The language is a global i18n singleton; reset it so the ro test can't leak.
afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('ConnectionsPage', () => {
  it('lists received requests, connections and sent requests', async () => {
    renderPage();
    expect(await screen.findByText('Nova')).toBeDefined();
    expect(screen.getByText('Orion')).toBeDefined();
    expect(screen.getByText('Vega')).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows the empty state when there is nothing to list', async () => {
    mockGetOverview.mockResolvedValue(empty);
    renderPage();
    expect(await screen.findByText(/No connections yet/)).toBeDefined();
  });

  it('opens a profile from a row', async () => {
    renderPage();
    fireEvent.click(await screen.findByText('Orion'));
    expect(mockNavigate).toHaveBeenCalledWith('/u/3');
  });

  it('shows an error with a retry instead of the empty state when the lists fail to load', async () => {
    mockGetOverview.mockRejectedValueOnce(new Error('down'));
    renderPage();
    expect(await screen.findByText("Your connections couldn't be loaded.")).toBeDefined();
    expect(screen.queryByText(/No connections yet/)).toBeNull();

    fireEvent.click(screen.getByText('Try again'));
    expect(await screen.findByText('Nova')).toBeDefined();
    expect(screen.queryByText("Your connections couldn't be loaded.")).toBeNull();
  });

  it('accepts a request and reloads the lists', async () => {
    mockAccept.mockResolvedValue(ok);
    renderPage();
    await screen.findByText('Nova');
    mockGetOverview.mockResolvedValue({ ...overview, incoming: [] });
    fireEvent.click(screen.getByText('Accept'));
    await waitFor(() => expect(screen.queryByText('Nova')).toBeNull());
    expect(mockAccept).toHaveBeenCalledWith(11);
  });

  it.each([
    ['Accept', mockAccept],
    ['Decline', mockDecline],
    ['Remove', mockRemove],
    ['Cancel', mockRemove],
  ] as const)('says why %s failed and keeps the row', async (label, mock) => {
    mock.mockRejectedValue(new ApiClientError(500, 'Internal server error'));
    renderPage();
    await screen.findByText('Nova');
    fireEvent.click(screen.getByText(label));
    expect(await screen.findByRole('alert')).toHaveTextContent('Internal server error');
    // Nothing says the lists are stale, so they aren't loaded again
    expect(mockGetOverview).toHaveBeenCalledTimes(1);
    expect(screen.getByText(label)).not.toBeDisabled();
  });

  it('says something went wrong when the failure has no reason', async () => {
    mockDecline.mockRejectedValue(new Error(''));
    renderPage();
    fireEvent.click(await screen.findByText('Decline'));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something went wrong. Please try again.',
    );
  });

  it('reloads the lists when the request is gone, so the stale row disappears', async () => {
    mockAccept.mockRejectedValue(new ApiClientError(404, 'Request not found'));
    renderPage();
    await screen.findByText('Nova');
    mockGetOverview.mockResolvedValue({ ...overview, incoming: [] });
    fireEvent.click(screen.getByText('Accept'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Request not found');
    await waitFor(() => expect(screen.queryByText('Nova')).toBeNull());
  });

  it('drops an earlier reason when the lists are loaded again by hand', async () => {
    mockAccept.mockRejectedValue(new ApiClientError(404, 'Request not found'));
    renderPage();
    await screen.findByText('Nova');
    mockGetOverview.mockRejectedValueOnce(new Error('down'));
    fireEvent.click(screen.getByText('Accept'));
    fireEvent.click(await screen.findByText('Try again'));
    expect(await screen.findByText('Nova')).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps the reason above the empty state when the last row was stale', async () => {
    mockGetOverview.mockResolvedValue({ ...empty, outgoing: overview.outgoing });
    mockRemove.mockRejectedValue(new ApiClientError(404, 'Connection not found'));
    renderPage();
    await screen.findByText('Vega');
    mockGetOverview.mockResolvedValue(empty);
    fireEvent.click(screen.getByText('Cancel'));
    expect(await screen.findByText(/No connections yet/)).toBeDefined();
    expect(screen.getByRole('alert')).toHaveTextContent('Connection not found');
  });

  it('clears the reason on the next action that works', async () => {
    mockDecline.mockRejectedValueOnce(new ApiClientError(500, 'Internal server error'));
    mockDecline.mockResolvedValueOnce(ok);
    renderPage();
    fireEvent.click(await screen.findByText('Decline'));
    await screen.findByRole('alert');
    fireEvent.click(screen.getByText('Decline'));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('says the reason in Romanian on a Romanian page', async () => {
    await i18n.changeLanguage('ro');
    mockAccept.mockRejectedValue(new ApiClientError(404, 'Request not found'));
    renderPage();
    fireEvent.click(await screen.findByText('Acceptă'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Cererea nu există');
  });
});
