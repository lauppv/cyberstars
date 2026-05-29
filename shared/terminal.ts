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
