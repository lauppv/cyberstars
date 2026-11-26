import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('./AnnouncementSection', () => ({
  AnnouncementSection: () => <textarea aria-label="Announcement text" />,
}));
vi.mock('./PollSection', () => ({ PollSection: () => <p>Poll form</p> }));

const { NoticesSection } = await import('./NoticesSection');

describe('NoticesSection', () => {
  it('opens on the announcements, a tab each for them and the polls', () => {
    render(<NoticesSection className="" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['Announcements', 'Polls']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tablist', { name: 'Announcements and polls' })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: 'Announcements' })).toBeVisible();
    expect(screen.queryByRole('tabpanel', { name: 'Polls' })).toBeNull();
  });

  it('keeps what was written in one tab while the other is shown', () => {
    render(<NoticesSection className="" />);
    fireEvent.change(screen.getByLabelText('Announcement text'), { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('tab', { name: 'Polls' }));
    expect(screen.getByRole('tabpanel', { name: 'Polls' })).toBeVisible();
    expect(screen.getByText('Poll form')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Announcements' }));
    expect(screen.getByLabelText('Announcement text')).toHaveValue('Hi');
  });
});
