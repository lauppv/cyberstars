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

type CheckMode = 'exact' | 'contains' | 'regex' | 'line';

type CheckType =
  | 'file_exists'
  | 'file_absent'
  | 'file_content'
  | 'dir_listing'
  | 'cwd_equals'
  | 'history_contains'
  | 'history_not_contains'
  | 'last_output'
  | 'any_output'
  | 'command_output';

// One validation check from a lesson's <slug>-tests.json.
export interface TerminalCheck {
  name: string;
  check: CheckType;
  path?: string;
  expectDir?: boolean;
  mode?: CheckMode;
  expected?: string;
  pattern?: string;
  probe?: string;
  line?: number;
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
