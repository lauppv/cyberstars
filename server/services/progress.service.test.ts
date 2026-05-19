import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.DB_USER = "test";
process.env.DB_HOST = "localhost";
process.env.DB_NAME = "test";
process.env.DB_PASSWORD = "test";

const mockProgressRepo = {
  getByCourse: vi.fn(),
  upsertProgress: vi.fn(),
  upsertCode: vi.fn(),
  getSavedCode: vi.fn(),
  touchAccess: vi.fn(),
  getLeaderboard: vi.fn(),
};

const mockCurriculumRepo = {
  getLessonsByCourse: vi.fn(),
  getAllCourses: vi.fn(),
  getAllLessons: vi.fn(),
  getLessonCount: vi.fn(),
};

vi.mock("../repositories/progress.repository.js", () => mockProgressRepo);
vi.mock("../repositories/curriculum.repository.js", () => mockCurriculumRepo);

const { getCourseProgress, markComplete, saveCode, getSavedCode, trackAccess, getLeaderboard } =
  await import("./progress.service.js");

beforeEach(() => vi.clearAllMocks());

describe("getCourseProgress", () => {
  it("aggregates lessons and progress correctly", async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: "a", title: "Lesson A", sortOrder: 0 },
      { slug: "b", title: "Lesson B", sortOrder: 1 },
      { slug: "c", title: "Lesson C", sortOrder: 2 },
    ]);
    mockProgressRepo.getByCourse.mockResolvedValue([
      { lessonSlug: "a", completed: true, completedAt: new Date("2025-01-01"), lastAccessedAt: new Date("2025-01-02") },
    ]);

    const result = await getCourseProgress(1, "python");

    expect(result.completed).toBe(1);
    expect(result.total).toBe(3);
    expect(result.earnedXp).toBe(10); // xpForLesson(0) = 10
    expect(result.totalXp).toBe(33);  // 10 + 11 + 12
    expect(result.lessons).toHaveLength(3);
    expect(result.lessons[0].completed).toBe(true);
    expect(result.lessons[1].completed).toBe(false);
  });

  it("returns zero progress when no lessons completed", async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: "a", title: "A", sortOrder: 0 },
    ]);
    mockProgressRepo.getByCourse.mockResolvedValue([]);

    const result = await getCourseProgress(1, "python");
    expect(result.completed).toBe(0);
    expect(result.earnedXp).toBe(0);
  });
});

describe("markComplete", () => {
  it("delegates to repo", async () => {
    await markComplete(1, "python", "booleans");
    expect(mockProgressRepo.upsertProgress).toHaveBeenCalledWith(1, "python", "booleans", true);
  });
});

describe("saveCode / getSavedCode", () => {
  it("saves and retrieves code", async () => {
    mockProgressRepo.getSavedCode.mockResolvedValue("print('hi')");
    await saveCode(1, "python", "booleans", "print('hi')");
    expect(mockProgressRepo.upsertCode).toHaveBeenCalledWith(1, "python", "booleans", "print('hi')");
    const code = await getSavedCode(1, "python", "booleans");
    expect(code).toBe("print('hi')");
  });
});

describe("trackAccess", () => {
  it("delegates to repo", async () => {
    await trackAccess(1, "python", "booleans");
    expect(mockProgressRepo.touchAccess).toHaveBeenCalledWith(1, "python", "booleans");
  });
});

describe("getLeaderboard", () => {
  it("ranks users and marks current user", async () => {
    mockProgressRepo.getLeaderboard.mockResolvedValue([
      { userId: 10, name: "Alice", totalXp: 200 },
      { userId: 20, name: "Bob", totalXp: 100 },
    ]);

    const lb = await getLeaderboard(20);
    expect(lb).toHaveLength(2);
    expect(lb[0]).toEqual({ rank: 1, name: "Alice", xp: 200, isCurrentUser: false });
    expect(lb[1]).toEqual({ rank: 2, name: "Bob", xp: 100, isCurrentUser: true });
  });

  it("works without a current user", async () => {
    mockProgressRepo.getLeaderboard.mockResolvedValue([
      { userId: 10, name: "Alice", totalXp: 50 },
    ]);

    const lb = await getLeaderboard();
    expect(lb[0].isCurrentUser).toBe(false);
  });
});
