import { describe, it, expect, vi } from "vitest";
import request from "supertest";

process.env.JWT_SECRET = "test-secret";
process.env.DB_USER = "test";
process.env.DB_HOST = "localhost";
process.env.DB_NAME = "test";
process.env.DB_PASSWORD = "test";

function makePrismaProxy() {
  return new Proxy(
    {},
    {
      get() {
        return new Proxy(() => {}, {
          get() {
            return () => Promise.resolve([]);
          },
          apply() {
            return Promise.resolve([]);
          },
        });
      },
    },
  );
}

vi.mock("@prisma/client", () => {
  class PrismaClient {
    constructor() {
      return makePrismaProxy();
    }
  }
  return { PrismaClient };
});
vi.mock("./config/db.js", () => ({ prisma: makePrismaProxy() }));

vi.mock("./repositories/curriculum.repository.js", () => ({
  getAllCourses: vi.fn().mockResolvedValue([]),
  getLessonsByCourse: vi.fn().mockResolvedValue([]),
  getAllLessons: vi.fn().mockResolvedValue([]),
  getLessonCount: vi.fn().mockResolvedValue(0),
}));
vi.mock("./repositories/progress.repository.js", () => ({
  getProgress: vi.fn().mockResolvedValue([]),
  markComplete: vi.fn().mockResolvedValue(null),
  getSavedCode: vi.fn().mockResolvedValue(null),
  saveCode: vi.fn().mockResolvedValue(null),
  trackAccess: vi.fn().mockResolvedValue(null),
  getLeaderboard: vi.fn().mockResolvedValue([]),
}));
vi.mock("./repositories/user.repository.js", () => ({
  findByEmail: vi.fn().mockResolvedValue(null),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn().mockResolvedValue(null),
  updateProfile: vi.fn().mockResolvedValue(null),
}));

const { app } = await import("./app.js");

describe("endpoint smoke tests — public routes return 200", () => {
  const publicGets = [
    "/api/curriculum",
    "/api/lessons/python/booleans",
    "/api/lesson-code/python/booleans-code.md",
    "/api/leaderboard",
    "/api/forum/categories",
  ];

  for (const path of publicGets) {
    it(`GET ${path}`, async () => {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
    });
  }
});

describe("endpoint smoke tests — auth-protected routes return 401 without token", () => {
  const authRequired: [string, string][] = [
    ["get", "/api/progress/python"],
    ["post", "/api/progress/python/booleans/complete"],
    ["get", "/api/progress/python/booleans/code"],
    ["put", "/api/progress/python/booleans/code"],
    ["post", "/api/progress/python/booleans/access"],
    ["post", "/api/forum/threads"],
    ["post", "/api/terminal/session"],
    ["post", "/api/terminal/exec"],
    ["delete", "/api/terminal/session/123"],
    ["post", "/api/support/tickets"],
    ["get", "/api/support/tickets/mine"],
    ["patch", "/api/profile"],
    ["post", "/api/profile/avatar"],
    ["delete", "/api/profile/avatar"],
    ["get", "/auth/me"],
  ];

  for (const [method, path] of authRequired) {
    it(`${method.toUpperCase()} ${path}`, async () => {
      const res = await (request(app) as Record<string, (url: string) => request.Test>)[method](path);
      expect(res.status).toBe(401);
    });
  }
});

describe("endpoint smoke tests — unknown routes", () => {
  it("GET /api/does-not-exist → 404", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
  });
});
