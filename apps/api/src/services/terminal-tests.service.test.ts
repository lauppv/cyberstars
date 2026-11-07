import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import type { TerminalTestsSpec } from '@cyberstars/shared/terminal';

const { mockDockerExec, mockGetSessionView } = vi.hoisted(() => ({
  mockDockerExec: vi.fn(),
  mockGetSessionView: vi.fn(),
}));

vi.mock('@cyberstars-framework/sandbox/docker', () => ({ dockerExec: mockDockerExec }));
vi.mock('./terminal-session.service.js', () => ({ getSessionView: mockGetSessionView }));

const {
  loadTerminalTestsSpec,
  runTerminalTests,
  runProjectTerminalTests,
  ruleLabel,
  checkMessage,
  probedFile,
} = await import('./terminal-tests.service.js');
const { contentDir } = await import('./paths.js');
const { PROJECTS_DIR } = await import('@cyberstars/content/paths');

// Every Linux lesson's tests, EN and RO, and every Linux project's (the
// fixtures the tests below write for a moment left out)
function linuxSpecs(): { file: string; spec: TerminalTestsSpec }[] {
  const dirs = [
    contentDir('linux'),
    path.join(contentDir('linux'), 'ro'),
    path.join(PROJECTS_DIR, 'linux'),
  ];
  return dirs.flatMap((dir) =>
    fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('-tests.json') && !f.startsWith('zz-'))
      .map((f) => ({
        file: path.join(dir, f),
        spec: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as TerminalTestsSpec,
      })),
  );
}

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

function view(
  over: Partial<{ containerId: string; history: string[]; cwd: string; project: string }> = {},
) {
  return {
    containerId: 'container-abc',
    history: [] as string[],
    cwd: '/home/student',
    ...over,
  };
}

beforeEach(() => {
  mockDockerExec.mockReset();
  mockGetSessionView.mockReset();
});

describe('loadTerminalTestsSpec', () => {
  it('loads the English spec for a lesson that has tests', () => {
    const spec = loadTerminalTestsSpec('linux', 'cd');
    expect(spec?.checks).toEqual([{ kind: 'cwd_is', path: 'tools/scripts' }]);
    expect(spec?.requires).toEqual([
      { kind: 'command', name: 'cd' },
      { kind: 'command', name: 'ls' },
    ]);
  });

  it('prefers the ro/ spec when lang is ro and the file exists', () => {
    const spec = loadTerminalTestsSpec('linux', 'cd', 'ro');
    expect(spec?.checks).toEqual([{ kind: 'cwd_is', path: 'unelte/scripturi' }]);
  });

  it('falls back to the English spec when no ro/ file exists', () => {
    expect(loadTerminalTestsSpec('linux', 'pwd', 'ro')).toEqual(
      loadTerminalTestsSpec('linux', 'pwd'),
    );
  });

  it('returns null for a lesson without tests', () => {
    expect(loadTerminalTestsSpec('linux', 'no-such-lesson-xyz')).toBeNull();
  });
});

describe('runTerminalTests', () => {
  it('throws 404 when the lesson has no tests (before session lookup)', async () => {
    await expect(runTerminalTests('user:1', 'sid', 'linux', 'no-such-lesson-xyz')).rejects.toThrow(
      'This lesson has no tests',
    );
    expect(mockGetSessionView).not.toHaveBeenCalled();
  });

  it('throws 404 when the session is missing or not owned', async () => {
    mockGetSessionView.mockReturnValue(null);
    await expect(runTerminalTests('user:1', 'sid', 'linux', 'cd')).rejects.toThrow(
      'Session not found',
    );
  });

  it('evaluates cwd_is server-side without touching the container', async () => {
    mockGetSessionView.mockReturnValue(
      view({ cwd: '/home/student/tools/scripts', history: ['cd tools', 'ls', 'cd scripts'] }),
    );
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cd');
    expect(res.status).toBe('passed');
    expect(mockDockerExec).not.toHaveBeenCalled();
  });

  it('fails cwd_is when the student is in the wrong directory', async () => {
    mockGetSessionView.mockReturnValue(view({ cwd: '/home/student/tools', history: ['cd tools'] }));
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cd');
    expect(res.status).toBe('failed');
    expect(res.checks.find((c) => c.messageKey === 'terminalTests.check.cwd_is')?.passed).toBe(
      false,
    );
  });

  it('fails a requires rule (command name) when it is absent from history', async () => {
    mockGetSessionView.mockReturnValue(
      view({ cwd: '/home/student/tools/scripts', history: ['pwd'] }),
    );
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cd');
    expect(res.status).toBe('failed');
    expect(res.checks.find((c) => c.messageKey === 'terminalTests.require.command')?.passed).toBe(
      false,
    );
  });

  it('passes container state checks when the probe returns P for each', async () => {
    mockGetSessionView.mockReturnValue(
      view({ history: ['touch mission.txt crew.txt', 'mkdir -p reports/logs'] }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n3 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'touch');
    expect(res.status).toBe('passed');
    expect(mockDockerExec).toHaveBeenCalledOnce();
  });

  it('fails when a container state check returns F', async () => {
    mockGetSessionView.mockReturnValue(view({ history: ['touch mission.txt'] }));
    mockDockerExec.mockResolvedValue('0 P\n1 F\n2 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'touch');
    expect(res.status).toBe('failed');
  });

  it('compares command_output on the server (decoding base64)', async () => {
    const alerts = 'critical: pressure drop deck 7\ncritical: radiation spike lab 3';
    const healthy = 'ok: oxygen normal\nok: temperature stable\nok: gravity nominal';
    mockGetSessionView.mockReturnValue(
      view({
        history: [
          'mkdir report',
          'grep critical sensors.log > report/alerts.txt',
          'grep ok sensors.log > report/healthy.txt',
        ],
      }),
    );
    mockDockerExec.mockResolvedValue(`0 O ${b64(alerts + '\n')}\n1 O ${b64(healthy + '\n')}\n`);
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'redirect-out');
    expect(res.status).toBe('passed');
    const outputs = res.checks.filter((c) => c.messageKey === 'terminalTests.check.command_output');
    expect(outputs.map((c) => c.passed)).toEqual([true, true]);
  });

  it('fails command_output when the produced output differs', async () => {
    mockGetSessionView.mockReturnValue(
      view({ history: ['grep critical sensors.log > report/alerts.txt'] }),
    );
    mockDockerExec.mockResolvedValue(`0 O ${b64('nothing here')}\n`);
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'redirect-out');
    expect(res.status).toBe('failed');
  });

  it('maps a dockerExec failure to a 500 error', async () => {
    mockGetSessionView.mockReturnValue(view({ history: ['touch mission.txt'] }));
    mockDockerExec.mockRejectedValue(new Error('boom'));
    await expect(runTerminalTests('user:1', 'sid', 'linux', 'touch')).rejects.toThrow(
      'Could not check your work',
    );
  });

  it('covers files_equal + dirs_equal check messages (cp)', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: ['mkdir backups', 'cp mission.txt backups/mission.txt', 'cp -r reports backups'],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cp');
    expect(res.status).toBe('passed');
    expect(res.checks.some((c) => c.messageKey === 'terminalTests.check.files_equal')).toBe(true);
    expect(res.checks.some((c) => c.messageKey === 'terminalTests.check.dirs_equal')).toBe(true);
  });

  it('covers the file_mode check message (chmod-numeric)', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: [
          'mkdir engine-bay',
          'mv engine_control.sh engine-bay/',
          'chmod 750 engine-bay/engine_control.sh',
        ],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'chmod-numeric');
    expect(res.status).toBe('passed');
    const shown = res.checks.filter((c) => c.messageKey === 'terminalTests.check.file_mode');
    expect(shown.length).toBeGreaterThan(0);
    // The path only: the expected value can be the mission's answer.
    for (const c of shown) expect(Object.keys(c.params ?? {})).toEqual(['path']);
  });

  it('covers the file_contains check message (stderr)', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: [
          'ls report.txt ghost.txt 2> errors.log',
          'mkdir logs',
          'mv errors.log logs/',
          'grep "No such" logs/errors.log',
        ],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'stderr');
    expect(res.status).toBe('passed');
    const shown = res.checks.filter((c) => c.messageKey === 'terminalTests.check.file_contains');
    expect(shown.length).toBeGreaterThan(0);
    // The path only: the expected value can be the mission's answer.
    for (const c of shown) expect(Object.keys(c.params ?? {})).toEqual(['path']);
  });

  it('covers dir_exists (mkdir) and path_absent (rm) checks', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: ['mkdir -p mission/logs/day1 mission/data mission/backups', 'tree mission'],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n');
    expect((await runTerminalTests('user:1', 'sid', 'linux', 'mkdir')).status).toBe('passed');

    mockGetSessionView.mockReturnValue(
      view({
        history: ['cp mission.txt keep/mission.txt', 'rm junk.txt', 'rm temp.log cache.tmp'],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n3 P\n4 P\n');
    expect((await runTerminalTests('user:1', 'sid', 'linux', 'rm')).status).toBe('passed');
  });

  describe('path_exists check + empty rule (via a temporary fixture)', () => {
    const slug = 'zz-extra-fixture';
    const file = path.join(contentDir('linux'), `${slug}-tests.json`);

    beforeEach(() => {
      fs.writeFileSync(
        file,
        JSON.stringify({
          checks: [{ kind: 'path_exists', path: 'somefile' }],
          requires: [{ kind: 'command' }],
        }),
      );
    });
    afterAll(() => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    it('passes path_exists but fails the empty (no name/pattern) rule', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls'] }));
      mockDockerExec.mockResolvedValue('0 P\n');
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(
        res.checks.find((c) => c.messageKey === 'terminalTests.check.path_exists')?.passed,
      ).toBe(true);
      expect(res.status).toBe('failed');
    });
  });

  describe('absolute paths, empty command_output, pattern forbids (via a temporary fixture)', () => {
    const slug = 'zz-abs-fixture';
    const file = path.join(contentDir('linux'), `${slug}-tests.json`);

    beforeEach(() => {
      fs.writeFileSync(
        file,
        JSON.stringify({
          checks: [
            { kind: 'path_exists', path: '/etc/hostname' },
            { kind: 'command_output', cmd: 'true', expected: '' },
          ],
          forbids: [{ kind: 'command', pattern: 'rm\\s' }],
          requires: [{ kind: 'command', pattern: '^(?=.*\\bls\\b)(?=.*-l)' }],
        }),
      );
    });
    afterAll(() => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    it('handles an absolute path, an empty-data O verdict, and a pattern-only forbid', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls -l'] }));
      // Index 1 is an O verdict with no base64 payload -> decodes to ''.
      mockDockerExec.mockResolvedValue('0 P\n1 O\n');
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(res.status).toBe('passed');
      const forbid = res.checks.find((c) => c.messageKey === 'terminalTests.forbid.command');
      // Only the command's name, never the pattern that pins it.
      expect(forbid?.params?.name).toBe('rm');
      const require = res.checks.find((c) => c.messageKey === 'terminalTests.require.command');
      expect(require).toMatchObject({ passed: true, params: { name: 'ls' } });
    });
  });

  describe('forbids with neither name nor pattern (via a temporary fixture)', () => {
    const slug = 'zz-empty-forbid-fixture';
    const file = path.join(contentDir('linux'), `${slug}-tests.json`);

    beforeEach(() => {
      fs.writeFileSync(file, JSON.stringify({ forbids: [{ kind: 'command' }] }));
    });
    afterAll(() => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    it('falls back to an empty name and passes (an empty rule never matches)', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls'] }));
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(res.status).toBe('passed');
      const forbid = res.checks.find((c) => c.messageKey === 'terminalTests.forbid.command');
      expect(forbid?.params?.name).toBe('');
    });
  });

  describe('forbids (via a temporary fixture)', () => {
    const slug = 'zz-forbids-fixture';
    const file = path.join(contentDir('linux'), `${slug}-tests.json`);

    beforeEach(() => {
      fs.writeFileSync(
        file,
        JSON.stringify({
          requires: [{ kind: 'command', name: 'ls' }],
          forbids: [{ kind: 'command', name: 'rm' }],
        }),
      );
    });
    afterAll(() => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    it('passes when the forbidden command is absent', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls'] }));
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(res.status).toBe('passed');
    });

    it('fails when the forbidden command was used', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls', 'rm junk.txt'] }));
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(res.status).toBe('failed');
      expect(res.checks.find((c) => c.messageKey === 'terminalTests.forbid.command')?.passed).toBe(
        false,
      );
    });
  });
});

describe('what a command rule shows', () => {
  it('names a command, never a file or a word the pattern searches for', () => {
    const wrong: string[] = [];
    for (const { file, spec } of linuxSpecs()) {
      for (const rule of [...(spec.requires ?? []), ...(spec.forbids ?? [])]) {
        const label = ruleLabel(rule);
        const command = /^[a-z][\w-]*$/.test(label) || label === '>' || label === '>>';
        const fileName = rule.pattern?.includes(`${label}\\.`);
        if (!command || fileName) wrong.push(`${path.basename(file)}: ${label}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});

describe('the kill lesson', () => {
  it('takes every way of sending SIGKILL, and nothing politer', () => {
    for (const lang of ['en', 'ro'] as const) {
      const rule = loadTerminalTestsSpec('linux', 'kill', lang)!.requires![0];
      const re = new RegExp(rule.pattern!);
      for (const ok of [
        'kill -9 31',
        'kill -KILL 31',
        'kill -SIGKILL 31',
        'kill -s KILL 31',
        'kill -s SIGKILL 31',
        'kill -s 9 31',
        'kill -n 9 31',
        '/bin/kill --signal KILL 31',
      ]) {
        expect(re.test(ok), ok).toBe(true);
      }
      for (const no of ['kill 31', 'kill -15 31', 'kill -s TERM 31', 'pkill -9 nav-computer']) {
        expect(re.test(no), no).toBe(false);
      }
    }
  });
});

describe('what a check shows', () => {
  it('shows a probe only by the one file it reads, never its search or count', () => {
    expect(probedFile("grep -vc '^45.9.148.3 ' report/intruder.txt")).toBe('report/intruder.txt');
    expect(probedFile('grep -c Fikus shop/clean.csv')).toBe('shop/clean.csv');
    expect(probedFile('wc -l < report/not-found.txt')).toBe('report/not-found.txt');
    expect(probedFile("tail -n 1 x/top.txt | awk '{print $11}'")).toBe('x/top.txt');
    // Several paths can be what the student had to find
    expect(probedFile('ls phone/2022 phone/2023 phone/2024')).toBeNull();
    expect(probedFile("ps -eo args= | grep -c '^/usr/bin/nav-computer'")).toBeNull();
  });

  it('never hands over a probe or the original a copy is checked against', () => {
    const leaks: string[] = [];
    for (const { file, spec } of linuxSpecs()) {
      for (const check of spec.checks ?? []) {
        const shown = Object.values(checkMessage(check).params ?? {});
        if (check.kind === 'command_output' && shown.some((v) => v === check.cmd)) {
          leaks.push(`${path.basename(file)}: ${check.cmd}`);
        }
        if (check.kind === 'files_equal' && shown.includes(check.a)) {
          leaks.push(`${path.basename(file)}: ${check.a}`);
        }
      }
    }
    expect(leaks).toEqual([]);
  });
});

describe('runProjectTerminalTests', () => {
  it('throws 404 for a slug that is not a Linux project, before any session lookup', async () => {
    for (const slug of ['library-desk', 'no-such-project', '../lessons/linux/cd']) {
      await expect(runProjectTerminalTests('user:1', 'sid', slug)).rejects.toThrow(
        'This project has no tests',
      );
    }
    expect(mockGetSessionView).not.toHaveBeenCalled();
  });

  it('judges only a session started for that project', async () => {
    mockGetSessionView.mockReturnValue(view({ project: 'photo-archive' }));
    await expect(runProjectTerminalTests('user:1', 'sid', 'downloads-cleanup')).rejects.toThrow(
      'Session not found',
    );
    mockGetSessionView.mockReturnValue(view());
    await expect(runProjectTerminalTests('user:1', 'sid', 'downloads-cleanup')).rejects.toThrow(
      'Session not found',
    );
    expect(mockDockerExec).not.toHaveBeenCalled();
  });

  it('runs the project’s checks and command rules on its session', async () => {
    mockGetSessionView.mockReturnValue(
      view({ project: 'downloads-cleanup', history: ['mv a b', 'rm c', 'find .'] }),
    );
    mockDockerExec.mockResolvedValue('');
    const res = await runProjectTerminalTests('user:1', 'sid', 'downloads-cleanup');
    expect(res.status).toBe('failed');
    expect(mockDockerExec).toHaveBeenCalledOnce();
    const rules = res.checks.filter((c) => c.messageKey === 'terminalTests.require.command');
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.every((c) => c.passed)).toBe(true);
  });
});

describe('a lesson check on a project session', () => {
  it('is refused, so a project’s files never finish a lesson', async () => {
    mockGetSessionView.mockReturnValue(view({ project: 'downloads-cleanup' }));
    await expect(runTerminalTests('user:1', 'sid', 'linux', 'cd')).rejects.toThrow(
      'Session not found',
    );
  });
});
