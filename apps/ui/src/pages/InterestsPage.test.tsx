import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

const refreshUser = vi.fn();
let user: { interests: string[] | null } | null = { interests: null };

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user, refreshUser }),
}));

const saveInterests = vi.fn();
vi.mock('../services/profileService', () => ({
  saveInterests: (...args: unknown[]) => saveInterests(...args),
}));

import { InterestsPage } from './InterestsPage';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/interests']}>
      <Routes>
        <Route path="/interests" element={<InterestsPage />} />
        <Route path="/" element={<span>home</span>} />
      </Routes>
    </MemoryRouter>,
  );
}

const option = (name: string) => screen.getByText(name, { selector: 'span' }).closest('button')!;
const proceed = () => screen.getByRole('button', { name: 'Continue' });

beforeEach(() => {
  vi.clearAllMocks();
  user = { interests: null };
});

describe('InterestsPage', () => {
  it('asks what the student wants to learn, and waits for at least one pick', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'What do you want to learn?' })).toBeInTheDocument();
    expect(proceed()).toBeDisabled();
    fireEvent.click(option('Linux'));
    expect(option('Linux')).toHaveAttribute('aria-pressed', 'true');
    expect(proceed()).toBeEnabled();
    fireEvent.click(option('Linux'));
    expect(proceed()).toBeDisabled();
  });

  it('saves the picks in the order they are listed, then reads the account again', async () => {
    saveInterests.mockResolvedValue(undefined);
    renderPage();
    fireEvent.click(option('Algorithms'));
    fireEvent.click(option('C'));
    fireEvent.click(proceed());
    expect(saveInterests).toHaveBeenCalledWith(['c', 'algorithms']);
    await waitFor(() => expect(refreshUser).toHaveBeenCalled());
  });

  it('says so when the picks could not be saved, and lets the student try again', async () => {
    saveInterests.mockRejectedValue(new Error('down'));
    renderPage();
    fireEvent.click(option('Java'));
    fireEvent.click(proceed());
    expect(await screen.findByText("Couldn't save that. Try again.")).toBeInTheDocument();
    expect(proceed()).toBeEnabled();
    expect(refreshUser).not.toHaveBeenCalled();
  });

  it('sends on to the dashboard a student who already answered', () => {
    user = { interests: ['python'] };
    renderPage();
    expect(screen.getByText('home')).toBeInTheDocument();
  });
});
