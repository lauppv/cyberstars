import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../ui/Avatar';
import i18next from 'i18next';
import { useMessages } from '../../context/MessagesContext';
import { useUserSocketFrames } from '../../context/UserSocketContext';
import { MessageComposer } from './MessageComposer';
import { MessageActions } from './MessageActions';
import { UserLink } from '../ui/UserLink';
import * as messagesService from '../../services/messagesService';
import type { ConversationDTO, MessageDTO, MessageReactionDTO } from '../../../shared/messages';
import type { UserSocketFrame } from '../../../shared/notifications';

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(i18next.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Day + time for the message's timestamp line (e.g. "22 iul. 14:32").
function dateTimeLabel(iso: string): string {
  return new Date(iso).toLocaleString(i18next.language, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// The server ships raw per-user rows; group them per emoji here so `active`
// reflects the viewing user without per-viewer shaping server-side.
function groupReactions(reactions: MessageReactionDTO[], currentUserId: number) {
  const groups = new Map<string, { count: number; active: boolean }>();
  for (const r of reactions) {
    const g = groups.get(r.emoji) ?? { count: 0, active: false };
    g.count += 1;
    if (r.userId === currentUserId) g.active = true;
    groups.set(r.emoji, g);
  }
  return Array.from(groups, ([emoji, g]) => ({ emoji, ...g }));
}

export function MessageThread({
  conversation,
  currentUserId,
  onBack,
}: {
  conversation: ConversationDTO;
  currentUserId: number;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const { setActiveConversation, markConversationRead } = useMessages();
  const conversationId = conversation.id;

  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  // The message being edited inline, plus its working draft. null = not editing.
  const [editing, setEditing] = useState<{ id: number; draft: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Scroll height before a load-older prepend, so the effect below can restore
  // the reading position instead of jumping to the bottom.
  const prependRef = useRef<{ height: number; top: number } | null>(null);
  // Newest unseen message id while the tab is hidden; flushed on visibility.
  const pendingReadRef = useRef<number | null>(null);

  // Mark everything up to the newest message read (server + inbox badge). If
  // the tab is hidden the user hasn't actually seen it — defer until visible so
  // read receipts aren't sent for a background tab.
  const markReadUpTo = useCallback(
    (upToMessageId: number) => {
      if (document.visibilityState !== 'visible') {
        pendingReadRef.current = Math.max(pendingReadRef.current ?? 0, upToMessageId);
        return;
      }
      messagesService.markRead(conversationId, upToMessageId).catch(() => {});
      markConversationRead(conversationId);
    },
    [conversationId, markConversationRead],
  );

  useEffect(() => {
    const flush = () => {
      const pending = pendingReadRef.current;
      if (document.visibilityState === 'visible' && pending != null) {
        pendingReadRef.current = null;
        markReadUpTo(pending);
      }
    };
    document.addEventListener('visibilitychange', flush);
    return () => document.removeEventListener('visibilitychange', flush);
  }, [markReadUpTo]);

  // Load history whenever the open conversation changes.
  useEffect(() => {
    setActiveConversation(conversationId);
    let cancelled = false;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    messagesService
      .getHistory(conversationId)
      .then((res) => {
        if (cancelled) return;
        const asc = [...res.messages].reverse();
        setMessages(asc);
        setHasMore(res.hasMore);
        const newest = asc[asc.length - 1];
        if (newest) markReadUpTo(newest.id);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      pendingReadRef.current = null; // a deferred read must not leak across conversations
      setActiveConversation(null);
    };
  }, [conversationId, setActiveConversation, markReadUpTo]);

  // Live frames for this conversation.
  const onFrame = useCallback(
    (frame: UserSocketFrame) => {
      if (frame.channel !== 'dm') return;
      if (frame.type === 'message' && frame.payload.conversationId === conversationId) {
        const msg = frame.payload;
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        if (msg.senderId !== currentUserId) markReadUpTo(msg.id);
      } else if (
        (frame.type === 'edited' || frame.type === 'deleted') &&
        frame.payload.conversationId === conversationId
      ) {
        const msg = frame.payload;
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
      } else if (frame.type === 'reaction' && frame.payload.conversationId === conversationId) {
        const { messageId, reactions } = frame.payload;
        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)));
      } else if (frame.type === 'read' && frame.payload.conversationId === conversationId) {
        // Only the *other* participant's read marks my messages as seen — the
        // frame is also echoed to my own tabs (to sync the inbox badge), and
        // applying that echo here would fake read receipts.
        if (frame.payload.readerId === currentUserId) return;
        const upTo = frame.payload.upToMessageId;
        const at = new Date().toISOString();
        setMessages((prev) =>
          prev.map((m) =>
            m.senderId === currentUserId && !m.readAt && m.id <= upTo ? { ...m, readAt: at } : m,
          ),
        );
      }
    },
    [conversationId, currentUserId, markReadUpTo],
  );
  useUserSocketFrames(onFrame);

  // Keep the view pinned to the newest message — except after a load-older
  // prepend, where the reading position is restored instead.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prepend = prependRef.current;
    if (prepend) {
      prependRef.current = null;
      el.scrollTop = prepend.top + (el.scrollHeight - prepend.height);
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const loadOlder = useCallback(() => {
    const oldest = messages[0]?.id;
    if (oldest == null) return;
    messagesService
      .getHistory(conversationId, 30, oldest)
      .then((res) => {
        const el = scrollRef.current;
        if (el) prependRef.current = { height: el.scrollHeight, top: el.scrollTop };
        setMessages((prev) => [...[...res.messages].reverse(), ...prev]);
        setHasMore(res.hasMore);
      })
      .catch(() => {});
  }, [conversationId, messages]);

  const send = useCallback(
    async (content: string) => {
      const { message } = await messagesService.sendMessage(conversationId, content);
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
    },
    [conversationId],
  );

  const saveEdit = useCallback(() => {
    if (!editing) return;
    const { id, draft } = editing;
    const content = draft.trim();
    const current = messages.find((m) => m.id === id);
    // Nothing to save on an empty draft; an unchanged draft just closes the
    // editor without a needless request (and without stamping editedAt).
    if (!content || content === current?.content) {
      setEditing(null);
      return;
    }
    messagesService
      .editMessage(id, content)
      .then(({ message }) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
      })
      .catch(() => {})
      .finally(() => setEditing(null));
  }, [editing, messages]);

  const remove = useCallback((id: number) => {
    messagesService
      .deleteMessage(id)
      .then(({ message }) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
      })
      .catch(() => {});
  }, []);

  const react = useCallback((messageId: number, emoji: string) => {
    messagesService
      .toggleReaction(messageId, emoji)
      .then(({ message }) => {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? message : m)));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ paddingBottom: 'var(--radio-clearance, 0px)' }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] flex-shrink-0">
        <button
          onClick={onBack}
          className="md:hidden text-[var(--text3)] hover:text-[var(--text)] bg-transparent border-none cursor-pointer text-[16px]"
          aria-label={t('messages.back')}
        >
          ←
        </button>
        <UserLink userId={conversation.other.id} className="flex items-center gap-3 min-w-0">
          <Avatar url={conversation.other.avatarUrl} name={conversation.other.name} size={32} />
          <span className="font-semibold text-[14px] text-[var(--text)] truncate">
            {conversation.other.name}
          </span>
        </UserLink>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {loading ? (
          <div className="text-center text-[13px] text-[var(--text3)] py-8">…</div>
        ) : (
          <>
            {hasMore && (
              <button
                onClick={loadOlder}
                className="self-center text-[12px] font-medium text-[var(--accent)] hover:brightness-125 transition cursor-pointer bg-transparent border-none mb-1"
              >
                {t('messages.loadOlder')}
              </button>
            )}
            {messages.map((m) => {
              const mine = m.senderId === currentUserId;
              return (
                <div
                  key={m.id}
                  className={`group max-w-[75%] flex flex-col ${mine ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  {editing?.id === m.id ? (
                    <div className="flex flex-col gap-1 items-end w-full">
                      <textarea
                        autoFocus
                        value={editing.draft}
                        onChange={(e) => setEditing({ id: m.id, draft: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            saveEdit();
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            setEditing(null);
                          }
                        }}
                        rows={1}
                        maxLength={2000}
                        className="w-full resize-none max-h-32 min-h-[38px] px-3 py-2 rounded-[var(--radius)] bg-[var(--glass)] border border-[var(--border)] text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/60"
                      />
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text3)]">
                        <span>{t('messages.editHint')}</span>
                        <button
                          onClick={() => setEditing(null)}
                          className="hover:text-[var(--text)] bg-transparent border-none cursor-pointer"
                        >
                          {t('messages.cancel')}
                        </button>
                        <button
                          onClick={saveEdit}
                          className="text-[var(--accent)] hover:brightness-125 bg-transparent border-none cursor-pointer font-semibold"
                        >
                          {t('messages.save')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1 max-w-full ${mine ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`px-3 py-2 rounded-[var(--radius)] text-[13px] leading-snug whitespace-pre-wrap break-words min-w-0 ${
                          mine
                            ? 'bg-[var(--accent)]/25 border border-[var(--accent)]/40 text-[var(--text)]'
                            : 'bg-[var(--glass)] border border-[var(--border)] text-[var(--text)]'
                        } ${m.deleted ? 'italic text-[var(--text3)]' : ''}`}
                      >
                        {m.deleted ? t('messages.deletedMessage') : m.content}
                      </div>
                      {!m.deleted && (
                        <MessageActions
                          align={mine ? 'left' : 'right'}
                          canModify={mine}
                          onReact={(emoji) => react(m.id, emoji)}
                          onEdit={() => setEditing({ id: m.id, draft: m.content })}
                          onDelete={() => remove(m.id)}
                        />
                      )}
                    </div>
                  )}
                  {!m.deleted && m.reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${mine ? 'justify-end' : ''}`}>
                      {groupReactions(m.reactions, currentUserId).map((g) => (
                        <button
                          key={g.emoji}
                          onClick={() => react(m.id, g.emoji)}
                          aria-pressed={g.active}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[12px] leading-none border transition cursor-pointer ${
                            g.active
                              ? 'bg-[var(--accent)]/25 border-[var(--accent)]/50'
                              : 'bg-[var(--glass)] border-[var(--border)] hover:bg-[var(--accent)]/15'
                          }`}
                        >
                          <span>{g.emoji}</span>
                          {g.count > 1 && (
                            <span className="text-[10px] text-[var(--text3)] tabular-nums">
                              {g.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {editing?.id !== m.id && (
                    <div
                      className={`flex items-center gap-2 mt-0.5 px-1 ${mine ? 'justify-end' : ''}`}
                    >
                      <span className="text-[10px] text-[var(--text3)] tabular-nums">
                        {dateTimeLabel(m.createdAt)}
                      </span>
                      {!m.deleted && m.editedAt && (
                        <span
                          className="text-[10px] text-[var(--text3)] italic tabular-nums"
                          title={t('messages.edited', { time: timeLabel(m.editedAt) })}
                        >
                          {t('messages.edited', { time: timeLabel(m.editedAt) })}
                        </span>
                      )}
                      {mine && !m.deleted && (
                        <span className="text-[10px] text-[var(--text3)]">
                          {m.readAt ? t('messages.seen') : t('messages.sent')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <MessageComposer onSend={send} />
    </div>
  );
}
