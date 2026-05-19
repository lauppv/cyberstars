import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../services/codeExecutionService", () => ({
  runCode: vi.fn(),
  submitCode: vi.fn(),
}));

vi.mock("../services/apiClient", () => ({
  ApiClientError: class ApiClientError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = "ApiClientError";
    }
  },
}));

const { useCodeExecution } = await import("./useCodeExecution");
const { runCode, submitCode } = await import("../services/codeExecutionService");
const { ApiClientError } = await import("../services/apiClient");
const mockRunCode = vi.mocked(runCode);
const mockSubmitCode = vi.mocked(submitCode);

describe("useCodeExecution", () => {
  it("starts with empty output and not running", () => {
    const { result } = renderHook(() => useCodeExecution());
    expect(result.current.output).toBe("");
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("execute sets output from runCode", async () => {
    mockRunCode.mockResolvedValue({ output: "Hello" });
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.execute("code", "python");
    });

    expect(result.current.output).toBe("Hello");
    expect(result.current.isRunning).toBe(false);
  });

  it("execute shows 'No output.' when result is empty", async () => {
    mockRunCode.mockResolvedValue({ output: "" });
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.execute("code", "python");
    });

    expect(result.current.output).toBe("No output.");
  });

  it("execute shows server error message on ApiClientError", async () => {
    mockRunCode.mockRejectedValue(new ApiClientError(429, "Too many requests. Try again in 45 seconds."));
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.execute("code", "python");
    });

    expect(result.current.output).toBe("Too many requests. Try again in 45 seconds.");
  });

  it("execute shows generic error on network failure", async () => {
    mockRunCode.mockRejectedValue(new Error("fetch failed"));
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.execute("code", "python");
    });

    expect(result.current.output).toBe("Error connecting to server.");
  });

  it("submit sets submitResult on success", async () => {
    mockSubmitCode.mockResolvedValue({ passed: 3, total: 3, allPassed: true, results: [] });
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.submit("code", "python", "python", "booleans");
    });

    expect(result.current.submitResult?.allPassed).toBe(true);
    expect(result.current.output).toContain("All tests passed");
  });

  it("submit shows partial results", async () => {
    mockSubmitCode.mockResolvedValue({ passed: 1, total: 3, allPassed: false, results: [] });
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.submit("code", "python", "python", "booleans");
    });

    expect(result.current.output).toContain("1/3");
  });

  it("clearOutput resets state", async () => {
    mockRunCode.mockResolvedValue({ output: "Hello" });
    const { result } = renderHook(() => useCodeExecution());

    await act(async () => {
      await result.current.execute("code", "python");
    });
    expect(result.current.output).toBe("Hello");

    act(() => {
      result.current.clearOutput();
    });
    expect(result.current.output).toBe("");
    expect(result.current.submitResult).toBeNull();
  });
});
