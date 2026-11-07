import { describe, it, expect, vi, afterEach } from 'vitest';
import { execSync } from 'child_process';

const { mockExistsSync, mockReadFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  const patched = {
    ...actual,
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  };
  return { ...patched, default: patched };
});

// One Linux project, so the tests don't hang on the real catalog
vi.mock('@cyberstars/shared/projects', () => ({
  findProject: (language: string, slug: string) =>
    language === 'linux' && slug === 'tidy' ? { slug, language } : undefined,
}));

const { loadSetup, loadProjectSetup, createSession, execCommand, destroySession } =
  await import('./terminal-session.service.js');

function dockerAvailable(): boolean {
  try {
    execSync('docker image inspect cyberstars-linux-sandbox', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const hasDocker = dockerAvailable();
const itDocker = hasDocker ? it : it.skip;

const sessionsToClean: string[] = [];
afterEach(async () => {
  for (const id of sessionsToClean.splice(0)) {
    await destroySession(id);
  }
});

describe('loadSetup', () => {
  it('returns null when setup file does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    expect(loadSetup('linux', 'nonexistent')).toBeNull();
  });

  it('returns parsed JSON when file exists', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ cwd: '/home/student/docs', dirs: [], files: [] }),
    );
    const setup = loadSetup('linux', 'test-lesson');
    expect(setup).toEqual({ cwd: '/home/student/docs', dirs: [], files: [] });
  });
});

describe('loadProjectSetup', () => {
  it('reads a Linux project’s files from beside its steps', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ cwd: '/home/student', dirs: [], files: [] }));
    expect(loadProjectSetup('tidy')).toEqual({
      cwd: '/home/student',
      dirs: [],
      files: [],
    });
    expect(mockReadFileSync.mock.lastCall?.[0]).toMatch(/projects\/linux\/tidy-setup\.json$/);
  });

  it('is a 404 for a slug that isn’t a Linux project, before any file is read', () => {
    mockExistsSync.mockClear();
    for (const slug of ['../lessons/linux/pwd', 'nope']) {
      expect(() => loadProjectSetup(slug)).toThrow(
        expect.objectContaining({ statusCode: 404, message: 'Project not found' }),
      );
    }
    expect(mockExistsSync).not.toHaveBeenCalled();
  });
});

describe('createSession', () => {
  itDocker('creates a session and returns session info', async () => {
    mockExistsSync.mockReturnValue(false);
    const info = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(info.sessionId);
    expect(info.sessionId).toBeDefined();
    expect(info.cwd).toBe('/home/student');
  });
});

describe('execCommand', () => {
  it('throws for unknown session', async () => {
    await expect(execCommand('no-such-session', 'ls', 'user:1')).rejects.toThrow(
      'Session not found',
    );
  });

  itDocker('throws for command too long', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(sessionId);
    await expect(execCommand(sessionId, 'x'.repeat(2001), 'user:1')).rejects.toThrow(
      'Command too long',
    );
  });

  itDocker('returns output and updated cwd', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(sessionId);

    const result = await execCommand(sessionId, 'echo hello', 'user:1');
    expect(result.output).toContain('hello');
    expect(result.cwd).toBe('/home/student');
  });

  itDocker('tracks cwd across commands', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(sessionId);

    await execCommand(sessionId, 'cd /tmp', 'user:1');
    const result = await execCommand(sessionId, 'pwd', 'user:1');
    expect(result.cwd).toBe('/tmp');
  });

  itDocker('stops what a command left running in the background', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(sessionId);

    await execCommand(sessionId, 'sleep 299 &', 'user:1');
    const result = await execCommand(sessionId, 'ps -eo args=', 'user:1');
    expect(result.output).not.toContain('sleep 299');
    // Nothing is left behind as a zombie either
    const zombies = await execCommand(sessionId, 'ps -eo stat= | grep -c Z', 'user:1');
    expect(zombies.output.trim()).toBe('0');
  });

  itDocker('runs the setup’s programs and spares them, but not the leftovers', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        cwd: '/home/student',
        dirs: [],
        files: [],
        processes: [
          { cmd: '/usr/bin/reactor-monitor --port=7700', memoryMb: 8 },
          { cmd: '/usr/bin/nav-computer --frozen', stubborn: true },
        ],
      }),
    );
    const { sessionId } = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(sessionId);

    await execCommand(sessionId, 'sleep 299 &', 'user:1');
    const listed = await execCommand(sessionId, 'ps -eo args= --sort=-rss', 'user:1');
    expect(listed.output.split('\n')[0]).toBe('/usr/bin/reactor-monitor --port=7700');
    expect(listed.output).toContain('/usr/bin/nav-computer --frozen');
    expect(listed.output).not.toContain('sleep 299');

    // A stubborn one ignores a polite stop, but not a forced one, and stays stopped
    await execCommand(sessionId, 'kill $(pgrep -f nav-computer)', 'user:1');
    const asked = await execCommand(sessionId, 'ps -eo args=', 'user:1');
    expect(asked.output).toContain('/usr/bin/nav-computer --frozen');
    await execCommand(sessionId, 'kill -9 $(pgrep -f nav-computer)', 'user:1');
    const after = await execCommand(sessionId, 'ps -eo args=', 'user:1');
    expect(after.output).not.toContain('nav-computer');
    expect(after.output).toContain('reactor-monitor');
  });

  itDocker('rejects a command from a different user', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(sessionId);
    await expect(execCommand(sessionId, 'whoami', 'guest:other')).rejects.toThrow(
      'Session not found',
    );
  });
});

describe('destroySession', () => {
  itDocker('removes the session', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test', 'user:1');

    await destroySession(sessionId);
    await expect(execCommand(sessionId, 'echo hi', 'user:1')).rejects.toThrow('Session not found');
  });

  it('is a no-op for unknown session', async () => {
    await expect(destroySession('nope')).resolves.toBeUndefined();
  });

  itDocker('ignores a non-owner actor', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test', 'user:1');
    sessionsToClean.push(sessionId);

    await destroySession(sessionId, 'guest:other');
    const stillAlive = await execCommand(sessionId, 'echo hi', 'user:1');
    expect(stillAlive.output).toContain('hi');

    await destroySession(sessionId, 'user:1');
    await expect(execCommand(sessionId, 'echo hi', 'user:1')).rejects.toThrow('Session not found');
  });
});
