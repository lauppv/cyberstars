import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import type {
  ForumCategoryDTO,
  ForumThreadDetailDTO,
  ForumThreadSummaryDTO,
} from '../../shared/forum';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, isLoggedIn: false, isLoading: false }),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../services/forumService', () => ({
  getCategories: vi.fn(),
  getThreads: vi.fn(),
  getThread: vi.fn(),
}));

const forumService = await import('../services/forumService');
const mockGetCategories = vi.mocked(forumService.getCategories);
const mockGetThreads = vi.mocked(forumService.getThreads);
const mockGetThread = vi.mocked(forumService.getThread);

const { ForumPage } = await import('./ForumPage');

const now = new Date().toISOString();

const category: ForumCategoryDTO = {
  id: 1,
  slug: 'python-help',
  name: 'Python Help',
  description: 'Ask about Python',
  icon: '🐍',
  color: '#6C5CE7',
  groupName: 'Courses',
  threadCount: 1,
  postCount: 1,
  lastPost: null,
};

const threadSummary: ForumThreadSummaryDTO = {
  id: 5,
  title: 'Loops confuse me',
  pinned: false,
  locked: false,
  solved: false,
  views: 3,
  authorName: 'Ada',
  authorId: 1,
  authorRole: 'USER',
  replyCount: 0,
  createdAt: now,
  updatedAt: now,
  lastPostAuthor: null,
  lastPostAt: null,
};

const threadDetail: ForumThreadDetailDTO = {
  id: 5,
  title: 'Loops confuse me',
  pinned: false,
  locked: false,
  solved: false,
  views: 3,
  categorySlug: 'python-help',
  categoryName: 'Python Help',
  authorName: 'Ada',
  authorId: 1,
  authorRole: 'USER',
  createdAt: now,
  posts: [],
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/c/:categorySlug" element={<ForumPage />} />
        <Route path="/forum/t/:threadId" element={<ForumPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetCategories.mockResolvedValue([category]);
  mockGetThreads.mockResolvedValue({ category, threads: [threadSummary] });
  mockGetThread.mockResolvedValue(threadDetail);
});

describe('ForumPage routing', () => {
  it('renders the index at /forum', async () => {
    renderAt('/forum');
    expect(await screen.findByText('Python Help')).toBeInTheDocument();
    expect(mockGetThread).not.toHaveBeenCalled();
  });

  it('opens a category straight from its URL', async () => {
    renderAt('/forum/c/python-help');
    await waitFor(() => expect(mockGetThreads).toHaveBeenCalledWith('python-help'));
    expect(await screen.findByText('Loops confuse me')).toBeInTheDocument();
  });

  it('opens a thread straight from its URL and offers a way back to its category', async () => {
    renderAt('/forum/t/5');
    await waitFor(() => expect(mockGetThread).toHaveBeenCalledWith(5));
    expect(
      await screen.findByRole('heading', { name: 'Loops confuse me', level: 1 }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /Back to Python Help/ }));

    await waitFor(() => expect(mockGetThreads).toHaveBeenCalledWith('python-help'));
  });

  it('falls back to the index for a malformed thread id', async () => {
    renderAt('/forum/t/not-a-number');
    expect(await screen.findByText('Python Help')).toBeInTheDocument();
    expect(mockGetThread).not.toHaveBeenCalled();
  });
});
