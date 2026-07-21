import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => (k === 'gamification.notEarned' ? ' (locked)' : k) }),
}));

const { Badge } = await import('./Badge');

describe('Badge', () => {
  it('uses the description as tooltip when earned', () => {
    render(<Badge icon="🏅" label="Gold" earned description="Finish 30 lessons" />);
    const badge = screen.getByText('Gold').closest('div') as HTMLElement;
    expect(badge).toHaveAttribute('title', 'Finish 30 lessons');
    expect(badge.style.boxShadow).toContain('accent-glow');
  });

  it('falls back to the label as tooltip when earned without a description', () => {
    render(<Badge icon="🥉" label="Bronze" earned />);
    const badge = screen.getByText('Bronze').closest('div') as HTMLElement;
    expect(badge).toHaveAttribute('title', 'Bronze');
  });

  it('appends the not-earned suffix when locked with a description', () => {
    render(<Badge icon="🔒" label="Silver" earned={false} description="Finish 20 lessons" />);
    const badge = screen.getByText('Silver').closest('div') as HTMLElement;
    expect(badge).toHaveAttribute('title', 'Finish 20 lessons (locked)');
    expect(badge.style.boxShadow).toBe('');
  });

  it('appends the not-earned suffix to the label when locked without a description', () => {
    render(<Badge icon="🔒" label="First Steps" earned={false} />);
    const badge = screen.getByText('First Steps').closest('div') as HTMLElement;
    expect(badge).toHaveAttribute('title', 'First Steps (locked)');
  });
});
