import { useState, useEffect, useCallback } from "react";
import { Topbar } from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import * as forumService from "../services/forumService";
import type {
  ForumCategoryDTO,
  ForumThreadSummaryDTO,
  ForumThreadDetailDTO,
  ForumPostDTO,
  ForumReactionGroupDTO,
} from "../../shared/forum";
import type { AuthenticatedUser, UserRole } from "../../shared/auth";
import "./ForumPage.css";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** Categories where only moderators and admins may start threads or reply. */
const RESTRICTED_CATEGORIES = new Set(["announcements"]);

const ROLE_META: Record<UserRole, { label: string; cls: string }> = {
  ADMIN: { label: "Admin", cls: "role-admin" },
  MODERATOR: { label: "Moderator", cls: "role-mod" },
  USER: { label: "User", cls: "role-user" },
};

function RoleBadge({ role }: { role: UserRole }) {
  const meta = ROLE_META[role];
  return <span className={`role-badge ${meta.cls}`}>{meta.label}</span>;
}

/** Mirror of the server-side permission rule (server is authoritative). */
function canModerate(actorRole: UserRole, targetRole: UserRole, isOwner: boolean): boolean {
  if (actorRole === "ADMIN") return true;
  if (actorRole === "MODERATOR") return isOwner || targetRole === "USER";
  return isOwner;
}

type View = "index" | "category" | "thread";

export function ForumPage() {
  const { isLoggedIn, user } = useAuth();
  const [view, setView] = useState<View>("index");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<number | null>(null);

  const openCategory = (slug: string) => {
    setCategorySlug(slug);
    setView("category");
    window.scrollTo(0, 0);
  };
  const openThread = (id: number) => {
    setThreadId(id);
    setView("thread");
    window.scrollTo(0, 0);
  };
  const backToIndex = () => {
    setView("index");
    window.scrollTo(0, 0);
  };
  const backToCategory = () => {
    setView("category");
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Topbar />
      {view === "index" && (
        <ForumIndex onOpenCategory={openCategory} isLoggedIn={isLoggedIn} onNewThread={() => {}} />
      )}
      {view === "category" && categorySlug && (
        <CategoryView
          categorySlug={categorySlug}
          onBack={backToIndex}
          onOpenThread={openThread}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}
      {view === "thread" && threadId && (
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
  isLoggedIn,
  onNewThread,
}: {
  onOpenCategory: (slug: string) => void;
  isLoggedIn: boolean;
  onNewThread: () => void;
}) {
  const [categories, setCategories] = useState<ForumCategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    forumService.getCategories().then((cats) => {
      if (!cancelled) { setCategories(cats); setLoading(false); }
    }).catch(() => {
      if (!cancelled) { setError("Failed to load forum categories."); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  const groups = categories.reduce<Record<string, ForumCategoryDTO[]>>((acc, cat) => {
    (acc[cat.groupName] ??= []).push(cat);
    return acc;
  }, {});

  const totalThreads = categories.reduce((s, c) => s + c.threadCount, 0);
  const totalPosts = categories.reduce((s, c) => s + c.postCount, 0);

  if (loading) {
    return (
      <main className="forum-page">
        <div className="forum-loading">Loading forum...</div>
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
          <p className="forum-page-subtitle">
            Ask, share, and hang out with other CyberStars. Be kind, search before posting, and have
            fun.
          </p>
        </div>
        {isLoggedIn && (
          <button className="forum-btn forum-btn-primary" onClick={onNewThread}>
            + New Thread
          </button>
        )}
      </div>

      <div className="forum-stats">
        <div className="fs-item">
          <div className="fs-value">{totalThreads.toLocaleString()}</div>
          <div className="fs-label">Threads</div>
        </div>
        <div className="fs-item">
          <div className="fs-value">{totalPosts.toLocaleString()}</div>
          <div className="fs-label">Posts</div>
        </div>
        <div className="fs-item">
          <div className="fs-value">{categories.length}</div>
          <div className="fs-label">Categories</div>
        </div>
      </div>

      <div className="forum-content">
        <div>
          {Object.entries(groups).map(([groupName, cats]) => (
            <div className="forum-group" key={groupName}>
              <div className="forum-group-header">
                <div className="forum-group-title">{groupName}</div>
                <div className="forum-group-line" />
              </div>
              <div className="cat-table">
                {cats.map((c) => (
                  <div className="cat-row" key={c.slug} onClick={() => onOpenCategory(c.slug)}>
                    <div className="cat-main">
                      <div
                        className="cat-icon"
                        style={{ background: c.color + "22" }}
                      >
                        {c.icon}
                      </div>
                      <div className="cat-info">
                        <div className="cat-name">{c.name}</div>
                        <div className="cat-desc">{c.description}</div>
                      </div>
                    </div>
                    <div className="cat-counts">
                      <strong>{c.threadCount.toLocaleString()}</strong>
                      <span>threads</span>
                      <span>{c.postCount.toLocaleString()} posts</span>
                    </div>
                    {c.lastPost && (
                      <div className="cat-lastpost">
                        <div className="lp-info">
                          <div className="lp-title">{c.lastPost.threadTitle}</div>
                          <div className="lp-meta">
                            by <span className="lp-user">{c.lastPost.authorName}</span> ·{" "}
                            {timeAgo(c.lastPost.createdAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ==================== CATEGORY VIEW ==================== */

function CategoryView({
  categorySlug,
  onBack,
  onOpenThread,
  isLoggedIn,
  user,
}: {
  categorySlug: string;
  onBack: () => void;
  onOpenThread: (id: number) => void;
  isLoggedIn: boolean;
  user: AuthenticatedUser | null;
}) {
  const restricted = RESTRICTED_CATEGORIES.has(categorySlug);
  const canPost = isLoggedIn && (!restricted || (user != null && user.role !== "USER"));
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
  const [showComposer, setShowComposer] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    forumService.getThreads(categorySlug).then((data) => {
      if (!cancelled) { setCategory(data.category); setThreads(data.threads); setLoading(false); }
    }).catch(() => {
      if (!cancelled) { setError("Failed to load threads."); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [categorySlug]);

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
      setNewTitle("");
      setNewContent("");
      onOpenThread(threadId);
    } finally {
      setPosting(false);
    }
  };

  if (loading || (!category && !error)) {
    return (
      <main className="forum-page">
        <div className="forum-loading">Loading threads...</div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="forum-page">
        <div className="forum-crumbs">
          <a onClick={onBack}>Forum</a>
          <span className="forum-crumb-sep">/</span>
          <span className="forum-crumb-here">Error</span>
        </div>
        <div className="forum-loading">{error ?? "Category not found."}</div>
      </main>
    );
  }

  return (
    <main className="forum-page">
      <div className="forum-crumbs">
        <a onClick={onBack}>Forum</a>
        <span className="forum-crumb-sep">/</span>
        <span className="forum-crumb-here">{category.name}</span>
      </div>

      <div className="cat-banner" style={{ borderColor: category.color + "44" }}>
        <div
          className="cat-banner-icon"
          style={{ background: category.color + "22" }}
        >
          {category.icon}
        </div>
        <div className="cat-banner-info">
          <div className="cat-banner-title">{category.name}</div>
          <div className="cat-banner-desc">{category.description}</div>
          <div className="cat-banner-stats">
            <span>
              <strong>{threads.length}</strong> threads
            </span>
          </div>
        </div>
        {canPost && (
          <button
            className="forum-btn forum-btn-primary"
            onClick={() => setShowComposer(!showComposer)}
          >
            + New Thread
          </button>
        )}
      </div>

      {restricted && !canPost && (
        <div className="forum-restricted-note">
          🔒 Only moderators and admins can start threads in this category.
        </div>
      )}

      {showComposer && (
        <div className="forum-composer">
          <input
            className="forum-composer-title"
            placeholder="Thread title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="forum-composer-textarea"
            placeholder="Write your post... Markdown supported."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="forum-composer-footer">
            <button className="forum-btn forum-btn-ghost" onClick={() => setShowComposer(false)}>
              Cancel
            </button>
            <button
              className="forum-btn forum-btn-primary"
              onClick={handleCreateThread}
              disabled={posting || !newTitle.trim() || !newContent.trim()}
            >
              {posting ? "Posting..." : "Create Thread"}
            </button>
          </div>
        </div>
      )}

      <div className="thread-table">
        {threads.length === 0 ? (
          <div className="thread-empty">No threads yet. Be the first to post!</div>
        ) : (
          threads.map((t) => (
            <div
              className={`thread-row${t.pinned ? " pinned" : ""}`}
              key={t.id}
              onClick={() => onOpenThread(t.id)}
            >
              <div className="thread-marker">
                {t.pinned ? "📌" : t.locked ? "🔒" : t.solved ? "✓" : "●"}
              </div>
              <div className="thread-main">
                <div className="thread-title">
                  <span>{t.title}</span>
                  {t.solved && <span className="badge badge-solved">✓ Solved</span>}
                </div>
                <div className="thread-author">
                  by <span className="author">{t.authorName}</span>{" "}
                  <RoleBadge role={t.authorRole} /> · {timeAgo(t.createdAt)}
                </div>
              </div>
              <div className="thread-count">
                {t.replyCount}
                <small>replies</small>
              </div>
              <div className="thread-count">
                {t.views >= 1000 ? (t.views / 1000).toFixed(1) + "k" : t.views}
                <small>views</small>
              </div>
              {t.lastPostAuthor && (
                <div className="thread-lastpost">
                  <span className="lp-user">{t.lastPostAuthor}</span>
                  <span className="lp-time">{t.lastPostAt ? timeAgo(t.lastPostAt) : ""}</span>
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
  const [thread, setThread] = useState<ForumThreadDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [posting, setPosting] = useState(false);

  const loadThread = useCallback(() => {
    forumService.getThread(threadId).then((data) => {
      setThread(data);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load thread.");
      setLoading(false);
    });
  }, [threadId]);

  useEffect(() => {
    let cancelled = false;
    forumService.getThread(threadId).then((data) => {
      if (!cancelled) { setThread(data); setLoading(false); }
    }).catch(() => {
      if (!cancelled) { setError("Failed to load thread."); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [threadId]);

  const handleReply = async () => {
    if (!replyContent.trim() || !thread) return;
    setPosting(true);
    try {
      await forumService.createPost(threadId, { content: replyContent.trim() });
      setReplyContent("");
      loadThread();
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId: number, emoji: string) => {
    if (!isLoggedIn) return;
    await forumService.toggleReaction(postId, { emoji });
    loadThread();
  };

  const handleMarkSolution = async (postId: number) => {
    await forumService.markSolution(postId);
    loadThread();
  };

  const handleEditPost = async (postId: number, content: string) => {
    await forumService.updatePost(postId, { content });
    loadThread();
  };

  const handleDeletePost = async (postId: number) => {
    const res = await forumService.deletePost(postId);
    if (res.threadDeleted) onBack();
    else loadThread();
  };

  const handleDeleteThread = async () => {
    await forumService.deleteThread(threadId);
    onBack();
  };

  const handleChangeRole = async (userId: number, role: UserRole) => {
    await forumService.updateUserRole(userId, role);
    loadThread();
  };

  if (loading || (!thread && !error)) {
    return (
      <main className="forum-page">
        <div className="forum-loading">Loading thread...</div>
      </main>
    );
  }

  if (error || !thread) {
    return (
      <main className="forum-page">
        <div className="forum-crumbs">
          <a onClick={onBack}>Forum</a>
          <span className="forum-crumb-sep">/</span>
          <span className="forum-crumb-here">Error</span>
        </div>
        <div className="forum-loading">{error ?? "Thread not found."}</div>
      </main>
    );
  }

  const restricted = RESTRICTED_CATEGORIES.has(thread.categorySlug);
  const canReply =
    isLoggedIn && !thread.locked && (!restricted || (user != null && user.role !== "USER"));

  return (
    <main className="forum-page">
      <div className="forum-crumbs">
        <a onClick={onBack}>Forum</a>
        <span className="forum-crumb-sep">/</span>
        <a onClick={onBackToCategory}>{thread.categoryName}</a>
        <span className="forum-crumb-sep">/</span>
        <span className="forum-crumb-here">{thread.title}</span>
      </div>

      <div className="thread-head">
        <div className="thread-head-info">
          <h1 className="thread-head-title">{thread.title}</h1>
          <div className="thread-head-meta">
            <span>
              started by <strong>{thread.authorName}</strong>
            </span>
            <RoleBadge role={thread.authorRole} />
            <span className="dot" />
            <span>{thread.posts.length} posts</span>
            <span className="dot" />
            <span>{thread.views} views</span>
            {thread.solved && (
              <>
                <span className="dot" />
                <span className="badge badge-solved">✓ Solved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {thread.posts.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          isOp={i === 0}
          canMarkSolution={isLoggedIn && !thread.solved && i > 0}
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
          <div className="forum-composer-head">Post a reply</div>
          <textarea
            className="forum-composer-textarea"
            placeholder="Type your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="forum-composer-footer">
            <span className="forum-composer-hint">Markdown supported</span>
            <button
              className="forum-btn forum-btn-primary"
              onClick={handleReply}
              disabled={posting || !replyContent.trim()}
            >
              {posting ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </div>
      )}

      {restricted && isLoggedIn && !canReply && !thread.locked && (
        <div className="forum-restricted-note">
          🔒 Only moderators and admins can reply in this category.
        </div>
      )}

      {thread.locked && (
        <div className="thread-locked-banner">🔒 This thread is locked. No new replies.</div>
      )}
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
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);

  const isOwner = currentUser != null && currentUser.id === post.authorId;
  const canManage =
    currentUser != null && canModerate(currentUser.role, post.authorRole, isOwner);
  const isAdmin = currentUser?.role === "ADMIN";

  const saveEdit = () => {
    if (!draft.trim()) return;
    onEdit(draft.trim());
    setEditing(false);
  };

  if (post.deleted) {
    return (
      <div className={`forum-post deleted${isOp ? " op" : ""}`}>
        <div className="post-sidebar">
          <div className="post-avatar">
            {post.authorName.charAt(0).toUpperCase()}
          </div>
          <div className="post-username">{post.authorName}</div>
        </div>
        <div className="post-body">
          <div className="post-deleted-banner">
            <span>🗑</span>
            <span>This post was deleted by <strong>{post.deletedByName}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`forum-post${isOp ? " op" : ""}`}>
      <div className="post-sidebar">
        <div className={`post-avatar${isOp ? " op-avatar" : ""}`}>
          {post.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="post-username">{post.authorName}</div>
        <RoleBadge role={post.authorRole} />
        {isAdmin && !isOwner && (
          <select
            className="role-select"
            value={post.authorRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            title="Change this member's role"
          >
            <option value="USER">User</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span className="post-time">{timeAgo(post.createdAt)}</span>
          {post.editedByName && (
            <span className="post-edited">edited by {post.editedByName}</span>
          )}
        </div>
        {post.solution && (
          <div className="solution-banner">
            <span className="check">✓</span>
            <span>Marked as solution — this answer solved the question</span>
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
                Cancel
              </button>
              <button
                className="forum-btn forum-btn-primary"
                onClick={saveEdit}
                disabled={!draft.trim()}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="post-content">{post.content}</div>
        )}
        <div className="post-footer">
          <div className="reactions">
            {post.reactions.map((r) => (
              <button
                key={r.emoji}
                className={`reaction${r.active ? " active" : ""}`}
                onClick={() => onReaction(r.emoji)}
                title={r.users.join(", ")}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
            <button className="reaction reaction-add" onClick={() => onReaction("👍")}>
              +
            </button>
          </div>
          <div className="post-buttons">
            {canMarkSolution && !post.solution && (
              <button className="post-btn solution-btn" onClick={onMarkSolution}>
                ✓ Mark as solution
              </button>
            )}
            {canManage && !editing && (
              <button className="post-btn" onClick={() => setEditing(true)}>
                ✎ Edit
              </button>
            )}
            {canManage && (
              <button
                className="post-btn post-btn-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      isOp ? "Delete this entire thread?" : "Delete this post?"
                    )
                  ) {
                    onDelete();
                  }
                }}
              >
                🗑 {isOp ? "Delete thread" : "Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
