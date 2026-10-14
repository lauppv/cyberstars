import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '@cyberstars/shared/features';
import type { TutorAnswerEnd, TutorMessage } from '@cyberstars/shared/tutor';
import * as tutorService from '../services/tutorService';
import { ApiClientError } from '../services/apiClient';

// The answer being written: the question it answers and its words so far.
interface PendingAnswer {
  question: string;
  answer: string;
}

// A message that didn't get its full answer. Before any words nothing was
// saved, so the question shows again with its error; after some words the
// partial answer is already in the conversation, marked as broken off.
export interface TutorFailure {
  question: string;
  // The i18n key of what went wrong.
  reason: 'tutor.errorBusy' | 'tutor.errorFailed';
  afterWords: boolean;
}

interface TutorContextValue {
  // The student may use the tutor; without it there is no panel.
  enabled: boolean;
  open: boolean;
  toggle: () => void;
  close: () => void;
  messages: TutorMessage[];
  hasMore: boolean;
  loading: boolean;
  // The saved messages couldn't be read; closing and opening tries again.
  loadFailed: boolean;
  pending: PendingAnswer | null;
  failure: TutorFailure | null;
  send: (text: string) => void;
  retry: () => void;
  loadEarlier: () => Promise<void>;
  clear: () => Promise<void>;
}

const TutorContext = createContext<TutorContextValue | null>(null);

// The chat endpoint only takes a short in-app path.
const SAFE_PAGE = /^\/[\w\-/]*$/;

function reasonOf(err: unknown): TutorFailure['reason'] {
  return err instanceof ApiClientError && err.status === 429
    ? 'tutor.errorBusy'
    : 'tutor.errorFailed';
}

export function TutorProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const enabled = !!user && canAccessFeature('tutorChat', user.role, import.meta.env.PROD);
  const userId = user?.id;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [pending, setPending] = useState<PendingAnswer | null>(null);
  const [failure, setFailure] = useState<TutorFailure | null>(null);
  // Messages added here have no id from the server; they count down from -1.
  const localId = useRef(0);
  const controller = useRef<AbortController | null>(null);

  // Another account, or none: forget the conversation. Done while rendering, so
  // the old one never shows under the new account
  const [owner, setOwner] = useState(userId);
  if (owner !== userId) {
    setOwner(userId);
    setOpen(false);
    setMessages([]);
    setHasMore(false);
    setLoaded(false);
    setLoading(false);
    setLoadFailed(false);
    setPending(null);
    setFailure(null);
  }
  // ...and stop the answer the previous one was waiting for.
  const currentUser = useRef(userId);
  useEffect(() => {
    currentUser.current = userId;
    return () => controller.current?.abort();
  }, [userId]);

  const load = useCallback(() => {
    const forUser = userId;
    setLoading(true);
    setLoadFailed(false);
    tutorService
      .getGeneralConversation()
      .then((res) => {
        if (currentUser.current !== forUser) return;
        setMessages([...res.messages].reverse());
        setHasMore(res.hasMore);
        setLoaded(true);
      })
      .catch(() => {
        if (currentUser.current === forUser) setLoadFailed(true);
      })
      .finally(() => {
        if (currentUser.current === forUser) setLoading(false);
      });
  }, [userId]);

  const local = useCallback(
    (role: TutorMessage['role'], text: string, finish: TutorAnswerEnd | null): TutorMessage => ({
      id: --localId.current,
      role,
      text,
      finish,
      createdAt: new Date().toISOString(),
    }),
    [],
  );

  const send = useCallback(
    (text: string) => {
      const question = text.trim();
      if (!question || controller.current) return;
      const abort = new AbortController();
      controller.current = abort;
      setFailure(null);
      setPending({ question, answer: '' });

      let words = '';
      let finish: TutorAnswerEnd | null = null;
      const saved = (end: TutorAnswerEnd) =>
        setMessages((prev) => [
          ...prev,
          local('student', question, null),
          local('tutor', words, end),
        ]);

      tutorService
        .streamChat(
          {
            message: question,
            page: SAFE_PAGE.test(pathname) ? pathname : '/',
            lang: i18n.language === 'ro' ? 'ro' : 'en',
          },
          (event) => {
            if (event.type === 'text') {
              words += event.text;
              setPending({ question, answer: words });
            } else if (event.type === 'done') {
              finish = event.finish;
            } else {
              finish = 'interrupted';
            }
          },
          abort.signal,
        )
        .then(() => {
          // A stream that closed without saying how it ended broke off.
          if (finish === null) finish = words ? 'interrupted' : null;
          if (finish === null) {
            setFailure({ question, reason: 'tutor.errorFailed', afterWords: false });
            return;
          }
          saved(finish);
          if (finish === 'interrupted') {
            setFailure({ question, reason: 'tutor.errorFailed', afterWords: true });
          }
        })
        .catch((err: unknown) => {
          if (abort.signal.aborted) return;
          if (words) saved('interrupted');
          setFailure({ question, reason: reasonOf(err), afterWords: !!words });
        })
        .finally(() => {
          if (controller.current === abort) controller.current = null;
          if (!abort.signal.aborted) setPending(null);
        });
    },
    [i18n, local, pathname],
  );

  const retry = useCallback(() => {
    if (failure) send(failure.question);
  }, [failure, send]);

  const loadEarlier = useCallback(async () => {
    const oldest = messages.find((m) => m.id > 0)?.id;
    if (oldest === undefined) return;
    const res = await tutorService.getGeneralConversation(oldest);
    setMessages((prev) => [...[...res.messages].reverse(), ...prev]);
    setHasMore(res.hasMore);
  }, [messages]);

  const clear = useCallback(async () => {
    await tutorService.deleteGeneralConversation();
    setMessages([]);
    setHasMore(false);
    setFailure(null);
  }, []);

  const value: TutorContextValue = {
    enabled,
    open: open && enabled,
    toggle: () => {
      // The saved messages are read the first time the panel opens.
      if (!open && !loaded && !loading) load();
      setOpen(!open);
    },
    close: () => setOpen(false),
    messages,
    hasMore,
    loading,
    loadFailed,
    pending,
    failure,
    send,
    retry,
    loadEarlier,
    clear,
  };

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>;
}

/** The tutor's conversation and panel, or null outside the provider (tests). */
// eslint-disable-next-line react-refresh/only-export-components
export function useTutor(): TutorContextValue | null {
  return useContext(TutorContext);
}
