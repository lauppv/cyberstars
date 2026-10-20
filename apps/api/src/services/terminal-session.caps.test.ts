import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// The per-owner and per-network caps, with docker mocked like in
// terminal-session.eviction.test.ts and the global cap left at its default.
process.env.GUEST_IP_MAX_SANDBOXES = '2';

const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }));

vi.mock('child_process', () => {
  const execFile = (...args: unknown[]) => execFileMock(...args);
  return { execFile, default: { execFile } };
});

const { createSession, getSessionView, activeCount, destroyAllSessions } =
  await import('./terminal-session.service.js');
const { acquireForRun, releaseAfterRun, drainAll } = await import('./code-container.service.js');

type DockerCb = (err: Error | null, stdout: string, stderr: string) => void;

// `docker run` answers on a later tick, like the real one, so sessions asked
// for together are all still starting at once.
let counter = 0;
function installDockerMock() {
  counter = 0;
  execFileMock.mockImplementation((_cmd: string, args: string[], _opts: unknown, cb: DockerCb) => {
    if (args[0] === 'run') {
      const id = `container-${++counter}`;
      setImmediate(() => cb(null, `${id}\n`, ''));
    } else cb(null, '', '');
  });
}

function removed(): string[] {
  return execFileMock.mock.calls
    .map((c) => c[1] as string[])
    .filter((a) => a[0] === 'rm')
    .map((a) => a[2]);
}

async function newSession(owner: string) {
  return createSession('linux', 'no-such-lesson-xyz', owner);
}

beforeEach(() => {
  vi.clearAllMocks();
  installDockerMock();
});

afterEach(async () => {
  await destroyAllSessions();
  await drainAll();
});

describe('sessions per owner', () => {
  it('closes the oldest of three when a fourth opens', async () => {
    const first = await newSession('user:o');
    await newSession('user:o');
    await newSession('user:o');
    expect(activeCount()).toBe(3);

    await newSession('user:o');
    expect(activeCount()).toBe(3);
    expect(getSessionView(first.sessionId, 'user:o')).toBeNull();
    expect(removed()).toEqual(['container-1']);
  });

  it("leaves other owners' sessions alone", async () => {
    const other = await newSession('user:x');
    for (let i = 0; i < 4; i++) await newSession('user:o');
    expect(getSessionView(other.sessionId, 'user:x')).not.toBeNull();
  });

  it('counts sessions still starting, so a burst ends with three', async () => {
    const results = await Promise.allSettled([1, 2, 3, 4, 5].map(() => newSession('user:b')));

    expect(activeCount()).toBe(3);
    // The two oldest were closed while their containers were starting, and
    // those containers are removed rather than left behind
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(2);
    expect(removed()).toEqual(expect.arrayContaining(['container-1', 'container-2']));
  });
});

// GUEST_IP_MAX_SANDBOXES is 2 here
describe('sandboxes per guest network', () => {
  const guestSession = (guestId: string, ip: string) =>
    createSession('linux', 'no-such-lesson-xyz', guestId, undefined, ip);

  // Each step a second after the last, so "least recently used" never ties
  let now = Date.now();
  const later = () => vi.setSystemTime((now += 1000));
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    later();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts a network's editor containers and terminal sessions together", async () => {
    await acquireForRun('guest:a', 'python', '9.9.9.9');
    releaseAfterRun('guest:a');
    later();
    const b = await guestSession('g-b', '9.9.9.9');
    later();

    // At the limit: the oldest idle sandbox, the editor container, makes room
    const c = await guestSession('g-c', '9.9.9.9');
    expect(removed()).toEqual(['container-1']);
    expect(getSessionView(b.sessionId, 'g-b')).not.toBeNull();
    expect(getSessionView(c.sessionId, 'g-c')).not.toBeNull();
  });

  it('closes an idle terminal session to make room for an editor run', async () => {
    const a = await guestSession('g-a', '9.9.9.8');
    later();
    await guestSession('g-b', '9.9.9.8');
    await acquireForRun('guest:c', 'python', '9.9.9.8');
    expect(getSessionView(a.sessionId, 'g-a')).toBeNull();
  });

  it('turns a guest away when everything on their network is busy', async () => {
    await acquireForRun('guest:a', 'python', '8.8.8.8');
    await acquireForRun('guest:b', 'python', '8.8.8.8');

    await expect(guestSession('g-c', '8.8.8.8')).rejects.toMatchObject({ statusCode: 429 });
    await expect(acquireForRun('guest:d', 'python', '8.8.8.8')).rejects.toMatchObject({
      statusCode: 429,
    });
    expect(activeCount()).toBe(0);
  });

  it("leaves other networks and signed-in students' sandboxes out of it", async () => {
    await acquireForRun('guest:a', 'python', '7.7.7.7');
    await acquireForRun('guest:b', 'python', '7.7.7.7');

    await expect(guestSession('g-c', '7.7.7.6')).resolves.toBeDefined();
    await expect(createSession('linux', 'no-such-lesson-xyz', 'user:1')).resolves.toBeDefined();
    await expect(acquireForRun('user:2', 'python')).resolves.toBeDefined();
  });

  it("doesn't count a language switch as a new sandbox", async () => {
    await acquireForRun('guest:a', 'python', '6.6.6.6');
    releaseAfterRun('guest:a');
    await acquireForRun('guest:b', 'python', '6.6.6.6');

    await expect(acquireForRun('guest:a', 'java', '6.6.6.6')).resolves.toBeDefined();
    // guest:b's busy container is untouched; only guest:a's python one went
    expect(removed()).toEqual(['container-1']);
  });
});
