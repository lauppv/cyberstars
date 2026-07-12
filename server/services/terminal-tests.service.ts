import fs from 'fs';
import path from 'path';
import { contentDir } from './paths.js';
import { dockerExec } from './docker-exec.js';
import { getSessionView } from './terminal-session.service.js';
import { compareOutputs } from './lesson-tests.service.js';
import { AppError } from '../middleware/errorHandler.js';
import type {
  TerminalCheck,
  TerminalCheckResult,
  TerminalCommandRule,
  TerminalTestResult,
  TerminalTestsSpec,
} from '../../shared/terminal.js';

// Server-side judge for Linux/terminal lessons. Unlike the code judge (stdin →
// stdout program + oracle), this validates the sandbox STATE: it runs assertion
// probes against the student's live session container (one docker exec) plus
// command-trace requires/forbids against session.history. See §0.7 of
// TESTS-DESIGN.md.

const HOME = '/home/student';
const CHECK_TIMEOUT_MS = 12_000;

// Same ro/-subfolder fallback as terminal -setup.json / lesson markdown. A RO
// lesson with translated filenames ships ro/<slug>-tests.json whose paths match
// the RO -setup.json; English-only lessons need only the EN file.
function terminalTestsDir(courseKey: string, lessonSlug: string, lang?: string): string | null {
  const base = contentDir(courseKey);
  if (lang === 'ro' && fs.existsSync(path.join(base, 'ro', `${lessonSlug}-tests.json`))) {
    return path.join(base, 'ro');
  }
  return fs.existsSync(path.join(base, `${lessonSlug}-tests.json`)) ? base : null;
}

export function loadTerminalTestsSpec(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
): TerminalTestsSpec | null {
  const dir = terminalTestsDir(courseKey, lessonSlug, lang);
  if (!dir) return null;
  return JSON.parse(
    fs.readFileSync(path.join(dir, `${lessonSlug}-tests.json`), 'utf8'),
  ) as TerminalTestsSpec;
}

function shq(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

function abs(p: string): string {
  return p.startsWith('/') ? p : `${HOME}/${p}`;
}

// A container-run check emits `<i> P|F` (boolean) or `<i> O <base64-stdout>`
// (command_output, compared on the server). cwd_is is evaluated server-side, so
// it produces no script line.
function scriptLine(check: TerminalCheck, i: number): string | null {
  const ok = (cond: string) => `if ${cond}; then echo '${i} P'; else echo '${i} F'; fi`;
  switch (check.kind) {
    case 'file_exists':
      return ok(`test -f ${shq(abs(check.path))}`);
    case 'dir_exists':
      return ok(`test -d ${shq(abs(check.path))}`);
    case 'path_exists':
      return ok(`test -e ${shq(abs(check.path))}`);
    case 'path_absent':
      return ok(`! test -e ${shq(abs(check.path))}`);
    case 'files_equal':
      return ok(`cmp -s ${shq(abs(check.a))} ${shq(abs(check.b))}`);
    case 'dirs_equal':
      return ok(`diff -rq ${shq(abs(check.a))} ${shq(abs(check.b))} >/dev/null 2>&1`);
    case 'file_contains':
      return ok(`grep -qF -- ${shq(check.text)} ${shq(abs(check.path))}`);
    case 'file_mode':
      return ok(`[ "$(stat -c %a ${shq(abs(check.path))} 2>/dev/null)" = ${shq(check.mode)} ]`);
    case 'command_output':
      // Run the authored probe in a subshell so its cwd changes don't leak;
      // ship stdout base64-encoded — the server decodes + compares.
      return `printf '${i} O '; ( ${check.cmd} ) 2>&1 | base64 -w0; echo`;
    case 'cwd_is':
      return null;
  }
}

function checkMessage(check: TerminalCheck): Omit<TerminalCheckResult, 'passed'> {
  const key = `terminalTests.check.${check.kind}`;
  switch (check.kind) {
    case 'files_equal':
    case 'dirs_equal':
      return { messageKey: key, params: { a: check.a, b: check.b } };
    case 'file_contains':
      return { messageKey: key, params: { path: check.path, text: check.text } };
    case 'file_mode':
      return { messageKey: key, params: { path: check.path, mode: check.mode } };
    case 'command_output':
      return { messageKey: key, params: { cmd: check.cmd } };
    default:
      return { messageKey: key, params: { path: check.path } };
  }
}

function ruleMatches(rule: TerminalCommandRule, history: string[]): boolean {
  if (rule.pattern) {
    const re = new RegExp(rule.pattern);
    return history.some((h) => re.test(h));
  }
  if (rule.name) {
    const escaped = rule.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(^|\\s|\\||&|;)${escaped}(\\s|$)`);
    return history.some((h) => re.test(h));
  }
  return false;
}

export async function runTerminalTests(
  ownerKey: string,
  sessionId: string,
  courseKey: string,
  lessonSlug: string,
  lang?: string,
): Promise<TerminalTestResult> {
  const spec = loadTerminalTestsSpec(courseKey, lessonSlug, lang);
  if (!spec) throw new AppError(404, 'This lesson has no tests');

  const session = getSessionView(sessionId, ownerKey);
  if (!session) throw new AppError(404, 'Session not found');

  const checks = spec.checks ?? [];
  const results: TerminalCheckResult[] = new Array(checks.length);

  // Container checks batch into one docker exec; cwd_is is resolved here.
  const containerIndexes: number[] = [];
  const scriptLines: string[] = [`cd ${shq(HOME)} 2>/dev/null || true`];
  checks.forEach((check, i) => {
    if (check.kind === 'cwd_is') {
      const passed = session.cwd.replace(/\/+$/, '') === abs(check.path).replace(/\/+$/, '');
      results[i] = { passed, ...checkMessage(check) };
      return;
    }
    const line = scriptLine(check, i);
    if (line !== null) {
      containerIndexes.push(i);
      scriptLines.push(line);
    }
  });

  if (containerIndexes.length > 0) {
    let raw: string;
    try {
      raw = await dockerExec(
        ['exec', session.containerId, 'bash', '-c', scriptLines.join('\n')],
        CHECK_TIMEOUT_MS,
      );
    } catch {
      throw new AppError(500, 'Could not check your work — please try again');
    }
    const verdicts = new Map<number, { flag: string; data?: string }>();
    for (const line of raw.split('\n')) {
      const m = line.match(/^(\d+) ([PFO])(?: (.*))?$/);
      if (m) verdicts.set(Number(m[1]), { flag: m[2], data: m[3] });
    }
    for (const i of containerIndexes) {
      const check = checks[i];
      const verdict = verdicts.get(i);
      let passed = false;
      if (verdict) {
        if (verdict.flag === 'P') passed = true;
        else if (verdict.flag === 'O' && check.kind === 'command_output') {
          const actual = Buffer.from(verdict.data ?? '', 'base64').toString('utf8');
          passed = compareOutputs(check.expected, actual, 'trimmed');
        }
      }
      results[i] = { passed, ...checkMessage(check) };
    }
  }

  for (const rule of spec.requires ?? []) {
    results.push({
      passed: ruleMatches(rule, session.history),
      messageKey: 'terminalTests.require.command',
      params: { name: rule.name ?? rule.pattern ?? '' },
    });
  }
  for (const rule of spec.forbids ?? []) {
    results.push({
      passed: !ruleMatches(rule, session.history),
      messageKey: 'terminalTests.forbid.command',
      params: { name: rule.name ?? rule.pattern ?? '' },
    });
  }

  const status = results.every((r) => r.passed) ? 'passed' : 'failed';
  return { status, checks: results };
}
