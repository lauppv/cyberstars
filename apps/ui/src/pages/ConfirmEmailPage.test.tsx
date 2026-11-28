import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

const refreshUser = vi.fn();
const auth: {
  user: Record<string, unknown> | null;
  isLoading: boolean;
  refreshUser: typeof refreshUser;
} = { user: null, isLoading: false, refreshUser };
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));

const confirmEmail = vi.fn();
const resendConfirmation = vi.fn();
vi.mock('../services/authService', () => ({
  confirmEmail: (token: string) => confirmEmail(token),
  resendConfirmation: () => resendConfirmation(),
}));

const { ConfirmEmailPage } = await import('./ConfirmEmailPage');

const TOKEN = 'a'.repeat(43);

function Address() {
  const { pathname, search } = useLocation();
  return <p data-testid="address">{pathname + search}</p>;
}

async function renderAt(path: string) {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/confirm-email"
            element={
              <>
                <ConfirmEmailPage />
                <Address />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.user = null;
  auth.isLoading = false;
});

describe('ConfirmEmailPage', () => {
  it('confirms with the token once, without a session, and takes it out of the address', async () => {
    confirmEmail.mockResolvedValue({ message: 'Email confirmed' });
    await renderAt(`/confirm-email?token=${TOKEN}`);
    expect(confirmEmail).toHaveBeenCalledOnce();
    expect(confirmEmail).toHaveBeenCalledWith(TOKEN);
    expect(screen.getByRole('heading', { name: 'Your email is confirmed' })).toBeInTheDocument();
    expect(screen.getByTestId('address')).toHaveTextContent(/^\/confirm-email$/);
    expect(refreshUser).toHaveBeenCalled();
  });

  it('lets a signed-in account ask for a new link when this one is spent', async () => {
    auth.user = { id: 1, email: 'ana@gmail.com', emailConfirmed: false };
    confirmEmail.mockRejectedValue(new Error('This link has expired or was already used'));
    resendConfirmation.mockResolvedValue({ message: 'Confirmation link sent' });
    await renderAt(`/confirm-email?token=${TOKEN}`);
    expect(
      screen.getByRole('heading', { name: "This link doesn't work anymore" }),
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Send again' }));
    });
    expect(resendConfirmation).toHaveBeenCalledOnce();
    expect(screen.getByText(/We sent a new link to ana@gmail.com/)).toBeInTheDocument();
  });

  it('sends a guest with a spent link to sign in', async () => {
    confirmEmail.mockRejectedValue(new Error('This link has expired or was already used'));
    await renderAt(`/confirm-email?token=${TOKEN}`);
    expect(screen.getByRole('link', { name: 'Sign in to get a new link' })).toHaveAttribute(
      'href',
      '/getstarted',
    );
  });

  it('still says confirmed when a link opened twice finds the email confirmed already', async () => {
    auth.user = { id: 1, email: 'ana@gmail.com', emailConfirmed: true };
    confirmEmail.mockRejectedValue(new Error('This link has expired or was already used'));
    await renderAt(`/confirm-email?token=${TOKEN}`);
    expect(screen.getByRole('heading', { name: 'Your email is confirmed' })).toBeInTheDocument();
  });

  it('sends nothing without a token', async () => {
    await renderAt('/confirm-email');
    expect(confirmEmail).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: "This link doesn't work anymore" }),
    ).toBeInTheDocument();
  });
});
