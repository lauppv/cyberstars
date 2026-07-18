import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useMessages } from '../../context/MessagesContext';
import { useUserSocketFrames } from '../../context/UserSocketContext';
import { MessageComposer } from './MessageComposer';
import * as messagesService from '../../services/messagesService';
import type { ConversationDTO, MessageDTO } from '../../../shared/messages';
import type { UserSocketFrame } from '../../../shared/notifications';

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(i18next.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
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
      } else if (frame.type === 'deleted' && frame.payload.conversationId === conversationId) {
        const msg = frame.payload;
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
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

  const remove = useCallback((id: number) => {
    messagesService
      .deleteMessage(id)
      .then(({ message }) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--accent)]/20 flex-shrink-0">
        <button
          onClick={onBack}
          className="md:hidden text-[var(--text3)] hover:text-[var(--text)] bg-transparent border-none cursor-pointer text-[16px]"
          aria-label={t('messages.back')}
        >
          ←
        </button>
        {conversation.other.avatarUrl ? (
          <img
            src={conversation.other.avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover border-2 border-[var(--accent)]/50"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--surface2)] flex items-center justify-center text-sm border-2 border-[var(--accent)]/50">
            🚀
          </div>
        )}
        <span className="font-semibold text-[14px] text-[var(--text)] truncate">
          {conversation.other.name}
        </span>
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
                  <div
                    className={`px-3 py-2 rounded-[var(--radius)] text-[13px] leading-snug whitespace-pre-wrap break-words ${
                      mine
                        ? 'bg-[var(--accent)]/25 border border-[var(--accent)]/40 text-[var(--text)]'
                        : 'bg-[rgba(22,22,29,0.4)] border border-[var(--accent)]/20 text-[var(--text)]'
                    } ${m.deleted ? 'italic text-[var(--text3)]' : ''}`}
                  >
                    {m.deleted ? t('messages.deletedMessage') : m.content}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 px-1">
                    <span className="text-[10px] text-[var(--text3)] tabular-nums">
                      {timeLabel(m.createdAt)}
                    </span>
                    {mine && !m.deleted && (
                      <>
                        <span className="text-[10px] text-[var(--text3)]">
                          {m.readAt ? t('messages.read') : t('messages.sent')}
                        </span>
                        <button
                          onClick={() => remove(m.id)}
                          className="text-[10px] text-[var(--text3)] opacity-0 group-hover:opacity-100 hover:text-[var(--error)] transition bg-transparent border-none cursor-pointer"
                        >
                          {t('messages.delete')}
                        </button>
                      </>
                    )}
                  </div>
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
