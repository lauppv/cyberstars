import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '../../shared/features';
import { useUserSocketFrames } from './UserSocketContext';
import * as messagesService from '../services/messagesService';
import type { ConversationDTO, MessageDTO } from '../../shared/messages';
import type { UserSocketFrame } from '../../shared/notifications';

interface MessagesContextValue {
  enabled: boolean;
  conversations: ConversationDTO[];
  totalUnread: number;
  loading: boolean;
  refresh: () => void;
  openWith: (recipientId: number) => Promise<ConversationDTO>;
  // The page marks which conversation is on screen so incoming messages for it
  // don't inflate the unread badge (they're being read live).
  setActiveConversation: (id: number | null) => void;
  markConversationRead: (id: number) => void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const enabled = isLoggedIn && canAccessFeature('messaging', user?.role, import.meta.env.PROD);

  const [conversations, setConversations] = useState<ConversationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const activeRef = useRef<number | null>(null);
  // Mirror of the known conversation ids, so a socket frame can decide whether a
  // conversation is new (→ refetch) without an impure read inside a state updater.
  const knownIds = useRef<Set<number>>(new Set());
  useEffect(() => {
    knownIds.current = new Set(conversations.map((c) => c.id));
  }, [conversations]);

  const load = useCallback(() => {
    if (!enabled) return;
    setLoading(true);
    messagesService
      .getConversations()
      .then((res) => setConversations(res.conversations))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setConversations([]); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    load();
  }, [enabled, load]);

  // Fold a fresh message into the inbox: update last message, bump to the top,
  // and (unless the thread is on screen) increment unread.
  const applyIncoming = useCallback(
    (message: MessageDTO) => {
      // First message from someone new: the conversation isn't in the inbox yet,
      // so refetch rather than trying to synthesize it here.
      if (!knownIds.current.has(message.conversationId)) {
        load();
        return;
      }
      const mine = message.senderId === user?.id;
      const active = activeRef.current === message.conversationId;
      const bump = !mine && !active ? 1 : 0;
      setConversations((prev) => {
        const conv = prev.find((c) => c.id === message.conversationId);
        if (!conv) return prev;
        const updated: ConversationDTO = {
          ...conv,
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount: conv.unreadCount + bump,
        };
        return [updated, ...prev.filter((c) => c.id !== message.conversationId)];
      });
    },
    [user?.id, load],
  );

  const onFrame = useCallback(
    (frame: UserSocketFrame) => {
      if (frame.channel !== 'dm') return;
      if (frame.type === 'message') applyIncoming(frame.payload);
    },
    [applyIncoming],
  );
  useUserSocketFrames(onFrame);

  const openWith = useCallback(async (recipientId: number) => {
    const { conversation } = await messagesService.openConversation(recipientId);
    setConversations((prev) =>
      prev.some((c) => c.id === conversation.id) ? prev : [conversation, ...prev],
    );
    return conversation;
  }, []);

  const setActiveConversation = useCallback((id: number | null) => {
    activeRef.current = id;
  }, []);

  const markConversationRead = useCallback((id: number) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
  }, []);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations],
  );

  return (
    <MessagesContext
      value={{
        enabled,
        conversations,
        totalUnread,
        loading,
        refresh: load,
        openWith,
        setActiveConversation,
        markConversationRead,
      }}
    >
      {children}
    </MessagesContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMessages(): MessagesContextValue {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
}
