import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { useUsage } from './UsageContext';
import { canAccessFeature } from '@cyberstars/shared/features';
import type {
  TutorAnswerEnd,
  TutorConversationSummary,
  TutorLessonRef,
  TutorLessonWork,
  TutorLookup,
  TutorMessage,
} from '@cyberstars/shared/tutor';
import { USAGE_LIMIT_ERROR } from '@cyberstars/shared/usage';
import * as tutorService from '../services/tutorService';
import { ApiClientError } from '../services/apiClient';

// What the tutor last looked up before its first words, as the server named it.
export interface TutorLookupStatus {
  lookup: TutorLookup;
  title?: string;
}

// The answer being written: the question it answers, the lookup it is on
// until its first words, and its words so far.
interface PendingAnswer {
  question: string;
  lookup: TutorLookupStatus | null;
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

// Where the student stands on a lesson, as its page tells it: nothing written
// yet, work not tested, a failed Run Tests (at the test it stopped on, when
// there is one) or a passed one. A lesson chat's first suggestions follow it.
export type TutorLessonStage =
  | { stage: 'empty' }
  | { stage: 'working' }
  | { stage: 'failing'; test?: number }
  | { stage: 'passed' };

// One conversation as the panel shows it: a saved one, or a new one that gets
// its id once its first exchange is saved.
interface Conversation {
  id: number | null;
  lesson: TutorLesson | null;
  messages: TutorMessage[];
  hasMore: boolean;
  loaded: boolean;
  loading: boolean;
  // The saved messages couldn't be read; closing and opening tries again.
  loadFailed: boolean;
  pending: PendingAnswer | null;
  failure: TutorFailure | null;
  // The i18n keys of the questions an empty general conversation offers.
  starters: string[];
}

// What a general conversation can start with. Each new one offers three of
// them at random, one that fits the page first when there is one.
const GENERAL_STARTERS = [
  'course',
  'idea',
  'help',
  'loop',
  'function',
  'error',
  'languages',
  'challenge',
  'recursion',
  'list',
  'linux',
  'stuck',
  'debug',
  'better',
];
const PAGE_STARTERS: [path: string, starter: string][] = [
  ['/algorithms', 'challenge'],
  ['/courses', 'course'],
];

// What the tutor says when a lesson's tests pass, one of them at random.
const CHEERS = ['tutor.cheer.done', 'tutor.cheer.alone', 'tutor.cheer.yours'];

function pickStarters(pathname: string): string[] {
  const fits = PAGE_STARTERS.find(([path]) => pathname.startsWith(path))?.[1];
  const pool = GENERAL_STARTERS.filter((starter) => starter !== fits);
  const picked = fits ? [fits] : [];
  while (picked.length < 3) picked.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
  return picked.map((starter) => `tutor.start.${starter}`);
}

function blank(
  lesson: TutorLesson | null,
  id: number | null = null,
  starters: string[] = [],
): Conversation {
  return {
    id,
    lesson,
    messages: [],
    hasMore: false,
    loaded: id === null,
    loading: false,
    loadFailed: false,
    pending: null,
    failure: null,
    starters,
  };
}

// A new conversation nothing has been asked in yet, so it can be shown again
// instead of starting another.
function untouched(c: Conversation): boolean {
  return c.id === null && c.messages.length === 0 && !c.pending && !c.failure;
}

interface TutorContextValue {
  // The student may use the tutor; without it there is no panel.
  enabled: boolean;
  open: boolean;
  // What the shown conversation is about; null for a general one.
  lesson: TutorLesson | null;
  // The shown conversation's id; null until its first exchange is saved.
  conversationId: number | null;
  // Tells the shown conversation from every other, saved or not.
  conversationKey: string | null;
  // The sidebar's button: opens a new general conversation, or closes one.
  toggle: () => void;
  close: () => void;
  // Opens the lesson's newest conversation, or a new one about it.
  openLesson: (lesson: TutorLesson) => void;
  // A lesson page says where its work is read while it is open. The function
  // it gets back says it has gone, which closes the panel on its conversation.
  enterLesson: (lesson: TutorLessonRef, readWork: () => TutorLessonWork) => () => void;
  // A lesson page says where the student stands on it, whenever that changes.
  reportStage: (lesson: TutorLessonRef, stage: TutorLessonStage) => void;
  // Where the student stands on the shown conversation's lesson, as last told.
  stage: TutorLessonStage | null;
  // The i18n key of a cheer for that lesson's tests passing, while it lasts.
  cheer: string | null;
  // A new conversation about what the shown one is about.
  startNew: () => void;
  // The student's saved conversations, newest first; null until read.
  history: TutorConversationSummary[] | null;
  historyFailed: boolean;
  historyOpen: boolean;
  toggleHistory: () => void;
  // Shows a saved conversation, on its lesson's page when it has one.
  openConversation: (summary: TutorConversationSummary, lessonTitle: string) => void;
  messages: TutorMessage[];
  hasMore: boolean;
  loading: boolean;
  loadFailed: boolean;
  pending: PendingAnswer | null;
  failure: TutorFailure | null;
  // What an empty general conversation offers to start with, as i18n keys.
  starters: string[];
  send: (text: string) => void;
  retry: () => void;
  loadEarlier: () => Promise<void>;
  clear: () => Promise<void>;
}

const TutorContext = createContext<TutorContextValue | null>(null);

// The chat endpoint only takes a short in-app path.
const SAFE_PAGE = /^\/[\w\-/]*$/;

// Whether the history column is open, kept for the next visit.
const HISTORY_KEY = 'cyberstars.tutorHistory';

function readHistoryOpen(): boolean {
  try {
    return localStorage.getItem(HISTORY_KEY) === 'open';
  } catch {
    return false;
  }
}

// A 429 is either the session spent or too many messages in a minute.
function reasonOf(err: unknown): TutorFailure['reason'] {
  if (!(err instanceof ApiClientError) || err.status !== 429) return 'tutor.errorFailed';
  return err.message.startsWith(USAGE_LIMIT_ERROR) ? 'tutor.errorLimit' : 'tutor.errorBusy';
}

function lessonKeyOf(lesson: TutorLessonRef | null): string | null {
  return lesson && `${lesson.courseKey}/${lesson.lessonSlug}`;
}

// Only what the server takes as the lesson, not the title.
function refOf(lesson: TutorLessonRef): TutorLessonRef {
  return { courseKey: lesson.courseKey, lessonSlug: lesson.lessonSlug };
}

export function TutorProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { refresh: refreshUsage } = useUsage();
  const enabled = !!user && canAccessFeature('tutorChat', user.role, import.meta.env.PROD);
  const userId = user?.id;

  const [open, setOpen] = useState(false);
  // Every conversation opened so far, by a key of the panel's own. An answer
  // carries on in its own conversation while the panel shows another one.
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [shown, setShown] = useState<string | null>(null);
  const [history, setHistory] = useState<TutorConversationSummary[] | null>(null);
  const [historyFailed, setHistoryFailed] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(readHistoryOpen);
  // Where the student stands on each lesson whose page told it, and the cheer
  // each lesson whose tests just passed gets, by lesson.
  const [stages, setStages] = useState<Record<string, TutorLessonStage>>({});
  const [cheers, setCheers] = useState<Record<string, string>>({});
  // The handlers below run after renders the state hasn't caught up with yet,
  // so they read and write these alongside it.
  const all = useRef(conversations);
  const shownRef = useRef<{ key: string; lesson: TutorLessonRef | null } | null>(null);
  // Keys of new conversations, and ids of messages added here, which have none
  // from the server: both count on.
  const fresh = useRef(0);
  const localId = useRef(0);
  // The answer each conversation is waiting for.
  const controllers = useRef(new Map<string, AbortController>());
  // The stages as last told, read when the next one comes.
  const stagesNow = useRef<Record<string, TutorLessonStage>>({});
  // Where each open lesson page's work is read, by lesson.
  const works = useRef(new Map<string, () => TutorLessonWork>());
  // Bumped by every choice of what to show, so a lesson's conversation found
  // late never replaces one picked since.
  const choice = useRef(0);

  const update = useCallback(
    (key: string, change: (c: Conversation) => Partial<Conversation>) =>
      setConversations((current) => {
        const before = current[key];
        if (!before) return current;
        const next = { ...current, [key]: { ...before, ...change(before) } };
        all.current = next;
        return next;
      }),
    [],
  );

  const add = useCallback((key: string, conversation: Conversation) => {
    setConversations((current) => {
      const next = { ...current, [key]: conversation };
      all.current = next;
      return next;
    });
  }, []);

  // Another account, or none: forget the conversations. Done while rendering,
  // so the old ones never show under the new account
  const [owner, setOwner] = useState(userId);
  if (owner !== userId) {
    setOwner(userId);
    setOpen(false);
    setShown(null);
    setConversations({});
    setHistory(null);
    setHistoryFailed(false);
    setStages({});
    setCheers({});
  }
  // ...and stop the answers the previous one was waiting for.
  const currentUser = useRef(userId);
  useEffect(() => {
    currentUser.current = userId;
    all.current = {};
    shownRef.current = null;
    stagesNow.current = {};
    const running = controllers.current;
    return () => {
      for (const c of running.values()) c.abort();
      running.clear();
    };
  }, [userId]);

  const loadHistory = useCallback((): Promise<TutorConversationSummary[] | null> => {
    const forUser = userId;
    setHistoryFailed(false);
    return tutorService
      .listConversations()
      .then((list) => {
        if (currentUser.current !== forUser) return null;
        setHistory(list);
        return list;
      })
      .catch(() => {
        if (currentUser.current === forUser) setHistoryFailed(true);
        return null;
      });
  }, [userId]);

  const display = useCallback((key: string, lesson: TutorLessonRef | null) => {
    shownRef.current = { key, lesson };
    setShown(key);
    setOpen(true);
  }, []);

  // Shows a new conversation about the lesson, or none for a general one.
  const showNew = useCallback(
    (lesson: TutorLesson | null) => {
      const reuse = Object.entries(all.current).find(
        ([, c]) => untouched(c) && lessonKeyOf(c.lesson) === lessonKeyOf(lesson),
      );
      const key = reuse?.[0] ?? `new-${++fresh.current}`;
      add(key, blank(lesson, null, lesson ? [] : pickStarters(pathname)));
      display(key, lesson);
    },
    [add, display, pathname],
  );

  // Shows a saved conversation, reading its messages the first time.
  const showSaved = useCallback(
    (id: number, lesson: TutorLesson | null) => {
      const known = Object.entries(all.current).find(([, c]) => c.id === id);
      const key = known?.[0] ?? `saved-${id}`;
      if (!known || (!known[1].loaded && !known[1].loading)) {
        const forUser = userId;
        add(key, {
          ...(known?.[1] ?? blank(lesson, id)),
          lesson,
          loading: true,
          loadFailed: false,
        });
        tutorService
          .getConversation(id)
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
      }
      display(key, lesson);
    },
    [add, display, update, userId],
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

  const dropCheer = useCallback((lessonKey: string) => {
    setCheers((current) => {
      if (!(lessonKey in current)) return current;
      const rest = { ...current };
      delete rest[lessonKey];
      return rest;
    });
  }, []);

  const send = useCallback(
    (text: string) => {
      const question = text.trim();
      const key = shownRef.current?.key;
      const conversation = key && all.current[key];
      if (!question || !key || !conversation || controllers.current.has(key)) return;
      const abort = new AbortController();
      controllers.current.set(key, abort);
      update(key, () => ({ failure: null, pending: { question, lookup: null, answer: '' } }));
      if (conversation.lesson) dropCheer(lessonKeyOf(conversation.lesson)!);

      let words = '';
      let finish: TutorAnswerEnd | null = null;
      // A new conversation learns its id from the end of its first answer.
      const savedAs = (id: number | undefined) => {
        if (id !== undefined && all.current[key]?.id === null) update(key, () => ({ id }));
      };
      const saved = (end: TutorAnswerEnd) =>
        update(key, (c) => ({
          messages: [...c.messages, local('student', question, null), local('tutor', words, end)],
        }));
      const { lesson, id } = conversation;
      const readWork = lesson && works.current.get(lessonKeyOf(lesson)!);

      tutorService
        .streamChat(
          {
            message: question,
            page: SAFE_PAGE.test(pathname) ? pathname : '/',
            lang: i18n.language === 'ro' ? 'ro' : 'en',
            ...(lesson && { lesson: refOf(lesson) }),
            ...(id !== null && { conversationId: id }),
            ...(readWork && { work: readWork() }),
          },
          (event) => {
            if (event.type === 'status') {
              const lookup = { lookup: event.lookup, title: event.title };
              update(key, () => ({ pending: { question, lookup, answer: words } }));
            } else if (event.type === 'text') {
              words += event.text;
              update(key, () => ({ pending: { question, lookup: null, answer: words } }));
            } else if (event.type === 'done') {
              finish = event.finish;
              savedAs(event.conversationId);
            } else {
              // Before any words nothing was saved, so it is a failure like
              // one before the stream, and the question can simply go again.
              finish = words ? 'interrupted' : null;
              savedAs(event.conversationId);
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
          // The message is paid for by now, and its conversation moved to the
          // top of the history: the panel shows both as they are.
          refreshUsage();
          if (finish) void loadHistory();
        });
    },
    [dropCheer, i18n, loadHistory, local, pathname, refreshUsage, update],
  );

  const enterLesson = useCallback((of: TutorLessonRef, readWork: () => TutorLessonWork) => {
    const lessonKey = lessonKeyOf(of)!;
    works.current.set(lessonKey, readWork);
    return () => {
      if (works.current.get(lessonKey) === readWork) works.current.delete(lessonKey);
      // A page mounted again at once (StrictMode, a fresh render of the same
      // lesson) has not been left: only a lesson still gone after this commit is.
      queueMicrotask(() => {
        if (works.current.has(lessonKey)) return;
        if (lessonKeyOf(shownRef.current?.lesson ?? null) === lessonKey) setOpen(false);
      });
    };
  }, []);

  const reportStage = useCallback(
    (of: TutorLessonRef, stage: TutorLessonStage) => {
      const lessonKey = lessonKeyOf(of)!;
      const before = stagesNow.current[lessonKey];
      // Told again on every keystroke: only a change of stage renders anything.
      if (JSON.stringify(before) === JSON.stringify(stage)) return;
      stagesNow.current = { ...stagesNow.current, [lessonKey]: stage };
      setStages(stagesNow.current);
      // Tests passing after the page first told otherwise get a cheer. It lasts
      // while they stay passed, until the student writes to the tutor again.
      if (stage.stage !== 'passed') dropCheer(lessonKey);
      else if (before && before.stage !== 'passed') {
        const cheer = CHEERS[Math.floor(Math.random() * CHEERS.length)];
        setCheers((current) => ({ ...current, [lessonKey]: cheer }));
      }
    },
    [dropCheer],
  );

  const openLesson = useCallback(
    (of: TutorLesson) => {
      const mine = ++choice.current;
      // The lesson's conversation the panel showed last carries on, even one
      // whose first answer is still on its way.
      const last = shownRef.current;
      if (last && lessonKeyOf(last.lesson) === lessonKeyOf(of) && all.current[last.key]) {
        update(last.key, () => ({ lesson: of }));
        display(last.key, of);
        return;
      }
      const pick = (list: TutorConversationSummary[] | null) => {
        if (choice.current !== mine) return;
        const newest = list?.find((c) => lessonKeyOf(c.lesson) === lessonKeyOf(of));
        if (newest) showSaved(newest.id, of);
        else showNew(of);
      };
      if (history) pick(history);
      else void loadHistory().then(pick);
    },
    [display, history, loadHistory, showNew, showSaved, update],
  );

  const current = (shown && conversations[shown]) || null;

  const startNew = useCallback(() => {
    choice.current++;
    showNew(current?.lesson ?? null);
  }, [current, showNew]);

  const openConversation = useCallback(
    (summary: TutorConversationSummary, lessonTitle: string) => {
      choice.current++;
      const lesson = summary.lesson && { ...summary.lesson, title: lessonTitle };
      showSaved(summary.id, lesson);
      if (!lesson) return;
      const page = `/lesson/${lesson.courseKey}/${lesson.lessonSlug}`;
      if (pathname !== page) navigate(page);
    },
    [navigate, pathname, showSaved],
  );

  const toggle = useCallback(() => {
    if (open && current && !current.lesson) {
      setOpen(false);
      return;
    }
    choice.current++;
    showNew(null);
    if (!history) void loadHistory();
  }, [current, history, loadHistory, open, showNew]);

  const toggleHistory = useCallback(() => {
    setHistoryOpen((was) => {
      try {
        localStorage.setItem(HISTORY_KEY, was ? 'closed' : 'open');
      } catch {
        // the choice just isn't kept
      }
      return !was;
    });
    if (!history || historyFailed) void loadHistory();
  }, [history, historyFailed, loadHistory]);

  const retry = useCallback(() => {
    if (current?.failure) send(current.failure.question);
  }, [current, send]);

  const loadEarlier = useCallback(async () => {
    if (!shown || !current || current.id === null) return;
    const oldest = current.messages.find((m) => m.id > 0)?.id;
    if (oldest === undefined) return;
    const res = await tutorService.getConversation(current.id, oldest);
    update(shown, (c) => ({
      messages: [...[...res.messages].reverse(), ...c.messages],
      hasMore: res.hasMore,
    }));
  }, [current, shown, update]);

  const clear = useCallback(async () => {
    if (!current) return;
    if (current.id !== null) {
      const { id } = current;
      await tutorService.deleteConversation(id);
      setHistory((list) => list && list.filter((c) => c.id !== id));
    }
    choice.current++;
    showNew(current.lesson);
  }, [current, showNew]);

  const value: TutorContextValue = {
    enabled,
    open: open && enabled && !!current,
    lesson: current?.lesson ?? null,
    conversationId: current?.id ?? null,
    conversationKey: current ? shown : null,
    toggle,
    close: () => setOpen(false),
    openLesson,
    enterLesson,
    reportStage,
    stage: (current?.lesson && stages[lessonKeyOf(current.lesson)!]) || null,
    cheer: (current?.lesson && cheers[lessonKeyOf(current.lesson)!]) || null,
    startNew,
    history,
    historyFailed,
    historyOpen,
    toggleHistory,
    openConversation,
    messages: current?.messages ?? [],
    hasMore: current?.hasMore ?? false,
    loading: current?.loading ?? false,
    loadFailed: current?.loadFailed ?? false,
    pending: current?.pending ?? null,
    failure: current?.failure ?? null,
    starters: current?.starters ?? [],
    send,
    retry,
    loadEarlier,
    clear,
  };

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>;
}

/** The tutor's conversations and panel, or null outside the provider (tests). */
// eslint-disable-next-line react-refresh/only-export-components
export function useTutor(): TutorContextValue | null {
  return useContext(TutorContext);
}
