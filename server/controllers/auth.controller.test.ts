import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

process.env.JWT_SECRET = "test-secret";
process.env.DB_USER = "test";
process.env.DB_HOST = "localhost";
process.env.DB_NAME = "test";
process.env.DB_PASSWORD = "test";

const mockSignup = vi.fn();
const mockLogin = vi.fn();
const mockGetUser = vi.fn();

vi.mock("../services/auth.service.js", () => ({
  signup: (...args: unknown[]) => mockSignup(...args),
  login: (...args: unknown[]) => mockLogin(...args),
  getUser: (...args: unknown[]) => mockGetUser(...args),
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: class { constructor() { return {}; } },
}));

const { signup, login, logout, me } = await import("./auth.controller.js");

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response & { cookie: ReturnType<typeof vi.fn>; clearCookie: ReturnType<typeof vi.fn> } {
  const res = {
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response & { cookie: ReturnType<typeof vi.fn>; clearCookie: ReturnType<typeof vi.fn> };
}

beforeEach(() => vi.clearAllMocks());

describe("signup", () => {
  it("creates user, sets cookie, and returns success", async () => {
    mockSignup.mockResolvedValue("jwt-token-123");
    const req = mockReq({ body: { name: "Test", email: "test@test.com", password: "pass123" } });
    const res = mockRes();
    await signup(req, res);
    expect(mockSignup).toHaveBeenCalledWith("Test", "test@test.com", "pass123");
    expect(res.cookie).toHaveBeenCalledWith("token", "jwt-token-123", expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
  });
});

describe("login", () => {
  it("logs in, sets cookie, and returns success", async () => {
    mockLogin.mockResolvedValue("jwt-token-456");
    const req = mockReq({ body: { email: "test@test.com", password: "pass123" } });
    const res = mockRes();
    await login(req, res);
    expect(mockLogin).toHaveBeenCalledWith("test@test.com", "pass123");
    expect(res.cookie).toHaveBeenCalledWith("token", "jwt-token-456", expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ message: "Login successful" });
  });
});

describe("logout", () => {
  it("clears cookie and returns success", () => {
    const req = mockReq();
    const res = mockRes();
    logout(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith("token", expect.objectContaining({ httpOnly: true }));
    expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
  });
});

describe("me", () => {
  it("returns current user data", async () => {
    const userData = { id: 1, name: "Test", email: "test@test.com" };
    mockGetUser.mockResolvedValue(userData);
    const req = mockReq({ user: { id: 1 } as Request["user"] });
    const res = mockRes();
    await me(req, res);
    expect(mockGetUser).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(userData);
  });
});
