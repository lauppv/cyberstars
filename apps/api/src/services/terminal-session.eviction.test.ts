import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Small global cap so the capacity/eviction path is easy to drive. Mocking
// child_process (docker's execFile) lets createSession run without a real
// sandbox image, unlike terminal-session.service.test.ts which needs Docker.
process.env.TERMINAL_MAX_SESSIONS = '2';

const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }));

vi.mock('child_process', () => {
  const execFile = (...args: unknown[]) => execFileMock(...args);
  return { execFile, default: { execFile } };
});

const { acquireSlotMock, releaseSlotMock } = vi.hoisted(() => ({
  acquireSlotMock: vi.fn(),
  releaseSlotMock: vi.fn(),
}));
vi.mock('./sandbox.js', () => ({
  SANDBOX_LABEL: 'cyberstars.sandbox',
  sandbox: { acquireSlot: (...a: unknown[]) => acquireSlotMock(...a) },
}));

const { createSession, execCommand, getSessionView, activeCount, destroyAllSessions } =
  await import('./terminal-session.service.js');

type DockerCb = (err: Error | null, stdout: string, stderr: string) => void;

let counter = 0;
function installDockerMock() {
  counter = 0;
  execFileMock.mockImplementation((_cmd: string, args: string[], _opts: unknown, cb: DockerCb) => {
    if (args[0] === 'run') cb(null, `container-${++counter}\n`, '');
    else cb(null, '', '');
  });
}

// A slug with no *-setup.json → loadSetup returns null, so no dirs/files probes.
async function newSession(owner: string) {
  return createSession('linux', 'no-such-lesson-xyz', owner);
}

beforeEach(() => {
  vi.clearAllMocks();
  installDockerMock();
  acquireSlotMock.mockResolvedValue(releaseSlotMock);
});

afterEach(async () => {
  await destroyAllSessions();
});

describe('a new session', () => {
  it('labels its sandbox, so a later run of the server can find it', async () => {
    await newSession('user:label');
    const run = execFileMock.mock.calls.find(([, args]) => args[0] === 'run')![1];
    expect(run).toContain('--label=cyberstars.sandbox');
  });
});

describe('global session cap', () => {
  it('evicts the least-recently-active idle session at the cap', async () => {
    const a = await newSession('user:a');
    await newSession('user:b');
    expect(activeCount()).toBe(2);

    // A third owner is at the cap; user:a is the LRU idle one and gets evicted.
    await newSession('user:c');
    expect(activeCount()).toBe(2);

    await expect(execCommand(a.sessionId, 'echo hi', 'user:a')).rejects.toThrow(
      'Session not found',
    );
  });

  it('recycles the requesting owner’s own idle session before other owners’', async () => {
    const a1 = await newSession('user:a');
    await newSession('user:a'); // a now owns both slots
    expect(activeCount()).toBe(2);

    // user:a hits the cap again; their own oldest idle session is reclaimed,
    // never another owner's.
    await newSession('user:a');
    expect(activeCount()).toBe(2);

    await expect(execCommand(a1.sessionId, 'echo hi', 'user:a')).rejects.toThrow(
      'Session not found',
    );
  });
});

describe('shared sandbox slots', () => {
  it('holds a slot for the command and the cleanup after it, then frees it', async () => {
    const { sessionId } = await newSession('user:s');
    await execCommand(sessionId, 'sleep 9 &', 'user:s');

    const calls = execFileMock.mock.calls.map((c) => c[1] as string[]);
    const command = calls.findIndex((a) => a.includes('timeout'));
    expect(calls[command + 1]).toEqual(['exec', 'container-1', 'sh', '-c', 'kill -9 -1']);
    expect(releaseSlotMock).toHaveBeenCalledTimes(1);
    // A terminal command is never stopped to make room: no `stop` with its slot
    expect(acquireSlotMock).toHaveBeenCalledWith({ onWait: expect.any(Function) });
  });

  it('turns a command away on a busy server and keeps it out of the history', async () => {
    const { sessionId } = await newSession('user:busy');
    acquireSlotMock.mockRejectedValueOnce(Object.assign(new Error('busy'), { statusCode: 503 }));

    await expect(execCommand(sessionId, 'ls', 'user:busy')).rejects.toMatchObject({
      statusCode: 503,
    });
    expect(getSessionView(sessionId, 'user:busy')!.history).toEqual([]);
    expect(execFileMock.mock.calls.some((c) => (c[1] as string[]).includes('timeout'))).toBe(false);

    // The session isn't stuck as busy afterwards
    await expect(execCommand(sessionId, 'ls', 'user:busy')).resolves.toBeDefined();
  });
});
