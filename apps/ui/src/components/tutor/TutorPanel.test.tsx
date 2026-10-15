import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { StrictMode, useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import type {
  TutorConversationSummary,
  TutorLessonRef,
  TutorMessage,
  TutorStreamEvent,
} from '@cyberstars/shared/tutor';
import type { UsageState } from '@cyberstars/shared/usage';
import { ApiClientError } from '../../services/apiClient';

const h = vi.hoisted(() => ({
  auth: { user: null as null | { id: number; role: string; name?: string } },
  canAccess: vi.fn((..._a: unknown[]) => true),
  listConversations: vi.fn(),
  getConversation: vi.fn(),
  deleteConversation: vi.fn(),
  streamChat: vi.fn(),
  usage: { summary: null as null | { tutorMessage: UsageState }, refresh: vi.fn() },
  courses: [
    {
      key: 'python',
      title: 'Python',
      description: '',
      lessons: [
        { slug: 'for', title: 'For loops', sortOrder: 1 },
        { slug: 'while', title: 'While loops', sortOrder: 2 },
      ],
    },
  ],
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../context/UsageContext', () => ({ useUsage: () => h.usage }));
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculum: () => ({ courses: h.courses }),
}));
vi.mock('@cyberstars/shared/features', () => ({
  canAccessFeature: (...a: unknown[]) => h.canAccess(...a),
}));
vi.mock('../../services/tutorService', () => ({
  listConversations: h.listConversations,
  getConversation: h.getConversation,
  deleteConversation: h.deleteConversation,
  streamChat: h.streamChat,
}));

import { TutorProvider, useTutor, type TutorLessonStage } from '../../context/TutorContext';
import { TutorPanel } from './TutorPanel';

const USER = { id: 7, role: 'USER' };
const TODAY = new Date().toISOString();

function message(
  id: number,
  role: TutorMessage['role'],
  text: string,
  finish = null as TutorMessage['finish'],
): TutorMessage {
  return { id, role, text, finish, createdAt: '2026-10-14T10:00:00Z' };
}

function summary(
  id: number,
  title: string,
  lesson: TutorLessonRef | null = null,
  updatedAt = TODAY,
): TutorConversationSummary {
  return { id, title, lesson, updatedAt };
}

// The saved conversations and the messages each one reads back.
function saved(list: TutorConversationSummary[], pages: Record<number, TutorMessage[]> = {}) {
  h.listConversations.mockResolvedValue(list);
  h.getConversation.mockImplementation((id: number) =>
    Promise.resolve({ messages: pages[id] ?? [], hasMore: false }),
  );
}

// One answer the test writes event by event, then ends or breaks.
function answer() {
  let emit: (e: TutorStreamEvent) => void = () => {};
  let end: () => void = () => {};
  let fail: (err: unknown) => void = () => {};
  h.streamChat.mockImplementationOnce(
    (_body: unknown, onEvent: (e: TutorStreamEvent) => void) =>
      new Promise<void>((resolve, reject) => {
        emit = onEvent;
        end = resolve;
        fail = reject;
      }),
  );
  return {
    emit: (e: TutorStreamEvent) => act(() => emit(e)),
    end: () => act(async () => end()),
    fail: (err: unknown) => act(async () => fail(err)),
  };
}

function Where() {
  return <div data-testid="where">{useLocation().pathname}</div>;
}

const FOR_REF = { courseKey: 'python', lessonSlug: 'for' };
const WHILE_REF = { courseKey: 'python', lessonSlug: 'while' };
const FOR_LESSON = { ...FOR_REF, title: 'For loops' };
const WHILE_LESSON = { ...WHILE_REF, title: 'While loops' };
// The student's work as the lesson page would read it when a message is sent.
const work = {
  current: { code: 'for i in x:', runOutput: '', submissionId: 3 as number | undefined },
};

// Where the student stands on the For lesson when its page tells the tutor.
const standing = { current: { stage: 'empty' } as TutorLessonStage };

// A lesson page: it says where its work is read while it is open.
function OnLesson({ lesson }: { lesson: TutorLessonRef }) {
  const enter = useTutor()!.enterLesson;
  useEffect(() => enter(lesson, () => work.current), [enter, lesson]);
  return null;
}

// The sidebar's entry, a lesson page's ⋯ entry and its leaving, and the panel
// where the shell puts it.
function Shell() {
  const tutor = useTutor()!;
  const [onFor, setOnFor] = useState(true);
  const [onWhile, setOnWhile] = useState(true);
  return (
    <>
      <button onClick={tutor.toggle}>toggle</button>
      <button onClick={() => tutor.openLesson(FOR_LESSON)}>ask lesson</button>
      <button onClick={() => tutor.openLesson(WHILE_LESSON)}>ask other lesson</button>
      <button onClick={() => setOnFor(false)}>leave lesson</button>
      <button onClick={() => setOnWhile(false)}>leave other lesson</button>
      <button onClick={() => tutor.reportStage(FOR_REF, standing.current)}>report stage</button>
      {onFor && <OnLesson lesson={FOR_REF} />}
      {onWhile && <OnLesson lesson={WHILE_REF} />}
      {tutor.open && <TutorPanel />}
      <Where />
    </>
  );
}

function app(path: string) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <TutorProvider>
        <Shell />
      </TutorProvider>
    </MemoryRouter>
  );
}

function renderTutor(path = '/courses') {
  return render(app(path));
}

async function openPanel() {
  fireEvent.click(screen.getByText('toggle'));
  await screen.findByRole('complementary', { name: 'Tutor' });
}

async function openLesson(name = 'ask lesson') {
  fireEvent.click(screen.getByText(name));
  await screen.findByRole('complementary', { name: 'Tutor' });
}

function historyList() {
  return screen.getByRole('navigation', { name: 'Conversations' });
}

// Opens the history and picks the conversation with this title.
async function openSaved(title: string) {
  if (!screen.queryByRole('navigation', { name: 'Conversations' })) {
    fireEvent.click(screen.getByRole('button', { name: 'Conversations' }));
  }
  fireEvent.click(await within(historyList()).findByRole('button', { name: new RegExp(title) }));
}

// The text where the panel shows it, outside the history's list.
async function inPanel(text: string) {
  await waitFor(() =>
    expect(screen.getAllByText(text).filter((e) => !e.closest('nav'))).toHaveLength(1),
  );
}

function type(text: string) {
  const box = screen.getByRole('textbox', { name: 'Ask the tutor' });
  fireEvent.change(box, { target: { value: text } });
  fireEvent.keyDown(box, { key: 'Enter' });
}

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { user: USER };
  h.canAccess.mockReturnValue(true);
  saved([]);
  h.deleteConversation.mockResolvedValue(undefined);
  work.current = { code: 'for i in x:', runOutput: '', submissionId: 3 };
  h.usage.summary = null;
  localStorage.clear();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false })),
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('TutorPanel', () => {
  it('opens on a new conversation each time, with the saved ones in the history', async () => {
    saved([summary(1, 'Why a loop?')], {
      1: [message(2, 'tutor', 'Because it repeats.'), message(1, 'student', 'Why a loop?')],
    });
    renderTutor();
    await openPanel();
    expect(screen.getByText('How can I help?')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();

    await openSaved('Why a loop');
    const reply = await screen.findByText('Because it repeats.');
    const question = screen.getAllByText('Why a loop?').find((e) => !e.closest('nav'))!;
    expect(question.compareDocumentPosition(reply)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(h.getConversation).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('complementary')).toBeNull();
    await openPanel();
    expect(screen.getByText('How can I help?')).toBeInTheDocument();
    await openSaved('Why a loop');
    expect(screen.getByText('Because it repeats.')).toBeInTheDocument();
    expect(h.getConversation).toHaveBeenCalledTimes(1);
  });

  it('greets an empty conversation and closes on Escape', async () => {
    renderTutor();
    await openPanel();
    expect(await screen.findByText(/Ask about a lesson/)).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('greets the student by their first name, as fits the hour', async () => {
    h.auth = { user: { ...USER, name: 'Ada Lovelace' } };
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 15, 21, 0));
    renderTutor();
    await openPanel();
    expect(await screen.findByText('Good evening, Ada. How can I help?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle'));
    vi.setSystemTime(new Date(2026, 9, 16, 2, 30));
    await openPanel();
    expect(screen.getByText('Working late, Ada. How can I help?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle'));
    vi.setSystemTime(new Date(2026, 9, 16, 9, 0));
    await openPanel();
    expect(screen.getByText('Good morning, Ada. How can I help?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle'));
    vi.setSystemTime(new Date(2026, 9, 16, 14, 0));
    await openPanel();
    expect(screen.getByText('Hi, Ada. How can I help?')).toBeInTheDocument();
  });

  it('offers questions to start with, and sends the one picked', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    renderTutor();
    await openPanel();
    expect(await screen.findByText('How can I help?')).toBeInTheDocument();
    answer();
    fireEvent.click(screen.getByRole('button', { name: 'What is a variable?' }));
    expect(h.streamChat.mock.calls[0][0]).toMatchObject({ message: 'What is a variable?' });
    expect(screen.queryByRole('button', { name: 'What is a variable?' })).toBeNull();
  });

  it('picks other questions each time a general conversation opens, one fitting the page first', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    const starters = () =>
      within(screen.getByText(/Ask about a lesson/).parentElement!)
        .getAllByRole('button')
        .map((b) => b.textContent);
    renderTutor('/forum');
    await openPanel();
    await screen.findByText(/Ask about a lesson/);
    expect(starters()).toEqual([
      'Which course should I start with?',
      'What is a variable?',
      'What can you help me with?',
    ]);

    fireEvent.click(screen.getByText('toggle'));
    random.mockReturnValue(0.99);
    await openPanel();
    expect(starters()).toEqual([
      'How do I get better at programming?',
      'How do I find a bug in my code?',
      "What do I do when I'm stuck on a problem?",
    ]);
  });

  it('starts with a question about the challenges on their page', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    renderTutor('/algorithms/python');
    await openPanel();
    const greeting = (await screen.findByText(/Ask about a lesson/)).parentElement!;
    expect(
      within(greeting)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual([
      'Which challenge should I try first?',
      'How do I get better at programming?',
      'How do I find a bug in my code?',
    ]);
  });

  it('says when the saved messages could not be read', async () => {
    saved([summary(1, 'Lost')]);
    h.getConversation.mockRejectedValue(new Error('down'));
    renderTutor();
    await openPanel();
    await openSaved('Lost');
    expect(await screen.findByText(/earlier messages couldn't be loaded/)).toBeInTheDocument();
  });

  it('continues the conversation its first answer was saved to', async () => {
    renderTutor();
    await openPanel();
    const first = answer();
    type('What is a loop?');
    expect(h.streamChat.mock.calls[0][0]).not.toHaveProperty('conversationId');
    saved([summary(31, 'What is a loop?')]);
    first.emit({ type: 'text', text: 'Code that repeats.' });
    first.emit({ type: 'done', finish: 'complete', conversationId: 31 });
    await first.end();
    expect(h.listConversations).toHaveBeenCalledTimes(2);

    answer();
    type('And in Java?');
    expect(h.streamChat.mock.calls[1][0]).toMatchObject({
      message: 'And in Java?',
      conversationId: 31,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Conversations' }));
    expect(
      await within(historyList()).findByRole('button', { name: /What is a loop/ }),
    ).toHaveAttribute('aria-current', 'true');
  });

  it('starts a new conversation from the header and from the history', async () => {
    saved([summary(1, 'Old talk')], { 1: [message(1, 'student', 'Old talk')] });
    renderTutor();
    await openPanel();
    expect(screen.getByRole('button', { name: 'New conversation' })).toBeDisabled();
    await openSaved('Old talk');
    await inPanel('Old talk');

    const header = screen
      .getAllByRole('button', { name: 'New conversation' })
      .find((b) => !b.closest('nav'))!;
    fireEvent.click(header);
    expect(screen.getByText('How can I help?')).toBeInTheDocument();

    await openSaved('Old talk');
    fireEvent.click(within(historyList()).getByRole('button', { name: 'New conversation' }));
    expect(screen.getByText('How can I help?')).toBeInTheDocument();
  });

  it('names what it is doing until the first words, then streams them', async () => {
    renderTutor('/lesson/python/for');
    await openPanel();
    await screen.findByText(/Ask about a lesson/);
    const reply = answer();
    type('How do loops end?');

    expect(h.streamChat.mock.calls[0][0]).toEqual({
      message: 'How do loops end?',
      page: '/lesson/python/for',
      lang: 'en',
    });
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('status')).toHaveTextContent('Thinking it through');
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    // Each lookup as the server names it, a lesson by its title.
    reply.emit({ type: 'status', lookup: 'search' });
    expect(screen.getByRole('status')).toHaveTextContent('Searching the lessons');
    reply.emit({ type: 'status', lookup: 'pages' });
    expect(screen.getByRole('status')).toHaveTextContent('Looking through the app');
    reply.emit({ type: 'status', lookup: 'read' });
    expect(screen.getByRole('status')).toHaveTextContent('Reading a lesson');
    reply.emit({ type: 'status', lookup: 'read', title: 'For loops' });
    expect(screen.getByRole('status')).toHaveTextContent('Reading “For loops”');

    reply.emit({ type: 'text', text: 'When the' });
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByText('When the')).toBeInTheDocument();
    reply.emit({ type: 'text', text: ' condition is false.' });
    expect(screen.getByText('When the condition is false.')).toBeInTheDocument();
    reply.emit({ type: 'done', finish: 'complete' });
    await reply.end();

    expect(screen.getByText('How do loops end?')).toBeInTheDocument();
    expect(screen.getByText('When the condition is false.')).toBeInTheDocument();
    expect(screen.queryByText(/cut short/)).toBeNull();
  });

  it('sends an address the endpoint would refuse as the home page', async () => {
    renderTutor('/almanac/c++');
    await openPanel();
    answer();
    type('Hi');
    expect(h.streamChat.mock.calls[0][0]).toMatchObject({ page: '/' });
  });

  it('marks an answer cut by the length limit', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Explain recursion');
    reply.emit({ type: 'text', text: 'A function that' });
    reply.emit({ type: 'done', finish: 'cut' });
    await reply.end();
    expect(screen.getByText('The answer was cut short.')).toBeInTheDocument();
  });

  it('shows a short line for an answer blocked before any words, live and saved', async () => {
    saved([summary(1, 'Earlier')], {
      1: [message(2, 'tutor', '', 'blocked'), message(1, 'student', 'Earlier')],
    });
    renderTutor();
    await openPanel();
    await openSaved('Earlier');
    expect(await screen.findAllByText(/can't help with this one/)).toHaveLength(1);
    const reply = answer();
    type('Something odd');
    reply.emit({ type: 'done', finish: 'blocked' });
    await reply.end();
    expect(screen.getAllByText(/can't help with this one/)).toHaveLength(2);
  });

  it('says why an answer blocked after some words stopped, live and saved', async () => {
    saved([summary(1, 'Earlier')], {
      1: [message(2, 'tutor', 'Earlier words', 'blocked'), message(1, 'student', 'Earlier')],
    });
    renderTutor();
    await openPanel();
    await openSaved('Earlier');
    expect(await screen.findByText('Earlier words')).toBeInTheDocument();
    expect(
      screen.getAllByText('The tutor stopped this answer here. Try asking another way.'),
    ).toHaveLength(1);

    const reply = answer();
    type('Go on');
    reply.emit({ type: 'text', text: 'Some words' });
    reply.emit({ type: 'done', finish: 'blocked' });
    await reply.end();
    expect(screen.getByText('Some words')).toBeInTheDocument();
    expect(screen.getAllByText(/stopped this answer here/)).toHaveLength(2);
    expect(screen.queryByText(/can't help with this one/)).toBeNull();
  });

  it('offers the message again when the tutor fails before any words', async () => {
    renderTutor();
    await openPanel();
    const first = answer();
    type('Hello?');
    await first.fail(new ApiClientError(502, 'The tutor could not answer'));

    expect(screen.getByText('Hello?')).toBeInTheDocument();
    expect(screen.getByText("The tutor couldn't answer right now.")).toBeInTheDocument();
    expect(h.listConversations).toHaveBeenCalledTimes(1);
    const second = answer();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(h.streamChat.mock.calls[1][0]).toMatchObject({ message: 'Hello?' });
    second.emit({ type: 'text', text: 'Hi!' });
    second.emit({ type: 'done', finish: 'complete' });
    await second.end();
    expect(screen.queryByText(/couldn't answer/)).toBeNull();
    expect(screen.getAllByText('Hello?')).toHaveLength(1);
  });

  it('offers the message again when the stream ends in an error before any words', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Which lesson?');
    reply.emit({ type: 'status', lookup: 'search' });
    reply.emit({ type: 'error', message: 'The tutor could not answer right now' });
    await reply.end();

    expect(screen.getByText('Which lesson?')).toBeInTheDocument();
    expect(screen.getByText("The tutor couldn't answer right now.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('asks to wait after too many messages', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Again');
    await reply.fail(new ApiClientError(429, 'Too many attempts, try again in 40s.'));
    expect(screen.getByText(/Too many messages/)).toBeInTheDocument();
  });

  it('keeps the words of an answer that broke off, with Try again, in its saved conversation', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Tell me about lists');
    reply.emit({ type: 'text', text: 'Lists hold' });
    reply.emit({ type: 'error', message: 'Something went wrong', conversationId: 44 });
    await reply.end();
    expect(screen.getByText('Lists hold')).toBeInTheDocument();
    // The question was saved with the partial answer, so it shows once.
    expect(screen.getAllByText('Tell me about lists')).toHaveLength(1);

    answer();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(h.streamChat.mock.calls[1][0]).toMatchObject({ conversationId: 44 });
  });

  it('treats a stream that closed without an ending as broken off', async () => {
    renderTutor();
    await openPanel();
    const first = answer();
    type('One');
    await first.end();
    expect(screen.getByText("The tutor couldn't answer right now.")).toBeInTheDocument();

    const second = answer();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    second.emit({ type: 'text', text: 'Half an' });
    await second.end();
    expect(screen.getByText('Half an')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();

    const third = answer();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    third.emit({ type: 'text', text: 'Partly' });
    await third.fail(new TypeError('network'));
    expect(screen.getByText('Partly')).toBeInTheDocument();
  });

  it('loads earlier messages above the ones on screen', async () => {
    saved([summary(1, 'Paged')]);
    h.getConversation
      .mockResolvedValueOnce({ messages: [message(40, 'student', 'Newer')], hasMore: true })
      .mockResolvedValueOnce({ messages: [message(39, 'tutor', 'Older')], hasMore: false });
    renderTutor();
    await openPanel();
    await openSaved('Paged');
    fireEvent.click(await screen.findByRole('button', { name: 'Show earlier messages' }));
    const older = await screen.findByText('Older');
    expect(h.getConversation).toHaveBeenLastCalledWith(1, 40);
    expect(older.compareDocumentPosition(screen.getByText('Newer'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.queryByRole('button', { name: 'Show earlier messages' })).toBeNull();
  });

  it('keeps the view when earlier messages fail to load', async () => {
    saved([summary(1, 'Paged')]);
    h.getConversation
      .mockResolvedValueOnce({ messages: [message(40, 'student', 'Newer')], hasMore: true })
      .mockRejectedValueOnce(new Error('down'));
    renderTutor();
    await openPanel();
    await openSaved('Paged');
    fireEvent.click(await screen.findByRole('button', { name: 'Show earlier messages' }));
    await waitFor(() => expect(h.getConversation).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Newer')).toBeInTheDocument();
  });

  it('deletes the conversation only once confirmed, then starts a new one', async () => {
    saved([summary(1, 'Keep me?')], { 1: [message(1, 'student', 'Keep me?')] });
    const confirm = vi.fn(() => false);
    vi.stubGlobal('confirm', confirm);
    renderTutor();
    await openPanel();
    await openSaved('Keep me');
    await inPanel('Keep me?');
    const remove = screen.getByRole('button', { name: 'Delete conversation' });

    fireEvent.click(remove);
    expect(h.deleteConversation).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(remove);
    await waitFor(() => expect(screen.getByText(/Ask about a lesson/)).toBeInTheDocument());
    expect(h.deleteConversation).toHaveBeenCalledWith(1);
    expect(within(historyList()).queryByRole('button', { name: /Keep me/ })).toBeNull();
  });

  it('follows an in-app link without closing, and opens others in a new tab', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Where?');
    reply.emit({
      type: 'text',
      text: 'See [For loops](/lesson/python/for) or [docs](https://python.org).',
    });
    reply.emit({ type: 'done', finish: 'complete' });
    await reply.end();
    const external = screen.getByRole('link', { name: 'docs' });
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');

    fireEvent.click(screen.getByRole('link', { name: 'For loops' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/lesson/python/for');
    expect(screen.getByRole('complementary', { name: 'Tutor' })).toBeInTheDocument();
  });

  it('steps aside on a phone when a link opens a page', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Where?');
    reply.emit({ type: 'text', text: 'See [For loops](/lesson/python/for).' });
    reply.emit({ type: 'done', finish: 'complete' });
    await reply.end();
    fireEvent.click(screen.getByRole('link', { name: 'For loops' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/lesson/python/for');
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('forgets the conversations when someone else signs in', async () => {
    const view = renderTutor();
    await openPanel();
    const reply = answer();
    type('Mine');
    reply.emit({ type: 'done', finish: 'complete', conversationId: 3 });
    await reply.end();

    h.auth = { user: { id: 8, role: 'USER' } };
    view.rerender(app('/courses'));
    expect(screen.queryByRole('complementary')).toBeNull();
    await openPanel();
    expect(screen.queryByText('Mine')).toBeNull();
  });

  it('stays shut for a student the gate keeps out', async () => {
    h.canAccess.mockReturnValue(false);
    renderTutor();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});

describe('TutorPanel: the history', () => {
  it('lists the conversations by day, each with its lesson or as general', async () => {
    saved([
      summary(3, 'Why twice?', FOR_REF),
      summary(2, 'Hello there'),
      summary(1, 'Long ago', null, '2020-01-01T00:00:00.000Z'),
    ]);
    renderTutor();
    await openPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Conversations' }));
    const list = historyList();

    expect(
      await within(list).findByRole('button', { name: /Why twice\?.*For loops/ }),
    ).toBeInTheDocument();
    expect(within(list).getByRole('button', { name: /Hello there.*General/ })).toBeInTheDocument();
    const headings = within(list)
      .getAllByRole('heading', { level: 3 })
      .map((e) => e.textContent);
    expect(headings).toEqual(['Today', 'Earlier']);
  });

  it('says when there are none yet', async () => {
    renderTutor();
    await openPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Conversations' }));
    expect(await within(historyList()).findByText('No conversations yet.')).toBeInTheDocument();
  });

  it('says when they could not be read, and tries again when opened again', async () => {
    h.listConversations.mockRejectedValue(new Error('down'));
    renderTutor();
    await openPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Conversations' }));
    expect(
      await within(historyList()).findByText("Your conversations couldn't be loaded."),
    ).toBeInTheDocument();

    saved([summary(1, 'Back again')]);
    fireEvent.click(screen.getByRole('button', { name: 'Hide conversations' }));
    fireEvent.click(screen.getByRole('button', { name: 'Conversations' }));
    expect(
      await within(historyList()).findByRole('button', { name: /Back again/ }),
    ).toBeInTheDocument();
  });

  it('remembers whether it was open', async () => {
    const view = renderTutor();
    await openPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Conversations' }));
    view.unmount();

    renderTutor();
    await openPanel();
    expect(historyList()).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hide conversations' }));
    expect(screen.queryByRole('navigation', { name: 'Conversations' })).toBeNull();
  });

  it("opens a lesson's conversation on its lesson's page", async () => {
    saved([summary(5, 'About for', FOR_REF)], { 5: [message(1, 'student', 'About for')] });
    renderTutor('/courses');
    await openPanel();
    await openSaved('About for');

    expect(screen.getByTestId('where')).toHaveTextContent('/lesson/python/for');
    await inPanel('About for');
    await inPanel('For loops');
  });

  it("stays open on the lesson's page once it opens there, mounted twice or not", async () => {
    saved([summary(5, 'About for', FOR_REF)], { 5: [message(1, 'student', 'About for')] });
    function Opener() {
      const tutor = useTutor()!;
      return <button onClick={tutor.toggle}>toggle</button>;
    }
    function Panel() {
      return useTutor()!.open ? <TutorPanel /> : null;
    }
    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/courses']}>
          <TutorProvider>
            <Opener />
            <Routes>
              <Route path="/lesson/python/for" element={<OnLesson lesson={FOR_REF} />} />
              <Route path="*" element={null} />
            </Routes>
            <Panel />
          </TutorProvider>
        </MemoryRouter>
      </StrictMode>,
    );
    await openPanel();
    await openSaved('About for');
    await inPanel('About for');
    await act(async () => {});
    expect(screen.getByRole('complementary', { name: 'Tutor' })).toBeInTheDocument();
  });

  it('closes on a phone once a conversation is picked', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    saved([summary(1, 'Hello there')]);
    renderTutor();
    await openPanel();
    await openSaved('Hello there');
    expect(screen.queryByRole('navigation', { name: 'Conversations' })).toBeNull();
  });
});

describe('TutorPanel: a lesson conversation', () => {
  it("opens on the lesson's newest conversation, named after the lesson", async () => {
    saved(
      [summary(6, 'General one'), summary(5, 'About for', FOR_REF), summary(4, 'Older', FOR_REF)],
      {
        5: [message(5, 'student', 'About for')],
      },
    );
    renderTutor('/lesson/python/for');
    await openLesson();

    expect(await screen.findByText('About for')).toBeInTheDocument();
    expect(h.getConversation).toHaveBeenCalledWith(5);
    expect(h.getConversation).toHaveBeenCalledTimes(1);
    expect(screen.getByText('For loops')).toBeInTheDocument();
    expect(screen.queryByText('General')).toBeNull();
  });

  it('greets a lesson with no conversation yet with what the tutor can see', async () => {
    renderTutor('/lesson/python/for');
    await openLesson();
    expect(await screen.findByText(/sees your code/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Give me a nudge' })).toBeInTheDocument();
  });

  it('suggests what fits where the student stands on the lesson', async () => {
    renderTutor('/lesson/python/for');
    await openLesson();
    await screen.findByText(/sees your code/);
    // The buttons of the empty conversation's greeting.
    const starters = () =>
      within(screen.getByText(/sees your code/).parentElement!)
        .getAllByRole('button')
        .map((b) => b.textContent);
    const tell = (stage: TutorLessonStage) => {
      standing.current = stage;
      fireEvent.click(screen.getByText('report stage'));
    };
    expect(starters()).toEqual([
      'Explain the task to me',
      "Why doesn't my code work?",
      'Give me a nudge',
    ]);
    tell({ stage: 'empty' });
    expect(starters()).toEqual(['Where do I start?', 'Explain the task to me', 'Give me a nudge']);
    tell({ stage: 'failing' });
    expect(starters()[0]).toBe("Why doesn't my code work?");
    tell({ stage: 'passed' });
    expect(starters()).toEqual([
      'Could it be simpler?',
      'Why does this work?',
      'Where else is this idea used?',
    ]);
    tell({ stage: 'failing', test: 3 });
    expect(starters()).toEqual([
      'Why does test 3 fail?',
      'Give me a nudge',
      'Explain the task to me',
    ]);

    answer();
    fireEvent.click(screen.getByRole('button', { name: 'Why does test 3 fail?' }));
    expect(h.streamChat.mock.calls[0][0]).toMatchObject({ message: 'Why does test 3 fail?' });
  });

  it('keeps a lesson stage to its own lesson', async () => {
    renderTutor('/lesson/python/while');
    standing.current = { stage: 'passed' };
    fireEvent.click(screen.getByText('report stage'));
    await openLesson('ask other lesson');
    expect(
      await screen.findByRole('button', { name: 'Explain the task to me' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Could it be simpler?' })).toBeNull();
  });

  it('sends the lesson and the work as it is when each message goes', async () => {
    renderTutor('/lesson/python/for');
    await openLesson();
    await screen.findByText(/sees your code/);
    const first = answer();
    type('Why?');
    expect(h.streamChat.mock.calls[0][0]).toEqual({
      message: 'Why?',
      page: '/lesson/python/for',
      lang: 'en',
      lesson: FOR_REF,
      work: { code: 'for i in x:', runOutput: '', submissionId: 3 },
    });
    expect(screen.getByRole('status')).toHaveTextContent('Looking at your work');
    first.emit({ type: 'done', finish: 'complete', conversationId: 8 });
    await first.end();

    work.current = { code: 'for i in range(3):', runOutput: '0\n', submissionId: undefined };
    answer();
    type('And now?');
    expect(h.streamChat.mock.calls[1][0]).toMatchObject({
      conversationId: 8,
      lesson: FOR_REF,
      work: { code: 'for i in range(3):', runOutput: '0\n', submissionId: undefined },
    });
  });

  it('starts a new conversation about the same lesson', async () => {
    saved([summary(5, 'About for', FOR_REF)], { 5: [message(5, 'student', 'About for')] });
    renderTutor('/lesson/python/for');
    await openLesson();
    await screen.findByText('About for');

    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
    expect(screen.getByRole('button', { name: 'Give me a nudge' })).toBeInTheDocument();
    answer();
    type('Fresh start');
    expect(h.streamChat.mock.calls[0][0]).toMatchObject({ lesson: FOR_REF });
    expect(h.streamChat.mock.calls[0][0]).not.toHaveProperty('conversationId');
  });

  it('switches from a general conversation to the lesson, and the sidebar starts a new general one', async () => {
    saved([summary(5, 'Lesson question', FOR_REF)], {
      5: [message(5, 'student', 'Lesson question')],
    });
    renderTutor('/lesson/python/for');
    await openPanel();
    const reply = answer();
    type('General question');
    reply.emit({ type: 'done', finish: 'complete', conversationId: 9 });
    await reply.end();

    await openLesson();
    expect(await screen.findByText('Lesson question')).toBeInTheDocument();
    expect(screen.queryByText('General question')).toBeNull();

    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByText('How can I help?')).toBeInTheDocument();
    expect(screen.queryByText('Lesson question')).toBeNull();

    fireEvent.click(screen.getByText('toggle'));
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('closes when the student leaves the lesson, and shows the same conversation back', async () => {
    saved([summary(5, 'Lesson question', FOR_REF)], {
      5: [message(5, 'student', 'Lesson question')],
    });
    renderTutor('/lesson/python/for');
    await openLesson();
    await screen.findByText('Lesson question');

    fireEvent.click(screen.getByText('leave other lesson'));
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    fireEvent.click(screen.getByText('leave lesson'));
    await waitFor(() => expect(screen.queryByRole('complementary')).toBeNull());

    await openLesson();
    expect(screen.getByText('Lesson question')).toBeInTheDocument();
    expect(h.getConversation).toHaveBeenCalledTimes(1);
  });

  it('leaves a general conversation open when the student leaves a lesson', async () => {
    renderTutor('/lesson/python/for');
    await openPanel();
    fireEvent.click(screen.getByText('leave lesson'));
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('lets an answer finish in its own conversation while another one is shown', async () => {
    renderTutor('/lesson/python/for');
    await openLesson();
    await screen.findByText(/sees your code/);
    const reply = answer();
    type('Explain for');
    reply.emit({ type: 'text', text: 'It walks' });

    fireEvent.click(screen.getByText('toggle'));
    await screen.findByText(/Ask about a lesson/);
    expect(screen.queryByText('It walks')).toBeNull();
    // The general conversation isn't waiting for it.
    expect(screen.getByRole('textbox')).toBeEnabled();

    saved([summary(12, 'Explain for', FOR_REF)]);
    reply.emit({ type: 'text', text: ' through each item.' });
    reply.emit({ type: 'done', finish: 'complete', conversationId: 12 });
    await reply.end();
    expect(screen.queryByText('It walks through each item.')).toBeNull();

    await openLesson();
    expect(screen.getByText('Explain for')).toBeInTheDocument();
    expect(screen.getByText('It walks through each item.')).toBeInTheDocument();
    expect(h.getConversation).not.toHaveBeenCalled();
    expect(h.usage.refresh).toHaveBeenCalledOnce();
  });

  it('keeps each lesson in its own conversation', async () => {
    saved([summary(2, 'About while', WHILE_REF), summary(1, 'About for', FOR_REF)], {
      1: [message(1, 'student', 'About for')],
      2: [message(2, 'student', 'About while')],
    });
    renderTutor('/lesson/python/for');
    await openLesson();
    await screen.findByText('About for');
    await openLesson('ask other lesson');
    expect(await screen.findByText('About while')).toBeInTheDocument();
    expect(screen.queryByText('About for')).toBeNull();
    expect(screen.getByText('While loops')).toBeInTheDocument();
  });

  it('shows a link to another lesson as plain words, never as a link', async () => {
    saved([summary(5, 'Linked', FOR_REF)], {
      5: [
        message(2, 'tutor', 'As [While loops](/lesson/python/while) shows, the condition decides.'),
      ],
    });
    renderTutor('/lesson/python/for');
    await openLesson();
    expect(await screen.findByText(/While loops/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'While loops' })).toBeNull();
  });

  it("deletes and pages back through the lesson's conversation", async () => {
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
    saved([summary(5, 'Newer', FOR_REF)]);
    h.getConversation
      .mockResolvedValueOnce({ messages: [message(40, 'student', 'Newer')], hasMore: true })
      .mockResolvedValueOnce({ messages: [message(39, 'tutor', 'Older')], hasMore: false });
    renderTutor('/lesson/python/for');
    await openLesson();
    fireEvent.click(await screen.findByRole('button', { name: 'Show earlier messages' }));
    await screen.findByText('Older');
    expect(h.getConversation).toHaveBeenLastCalledWith(5, 40);

    fireEvent.click(screen.getByRole('button', { name: 'Delete conversation' }));
    await waitFor(() => expect(screen.queryByText('Newer')).toBeNull());
    expect(h.deleteConversation).toHaveBeenCalledWith(5);
    expect(screen.getByRole('button', { name: 'Give me a nudge' })).toBeInTheDocument();
  });
});

// The session with `used` of its 30 units gone, refilling at `resetAt`.
function session(
  used: number,
  resetAt: string | null = '2026-10-15T14:30:00.000Z',
): {
  tutorMessage: UsageState;
} {
  return {
    tutorMessage: { used, limit: 30, remaining: 30 - used, resetAt, unlimited: false },
  };
}

describe('TutorPanel: the 5-hour session', () => {
  const refill = new Date('2026-10-15T14:30:00.000Z').toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit',
  });

  it('says nothing below 90% used', async () => {
    h.usage.summary = session(26);
    renderTutor();
    await openPanel();
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Ask the tutor' })).toBeEnabled();
  });

  it('shows a notice at 90% used, which stays closed for that window once closed', async () => {
    h.usage.summary = session(27);
    const view = renderTutor();
    await openPanel();
    expect(
      screen.getByText(
        `You've used 90% of this session's tutor messages. They refill at ${refill}.`,
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close notice' }));
    expect(screen.queryByText(/used 90%/)).toBeNull();

    view.unmount();
    renderTutor();
    await openPanel();
    expect(screen.queryByText(/used 90%/)).toBeNull();

    // The next window's notice is a new one.
    h.usage.summary = session(28, '2026-10-15T20:00:00.000Z');
    fireEvent.click(screen.getByText('toggle'));
    await openPanel();
    expect(screen.getByText(/used 90%/)).toBeInTheDocument();
  });

  it('shuts the box at the limit and opens it again when the window ends', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    vi.setSystemTime(new Date('2026-10-15T14:00:00.000Z'));
    h.usage.summary = session(30);
    const view = renderTutor();
    fireEvent.click(screen.getByText('toggle'));
    await act(async () => {});

    expect(
      screen.getByText(`You've used your messages for now. You can chat again at ${refill}.`),
    ).toBeInTheDocument();
    expect(screen.queryByText(/used 90%/)).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Ask the tutor' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();

    act(() => vi.advanceTimersByTime(30 * 60 * 1000 - 1));
    expect(h.usage.refresh).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1001));
    expect(h.usage.refresh).toHaveBeenCalledOnce();

    h.usage.summary = session(0, null);
    view.rerender(
      <MemoryRouter initialEntries={['/courses']}>
        <TutorProvider>
          <Shell />
        </TutorProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('textbox', { name: 'Ask the tutor' })).toBeEnabled();
    expect(screen.queryByText(/You can chat again/)).toBeNull();
  });

  it('reads the usage again once an answer has ended', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('What is a loop?');
    await reply.emit({ type: 'text', text: 'A loop repeats.' });
    expect(h.usage.refresh).not.toHaveBeenCalled();
    await reply.emit({ type: 'done', finish: 'complete' });
    await reply.end();
    expect(h.usage.refresh).toHaveBeenCalledOnce();
  });

  it('tells a spent session apart from too many messages in a minute', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('One more?');
    await reply.fail(new ApiClientError(429, 'Limit reached. It refills at 2026-10-15T14:30:00Z'));

    expect(screen.getByText("Not sent: you've used your messages for now.")).toBeInTheDocument();
    expect(screen.queryByText(/Too many messages/)).toBeNull();
    expect(h.usage.refresh).toHaveBeenCalledOnce();
  });

  it('offers no Try again while the session is spent', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('One more?');
    h.usage.summary = session(30);
    await reply.fail(new ApiClientError(429, 'Limit reached. It refills at 2026-10-15T14:30:00Z'));

    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
  });

  it('never limits an admin', async () => {
    h.usage.summary = {
      tutorMessage: { used: 0, limit: 30, remaining: Infinity, resetAt: null, unlimited: true },
    };
    renderTutor();
    await openPanel();
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Ask the tutor' })).toBeEnabled();
  });
});
