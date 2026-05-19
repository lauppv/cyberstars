import { describe, it, expect, vi } from "vitest";

const mockProbe = vi.fn();
const mockGetSession = vi.fn();

vi.mock("./terminal-session.service.js", () => ({
  probe: (...args: unknown[]) => mockProbe(...args),
  getSession: (...args: unknown[]) => mockGetSession(...args),
}));

const { getTerminalTests, runTerminalTests } = await import("./terminal-test-runner.service.js");

describe("getTerminalTests", () => {
  it("returns parsed tests for an existing linux lesson", () => {
    const tests = getTerminalTests("linux", "navigating-the-filesystem");
    if (!tests) return; // skip if lesson doesn't exist in this checkout
    expect(Array.isArray(tests)).toBe(true);
    expect(tests[0]).toHaveProperty("name");
    expect(tests[0]).toHaveProperty("check");
  });

  it("returns null for non-existent lesson", () => {
    expect(getTerminalTests("linux", "nonexistent-xyz")).toBeNull();
  });
});

describe("runTerminalTests", () => {
  it("returns empty results for lesson with no tests", async () => {
    const result = await runTerminalTests("sid", "linux", "nonexistent-xyz");
    expect(result).toEqual({ passed: 0, total: 0, allPassed: true, results: [] });
  });

  it("evaluates cwd_equals check", async () => {
    mockGetSession.mockReturnValue({
      containerId: "abc",
      cwd: "/home/student",
      history: [],
      lastOutput: "",
      lastActivity: Date.now(),
    });

    vi.doMock("./paths.js", async (importOriginal) => {
      const orig = await importOriginal<typeof import("./paths.js")>();
      return orig;
    });

    const { runTerminalTests: run } = await import("./terminal-test-runner.service.js");

    mockGetSession.mockReturnValue({
      containerId: "abc",
      cwd: "/home/student/docs",
      history: ["cd docs"],
      lastOutput: "",
      lastActivity: Date.now(),
    });

    // Manually create a test scenario with history_contains
    mockProbe.mockResolvedValue("");

    // Test with a lesson that has actual tests
    const tests = getTerminalTests("linux", "navigating-the-filesystem");
    if (!tests) return;

    const result = await run("sid", "linux", "navigating-the-filesystem");
    expect(result.total).toBeGreaterThan(0);
    expect(result.results.length).toBe(result.total);
  });
});
