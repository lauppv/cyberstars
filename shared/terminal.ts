// Shared types for the Linux (terminal) course.

interface TerminalFile {
  path: string;
  content: string;
}

// The starting filesystem materialised into a fresh sandbox container.
export interface TerminalSetup {
  cwd: string;
  files: TerminalFile[];
  dirs: string[];
  intro?: string;
}

export interface TerminalSessionInfo {
  sessionId: string;
  cwd: string;
  intro?: string;
}

export interface TerminalExecResult {
  output: string;
  cwd: string;
}

// ---------------------------------------------------------------------------
// Terminal (Linux) judge — validates sandbox STATE, not stdout. A lesson opts
// in by shipping a <slug>-tests.json next to its markdown (server-side only).
// See §0.7 of TESTS-DESIGN.md.
// ---------------------------------------------------------------------------

/**
 * A state check runs in the live session container; a `cwd_is` check runs on
 * the server against the session's tracked cwd. All are junk-tolerant (assert
 * presence of the target state, not absence of exploration artifacts) except
 * `path_absent`, which is for explicit delete missions.
 */
export type TerminalCheck =
  | { kind: 'file_exists' | 'dir_exists' | 'path_exists' | 'path_absent'; path: string }
  | { kind: 'files_equal' | 'dirs_equal'; a: string; b: string }
  | { kind: 'file_contains'; path: string; text: string }
  | { kind: 'file_mode'; path: string; mode: string }
  | { kind: 'command_output'; cmd: string; expected: string }
  | { kind: 'cwd_is'; path: string };

/**
 * Command-trace rule matched against session.history: `name` matches a command
 * used as a word; `pattern` is a raw regex on a history line (pin the args).
 */
export interface TerminalCommandRule {
  kind: 'command';
  name?: string;
  pattern?: string;
}

export interface TerminalTestsSpec {
  checks?: TerminalCheck[];
  requires?: TerminalCommandRule[];
  forbids?: TerminalCommandRule[];
}

export interface TerminalCheckResult {
  passed: boolean;
  /** i18n key, e.g. 'terminalTests.check.file_exists' or 'terminalTests.require.command'. */
  messageKey: string;
  /** Interpolation params for the message (paths, command name/pattern). */
  params?: Record<string, string>;
}

export interface TerminalTestResult {
  status: 'passed' | 'failed';
  checks: TerminalCheckResult[];
}
