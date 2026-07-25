import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ForumCategoryDTO } from '../../../shared/forum';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const getCategories = vi.fn();
const createThread = vi.fn();
vi.mock('../../services/forumService', () => ({
  getCategories: () => getCategories(),
  createThread: (data: unknown) => createThread(data),
}));

import { ShareToForumModal } from './ShareToForumModal';

const CATEGORIES = [
  { slug: 'announcements', name: 'Announcements' },
  { slug: 'general', name: 'General' },
  { slug: 'help', name: 'Help' },
] as unknown as ForumCategoryDTO[];

beforeEach(() => {
  vi.clearAllMocks();
  getCategories.mockResolvedValue(CATEGORIES);
  createThread.mockResolvedValue({ threadId: 42 });
});

describe('ShareToForumModal', () => {
  it('loads categories and prefills the title from the lesson', async () => {
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={vi.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    expect(screen.getByDisplayValue('Loops')).toBeInTheDocument();
  });

  it('excludes restricted categories and defaults to the first allowed one', async () => {
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={vi.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    expect(screen.queryByText('Announcements')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Post'));
    await waitFor(() => expect(createThread).toHaveBeenCalledTimes(1));
    expect(createThread.mock.calls[0][0].categorySlug).toBe('general');
  });

  it('appends the optional description below the code block', async () => {
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={vi.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/Add context/), {
      target: { value: 'why is this slow?' },
    });
    fireEvent.click(screen.getByText('Post'));
    await waitFor(() => expect(createThread).toHaveBeenCalledTimes(1));
    expect(createThread.mock.calls[0][0].content).toBe(
      '```python\nprint(1)\n```\n\nwhy is this slow?',
    );
  });

  it('creates a thread with the code fenced and navigates to it', async () => {
    const onClose = vi.fn();
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={onClose} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Post'));

    await waitFor(() => expect(createThread).toHaveBeenCalledTimes(1));
    expect(createThread).toHaveBeenCalledWith({
      categorySlug: 'general',
      title: 'Loops',
      content: '```python\nprint(1)\n```',
    });
    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/forum/t/42');
  });

  it('maps course keys to a canonical fence language', async () => {
    render(
      <ShareToForumModal code="x=1" language="algo-python" lessonTitle="T" onClose={vi.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Post'));
    await waitFor(() => expect(createThread).toHaveBeenCalledTimes(1));
    expect(createThread.mock.calls[0][0].content).toBe('```python\nx=1\n```');
  });

  it('disables Post when the title is empty', async () => {
    render(<ShareToForumModal code="print(1)" language="python" onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    expect(screen.getByText('Post')).toBeDisabled();
  });

  it('shows an error and stays open when posting fails', async () => {
    createThread.mockRejectedValue(new Error('boom'));
    const onClose = vi.fn();
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={onClose} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Post'));
    await waitFor(() =>
      expect(screen.getByText('Could not post to the forum. Try again.')).toBeInTheDocument(),
    );
    expect(onClose).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls onClose from the Cancel button', async () => {
    const onClose = vi.fn();
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={onClose} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on the Escape key', async () => {
    const onClose = vi.fn();
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={onClose} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('ignores non-Escape keys', async () => {
    const onClose = vi.fn();
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="Loops" onClose={onClose} />,
    );
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('keeps a raw fence language for an unmapped language', async () => {
    render(<ShareToForumModal code="puts 1" language="Ruby" lessonTitle="T" onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByText('General')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Post'));
    await waitFor(() => expect(createThread).toHaveBeenCalledTimes(1));
    expect(createThread.mock.calls[0][0].content).toBe('```ruby\nputs 1\n```');
  });

  it('leaves the category unset when no categories are allowed', async () => {
    getCategories.mockResolvedValue([]);
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="T" onClose={vi.fn()} />,
    );
    await waitFor(() => expect(getCategories).toHaveBeenCalled());
    // With no category selected, Post stays disabled and no thread is created.
    expect(screen.getByText('Post')).toBeDisabled();
  });

  it('shows a load error when categories fail to fetch', async () => {
    getCategories.mockRejectedValue(new Error('boom'));
    render(
      <ShareToForumModal code="print(1)" language="python" lessonTitle="T" onClose={vi.fn()} />,
    );
    await waitFor(() => expect(screen.getByText('Could not load categories.')).toBeInTheDocument());
  });
});
