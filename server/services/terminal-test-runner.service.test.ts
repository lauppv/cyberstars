import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TerminalCheck } from "../../shared/terminal.js";

const mockProbe = vi.fn();
const mockGetSession = vi.fn();

vi.mock("./terminal-session.service.js", () => ({
  probe: (...args: unknown[]) => mockProbe(...args),
  getSession: (...args: unknown[]) => mockGetSession(...args),
}));

const mockExistsSync = vi.fn();
const mockReadFileSync = vi.fn();

vi.mock("fs", () => ({
  default: {
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  },
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
}));

const { getTerminalTests, runTerminalTests } = await import("./terminal-test-runner.service.js");

function fakeSession(overrides: Record<string, unknown> = {}) {
  return {
    containerId: "abc",
    cwd: "/home/student",
    history: [] as string[],
    lastOutput: "",
    lastActivity: Date.now(),
    ...overrides,
  };
}

function setupChecks(checks: TerminalCheck[]) {
  mockExistsSync.mockReturnValue(true);
  mockReadFileSync.mockReturnValue(JSON.stringify(checks));
}

beforeEach(() => vi.clearAllMocks());

describe("getTerminalTests", () => {
  it("returns parsed checks when file exists", () => {
    const checks: TerminalCheck[] = [{ name: "t1", check: "cwd_equals", expected: "/" }];
    setupChecks(checks);
    expect(getTerminalTests("linux", "some-lesson")).toEqual(checks);
  });

  it("returns null when file does not exist", () => {
    mockExistsSync.mockReturnValue(false);
    expect(getTerminalTests("linux", "nonexistent")).toBeNull();
  });
});

describe("runTerminalTests", () => {
  it("returns empty results when no test file", async () => {
    mockExistsSync.mockReturnValue(false);
    const result = await runTerminalTests("sid", "linux", "no-tests");
    expect(result).toEqual({ passed: 0, total: 0, allPassed: true, results: [] });
  });

  it("file_exists — pass when probe returns YES", async () => {
    setupChecks([{ name: "file check", check: "file_exists", path: "/home/student/hello.txt" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("YES");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
    expect(r.allPassed).toBe(true);
  });

  it("file_exists — fail when probe returns NO", async () => {
    setupChecks([{ name: "file check", check: "file_exists", path: "/tmp/x" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("NO");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("file_exists — uses -d flag when expectDir is true", async () => {
    setupChecks([{ name: "dir check", check: "file_exists", path: "/tmp", expectDir: true }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("YES");
    await runTerminalTests("sid", "linux", "lesson");
    expect(mockProbe).toHaveBeenCalledWith("sid", expect.stringContaining("-d"));
  });

  it("file_absent — pass when file does not exist", async () => {
    setupChecks([{ name: "absent", check: "file_absent", path: "/tmp/gone" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("NO");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("file_absent — fail when file exists", async () => {
    setupChecks([{ name: "absent", check: "file_absent", path: "/tmp/exists" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("YES");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("file_content — exact match (default mode)", async () => {
    setupChecks([{ name: "content", check: "file_content", path: "/tmp/f", expected: "hello" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("hello");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("file_content — contains mode", async () => {
    setupChecks([{ name: "content", check: "file_content", path: "/tmp/f", expected: "ell", mode: "contains" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("hello world");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("file_content — regex mode", async () => {
    setupChecks([{ name: "content", check: "file_content", path: "/tmp/f", expected: "^hel+o$", mode: "regex" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("hello");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("file_content — regex mode with invalid regex returns false", async () => {
    setupChecks([{ name: "content", check: "file_content", path: "/tmp/f", expected: "[invalid", mode: "regex" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("anything");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("file_content — line mode", async () => {
    setupChecks([{ name: "content", check: "file_content", path: "/tmp/f", expected: "second", mode: "line" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("first\nsecond\nthird");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("file_content — specific line number", async () => {
    setupChecks([{ name: "line", check: "file_content", path: "/tmp/f", expected: "B", line: 1 }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("A\nB\nC");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("dir_listing — contains mode", async () => {
    setupChecks([{ name: "listing", check: "dir_listing", path: "/home", expected: "student", mode: "contains" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("student\nother");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("cwd_equals — pass", async () => {
    setupChecks([{ name: "cwd", check: "cwd_equals", expected: "/home/student" }]);
    mockGetSession.mockReturnValue(fakeSession({ cwd: "/home/student" }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("cwd_equals — fail", async () => {
    setupChecks([{ name: "cwd", check: "cwd_equals", expected: "/tmp" }]);
    mockGetSession.mockReturnValue(fakeSession({ cwd: "/home/student" }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("history_contains — pass when command matches pattern", async () => {
    setupChecks([{ name: "hist", check: "history_contains", pattern: "^cd\\s" }]);
    mockGetSession.mockReturnValue(fakeSession({ history: ["ls", "cd docs"] }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("history_contains — fail when no command matches", async () => {
    setupChecks([{ name: "hist", check: "history_contains", pattern: "^rm " }]);
    mockGetSession.mockReturnValue(fakeSession({ history: ["ls", "cd docs"] }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("history_contains — invalid regex returns false", async () => {
    setupChecks([{ name: "hist", check: "history_contains", pattern: "[bad" }]);
    mockGetSession.mockReturnValue(fakeSession({ history: ["ls"] }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("history_contains — falls back to expected when pattern is missing", async () => {
    setupChecks([{ name: "hist", check: "history_contains", expected: "^ls$" }]);
    mockGetSession.mockReturnValue(fakeSession({ history: ["ls"] }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("history_not_contains — pass when no match", async () => {
    setupChecks([{ name: "no hist", check: "history_not_contains", pattern: "^rm " }]);
    mockGetSession.mockReturnValue(fakeSession({ history: ["ls", "cd docs"] }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("history_not_contains — fail when match found", async () => {
    setupChecks([{ name: "no hist", check: "history_not_contains", pattern: "^ls$" }]);
    mockGetSession.mockReturnValue(fakeSession({ history: ["ls"] }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("history_not_contains — invalid regex returns false", async () => {
    setupChecks([{ name: "no hist", check: "history_not_contains", pattern: "[bad" }]);
    mockGetSession.mockReturnValue(fakeSession({ history: [] }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("last_output — exact match", async () => {
    setupChecks([{ name: "out", check: "last_output", expected: "done" }]);
    mockGetSession.mockReturnValue(fakeSession({ lastOutput: "done" }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("any_output — pass when output is non-empty", async () => {
    setupChecks([{ name: "any", check: "any_output" }]);
    mockGetSession.mockReturnValue(fakeSession({ lastOutput: "something" }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("any_output — fail when output is empty", async () => {
    setupChecks([{ name: "any", check: "any_output" }]);
    mockGetSession.mockReturnValue(fakeSession({ lastOutput: "" }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("any_output — with expected value uses matchValue", async () => {
    setupChecks([{ name: "any", check: "any_output", expected: "hi", mode: "contains" }]);
    mockGetSession.mockReturnValue(fakeSession({ lastOutput: "say hi there" }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("command_output — runs probe and matches", async () => {
    setupChecks([{ name: "cmd", check: "command_output", probe: "whoami", expected: "student" }]);
    mockGetSession.mockReturnValue(fakeSession());
    mockProbe.mockResolvedValue("student");
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(true);
  });

  it("unknown check type returns false", async () => {
    setupChecks([{ name: "unknown", check: "nonexistent" as TerminalCheck["check"] }]);
    mockGetSession.mockReturnValue(fakeSession());
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.results[0].passed).toBe(false);
  });

  it("all checks fail when session is missing", async () => {
    setupChecks([
      { name: "a", check: "file_exists", path: "/x" },
      { name: "b", check: "cwd_equals", expected: "/" },
    ]);
    mockGetSession.mockReturnValue(undefined);
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.allPassed).toBe(false);
    expect(r.passed).toBe(0);
    expect(r.total).toBe(2);
  });

  it("counts passed/total correctly with mixed results", async () => {
    setupChecks([
      { name: "pass", check: "cwd_equals", expected: "/home/student" },
      { name: "fail", check: "cwd_equals", expected: "/tmp" },
    ]);
    mockGetSession.mockReturnValue(fakeSession({ cwd: "/home/student" }));
    const r = await runTerminalTests("sid", "linux", "lesson");
    expect(r.passed).toBe(1);
    expect(r.total).toBe(2);
    expect(r.allPassed).toBe(false);
  });
});
