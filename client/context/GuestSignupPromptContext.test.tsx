import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: { isLoggedIn: false },
  navigate: vi.fn(),
}));

vi.mock('./AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('react-router', () => ({ useNavigate: () => h.navigate }));

import { GuestSignupPromptProvider, useGuestSignupPrompt } from './GuestSignupPromptContext';

function Probe({ code = 0 }: { code?: number | undefined }) {
  const { notifyRunComplete } = useGuestSignupPrompt();
  return <button onClick={() => notifyRunComplete(code)}>run</button>;
}

function renderProbe(code?: number | undefined) {
  return render(
    <GuestSignupPromptProvider>
      <Probe code={code} />
    </GuestSignupPromptProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { isLoggedIn: false };
  localStorage.clear();
});

describe('GuestSignupPromptContext', () => {
  it('shows the modal on a guest first successful run', () => {
    renderProbe(0);
    fireEvent.click(screen.getByText('run'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not show for logged-in users', () => {
    h.auth = { isLoggedIn: true };
    renderProbe(0);
    fireEvent.click(screen.getByText('run'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not show on a failed run', () => {
    renderProbe(1);
    fireEvent.click(screen.getByText('run'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows at most once per browser', () => {
    const { unmount } = renderProbe(0);
    fireEvent.click(screen.getByText('run'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    unmount();

    renderProbe(0);
    fireEvent.click(screen.getByText('run'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dismisses via the close button', () => {
    renderProbe(0);
    fireEvent.click(screen.getByText('run'));
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dismisses on Escape', () => {
    renderProbe(0);
    fireEvent.click(screen.getByText('run'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates to signup on the primary CTA', () => {
    renderProbe(0);
    fireEvent.click(screen.getByText('run'));
    fireEvent.click(screen.getByText('Create free account'));
    expect(h.navigate).toHaveBeenCalledWith('/getstarted', { state: { mode: 'signup' } });
  });

  it('falls back to a no-op without a provider', () => {
    function Bare() {
      const { notifyRunComplete } = useGuestSignupPrompt();
      return <button onClick={() => notifyRunComplete(0)}>run</button>;
    }
    render(<Bare />);
    expect(() => fireEvent.click(screen.getByText('run'))).not.toThrow();
  });
});
