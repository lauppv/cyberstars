import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { TutorStreamEvent } from '@cyberstars/shared/tutor';
import { ApiClientError } from './apiClient';
import { deleteGeneralConversation, getGeneralConversation, streamChat } from './tutorService';

const fetchMock = vi.fn();

// A response whose body arrives in the given pieces, as a stream would.
function streamed(pieces: string[]): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const piece of pieces) controller.enqueue(encoder.encode(piece));
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

const REQUEST = { message: 'Why a loop?', page: '/courses', lang: 'en' as const };

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('the general conversation', () => {
  it('reads a page, older ones by the oldest id, and deletes it', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(Response.json({ messages: [], hasMore: false })),
    );
    await getGeneralConversation();
    await getGeneralConversation(41);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/tutor/conversations/general');
    expect(fetchMock.mock.calls[1][0]).toBe('/api/tutor/conversations/general?before=41');

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await deleteGeneralConversation();
    expect(fetchMock.mock.calls[2][0]).toBe('/api/tutor/conversations/general');
    expect(fetchMock.mock.calls[2][1]).toMatchObject({ method: 'DELETE' });
  });
});

describe('streamChat', () => {
  it('posts the message and hands over each event, even split across pieces', async () => {
    fetchMock.mockResolvedValue(
      streamed([
        'data: {"type":"text","text":"Hel',
        'lo"}\n\ndata: {"type":"text","text":" there"}\n\n',
        'data: {"type":"done","finish":"cut"}\n\n',
      ]),
    );
    const events: TutorStreamEvent[] = [];
    await streamChat(REQUEST, (e) => events.push(e));

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/tutor/chat');
    expect(init).toMatchObject({ method: 'POST', credentials: 'include' });
    expect(JSON.parse(init.body)).toEqual(REQUEST);
    expect(events).toEqual([
      { type: 'text', text: 'Hello' },
      { type: 'text', text: ' there' },
      { type: 'done', finish: 'cut' },
    ]);
  });

  it('reads an event the stream closed on without a blank line after it', async () => {
    fetchMock.mockResolvedValue(streamed(['data: {"type":"error","message":"broke"}']));
    const events: TutorStreamEvent[] = [];
    await streamChat(REQUEST, (e) => events.push(e));
    expect(events).toEqual([{ type: 'error', message: 'broke' }]);
  });

  it('throws the plain error a failure before any words gets', async () => {
    fetchMock.mockResolvedValue(Response.json({ error: 'Too many attempts' }, { status: 429 }));
    const err = await streamChat(REQUEST, () => {}).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiClientError);
    expect(err).toMatchObject({ status: 429, message: 'Too many attempts' });
  });

  it('throws a general message when the error is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('Bad gateway', { status: 502 }));
    await expect(streamChat(REQUEST, () => {})).rejects.toMatchObject({
      status: 502,
      message: 'Something went wrong',
    });
  });
});
