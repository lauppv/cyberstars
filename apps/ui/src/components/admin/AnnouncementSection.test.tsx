import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import type { AnnouncementDTO } from '@cyberstars/shared/admin';

const sendAnnouncement = vi.fn();
const getAnnouncements = vi.fn();
vi.mock('../../services/adminService', () => ({ sendAnnouncement, getAnnouncements }));

const { AnnouncementSection } = await import('./AnnouncementSection');

function write(text: string) {
  render(<AnnouncementSection className="" />);
  fireEvent.change(screen.getByLabelText('Announcement'), { target: { value: text } });
}

const confirm = () => screen.getByRole('dialog', { name: 'Send to all users?' });

// Braces, so the hook doesn't hand back the mock, which Vitest would call as a teardown
beforeEach(() => {
  sendAnnouncement.mockReset();
  getAnnouncements.mockReset();
  getAnnouncements.mockResolvedValue([]);
});

const sentBefore: AnnouncementDTO[] = [
  { id: 2, text: 'New course', authorName: 'Ada', createdAt: '2026-10-28T10:00:00.000Z' },
  { id: 1, text: 'Welcome', authorName: null, createdAt: '2026-10-20T10:00:00.000Z' },
];

describe('AnnouncementSection', () => {
  it('has nothing to send until something is written', () => {
    write('   ');
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('asks first, showing the row it makes in the bell', () => {
    write('  A new course is out.\nGo try it.  ');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    const row = within(confirm()).getByRole('menuitem');
    expect(row).toHaveTextContent('Official announcement: A new course is out. Go try it.');
    expect(within(row).getByText('View')).toBeInTheDocument();
    expect(sendAnnouncement).not.toHaveBeenCalled();
  });

  it('opens the full text from the preview, and Escape closes only that', () => {
    write('A new course is out.');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.click(within(confirm()).getByRole('menuitem'));
    expect(screen.getByRole('dialog', { name: 'Official announcement' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Official announcement' })).toBeNull();
    expect(confirm()).toBeInTheDocument();
  });

  it('keeps the question open on a click beside the full text', () => {
    write('A new course is out.');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.click(within(confirm()).getByRole('menuitem'));
    const reading = screen.getByRole('dialog', { name: 'Official announcement' });
    fireEvent.mouseDown(reading.parentElement!);
    expect(screen.queryByRole('dialog', { name: 'Official announcement' })).toBeNull();
    expect(confirm()).toBeInTheDocument();
  });

  it('goes back to writing on Cancel, Escape or a click beside the question', () => {
    write('Hi');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.mouseDown(confirm().parentElement!);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByLabelText('Announcement')).toHaveValue('Hi');
    expect(sendAnnouncement).not.toHaveBeenCalled();
  });

  it('sends the trimmed text and says how many got it', async () => {
    sendAnnouncement.mockResolvedValue({ sent: 3 });
    write('  Hi  ');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Send' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Sent to 3 users');
    expect(sendAnnouncement).toHaveBeenCalledWith('Hi');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByLabelText('Announcement')).toHaveValue('');
  });

  it('says so when it fails and keeps what was written', async () => {
    sendAnnouncement.mockRejectedValue(new Error('500'));
    write('Hi');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Send' }));
    expect(await within(confirm()).findByRole('alert')).toHaveTextContent(
      "The announcement couldn't be sent.",
    );
    expect(within(confirm()).getByRole('button', { name: 'Send' })).toBeEnabled();
    expect(screen.getByLabelText('Announcement')).toHaveValue('Hi');
  });
});

describe('AnnouncementSection history', () => {
  it('lists the ones sent before, cut to two lines, with when and who', async () => {
    getAnnouncements.mockResolvedValue(sentBefore);
    render(<AnnouncementSection className="" />);
    const text = await screen.findByText('New course');
    expect(text).toHaveClass('line-clamp-2');
    expect(text).not.toHaveClass('block');
    expect(screen.getByText('October 28, 2026 · Ada')).toBeInTheDocument();
    expect(screen.getByText('October 20, 2026 · Someone')).toBeInTheDocument();
  });

  it('opens one in full', async () => {
    getAnnouncements.mockResolvedValue(sentBefore);
    render(<AnnouncementSection className="" />);
    fireEvent.click(await screen.findByText('Welcome'));
    expect(screen.getByRole('dialog', { name: 'Official announcement' })).toHaveTextContent(
      'October 20, 2026',
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('says when none was sent yet', async () => {
    render(<AnnouncementSection className="" />);
    expect(await screen.findByText('No announcement has been sent yet.')).toBeInTheDocument();
  });

  it("says the history didn't load", async () => {
    getAnnouncements.mockRejectedValue(new Error('500'));
    render(<AnnouncementSection className="" />);
    expect(
      await screen.findByText("The announcements sent before couldn't be loaded."),
    ).toBeInTheDocument();
  });

  it('adds the one just sent', async () => {
    getAnnouncements.mockResolvedValueOnce([]).mockResolvedValueOnce([sentBefore[0]]);
    sendAnnouncement.mockResolvedValue({ sent: 3 });
    write('New course');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Send' }));
    expect(await screen.findByText('October 28, 2026 · Ada')).toBeInTheDocument();
    expect(getAnnouncements).toHaveBeenCalledTimes(2);
  });
});
