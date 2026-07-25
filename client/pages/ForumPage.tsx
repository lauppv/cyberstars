import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import i18next from 'i18next';
import { Topbar } from '../components/layout/Topbar';
import { UserLink } from '../components/ui/UserLink';
import { ForumPostContent } from '../components/forum/ForumPostContent';
import { CategoryModal } from '../components/forum/CategoryModal';
import { useAuth } from '../context/AuthContext';
import { RESTRICTED_FORUM_CATEGORIES } from '../../shared/constants';
import * as forumService from '../services/forumService';
import type {
  ForumCategoryDTO,
  ForumThreadSummaryDTO,
  ForumThreadDetailDTO,
  ForumPostDTO,
} from '../../shared/forum';
import { isAdmin, type AuthenticatedUser, type UserRole } from '../../shared/auth';
import './ForumPage.css';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return i18next.t('forum.time.justNow');
  if (mins < 60) return i18next.t('forum.time.minAgo', { count: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return i18next.t('forum.time.hourAgo', { count: hrs });
  const days = Math.floor(hrs / 24);
  if (days < 30) return i18next.t('forum.time.dayAgo', { count: days });
  return new Date(iso).toLocaleDateString();
}

/** Surfaces the server's error message (e.g. "Thread is locked") when present. */
function errMsg(err: unknown): string {
  return err instanceof Error && err.message ? err.message : i18next.t('forum.actionError');
}

const REACTION_EMOJIS = ['👍', '❤️', '😄', '🎉', '🚀', '👀', '🤔', '🙏'];

const ROLE_CLS: Record<UserRole, string> = {
  FOUNDER: 'role-founder',
  ADMIN: 'role-admin',
  MODERATOR: 'role-mod',
  USER: 'role-user',
};

function RoleBadge({ role }: { role: UserRole }) {
  const { t } = useTranslation();
  return <span className={`role-badge ${ROLE_CLS[role]}`}>{t(`forum.roles.${role}`)}</span>;
}

/** Mirror of the server-side permission rule (server is authoritative). */
function canModerate(actorRole: UserRole, targetRole: UserRole, isOwner: boolean): boolean {
  if (targetRole === 'FOUNDER') return actorRole === 'FOUNDER';
  if (isAdmin(actorRole)) return true;
  if (actorRole === 'MODERATOR') return isOwner || targetRole === 'USER';
  return isOwner;
}

type View = 'index' | 'category' | 'thread';

export function ForumPage() {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pendingThreadId =
    (location.state as { openThreadId?: number } | null)?.openThreadId ?? null;
  const [view, setView] = useState<View>(pendingThreadId != null ? 'thread' : 'index');
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [composeIntent, setComposeIntent] = useState(false);
  const [threadId, setThreadId] = useState<number | null>(pendingThreadId);

  // Consume the one-shot navigation state (e.g. after sharing code) so a
  // refresh or back-navigation doesn't force the thread view again.
  useEffect(() => {
    if (pendingThreadId != null) {
      window.scrollTo(0, 0);
      navigate('/forum', { replace: true, state: null });
    }
  }, [pendingThreadId, navigate]);

  const openCategory = (slug: string, compose = false) => {
    setCategorySlug(slug);
    setComposeIntent(compose);
    setView('category');
    window.scrollTo(0, 0);
  };
  const openThread = (id: number) => {
    setThreadId(id);
    setComposeIntent(false);
    setView('thread');
    window.scrollTo(0, 0);
  };
  const backToIndex = () => {
    setView('index');
    window.scrollTo(0, 0);
  };
  const backToCategory = () => {
    setView('category');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Topbar />
      {view === 'index' && <ForumIndex onOpenCategory={openCategory} user={user} />}
      {view === 'category' && categorySlug && (
        <CategoryView
          categorySlug={categorySlug}
          startCompose={composeIntent}
          onBack={backToIndex}
          onOpenThread={openThread}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}
      {view === 'thread' && threadId && (
        <ThreadView
          threadId={threadId}
          onBack={backToIndex}
          onBackToCategory={backToCategory}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}
    </>
  );
}

/* ==================== FORUM INDEX ==================== */

function ForumIndex({
  onOpenCategory,
  user,
}: {
  onOpenCategory: (slug: string) => void;
  user: AuthenticatedUser | null;
}) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<ForumCategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // null = closed; { category: undefined } = create; { category } = edit.
  const [modal, setModal] = useState<{ category?: ForumCategoryDTO } | null>(null);

  const isStaff = user != null && user.role !== 'USER';

  const load = useCallback(() => {
    forumService
      .getCategories()
      .then((cats) => {
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => {
        setError(t('forum.loadCategoriesError'));
        setLoading(false);
      });
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (cat: ForumCategoryDTO) => {
    if (!window.confirm(t('forum.confirmDeleteCategory'))) return;
    try {
      await forumService.deleteCategory(cat.slug);
      load();
    } catch (err) {
      window.alert(errMsg(err));
    }
  };

  const groups = categories.reduce<Record<string, ForumCategoryDTO[]>>((acc, cat) => {
    (acc[cat.groupName] ??= []).push(cat);
    return acc;
  }, {});
  const groupNames = Object.keys(groups);

  const totalThreads = categories.reduce((s, c) => s + c.threadCount, 0);
  const totalPosts = categories.reduce((s, c) => s + c.postCount, 0);

  if (loading) {
    return (
      <main className="forum-page">
        <div className="forum-loading">{t('forum.loadingForum')}</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="forum-page">
        <div className="forum-loading">{error}</div>
      </main>
    );
  }

  return (
    <main className="forum-page">
      <div className="forum-page-header">
        <div>
          <p className="forum-page-subtitle">{t('forum.subtitle')}</p>
        </div>
        {isStaff && (
          <button className="forum-btn forum-btn-primary" onClick={() => setModal({})}>
            {t('forum.newCategory')}
          </button>
        )}
      </div>

      <div className="forum-stats">
        <div className="fs-item">
          <div className="fs-value">{totalThreads.toLocaleString()}</div>
          <div className="fs-label">{t('forum.stats.threads')}</div>
        </div>
        <div className="fs-item">
          <div className="fs-value">{totalPosts.toLocaleString()}</div>
          <div className="fs-label">{t('forum.stats.posts')}</div>
        </div>
        <div className="fs-item">
          <div className="fs-value">{categories.length}</div>
          <div className="fs-label">{t('forum.stats.categories')}</div>
        </div>
      </div>

      <div className="forum-content">
        <div>
          {Object.entries(groups).map(([groupName, cats]) => (
            <div className="forum-group" key={groupName}>
              <div className="forum-group-header">
                <div className="forum-group-title">
                  {t(`forum.groups.${groupName}`, { defaultValue: groupName })}
                </div>
                <div className="forum-group-line" />
              </div>
              <div className="cat-table">
                {cats.map((c) => (
                  <div
                    className={`cat-row${isStaff ? ' cat-row-staff' : ''}`}
                    key={c.slug}
                    onClick={() => onOpenCategory(c.slug)}
                  >
                    <div className="cat-main">
                      <div className="cat-icon" style={{ background: c.color + '22' }}>
                        {c.icon}
                      </div>
                      <div className="cat-info">
                        <div className="cat-name">
                          {t(`forum.categories.${c.slug}.name`, { defaultValue: c.name })}
                        </div>
                        <div className="cat-desc">
                          {t(`forum.categories.${c.slug}.desc`, { defaultValue: c.description })}
                        </div>
                      </div>
                    </div>
                    <div className="cat-counts">
                      <strong>{c.threadCount.toLocaleString()}</strong>
                      <span>{t('forum.threadsLower')}</span>
                      <span>{t('forum.postsCount', { count: c.postCount })}</span>
                    </div>
                    {c.lastPost && (
                      <div className="cat-lastpost">
                        <div className="lp-info">
                          <div className="lp-title">{c.lastPost.threadTitle}</div>
                          <div className="lp-meta">
                            {t('forum.by')} <span className="lp-user">{c.lastPost.authorName}</span>{' '}
                            · {timeAgo(c.lastPost.createdAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    {isStaff && (
                      <div className="cat-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="cat-action-btn"
                          title={t('forum.editCategoryTitle')}
                          onClick={() => setModal({ category: c })}
                        >
                          ✎
                        </button>
                        <button
                          className="cat-action-btn cat-action-danger"
                          title={t('forum.deleteCategoryTitle')}
                          onClick={() => handleDelete(c)}
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <CategoryModal
          category={modal.category}
          groups={groupNames}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
    </main>
  );
}

/* ==================== CATEGORY VIEW ==================== */

function CategoryView({
  categorySlug,
  startCompose = false,
  onBack,
  onOpenThread,
  isLoggedIn,
  user,
}: {
  categorySlug: string;
  startCompose?: boolean;
  onBack: () => void;
  onOpenThread: (id: number) => void;
  isLoggedIn: boolean;
  user: AuthenticatedUser | null;
}) {
  const { t } = useTranslation();
  const restricted = RESTRICTED_FORUM_CATEGORIES.has(categorySlug);
  const canPost = isLoggedIn && (!restricted || (user != null && user.role !== 'USER'));
  const [category, setCategory] = useState<{
    slug: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  } | null>(null);
  const [threads, setThreads] = useState<ForumThreadSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(startCompose);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    forumService
      .getThreads(categorySlug)
      .then((data) => {
        if (!cancelled) {
          setCategory(data.category);
          setThreads(data.threads);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('forum.loadThreadsError'));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug, t]);

  const handleCreateThread = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    try {
      const { threadId } = await forumService.createThread({
        categorySlug,
        title: newTitle.trim(),
        content: newContent.trim(),
      });
      setShowComposer(false);
      setNewTitle('');
      setNewContent('');
      onOpenThread(threadId);
    } finally {
      setPosting(false);
    }
  };

  if (loading || (!category && !error)) {
    return (
      <main className="forum-page">
        <div className="forum-loading">{t('forum.loadingThreads')}</div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="forum-page">
        <div className="forum-crumbs">
          <a onClick={onBack}>{t('forum.crumbForum')}</a>
          <span className="forum-crumb-sep">/</span>
          <span className="forum-crumb-here">{t('forum.crumbError')}</span>
        </div>
        <div className="forum-loading">{error ?? t('forum.categoryNotFound')}</div>
      </main>
    );
  }

  return (
    <main className="forum-page">
      <div className="forum-crumbs">
        <a onClick={onBack}>{t('forum.crumbForum')}</a>
        <span className="forum-crumb-sep">/</span>
        <span className="forum-crumb-here">
          {t(`forum.categories.${category.slug}.name`, { defaultValue: category.name })}
        </span>
      </div>

      <div className="cat-banner" style={{ borderColor: category.color + '44' }}>
        <div className="cat-banner-icon" style={{ background: category.color + '22' }}>
          {category.icon}
        </div>
        <div className="cat-banner-info">
          <div className="cat-banner-title">
            {t(`forum.categories.${category.slug}.name`, { defaultValue: category.name })}
          </div>
          <div className="cat-banner-desc">
            {t(`forum.categories.${category.slug}.desc`, { defaultValue: category.description })}
          </div>
          <div className="cat-banner-stats">
            <span>
              <strong>{threads.length}</strong> {t('forum.bannerThreads')}
            </span>
          </div>
        </div>
        {canPost && (
          <button
            className="forum-btn forum-btn-primary"
            onClick={() => setShowComposer(!showComposer)}
          >
            {t('forum.newThread')}
          </button>
        )}
      </div>

      {restricted && !canPost && (
        <div className="forum-restricted-note">{t('forum.restrictedThreads')}</div>
      )}

      {showComposer && (
        <div className="forum-composer">
          <input
            className="forum-composer-title"
            placeholder={t('forum.threadTitlePlaceholder')}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="forum-composer-textarea"
            placeholder={t('forum.composerPlaceholder')}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="forum-composer-footer">
            <button className="forum-btn forum-btn-ghost" onClick={() => setShowComposer(false)}>
              {t('forum.cancel')}
            </button>
            <button
              className="forum-btn forum-btn-primary"
              onClick={handleCreateThread}
              disabled={posting || !newTitle.trim() || !newContent.trim()}
            >
              {posting ? t('forum.posting') : t('forum.createThread')}
            </button>
          </div>
        </div>
      )}

      <div className="thread-table">
        {threads.length === 0 ? (
          <div className="thread-empty">{t('forum.noThreads')}</div>
        ) : (
          threads.map((th) => (
            <div
              className={`thread-row${th.pinned ? ' pinned' : ''}`}
              key={th.id}
              onClick={() => onOpenThread(th.id)}
            >
              <div className="thread-marker">
                {th.pinned ? '📌' : th.locked ? '🔒' : th.solved ? '✓' : '●'}
              </div>
              <div className="thread-main">
                <div className="thread-title">
                  <span>{th.title}</span>
                  {th.solved && <span className="badge badge-solved">{t('forum.solved')}</span>}
                </div>
                <div className="thread-author">
                  {t('forum.by')}{' '}
                  <UserLink userId={th.authorId} className="author">
                    {th.authorName}
                  </UserLink>{' '}
                  <RoleBadge role={th.authorRole} /> · {timeAgo(th.createdAt)}
                </div>
              </div>
              <div className="thread-count">
                {th.replyCount}
                <small>{t('forum.replies')}</small>
              </div>
              <div className="thread-count">
                {th.views >= 1000 ? (th.views / 1000).toFixed(1) + 'k' : th.views}
                <small>{t('forum.views')}</small>
              </div>
              {th.lastPostAuthor && (
                <div className="thread-lastpost">
                  <span className="lp-user">{th.lastPostAuthor}</span>
                  <span className="lp-time">{th.lastPostAt ? timeAgo(th.lastPostAt) : ''}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

/* ==================== THREAD VIEW ==================== */

function ThreadView({
  threadId,
  onBack,
  onBackToCategory,
  isLoggedIn,
  user,
}: {
  threadId: number;
  onBack: () => void;
  onBackToCategory: () => void;
  isLoggedIn: boolean;
  user: AuthenticatedUser | null;
}) {
  const { t } = useTranslation();
  const [thread, setThread] = useState<ForumThreadDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadThread = useCallback(() => {
    forumService
      .getThread(threadId)
      .then((data) => {
        setThread(data);
        setLoading(false);
      })
      .catch(() => {
        setError(t('forum.loadThreadError'));
        setLoading(false);
      });
  }, [threadId, t]);

  useEffect(() => {
    let cancelled = false;
    forumService
      .getThread(threadId)
      .then((data) => {
        if (!cancelled) {
          setThread(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('forum.loadThreadError'));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [threadId, t]);

  const handleReply = async () => {
    if (!replyContent.trim() || !thread) return;
    setPosting(true);
    setActionError(null);
    try {
      await forumService.createPost(threadId, { content: replyContent.trim() });
      setReplyContent('');
      loadThread();
    } catch (err) {
      setActionError(errMsg(err));
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId: number, emoji: string) => {
    if (!isLoggedIn) return;
    setActionError(null);
    try {
      await forumService.toggleReaction(postId, { emoji });
      loadThread();
    } catch (err) {
      setActionError(errMsg(err));
    }
  };

  const handleMarkSolution = async (postId: number) => {
    setActionError(null);
    try {
      await forumService.markSolution(postId);
      loadThread();
    } catch (err) {
      setActionError(errMsg(err));
    }
  };

  const handleEditPost = async (postId: number, content: string) => {
    setActionError(null);
    try {
      await forumService.updatePost(postId, { content });
      loadThread();
    } catch (err) {
      setActionError(errMsg(err));
    }
  };

  const handleDeletePost = async (postId: number) => {
    setActionError(null);
    try {
      const res = await forumService.deletePost(postId);
      if (res.threadDeleted) onBack();
      else loadThread();
    } catch (err) {
      setActionError(errMsg(err));
    }
  };

  const handleDeleteThread = async () => {
    setActionError(null);
    try {
      await forumService.deleteThread(threadId);
      onBack();
    } catch (err) {
      setActionError(errMsg(err));
    }
  };

  const handleChangeRole = async (userId: number, role: UserRole) => {
    setActionError(null);
    try {
      await forumService.updateUserRole(userId, role);
      loadThread();
    } catch (err) {
      setActionError(errMsg(err));
    }
  };

  if (loading || (!thread && !error)) {
    return (
      <main className="forum-page">
        <div className="forum-loading">{t('forum.loadingThread')}</div>
      </main>
    );
  }

  if (error || !thread) {
    return (
      <main className="forum-page">
        <div className="forum-crumbs">
          <a onClick={onBack}>{t('forum.crumbForum')}</a>
          <span className="forum-crumb-sep">/</span>
          <span className="forum-crumb-here">{t('forum.crumbError')}</span>
        </div>
        <div className="forum-loading">{error ?? t('forum.threadNotFound')}</div>
      </main>
    );
  }

  const restricted = RESTRICTED_FORUM_CATEGORIES.has(thread.categorySlug);
  const canReply =
    isLoggedIn && !thread.locked && (!restricted || (user != null && user.role !== 'USER'));

  return (
    <main className="forum-page">
      <div className="forum-crumbs">
        <a onClick={onBack}>{t('forum.crumbForum')}</a>
        <span className="forum-crumb-sep">/</span>
        <a onClick={onBackToCategory}>
          {t(`forum.categories.${thread.categorySlug}.name`, { defaultValue: thread.categoryName })}
        </a>
        <span className="forum-crumb-sep">/</span>
        <span className="forum-crumb-here">{thread.title}</span>
      </div>

      <div className="thread-head">
        <div className="thread-head-info">
          <h1 className="thread-head-title">{thread.title}</h1>
          <div className="thread-head-meta">
            <span>
              {t('forum.startedBy')}{' '}
              <UserLink userId={thread.authorId}>
                <strong>{thread.authorName}</strong>
              </UserLink>
            </span>
            <RoleBadge role={thread.authorRole} />
            <span className="dot" />
            <span>
              {thread.posts.length} {t('forum.postsLower')}
            </span>
            <span className="dot" />
            <span>
              {thread.views} {t('forum.viewsLower')}
            </span>
            {thread.solved && (
              <>
                <span className="dot" />
                <span className="badge badge-solved">{t('forum.solved')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {actionError && (
        <div className="forum-restricted-note forum-action-error" role="alert">
          {actionError}
        </div>
      )}

      {thread.posts.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          isOp={i === 0}
          canMarkSolution={user != null && user.id === thread.authorId && i > 0}
          currentUser={user}
          onReaction={(emoji) => handleReaction(post.id, emoji)}
          onMarkSolution={() => handleMarkSolution(post.id)}
          onEdit={(content) => handleEditPost(post.id, content)}
          onDelete={() => (i === 0 ? handleDeleteThread() : handleDeletePost(post.id))}
          onChangeRole={(role) => handleChangeRole(post.authorId, role)}
        />
      ))}

      {canReply && (
        <div className="forum-composer">
          <div className="forum-composer-head">{t('forum.postReply')}</div>
          <textarea
            className="forum-composer-textarea"
            placeholder={t('forum.replyPlaceholder')}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="forum-composer-footer">
            <span className="forum-composer-hint">{t('forum.markdownSupported')}</span>
            <button
              className="forum-btn forum-btn-primary"
              onClick={handleReply}
              disabled={posting || !replyContent.trim()}
            >
              {posting ? t('forum.posting') : t('forum.postReplyBtn')}
            </button>
          </div>
        </div>
      )}

      {restricted && isLoggedIn && !canReply && !thread.locked && (
        <div className="forum-restricted-note">{t('forum.restrictedReply')}</div>
      )}

      {thread.locked && <div className="thread-locked-banner">{t('forum.locked')}</div>}
    </main>
  );
}

/* ==================== POST CARD ==================== */

function PostCard({
  post,
  isOp,
  canMarkSolution,
  currentUser,
  onReaction,
  onMarkSolution,
  onEdit,
  onDelete,
  onChangeRole,
}: {
  post: ForumPostDTO;
  isOp: boolean;
  canMarkSolution: boolean;
  currentUser: AuthenticatedUser | null;
  onReaction: (emoji: string) => void;
  onMarkSolution: () => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
  onChangeRole: (role: UserRole) => void;
}) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isOwner = currentUser != null && currentUser.id === post.authorId;
  const canManage = currentUser != null && canModerate(currentUser.role, post.authorRole, isOwner);
  const isFounder = currentUser?.role === 'FOUNDER';
  // Founder manages anyone (bar the founder); a plain admin only USER<->MODERATOR.
  const canChangeRole =
    currentUser != null &&
    !isOwner &&
    post.authorRole !== 'FOUNDER' &&
    (isFounder || (isAdmin(currentUser.role) && post.authorRole !== 'ADMIN'));

  const saveEdit = () => {
    if (!draft.trim()) return;
    onEdit(draft.trim());
    setEditing(false);
  };

  if (post.deleted) {
    return (
      <div className={`forum-post deleted${isOp ? ' op' : ''}`}>
        <div className="post-sidebar">
          <UserLink userId={post.authorId}>
            {post.authorAvatarUrl ? (
              <img src={post.authorAvatarUrl} alt="" className="post-avatar" />
            ) : (
              <div className="post-avatar">{post.authorName.charAt(0).toUpperCase()}</div>
            )}
          </UserLink>
          <UserLink userId={post.authorId}>
            <div className="post-username">{post.authorName}</div>
          </UserLink>
        </div>
        <div className="post-body">
          <div className="post-deleted-banner">
            <span>🗑</span>
            <span>
              {t('forum.deletedBy')} <strong>{post.deletedByName}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`forum-post${isOp ? ' op' : ''}`}>
      <div className="post-sidebar">
        <UserLink userId={post.authorId}>
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt=""
              className={`post-avatar${isOp ? ' op-avatar' : ''}`}
            />
          ) : (
            <div className={`post-avatar${isOp ? ' op-avatar' : ''}`}>
              {post.authorName.charAt(0).toUpperCase()}
            </div>
          )}
        </UserLink>
        <UserLink userId={post.authorId}>
          <div className="post-username">{post.authorName}</div>
        </UserLink>
        <RoleBadge role={post.authorRole} />
        {canChangeRole && (
          <select
            className="role-select"
            value={post.authorRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            title={t('forum.changeRole')}
          >
            <option value="USER">{t('forum.roles.USER')}</option>
            <option value="MODERATOR">{t('forum.roles.MODERATOR')}</option>
            {isFounder && <option value="ADMIN">{t('forum.roles.ADMIN')}</option>}
          </select>
        )}
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span className="post-time">{timeAgo(post.createdAt)}</span>
          {post.editedByName && (
            <span className="post-edited">{t('forum.editedBy', { name: post.editedByName })}</span>
          )}
        </div>
        {post.solution && (
          <div className="solution-banner">
            <span className="check">✓</span>
            <span>{t('forum.solutionBanner')}</span>
          </div>
        )}
        {editing ? (
          <div className="post-edit">
            <textarea
              className="forum-composer-textarea"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="post-edit-actions">
              <button
                className="forum-btn forum-btn-ghost"
                onClick={() => {
                  setEditing(false);
                  setDraft(post.content);
                }}
              >
                {t('forum.cancel')}
              </button>
              <button
                className="forum-btn forum-btn-primary"
                onClick={saveEdit}
                disabled={!draft.trim()}
              >
                {t('forum.save')}
              </button>
            </div>
          </div>
        ) : (
          <div className="post-content">
            <ForumPostContent content={post.content} />
          </div>
        )}
        <div className="post-footer">
          <div className="reactions">
            {post.reactions.map((r) => (
              <button
                key={r.emoji}
                className={`reaction${r.active ? ' active' : ''}`}
                onClick={() => onReaction(r.emoji)}
                title={r.users.join(', ')}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
            <div className="reaction-picker-wrap">
              <button
                className="reaction reaction-add"
                onClick={() => setPickerOpen((o) => !o)}
                title={t('forum.addReaction')}
              >
                +
              </button>
              {pickerOpen && (
                <>
                  <div className="reaction-picker-backdrop" onClick={() => setPickerOpen(false)} />
                  <div className="reaction-picker">
                    {REACTION_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        className="reaction-picker-emoji"
                        onClick={() => {
                          onReaction(emoji);
                          setPickerOpen(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="post-buttons">
            {canMarkSolution && !post.solution && (
              <button className="post-btn solution-btn" onClick={onMarkSolution}>
                {t('forum.markSolution')}
              </button>
            )}
            {canMarkSolution && post.solution && (
              <button className="post-btn solution-btn" onClick={onMarkSolution}>
                {t('forum.unmarkSolution')}
              </button>
            )}
            {canManage && !editing && (
              <button className="post-btn" onClick={() => setEditing(true)}>
                {t('forum.edit')}
              </button>
            )}
            {canManage && (
              <button
                className="post-btn post-btn-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      isOp ? t('forum.confirmDeleteThread') : t('forum.confirmDeletePost'),
                    )
                  ) {
                    onDelete();
                  }
                }}
              >
                {isOp ? t('forum.deleteThread') : `🗑 ${t('forum.delete')}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
