import fs from 'fs';
import path from 'path';
import { contentDir } from './paths.js';
import { probe, getSession } from './terminal-session.service.js';
import type { TerminalCheck } from '../../shared/terminal.js';

interface TerminalTestResult {
  name: string;
  passed: boolean;
}

export interface TerminalSubmitResult {
  passed: number;
  total: number;
  allPassed: boolean;
  results: TerminalTestResult[];
}

export function getTerminalTests(courseKey: string, lessonSlug: string): TerminalCheck[] | null {
  const filePath = path.join(contentDir(courseKey), `${lessonSlug}-tests.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function matchValue(actual: string, expected: string, mode: string | undefined): boolean {
  const a = actual.trim();
  const e = expected.trim();
  switch (mode) {
    case 'contains':
      return a.includes(e);
    case 'regex':
      try {
        return new RegExp(e).test(a);
      } catch {
        return false;
      }
    case 'line':
      return a.split('\n').some((l) => l.trim() === e);
    case 'exact':
    default:
      return a === e;
  }
}

async function evaluateCheck(sessionId: string, check: TerminalCheck): Promise<boolean> {
  const session = getSession(sessionId);
  if (!session) return false;

  switch (check.check) {
    case 'file_exists': {
      const target = check.path ?? '';
      const flag = check.expectDir ? '-d' : '-f';
      const result = await probe(sessionId, `test ${flag} "${target}" && echo YES || echo NO`);
      return result.trim() === 'YES';
    }

    case 'file_absent': {
      const target = check.path ?? '';
      const result = await probe(sessionId, `test -e "${target}" && echo YES || echo NO`);
      return result.trim() === 'NO';
    }

    case 'file_content': {
      const target = check.path ?? '';
      const content = await probe(sessionId, `cat "${target}" 2>/dev/null`);
      if (check.line !== undefined) {
        const lines = content.split('\n');
        const line = lines[check.line] ?? '';
        return matchValue(line, check.expected ?? '', check.mode);
      }
      return matchValue(content, check.expected ?? '', check.mode);
    }

    case 'dir_listing': {
      const target = check.path ?? '.';
      const listing = await probe(sessionId, `ls "${target}" 2>/dev/null`);
      return matchValue(listing, check.expected ?? '', check.mode);
    }

    case 'cwd_equals': {
      return session.cwd.trim() === (check.expected ?? '').trim();
    }

    case 'history_contains': {
      const pattern = check.pattern ?? check.expected ?? '';
      try {
        const regex = new RegExp(pattern);
        return session.history.some((cmd) => regex.test(cmd));
      } catch {
        return false;
      }
    }

    case 'history_not_contains': {
      const pattern = check.pattern ?? check.expected ?? '';
      try {
        const regex = new RegExp(pattern);
        return !session.history.some((cmd) => regex.test(cmd));
      } catch {
        return false;
      }
    }

    case 'last_output': {
      return matchValue(session.lastOutput, check.expected ?? '', check.mode);
    }

    case 'any_output': {
      if (check.expected) {
        return matchValue(session.lastOutput, check.expected, check.mode);
      }
      return session.lastOutput.trim().length > 0;
    }

    case 'command_output': {
      const output = await probe(sessionId, check.probe ?? 'echo');
      return matchValue(output, check.expected ?? '', check.mode);
    }

    default:
      return false;
  }
}

export async function runTerminalTests(
  sessionId: string,
  courseKey: string,
  lessonSlug: string,
): Promise<TerminalSubmitResult> {
  const checks = getTerminalTests(courseKey, lessonSlug);
  if (!checks || checks.length === 0) {
    return { passed: 0, total: 0, allPassed: true, results: [] };
  }

  const results: TerminalTestResult[] = [];

  for (const check of checks) {
    const passed = await evaluateCheck(sessionId, check);
    results.push({ name: check.name, passed });
  }

  const passed = results.filter((r) => r.passed).length;
  return {
    passed,
    total: results.length,
    allPassed: passed === results.length,
    results,
  };
}
