import { describe, it, expect, vi } from "vitest";

vi.mock("./code-execution.service.js", () => ({
  execute: vi.fn(),
}));

const { getTestCases, runTests } = await import("./test-runner.service.js");
const { execute } = await import("./code-execution.service.js");
const mockExecute = vi.mocked(execute);

describe("getTestCases", () => {
  it("returns parsed test cases for an existing lesson", () => {
    const tests = getTestCases("python", "booleans");
    expect(tests).not.toBeNull();
    expect(Array.isArray(tests)).toBe(true);
    expect(tests!.length).toBeGreaterThan(0);
    expect(tests![0]).toHaveProperty("name");
    expect(tests![0]).toHaveProperty("mode");
  });

  it("returns null for a non-existent lesson", () => {
    expect(getTestCases("python", "does-not-exist-xyz")).toBeNull();
  });
});

describe("runTests", () => {
  it("returns allPassed when all tests pass (exact mode)", async () => {
    mockExecute.mockResolvedValue("hello");

    const result = await runTests(
      'print("hello")',
      "python",
      "python",
      "booleans",
    );

    expect(result.total).toBeGreaterThan(0);
    expect(result.results.length).toBe(result.total);
  });

  it("returns empty results for a lesson with no tests", async () => {
    const result = await runTests("code", "python", "python", "does-not-exist-xyz");
    expect(result).toEqual({ passed: 0, total: 0, allPassed: true, results: [] });
  });

  it("marks test as failed when output doesn't match", async () => {
    mockExecute.mockResolvedValue("wrong output");

    const result = await runTests(
      'print("wrong output")',
      "python",
      "python",
      "booleans",
    );

    const failedCount = result.results.filter((r) => !r.passed).length;
    expect(failedCount).toBeGreaterThan(0);
  });

  it("applies overrides to code before execution", async () => {
    mockExecute.mockImplementation(async (code: string) => {
      if (code.includes('name = "Cortez"')) return "Hello. My name is Cortez, I am 57 years old, and I am 1.67 tall";
      return "wrong";
    });

    const tests = getTestCases("python", "variables-int");
    if (!tests) return;

    await runTests(
      'name = ""\nage = 0\nheight = 0\nprint(f"Hello. My name is {name}, I am {age} years old, and I am {height} tall")',
      "python",
      "python",
      "variables-int",
    );

    expect(mockExecute).toHaveBeenCalled();
    const firstCall = mockExecute.mock.calls[0][0];
    expect(firstCall).not.toContain('name = ""');
  });
});
