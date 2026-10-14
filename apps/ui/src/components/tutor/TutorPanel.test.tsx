import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import type { TutorMessage, TutorStreamEvent } from '@cyberstars/shared/tutor';
import { ApiClientError } from '../../services/apiClient';

const h = vi.hoisted(() => ({
  auth: { user: null as null | { id: number; role: string } },
  canAccess: vi.fn((..._a: unknown[]) => true),
  getGeneralConversation: vi.fn(),
  deleteGeneralConversation: vi.fn(),
  streamChat: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('@cyberstars/shared/features', () => ({
  canAccessFeature: (...a: unknown[]) => h.canAccess(...a),
}));
vi.mock('../../services/tutorService', () => ({
  getGeneralConversation: h.getGeneralConversation,
  deleteGeneralConversation: h.deleteGeneralConversation,
  streamChat: h.streamChat,
}));

import { TutorProvider, useTutor } from '../../context/TutorContext';
import { TutorPanel } from './TutorPanel';

const USER = { id: 7, role: 'USER' };

function message(
  id: number,
  role: TutorMessage['role'],
  text: string,
  finish = null as TutorMessage['finish'],
): TutorMessage {
  return { id, role, text, finish, createdAt: '2026-10-14T10:00:00Z' };
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

// The sidebar's entry, the panel where the shell puts it, and a way to switch user.
function Shell() {
  const tutor = useTutor()!;
  return (
    <>
      <button onClick={tutor.toggle}>toggle</button>
      {tutor.open && <TutorPanel />}
      <Where />
    </>
  );
}

function renderTutor(path = '/courses') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TutorProvider>
        <Shell />
      </TutorProvider>
    </MemoryRouter>,
  );
}

async function openPanel() {
  fireEvent.click(screen.getByText('toggle'));
  await screen.findByRole('complementary', { name: 'Tutor' });
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
  h.getGeneralConversation.mockResolvedValue({ messages: [], hasMore: false });
  h.deleteGeneralConversation.mockResolvedValue(undefined);
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false })),
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('TutorPanel', () => {
  it('opens on the saved conversation, oldest first, and reads it only once', async () => {
    h.getGeneralConversation.mockResolvedValue({
      messages: [message(2, 'tutor', 'Because it repeats.'), message(1, 'student', 'Why a loop?')],
      hasMore: false,
    });
    renderTutor();
    await openPanel();
    const question = await screen.findByText('Why a loop?');
    const reply = screen.getByText('Because it repeats.');
    expect(question.compareDocumentPosition(reply)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('complementary')).toBeNull();
    await openPanel();
    expect(screen.getByText('Why a loop?')).toBeInTheDocument();
    expect(h.getGeneralConversation).toHaveBeenCalledTimes(1);
  });

  it('greets an empty conversation and closes on Escape', async () => {
    renderTutor();
    await openPanel();
    expect(await screen.findByText(/Ask about a lesson/)).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('says when the saved messages could not be read', async () => {
    h.getGeneralConversation.mockRejectedValue(new Error('down'));
    renderTutor();
    await openPanel();
    expect(await screen.findByText(/couldn't be loaded/)).toBeInTheDocument();
  });

  it('names what it is doing until the first words, then streams them', async () => {
    renderTutor('/lesson/python/for');
    await openPanel();
    await screen.findByText(/Ask about a lesson/);
    vi.useFakeTimers();
    const reply = answer();
    type('How do loops end?');

    expect(h.streamChat.mock.calls[0][0]).toEqual({
      message: 'How do loops end?',
      page: '/lesson/python/for',
      lang: 'en',
    });
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('status')).toHaveTextContent('Reading the lesson');
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole('status')).toHaveTextContent('Looking at your code');
    // Each entry starts its own clock once it shows; past the last one it stays.
    for (let i = 0; i < 6; i++) act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole('status')).toHaveTextContent('Writing an answer');
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();

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
    h.getGeneralConversation.mockResolvedValue({
      messages: [message(2, 'tutor', '', 'blocked'), message(1, 'student', 'Earlier')],
      hasMore: false,
    });
    renderTutor();
    await openPanel();
    expect(await screen.findAllByText(/can't help with this one/)).toHaveLength(1);
    const reply = answer();
    type('Something odd');
    reply.emit({ type: 'done', finish: 'blocked' });
    await reply.end();
    expect(screen.getAllByText(/can't help with this one/)).toHaveLength(2);
  });

  it('offers the message again when the tutor fails before any words', async () => {
    renderTutor();
    await openPanel();
    const first = answer();
    type('Hello?');
    await first.fail(new ApiClientError(502, 'The tutor could not answer'));

    expect(screen.getByText('Hello?')).toBeInTheDocument();
    expect(screen.getByText("The tutor couldn't answer right now.")).toBeInTheDocument();
    const second = answer();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(h.streamChat.mock.calls[1][0]).toMatchObject({ message: 'Hello?' });
    second.emit({ type: 'text', text: 'Hi!' });
    second.emit({ type: 'done', finish: 'complete' });
    await second.end();
    expect(screen.queryByText(/couldn't answer/)).toBeNull();
    expect(screen.getAllByText('Hello?')).toHaveLength(1);
  });

  it('asks to wait after too many messages', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Again');
    await reply.fail(new ApiClientError(429, 'Too many attempts, try again in 40s.'));
    expect(screen.getByText(/Too many messages/)).toBeInTheDocument();
  });

  it('keeps the words of an answer that broke off, with Try again', async () => {
    renderTutor();
    await openPanel();
    const reply = answer();
    type('Tell me about lists');
    reply.emit({ type: 'text', text: 'Lists hold' });
    reply.emit({ type: 'error', message: 'Something went wrong' });
    await reply.end();
    expect(screen.getByText('Lists hold')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    // The question was saved with the partial answer, so it shows once.
    expect(screen.getAllByText('Tell me about lists')).toHaveLength(1);
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
    h.getGeneralConversation
      .mockResolvedValueOnce({ messages: [message(40, 'student', 'Newer')], hasMore: true })
      .mockResolvedValueOnce({ messages: [message(39, 'tutor', 'Older')], hasMore: false });
    renderTutor();
    await openPanel();
    fireEvent.click(await screen.findByRole('button', { name: 'Show earlier messages' }));
    const older = await screen.findByText('Older');
    expect(h.getGeneralConversation).toHaveBeenLastCalledWith(40);
    expect(older.compareDocumentPosition(screen.getByText('Newer'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.queryByRole('button', { name: 'Show earlier messages' })).toBeNull();
  });

  it('keeps the view when earlier messages fail to load', async () => {
    h.getGeneralConversation
      .mockResolvedValueOnce({ messages: [message(40, 'student', 'Newer')], hasMore: true })
      .mockRejectedValueOnce(new Error('down'));
    renderTutor();
    await openPanel();
    fireEvent.click(await screen.findByRole('button', { name: 'Show earlier messages' }));
    await waitFor(() => expect(h.getGeneralConversation).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Newer')).toBeInTheDocument();
  });

  it('deletes the conversation only once confirmed', async () => {
    h.getGeneralConversation.mockResolvedValue({
      messages: [message(1, 'student', 'Keep me?')],
      hasMore: false,
    });
    const confirm = vi.fn(() => false);
    vi.stubGlobal('confirm', confirm);
    renderTutor();
    await openPanel();
    await screen.findByText('Keep me?');
    const remove = screen.getByRole('button', { name: 'Delete conversation' });

    fireEvent.click(remove);
    expect(h.deleteGeneralConversation).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(remove);
    await waitFor(() => expect(screen.queryByText('Keep me?')).toBeNull());
    expect(h.deleteGeneralConversation).toHaveBeenCalled();
    expect(screen.getByText(/Ask about a lesson/)).toBeInTheDocument();
  });

  it('follows an in-app link without closing, and opens others in a new tab', async () => {
    h.getGeneralConversation.mockResolvedValue({
      messages: [
        message(2, 'tutor', 'See [For loops](/lesson/python/for) or [docs](https://python.org).'),
      ],
      hasMore: false,
    });
    renderTutor();
    await openPanel();
    const external = await screen.findByRole('link', { name: 'docs' });
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
    h.getGeneralConversation.mockResolvedValue({
      messages: [message(2, 'tutor', 'See [For loops](/lesson/python/for).')],
      hasMore: false,
    });
    renderTutor();
    await openPanel();
    fireEvent.click(await screen.findByRole('link', { name: 'For loops' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/lesson/python/for');
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('shows code in an answer as plain code', async () => {
    h.getGeneralConversation.mockResolvedValue({
      messages: [message(2, 'tutor', '```python\nfor i in range(3):\n    print(i)\n```')],
      hasMore: false,
    });
    const { container } = renderTutor();
    await openPanel();
    await screen.findByText(/for i in range/);
    expect(container.querySelector('pre code')).not.toBeNull();
    expect(container.querySelector('.cm-editor')).toBeNull();
  });

  it('forgets the conversation when someone else signs in', async () => {
    h.getGeneralConversation.mockResolvedValue({
      messages: [message(1, 'student', 'Mine')],
      hasMore: false,
    });
    const view = renderTutor();
    await openPanel();
    await screen.findByText('Mine');

    h.auth = { user: { id: 8, role: 'USER' } };
    view.rerender(
      <MemoryRouter initialEntries={['/courses']}>
        <TutorProvider>
          <Shell />
        </TutorProvider>
      </MemoryRouter>,
    );
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(screen.queryByText('Mine')).toBeNull();
  });

  it('stays shut for a student the gate keeps out', async () => {
    h.canAccess.mockReturnValue(false);
    renderTutor();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});
