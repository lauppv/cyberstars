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
};

const mockCurriculumRepo = {
  getLessonsByCourse: vi.fn(),
  getAllCourses: vi.fn(),
  getAllLessons: vi.fn(),
  getLessonCount: vi.fn(),
};

vi.mock("../repositories/progress.repository.js", () => mockProgressRepo);
vi.mock("../repositories/curriculum.repository.js", () => mockCurriculumRepo);

const { getCourseProgress, markComplete, saveCode, getSavedCode, trackAccess } =
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
