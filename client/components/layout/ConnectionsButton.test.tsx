import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: { user: { role: 'USER' } as { role: string } | null },
  access: true,
  navigate: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('react-router', () => ({ useNavigate: () => h.navigate }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
vi.mock('../../../shared/features', () => ({ canAccessFeature: () => h.access }));
vi.mock('./LockedIcon', () => ({
  LockedIcon: ({ label }: { label: string }) => <div data-testid="locked">{label}</div>,
}));

import { ConnectionsButton } from './ConnectionsButton';

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { user: { role: 'USER' } };
  h.access = true;
});

describe('ConnectionsButton', () => {
  it('navigates to /connections when clicked with access', () => {
    render(<ConnectionsButton />);
    fireEvent.click(screen.getByRole('button', { name: 'connections.title' }));
    expect(h.navigate).toHaveBeenCalledWith('/connections');
  });

  it('renders a locked icon when gated but signed in', () => {
    h.access = false;
    render(<ConnectionsButton />);
    expect(screen.getByTestId('locked')).toBeDefined();
  });

  it('renders nothing when gated and signed out', () => {
    h.access = false;
    h.auth = { user: null };
    const { container } = render(<ConnectionsButton />);
    expect(container.firstChild).toBeNull();
  });
});
