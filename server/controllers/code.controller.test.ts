import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

process.env.JWT_SECRET = "test-secret";
process.env.DB_USER = "test";
process.env.DB_HOST = "localhost";
process.env.DB_NAME = "test";
process.env.DB_PASSWORD = "test";

const mockExecute = vi.fn();
const mockRunTests = vi.fn();
const mockMarkComplete = vi.fn();

vi.mock("../services/code-execution.service.js", () => ({
  execute: (...args: unknown[]) => mockExecute(...args),
}));

vi.mock("../services/test-runner.service.js", () => ({
  runTests: (...args: unknown[]) => mockRunTests(...args),
}));

vi.mock("../services/progress.service.js", () => ({
  markComplete: (...args: unknown[]) => mockMarkComplete(...args),
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: class { constructor() { return {}; } },
}));

const { executeCode, submitCode } = await import("./code.controller.js");

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
  return res as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe("executeCode", () => {
  it("executes code and returns output", async () => {
    mockExecute.mockResolvedValue("Hello World");
    const req = mockReq({ body: { code: 'print("Hello World")', language: "python" } });
    const res = mockRes();
    await executeCode(req, res);
    expect(mockExecute).toHaveBeenCalledWith('print("Hello World")', "python");
    expect(res.json).toHaveBeenCalledWith({ output: "Hello World" });
  });
});

describe("submitCode", () => {
  it("runs tests and returns results", async () => {
    const testResult = { passed: 2, total: 2, allPassed: true, results: [] };
    mockRunTests.mockResolvedValue(testResult);
    const req = mockReq({
      body: { code: "x=1", language: "python", courseKey: "python", lessonSlug: "booleans" },
    });
    const res = mockRes();
    await submitCode(req, res);
    expect(mockRunTests).toHaveBeenCalledWith("x=1", "python", "python", "booleans");
    expect(res.json).toHaveBeenCalledWith(testResult);
  });

  it("marks lesson complete when all tests pass and user is logged in", async () => {
    mockRunTests.mockResolvedValue({ passed: 1, total: 1, allPassed: true, results: [] });
    const req = mockReq({
      body: { code: "x=1", language: "python", courseKey: "python", lessonSlug: "booleans" },
      user: { id: 42 } as Request["user"],
    });
    const res = mockRes();
    await submitCode(req, res);
    expect(mockMarkComplete).toHaveBeenCalledWith(42, "python", "booleans");
  });

  it("does not mark complete when tests fail", async () => {
    mockRunTests.mockResolvedValue({ passed: 0, total: 1, allPassed: false, results: [] });
    const req = mockReq({
      body: { code: "x=1", language: "python", courseKey: "python", lessonSlug: "booleans" },
      user: { id: 42 } as Request["user"],
    });
    const res = mockRes();
    await submitCode(req, res);
    expect(mockMarkComplete).not.toHaveBeenCalled();
  });

  it("does not mark complete when user is not logged in", async () => {
    mockRunTests.mockResolvedValue({ passed: 1, total: 1, allPassed: true, results: [] });
    const req = mockReq({
      body: { code: "x=1", language: "python", courseKey: "python", lessonSlug: "booleans" },
    });
    const res = mockRes();
    await submitCode(req, res);
    expect(mockMarkComplete).not.toHaveBeenCalled();
  });
});
