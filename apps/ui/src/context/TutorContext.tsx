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
import { useUsage } from './UsageContext';
import { canAccessFeature } from '@cyberstars/shared/features';
import type {
  TutorAnswerEnd,
  TutorLessonRef,
  TutorLessonWork,
  TutorMessage,
} from '@cyberstars/shared/tutor';
import { USAGE_LIMIT_ERROR } from '@cyberstars/shared/usage';
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
  reason: 'tutor.errorBusy' | 'tutor.errorLimit' | 'tutor.errorFailed';
  afterWords: boolean;
}

// The lesson or algorithm challenge a conversation is about, as the panel names it.
export interface TutorLesson extends TutorLessonRef {
  title: string;
}

// One conversation as the panel shows it.
interface Conversation {
  messages: TutorMessage[];
  hasMore: boolean;
  loaded: boolean;
  loading: boolean;
  // The saved messages couldn't be read; closing and opening tries again.
  loadFailed: boolean;
  pending: PendingAnswer | null;
  failure: TutorFailure | null;
}

const EMPTY: Conversation = {
  messages: [],
  hasMore: false,
  loaded: false,
  loading: false,
  loadFailed: false,
  pending: null,
  failure: null,
};

interface TutorContextValue {
  // The student may use the tutor; without it there is no panel.
  enabled: boolean;
  open: boolean;
  // The lesson whose conversation the panel shows; null for the general one.
  lesson: TutorLesson | null;
  // The sidebar's button: opens the general conversation, or closes it.
  toggle: () => void;
  close: () => void;
  // Opens the lesson's conversation; `readWork` gives the student's work on it
  // each time a message is sent.
  openLesson: (lesson: TutorLesson, readWork: () => TutorLessonWork) => void;
  // The student left the lesson: its conversation closes with it.
  leaveLesson: (lesson: TutorLessonRef) => void;
  messages: TutorMessage[];
  hasMore: boolean;
  loading: boolean;
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

// A 429 is either the session spent or too many messages in a minute.
function reasonOf(err: unknown): TutorFailure['reason'] {
  if (!(err instanceof ApiClientError) || err.status !== 429) return 'tutor.errorFailed';
  return err.message.startsWith(USAGE_LIMIT_ERROR) ? 'tutor.errorLimit' : 'tutor.errorBusy';
}

function keyOf(lesson: TutorLessonRef | null): string {
  return lesson ? `${lesson.courseKey}/${lesson.lessonSlug}` : 'general';
}

// Only what the server takes as the conversation, not the title.
function refOf(lesson: TutorLessonRef | null): TutorLessonRef | null {
  return lesson && { courseKey: lesson.courseKey, lessonSlug: lesson.lessonSlug };
}

export function TutorProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const { refresh: refreshUsage } = useUsage();
  const enabled = !!user && canAccessFeature('tutorChat', user.role, import.meta.env.PROD);
  const userId = user?.id;

  const [open, setOpen] = useState(false);
  const [lesson, setLesson] = useState<TutorLesson | null>(null);
  // Every conversation opened so far, by keyOf. An answer carries on in its
  // own conversation while the panel shows another one.
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  // Messages added here have no id from the server; they count down from -1.
  const localId = useRef(0);
  // The answer each conversation is waiting for.
  const controllers = useRef(new Map<string, AbortController>());
  // Where the open lesson's work is read from.
  const work = useRef<{ key: string; read: () => TutorLessonWork } | null>(null);

  const update = useCallback(
    (key: string, change: (c: Conversation) => Partial<Conversation>) =>
      setConversations((all) => {
        const current = all[key] ?? EMPTY;
        return { ...all, [key]: { ...current, ...change(current) } };
      }),
    [],
  );

  // Another account, or none: forget the conversations. Done while rendering,
  // so the old ones never show under the new account
  const [owner, setOwner] = useState(userId);
  if (owner !== userId) {
    setOwner(userId);
    setOpen(false);
    setLesson(null);
    setConversations({});
  }
  // ...and stop the answers the previous one was waiting for.
  const currentUser = useRef(userId);
  useEffect(() => {
    currentUser.current = userId;
    const running = controllers.current;
    return () => {
      for (const c of running.values()) c.abort();
      running.clear();
    };
  }, [userId]);

  const load = useCallback(
    (of: TutorLessonRef | null) => {
      const key = keyOf(of);
      const forUser = userId;
      update(key, () => ({ loading: true, loadFailed: false }));
      tutorService
        .getConversation(refOf(of))
        .then((res) => {
          if (currentUser.current !== forUser) return;
          update(key, () => ({
            messages: [...res.messages].reverse(),
            hasMore: res.hasMore,
            loaded: true,
          }));
        })
        .catch(() => {
          if (currentUser.current === forUser) update(key, () => ({ loadFailed: true }));
        })
        .finally(() => {
          if (currentUser.current === forUser) update(key, () => ({ loading: false }));
        });
    },
    [update, userId],
  );

  // Shows a conversation, reading its saved messages the first time.
  const show = useCallback(
    (of: TutorLesson | null) => {
      const c = conversations[keyOf(of)] ?? EMPTY;
      if (!c.loaded && !c.loading) load(of);
      setLesson(of);
      setOpen(true);
    },
    [conversations, load],
  );

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
      const key = keyOf(lesson);
      if (!question || controllers.current.has(key)) return;
      const abort = new AbortController();
      controllers.current.set(key, abort);
      update(key, () => ({ failure: null, pending: { question, answer: '' } }));

      let words = '';
      let finish: TutorAnswerEnd | null = null;
      const saved = (end: TutorAnswerEnd) =>
        update(key, (c) => ({
          messages: [...c.messages, local('student', question, null), local('tutor', words, end)],
        }));
      const ref = refOf(lesson);
      const lessonWork = ref && work.current?.key === key ? work.current.read() : undefined;

      tutorService
        .streamChat(
          {
            message: question,
            page: SAFE_PAGE.test(pathname) ? pathname : '/',
            lang: i18n.language === 'ro' ? 'ro' : 'en',
            ...(ref && { lesson: ref }),
            ...(lessonWork && { work: lessonWork }),
          },
          (event) => {
            if (event.type === 'text') {
              words += event.text;
              update(key, () => ({ pending: { question, answer: words } }));
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
            update(key, () => ({
              failure: { question, reason: 'tutor.errorFailed', afterWords: false },
            }));
            return;
          }
          saved(finish);
          if (finish === 'interrupted') {
            update(key, () => ({
              failure: { question, reason: 'tutor.errorFailed', afterWords: true },
            }));
          }
        })
        .catch((err: unknown) => {
          if (abort.signal.aborted) return;
          if (words) saved('interrupted');
          update(key, () => ({
            failure: { question, reason: reasonOf(err), afterWords: !!words },
          }));
        })
        .finally(() => {
          if (controllers.current.get(key) === abort) controllers.current.delete(key);
          if (abort.signal.aborted) return;
          update(key, () => ({ pending: null }));
          // The message is paid for by now; the panel shows what is left.
          refreshUsage();
        });
    },
    [i18n, lesson, local, pathname, refreshUsage, update],
  );

  // The lesson page says it's gone from its effect's cleanup, which keeps the
  // first render's functions: this one stays the same and reads the panel now.
  const shown = useRef(lesson);
  useEffect(() => {
    shown.current = lesson;
  }, [lesson]);
  const leaveLesson = useCallback((of: TutorLessonRef) => {
    const left = keyOf(of);
    if (work.current?.key === left) work.current = null;
    if (keyOf(shown.current) !== left) return;
    setOpen(false);
    setLesson(null);
  }, []);

  const key = keyOf(lesson);
  const current = conversations[key] ?? EMPTY;

  const retry = useCallback(() => {
    if (current.failure) send(current.failure.question);
  }, [current.failure, send]);

  const loadEarlier = useCallback(async () => {
    const oldest = current.messages.find((m) => m.id > 0)?.id;
    if (oldest === undefined) return;
    const res = await tutorService.getConversation(refOf(lesson), oldest);
    update(key, (c) => ({
      messages: [...[...res.messages].reverse(), ...c.messages],
      hasMore: res.hasMore,
    }));
  }, [current.messages, key, lesson, update]);

  const clear = useCallback(async () => {
    await tutorService.deleteConversation(refOf(lesson));
    update(key, () => ({ messages: [], hasMore: false, failure: null }));
  }, [key, lesson, update]);

  const value: TutorContextValue = {
    enabled,
    open: open && enabled,
    lesson,
    toggle: () => {
      if (open && !lesson) setOpen(false);
      else show(null);
    },
    close: () => setOpen(false),
    openLesson: (of, readWork) => {
      work.current = { key: keyOf(of), read: readWork };
      show(of);
    },
    leaveLesson,
    messages: current.messages,
    hasMore: current.hasMore,
    loading: current.loading,
    loadFailed: current.loadFailed,
    pending: current.pending,
    failure: current.failure,
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
