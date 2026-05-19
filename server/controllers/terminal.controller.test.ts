import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler.js";

process.env.JWT_SECRET = "test-secret";
process.env.DB_USER = "test";
process.env.DB_HOST = "localhost";
process.env.DB_NAME = "test";
process.env.DB_PASSWORD = "test";

const mockCreateSession = vi.fn();
const mockExecCommand = vi.fn();
const mockDestroySession = vi.fn();
const mockRunTerminalTests = vi.fn();
const mockMarkComplete = vi.fn();

vi.mock("../services/terminal-session.service.js", () => ({
  createSession: (...args: unknown[]) => mockCreateSession(...args),
  execCommand: (...args: unknown[]) => mockExecCommand(...args),
  destroySession: (...args: unknown[]) => mockDestroySession(...args),
}));

vi.mock("../services/terminal-test-runner.service.js", () => ({
  runTerminalTests: (...args: unknown[]) => mockRunTerminalTests(...args),
}));

vi.mock("../services/progress.service.js", () => ({
  markComplete: (...args: unknown[]) => mockMarkComplete(...args),
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: class { constructor() { return {}; } },
}));

const ctrl = await import("./terminal.controller.js");

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
  return res as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe("createSession", () => {
  it("creates session and returns it", async () => {
    const session = { sessionId: "abc-123", cwd: "/home/student" };
    mockCreateSession.mockResolvedValue(session);
    const req = mockReq({ body: { courseKey: "linux", lessonSlug: "intro" } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.createSession(req, res, next);
    expect(res.json).toHaveBeenCalledWith(session);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next on validation error", async () => {
    const req = mockReq({ body: { courseKey: "", lessonSlug: "" } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.createSession(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe("exec", () => {
  it("executes command and returns result", async () => {
    const result = { output: "hello", cwd: "/home/student" };
    mockExecCommand.mockResolvedValue(result);
    const req = mockReq({ body: { sessionId: "550e8400-e29b-41d4-a716-446655440000", command: "ls" } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.exec(req, res, next);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it("returns 404 AppError when session not found", async () => {
    mockExecCommand.mockRejectedValue(new Error("Session not found"));
    const req = mockReq({ body: { sessionId: "550e8400-e29b-41d4-a716-446655440000", command: "ls" } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.exec(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0][0] as AppError;
    expect(err.statusCode).toBe(404);
  });

  it("passes other errors to next", async () => {
    mockExecCommand.mockRejectedValue(new Error("Docker failed"));
    const req = mockReq({ body: { sessionId: "550e8400-e29b-41d4-a716-446655440000", command: "ls" } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.exec(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("submit", () => {
  it("runs tests and returns results", async () => {
    const testResult = { passed: 1, total: 1, allPassed: true, results: [] };
    mockRunTerminalTests.mockResolvedValue(testResult);
    const req = mockReq({
      body: { sessionId: "550e8400-e29b-41d4-a716-446655440000", courseKey: "linux", lessonSlug: "intro" },
    });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.submit(req, res, next);
    expect(res.json).toHaveBeenCalledWith(testResult);
  });

  it("marks complete when all pass and user logged in", async () => {
    mockRunTerminalTests.mockResolvedValue({ passed: 1, total: 1, allPassed: true, results: [] });
    const req = mockReq({
      body: { sessionId: "550e8400-e29b-41d4-a716-446655440000", courseKey: "linux", lessonSlug: "intro" },
      user: { id: 1 } as Request["user"],
    });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.submit(req, res, next);
    expect(mockMarkComplete).toHaveBeenCalledWith(1, "linux", "intro");
  });

  it("does not mark complete when tests fail", async () => {
    mockRunTerminalTests.mockResolvedValue({ passed: 0, total: 1, allPassed: false, results: [] });
    const req = mockReq({
      body: { sessionId: "550e8400-e29b-41d4-a716-446655440000", courseKey: "linux", lessonSlug: "intro" },
      user: { id: 1 } as Request["user"],
    });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.submit(req, res, next);
    expect(mockMarkComplete).not.toHaveBeenCalled();
  });

  it("returns 404 AppError when session not found", async () => {
    mockRunTerminalTests.mockRejectedValue(new Error("Session not found"));
    const req = mockReq({
      body: { sessionId: "550e8400-e29b-41d4-a716-446655440000", courseKey: "linux", lessonSlug: "intro" },
    });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.submit(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});

describe("destroy", () => {
  it("destroys session and returns ok", async () => {
    mockDestroySession.mockResolvedValue(undefined);
    const req = mockReq({ params: { sessionId: "550e8400-e29b-41d4-a716-446655440000" } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.destroy(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("calls next on validation error (invalid UUID)", async () => {
    const req = mockReq({ params: { sessionId: "not-a-uuid" } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.destroy(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
