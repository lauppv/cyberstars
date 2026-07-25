import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import type {
  ForumCategoryDTO,
  ForumPostDTO,
  ForumThreadDetailDTO,
  ForumThreadSummaryDTO,
} from '../../shared/forum';
import type { AuthenticatedUser, UserRole } from '../../shared/auth';

let authUser: AuthenticatedUser | null = null;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: authUser, isLoggedIn: authUser != null, isLoading: false }),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../services/forumService', () => ({
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  getThreads: vi.fn(),
  getThread: vi.fn(),
  createThread: vi.fn(),
  createPost: vi.fn(),
  toggleReaction: vi.fn(),
  markSolution: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
  deleteThread: vi.fn(),
  updateUserRole: vi.fn(),
}));

const forumService = await import('../services/forumService');
const mocked = {
  getCategories: vi.mocked(forumService.getCategories),
  createCategory: vi.mocked(forumService.createCategory),
  updateCategory: vi.mocked(forumService.updateCategory),
  deleteCategory: vi.mocked(forumService.deleteCategory),
  getThreads: vi.mocked(forumService.getThreads),
  getThread: vi.mocked(forumService.getThread),
  createThread: vi.mocked(forumService.createThread),
  createPost: vi.mocked(forumService.createPost),
  toggleReaction: vi.mocked(forumService.toggleReaction),
  markSolution: vi.mocked(forumService.markSolution),
  updatePost: vi.mocked(forumService.updatePost),
  deletePost: vi.mocked(forumService.deletePost),
  deleteThread: vi.mocked(forumService.deleteThread),
  updateUserRole: vi.mocked(forumService.updateUserRole),
};

const { ForumPage } = await import('./ForumPage');

const now = new Date().toISOString();
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

function makeUser(role: UserRole, id = 99): AuthenticatedUser {
  return {
    id,
    name: role.toLowerCase(),
    email: `${role.toLowerCase()}@test.dev`,
    role,
    avatarUrl: null,
    bio: null,
    status: null,
    statusExpiresAt: null,
    pendingEmail: null,
    createdAt: now,
    showBio: true,
    showStats: true,
    showProgress: true,
    showActivity: true,
    showConnections: true,
  };
}

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

function makePost(overrides: Partial<ForumPostDTO> = {}): ForumPostDTO {
  return {
    id: 10,
    content: 'Try a for loop',
    solution: false,
    authorId: 1,
    authorName: 'Ada',
    authorAvatarUrl: null,
    authorRole: 'USER',
    createdAt: now,
    updatedAt: now,
    editedByName: null,
    deleted: false,
    deletedByName: null,
    reactions: [],
    ...overrides,
  };
}

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

/** Category rows and thread rows are clickable divs, not buttons. */
function clickRow(label: string, rowClass: string) {
  const row = screen.getByText(label).closest(rowClass);
  expect(row).not.toBeNull();
  fireEvent.click(row!);
}

beforeEach(() => {
  vi.clearAllMocks();
  authUser = null;
  mocked.getCategories.mockResolvedValue([category]);
  mocked.getThreads.mockResolvedValue({ category, threads: [threadSummary] });
  mocked.getThread.mockResolvedValue(threadDetail);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ForumPage routing', () => {
  it('renders the index at /forum', async () => {
    renderAt('/forum');
    expect(await screen.findByText('Python Help')).toBeInTheDocument();
    expect(mocked.getThread).not.toHaveBeenCalled();
  });

  it('opens a category straight from its URL', async () => {
    renderAt('/forum/c/python-help');
    await waitFor(() => expect(mocked.getThreads).toHaveBeenCalledWith('python-help'));
    expect(await screen.findByText('Loops confuse me')).toBeInTheDocument();
  });

  it('opens a thread straight from its URL and offers a way back to its category', async () => {
    renderAt('/forum/t/5');
    await waitFor(() => expect(mocked.getThread).toHaveBeenCalledWith(5));
    expect(
      await screen.findByRole('heading', { name: 'Loops confuse me', level: 1 }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /Back to Python Help/ }));

    await waitFor(() => expect(mocked.getThreads).toHaveBeenCalledWith('python-help'));
  });

  it('falls back to the index for a malformed thread id', async () => {
    renderAt('/forum/t/not-a-number');
    expect(await screen.findByText('Python Help')).toBeInTheDocument();
    expect(mocked.getThread).not.toHaveBeenCalled();
  });

  it('walks index → category → thread by clicking through', async () => {
    renderAt('/forum');
    await screen.findByText('Python Help');
    clickRow('Python Help', '.cat-row');

    expect(await screen.findByText('Loops confuse me')).toBeInTheDocument();
    clickRow('Loops confuse me', '.thread-row');

    await waitFor(() => expect(mocked.getThread).toHaveBeenCalledWith(5));
  });
});

describe('ForumIndex', () => {
  it('shows a loading state until the categories resolve', () => {
    mocked.getCategories.mockReturnValue(new Promise(() => {}));
    renderAt('/forum');
    expect(screen.getByText('Loading forum...')).toBeInTheDocument();
  });

  it('shows an error when the categories fail to load', async () => {
    mocked.getCategories.mockRejectedValue(new Error('boom'));
    renderAt('/forum');
    expect(await screen.findByText('Failed to load forum categories.')).toBeInTheDocument();
  });

  it('groups categories and totals their threads and posts', async () => {
    mocked.getCategories.mockResolvedValue([
      { ...category, threadCount: 1200, postCount: 40 },
      {
        ...category,
        id: 2,
        slug: 'lounge',
        name: 'The Lounge',
        groupName: 'Off-Topic',
        threadCount: 3,
        postCount: 7,
      },
    ]);
    renderAt('/forum');

    expect(await screen.findByText('The Lounge')).toBeInTheDocument();
    expect(screen.getByText('Off-Topic')).toBeInTheDocument();
    expect(screen.getByText((1203).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('renders the last post with a relative timestamp per age bracket', async () => {
    const lastPost = (createdAt: string) => ({
      threadTitle: 'Latest',
      authorName: 'Ada',
      createdAt,
    });
    mocked.getCategories.mockResolvedValue([
      { ...category, slug: 'a', name: 'A', lastPost: lastPost(ago(5_000)) },
      { ...category, slug: 'b', name: 'B', lastPost: lastPost(ago(5 * 60_000)) },
      { ...category, slug: 'c', name: 'C', lastPost: lastPost(ago(3 * 3_600_000)) },
      { ...category, slug: 'd', name: 'D', lastPost: lastPost(ago(2 * 86_400_000)) },
      { ...category, slug: 'e', name: 'E', lastPost: lastPost(ago(400 * 86_400_000)) },
    ]);
    renderAt('/forum');

    await screen.findByText('A');
    expect(screen.getByText(/just now/)).toBeInTheDocument();
    expect(screen.getByText(/5m ago/)).toBeInTheDocument();
    expect(screen.getByText(/3h ago/)).toBeInTheDocument();
    expect(screen.getByText(/2d ago/)).toBeInTheDocument();
    expect(screen.getAllByText(/Latest/)).toHaveLength(5);
  });

  it('hides the staff controls from a plain user', async () => {
    authUser = makeUser('USER');
    renderAt('/forum');
    await screen.findByText('Python Help');
    expect(screen.queryByText('+ New Category')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Edit category')).not.toBeInTheDocument();
  });

  it('lets staff open the create-category modal', async () => {
    authUser = makeUser('ADMIN');
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByText('+ New Category'));
    expect(await screen.findByText('New category')).toBeInTheDocument();
  });

  it('reloads the categories after the modal saves', async () => {
    authUser = makeUser('ADMIN');
    mocked.createCategory.mockResolvedValue({ slug: 'new' });
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByText('+ New Category'));
    await screen.findByText('New category');
    fireEvent.change(screen.getByPlaceholderText('e.g. Python Help'), {
      target: { value: 'Rust Help' },
    });
    fireEvent.change(screen.getByPlaceholderText('What is this category about?'), {
      target: { value: 'Borrow checker woes' },
    });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => expect(mocked.getCategories).toHaveBeenCalledTimes(2));
    expect(screen.queryByText('New category')).not.toBeInTheDocument();
  });

  it('closes the category modal without reloading', async () => {
    authUser = makeUser('ADMIN');
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByText('+ New Category'));
    await screen.findByText('New category');
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('New category')).not.toBeInTheDocument();
    expect(mocked.getCategories).toHaveBeenCalledTimes(1);
  });

  it('lets staff open the edit-category modal prefilled', async () => {
    authUser = makeUser('MODERATOR');
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByTitle('Edit category'));
    expect(await screen.findByText('Edit category', { selector: 'div' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ask about Python')).toBeInTheDocument();
  });

  it('deletes a category once the confirmation is accepted', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mocked.deleteCategory.mockResolvedValue({ ok: true });
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByTitle('Delete category'));

    await waitFor(() => expect(mocked.deleteCategory).toHaveBeenCalledWith('python-help'));
    await waitFor(() => expect(mocked.getCategories).toHaveBeenCalledTimes(2));
  });

  it('keeps the category when the confirmation is dismissed', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByTitle('Delete category'));
    expect(mocked.deleteCategory).not.toHaveBeenCalled();
  });

  it('alerts with the server message when the delete fails', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mocked.deleteCategory.mockRejectedValue(new Error('Category is not empty'));
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByTitle('Delete category'));

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Category is not empty'));
  });

  it('falls back to a generic message when the delete error carries none', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mocked.deleteCategory.mockRejectedValue('nope');
    renderAt('/forum');
    await screen.findByText('Python Help');

    fireEvent.click(screen.getByTitle('Delete category'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('Something went wrong. Please try again.'),
    );
  });
});

describe('CategoryView', () => {
  it('shows a loading state until the threads resolve', () => {
    mocked.getThreads.mockReturnValue(new Promise(() => {}));
    renderAt('/forum/c/python-help');
    expect(screen.getByText('Loading threads...')).toBeInTheDocument();
  });

  it('shows an error with a way back to the index', async () => {
    mocked.getThreads.mockRejectedValue(new Error('boom'));
    renderAt('/forum/c/python-help');

    expect(await screen.findByText('Failed to load threads.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /Back to Forum/ }));
    expect(await screen.findByText('Python Help')).toBeInTheDocument();
  });

  it('tells a person when the category has no threads yet', async () => {
    mocked.getThreads.mockResolvedValue({ category, threads: [] });
    renderAt('/forum/c/python-help');
    expect(await screen.findByText('No threads yet. Be the first to post!')).toBeInTheDocument();
  });

  it('marks pinned, locked and solved threads and abbreviates large view counts', async () => {
    mocked.getThreads.mockResolvedValue({
      category,
      threads: [
        { ...threadSummary, id: 1, title: 'Pinned one', pinned: true, views: 2500 },
        { ...threadSummary, id: 2, title: 'Locked one', locked: true },
        {
          ...threadSummary,
          id: 3,
          title: 'Solved one',
          solved: true,
          lastPostAuthor: 'Grace',
          lastPostAt: ago(90 * 60_000),
        },
      ],
    });
    renderAt('/forum/c/python-help');

    await screen.findByText('Pinned one');
    expect(screen.getByText('📌')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('2.5k')).toBeInTheDocument();
    expect(screen.getByText('Grace')).toBeInTheDocument();
    expect(screen.getByText('1h ago')).toBeInTheDocument();
  });

  it('hides the composer from guests', async () => {
    renderAt('/forum/c/python-help');
    await screen.findByText('Loops confuse me');
    expect(screen.queryByText('+ New Thread')).not.toBeInTheDocument();
  });

  it('lets a logged-in person create a thread and lands them on it', async () => {
    authUser = makeUser('USER');
    mocked.createThread.mockResolvedValue({ threadId: 5 });
    renderAt('/forum/c/python-help');
    await screen.findByText('Loops confuse me');

    fireEvent.click(screen.getByText('+ New Thread'));
    fireEvent.change(screen.getByPlaceholderText('Thread title...'), {
      target: { value: 'How do ranges work?' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Write your post/), {
      target: { value: 'I keep getting an off-by-one.' },
    });
    fireEvent.click(screen.getByText('Create Thread'));

    await waitFor(() =>
      expect(mocked.createThread).toHaveBeenCalledWith({
        categorySlug: 'python-help',
        title: 'How do ranges work?',
        content: 'I keep getting an off-by-one.',
      }),
    );
    await waitFor(() => expect(mocked.getThread).toHaveBeenCalledWith(5));
  });

  it('keeps the create button disabled until both fields are filled', async () => {
    authUser = makeUser('USER');
    renderAt('/forum/c/python-help');
    await screen.findByText('Loops confuse me');

    fireEvent.click(screen.getByText('+ New Thread'));
    expect(screen.getByText('Create Thread')).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Thread title...'), {
      target: { value: 'Title only' },
    });
    expect(screen.getByText('Create Thread')).toBeDisabled();
  });

  it('closes the composer again on cancel', async () => {
    authUser = makeUser('USER');
    renderAt('/forum/c/python-help');
    await screen.findByText('Loops confuse me');

    fireEvent.click(screen.getByText('+ New Thread'));
    expect(screen.getByPlaceholderText('Thread title...')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('Thread title...')).not.toBeInTheDocument();
  });

  it('blocks a plain user from starting a thread in a restricted category', async () => {
    authUser = makeUser('USER');
    mocked.getThreads.mockResolvedValue({
      category: { ...category, slug: 'announcements', name: 'Announcements' },
      threads: [],
    });
    renderAt('/forum/c/announcements');

    expect(await screen.findByText(/Only moderators and admins can start threads/)).toBeVisible();
    expect(screen.queryByText('+ New Thread')).not.toBeInTheDocument();
  });

  it('lets a moderator start a thread in a restricted category', async () => {
    authUser = makeUser('MODERATOR');
    mocked.getThreads.mockResolvedValue({
      category: { ...category, slug: 'announcements', name: 'Announcements' },
      threads: [],
    });
    renderAt('/forum/c/announcements');

    expect(await screen.findByText('+ New Thread')).toBeInTheDocument();
    expect(
      screen.queryByText(/Only moderators and admins can start threads/),
    ).not.toBeInTheDocument();
  });
});

describe('ThreadView', () => {
  it('shows a loading state until the thread resolves', () => {
    mocked.getThread.mockReturnValue(new Promise(() => {}));
    renderAt('/forum/t/5');
    expect(screen.getByText('Loading thread...')).toBeInTheDocument();
  });

  it('shows an error with a way back to the index', async () => {
    mocked.getThread.mockRejectedValue(new Error('boom'));
    renderAt('/forum/t/5');

    expect(await screen.findByText('Failed to load thread.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Forum/ })).toBeInTheDocument();
  });

  it('renders the thread header with its counters and solved badge', async () => {
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      solved: true,
      views: 42,
      posts: [makePost()],
    });
    renderAt('/forum/t/5');

    await screen.findByRole('heading', { name: 'Loops confuse me', level: 1 });
    expect(screen.getByText('1 posts')).toBeInTheDocument();
    expect(screen.getByText('42 views')).toBeInTheDocument();
    expect(screen.getByText('✓ Solved')).toBeInTheDocument();
  });

  it('hides the reply box from guests', async () => {
    mocked.getThread.mockResolvedValue({ ...threadDetail, posts: [makePost()] });
    renderAt('/forum/t/5');
    await screen.findByText('Try a for loop');
    expect(screen.queryByText('Post a reply')).not.toBeInTheDocument();
  });

  it('posts a reply and refreshes the thread', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue({ ...threadDetail, posts: [makePost()] });
    mocked.createPost.mockResolvedValue({ postId: 11 });
    renderAt('/forum/t/5');
    await screen.findByText('Try a for loop');

    fireEvent.change(screen.getByPlaceholderText('Type your reply...'), {
      target: { value: 'Thanks, that worked' },
    });
    fireEvent.click(screen.getByText('Post Reply'));

    await waitFor(() =>
      expect(mocked.createPost).toHaveBeenCalledWith(5, { content: 'Thanks, that worked' }),
    );
    await waitFor(() => expect(mocked.getThread).toHaveBeenCalledTimes(2));
  });

  it('reports a refresh that fails after the reply went through', async () => {
    authUser = makeUser('USER');
    mocked.getThread
      .mockResolvedValueOnce({ ...threadDetail, posts: [makePost()] })
      .mockRejectedValue(new Error('offline'));
    mocked.createPost.mockResolvedValue({ postId: 11 });
    renderAt('/forum/t/5');
    await screen.findByText('Try a for loop');

    fireEvent.change(screen.getByPlaceholderText('Type your reply...'), {
      target: { value: 'Thanks' },
    });
    fireEvent.click(screen.getByText('Post Reply'));

    expect(await screen.findByText('Failed to load thread.')).toBeInTheDocument();
  });

  it('surfaces the server message when the reply is rejected', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue({ ...threadDetail, posts: [makePost()] });
    mocked.createPost.mockRejectedValue(new Error('Thread is locked'));
    renderAt('/forum/t/5');
    await screen.findByText('Try a for loop');

    fireEvent.change(screen.getByPlaceholderText('Type your reply...'), {
      target: { value: 'Late reply' },
    });
    fireEvent.click(screen.getByText('Post Reply'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Thread is locked');
  });

  it('shows the locked banner and no reply box on a locked thread', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue({ ...threadDetail, locked: true, posts: [makePost()] });
    renderAt('/forum/t/5');

    expect(await screen.findByText(/This thread is locked/)).toBeInTheDocument();
    expect(screen.queryByText('Post a reply')).not.toBeInTheDocument();
  });

  it('explains why a plain user cannot reply in a restricted category', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      categorySlug: 'announcements',
      categoryName: 'Announcements',
      posts: [makePost()],
    });
    renderAt('/forum/t/5');

    expect(await screen.findByText(/Only moderators and admins can reply/)).toBeInTheDocument();
  });

  it('renders a deleted post as a tombstone', async () => {
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      posts: [makePost({ deleted: true, deletedByName: 'Mod', authorAvatarUrl: '/a.png' })],
    });
    renderAt('/forum/t/5');

    expect(await screen.findByText(/This post was deleted by/)).toBeInTheDocument();
    expect(screen.getByText('Mod')).toBeInTheDocument();
    expect(screen.queryByText('Try a for loop')).not.toBeInTheDocument();
  });

  it('shows the edit trail and the solution banner', async () => {
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      posts: [makePost({ editedByName: 'Ada', solution: true, authorAvatarUrl: '/a.png' })],
    });
    renderAt('/forum/t/5');

    expect(await screen.findByText('edited by Ada')).toBeInTheDocument();
    expect(screen.getByText(/Marked as solution/)).toBeInTheDocument();
  });
});

describe('ThreadView reactions', () => {
  const withReaction = {
    ...threadDetail,
    posts: [
      makePost({ reactions: [{ emoji: '👍', count: 2, active: true, users: ['Ada', 'Grace'] }] }),
    ],
  };

  it('ignores reaction clicks from guests', async () => {
    mocked.getThread.mockResolvedValue(withReaction);
    renderAt('/forum/t/5');

    fireEvent.click(await screen.findByTitle('Ada, Grace'));
    await waitFor(() => expect(mocked.toggleReaction).not.toHaveBeenCalled());
  });

  it('toggles an existing reaction for a logged-in person', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(withReaction);
    mocked.toggleReaction.mockResolvedValue({ active: false });
    renderAt('/forum/t/5');

    fireEvent.click(await screen.findByTitle('Ada, Grace'));

    await waitFor(() => expect(mocked.toggleReaction).toHaveBeenCalledWith(10, { emoji: '👍' }));
    await waitFor(() => expect(mocked.getThread).toHaveBeenCalledTimes(2));
  });

  it('reports a failed reaction', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(withReaction);
    mocked.toggleReaction.mockRejectedValue(new Error('Too many reactions'));
    renderAt('/forum/t/5');

    fireEvent.click(await screen.findByTitle('Ada, Grace'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many reactions');
  });

  it('adds a reaction through the picker and closes it', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(withReaction);
    mocked.toggleReaction.mockResolvedValue({ active: true });
    renderAt('/forum/t/5');

    fireEvent.click(await screen.findByTitle('Add reaction'));
    fireEvent.click(screen.getByText('🎉'));

    await waitFor(() => expect(mocked.toggleReaction).toHaveBeenCalledWith(10, { emoji: '🎉' }));
    expect(screen.queryByText('🎉')).not.toBeInTheDocument();
  });

  it('closes the picker when the backdrop is clicked', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(withReaction);
    const { container } = renderAt('/forum/t/5');

    fireEvent.click(await screen.findByTitle('Add reaction'));
    expect(screen.getByText('🚀')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.reaction-picker-backdrop')!);
    expect(screen.queryByText('🚀')).not.toBeInTheDocument();
  });
});

describe('ThreadView moderation', () => {
  const opAndReply = {
    ...threadDetail,
    authorId: 99,
    posts: [
      makePost({ id: 10, authorId: 99, content: 'My question' }),
      makePost({ id: 11, authorId: 1, content: 'My answer' }),
    ],
  };

  it('lets the thread author mark a reply as the solution', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.markSolution.mockResolvedValue({ solved: true });
    renderAt('/forum/t/5');

    fireEvent.click(await screen.findByText('✓ Mark as solution'));
    await waitFor(() => expect(mocked.markSolution).toHaveBeenCalledWith(11));
  });

  it('lets the thread author unmark the accepted solution', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue({
      ...opAndReply,
      posts: [opAndReply.posts[0], { ...opAndReply.posts[1], solution: true }],
    });
    mocked.markSolution.mockResolvedValue({ solved: false });
    renderAt('/forum/t/5');

    fireEvent.click(await screen.findByText('✕ Unmark solution'));
    await waitFor(() => expect(mocked.markSolution).toHaveBeenCalledWith(11));
  });

  it('reports a failed solution toggle', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.markSolution.mockRejectedValue(new Error('Not your thread'));
    renderAt('/forum/t/5');

    fireEvent.click(await screen.findByText('✓ Mark as solution'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Not your thread');
  });

  it('does not offer the solution button on the opening post', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(opAndReply);
    renderAt('/forum/t/5');

    await screen.findByText('My question');
    expect(screen.getAllByText('✓ Mark as solution')).toHaveLength(1);
  });

  it('lets the author edit their own post', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.updatePost.mockResolvedValue({ ok: true });
    renderAt('/forum/t/5');

    await screen.findByText('My question');
    fireEvent.click(screen.getByText('✎ Edit'));
    fireEvent.change(screen.getByDisplayValue('My question'), {
      target: { value: 'My clearer question' },
    });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() =>
      expect(mocked.updatePost).toHaveBeenCalledWith(10, { content: 'My clearer question' }),
    );
  });

  it('discards the draft on cancel and blocks an empty save', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(opAndReply);
    renderAt('/forum/t/5');

    await screen.findByText('My question');
    fireEvent.click(screen.getByText('✎ Edit'));
    fireEvent.change(screen.getByDisplayValue('My question'), { target: { value: '   ' } });
    expect(screen.getByText('Save')).toBeDisabled();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('My question')).toBeInTheDocument();
    expect(mocked.updatePost).not.toHaveBeenCalled();
  });

  it('reports a failed edit', async () => {
    authUser = makeUser('USER');
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.updatePost.mockRejectedValue(new Error('Edit window closed'));
    renderAt('/forum/t/5');

    await screen.findByText('My question');
    fireEvent.click(screen.getByText('✎ Edit'));
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Edit window closed');
  });

  it('deletes a reply and refreshes the thread', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.deletePost.mockResolvedValue({ ok: true, threadDeleted: false });
    renderAt('/forum/t/5');

    await screen.findByText('My answer');
    const reply = screen.getByText('My answer').closest('.forum-post')!;
    fireEvent.click(within(reply as HTMLElement).getByText('🗑 Delete'));

    await waitFor(() => expect(mocked.deletePost).toHaveBeenCalledWith(11));
    await waitFor(() => expect(mocked.getThread).toHaveBeenCalledTimes(2));
  });

  it('leaves for the category when deleting the reply removes the thread', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.deletePost.mockResolvedValue({ ok: true, threadDeleted: true });
    renderAt('/forum/t/5');

    await screen.findByText('My answer');
    const reply = screen.getByText('My answer').closest('.forum-post')!;
    fireEvent.click(within(reply as HTMLElement).getByText('🗑 Delete'));

    await waitFor(() => expect(mocked.getThreads).toHaveBeenCalledWith('python-help'));
  });

  it('deleting the opening post deletes the whole thread', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.deleteThread.mockResolvedValue({ ok: true });
    renderAt('/forum/t/5');

    await screen.findByText('My question');
    fireEvent.click(screen.getByText('🗑 Delete thread'));

    await waitFor(() => expect(mocked.deleteThread).toHaveBeenCalledWith(5));
    await waitFor(() => expect(mocked.getThreads).toHaveBeenCalledWith('python-help'));
  });

  it('keeps the post when the delete confirmation is dismissed', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    mocked.getThread.mockResolvedValue(opAndReply);
    renderAt('/forum/t/5');

    await screen.findByText('My question');
    fireEvent.click(screen.getByText('🗑 Delete thread'));
    expect(mocked.deleteThread).not.toHaveBeenCalled();
  });

  it('reports a failed thread delete', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.deleteThread.mockRejectedValue(new Error('Thread is pinned'));
    renderAt('/forum/t/5');

    await screen.findByText('My question');
    fireEvent.click(screen.getByText('🗑 Delete thread'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Thread is pinned');
  });

  it('reports a failed post delete', async () => {
    authUser = makeUser('ADMIN');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mocked.getThread.mockResolvedValue(opAndReply);
    mocked.deletePost.mockRejectedValue(new Error('Already gone'));
    renderAt('/forum/t/5');

    await screen.findByText('My answer');
    const reply = screen.getByText('My answer').closest('.forum-post')!;
    fireEvent.click(within(reply as HTMLElement).getByText('🗑 Delete'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Already gone');
  });

  it('gives a moderator no controls over an admin post', async () => {
    authUser = makeUser('MODERATOR');
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      posts: [makePost({ authorRole: 'ADMIN' })],
    });
    renderAt('/forum/t/5');

    await screen.findByText('Try a for loop');
    expect(screen.queryByText('✎ Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('🗑 Delete thread')).not.toBeInTheDocument();
  });

  it('gives a moderator controls over a plain user post', async () => {
    authUser = makeUser('MODERATOR');
    mocked.getThread.mockResolvedValue({ ...threadDetail, posts: [makePost()] });
    renderAt('/forum/t/5');

    expect(await screen.findByText('✎ Edit')).toBeInTheDocument();
  });

  it('shields a founder post from an admin', async () => {
    authUser = makeUser('ADMIN');
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      posts: [makePost({ authorRole: 'FOUNDER' })],
    });
    renderAt('/forum/t/5');

    await screen.findByText('Try a for loop');
    expect(screen.queryByText('✎ Edit')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('lets a founder moderate another founder post', async () => {
    authUser = makeUser('FOUNDER');
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      posts: [makePost({ authorRole: 'FOUNDER' })],
    });
    renderAt('/forum/t/5');

    expect(await screen.findByText('✎ Edit')).toBeInTheDocument();
  });
});

describe('ThreadView role management', () => {
  it('lets an admin promote a plain user to moderator', async () => {
    authUser = makeUser('ADMIN');
    mocked.getThread.mockResolvedValue({ ...threadDetail, posts: [makePost()] });
    mocked.updateUserRole.mockResolvedValue({ ok: true });
    renderAt('/forum/t/5');

    const select = await screen.findByRole('combobox');
    expect(within(select).queryByRole('option', { name: 'Admin' })).not.toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'MODERATOR' } });
    await waitFor(() => expect(mocked.updateUserRole).toHaveBeenCalledWith(1, 'MODERATOR'));
  });

  it('offers the admin role only to the founder', async () => {
    authUser = makeUser('FOUNDER');
    mocked.getThread.mockResolvedValue({
      ...threadDetail,
      posts: [makePost({ authorRole: 'ADMIN' })],
    });
    renderAt('/forum/t/5');

    const select = await screen.findByRole('combobox');
    expect(within(select).getByRole('option', { name: 'Admin' })).toBeInTheDocument();
  });

  it('reports a failed role change', async () => {
    authUser = makeUser('ADMIN');
    mocked.getThread.mockResolvedValue({ ...threadDetail, posts: [makePost()] });
    mocked.updateUserRole.mockRejectedValue(new Error('Cannot demote yourself'));
    renderAt('/forum/t/5');

    fireEvent.change(await screen.findByRole('combobox'), { target: { value: 'MODERATOR' } });
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot demote yourself');
  });

  it('never offers a role select on your own post', async () => {
    authUser = makeUser('ADMIN', 1);
    mocked.getThread.mockResolvedValue({ ...threadDetail, posts: [makePost({ authorId: 1 })] });
    renderAt('/forum/t/5');

    await screen.findByText('Try a for loop');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
