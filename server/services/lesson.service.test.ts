import { describe, it, expect } from "vitest";
import { getLessonContent, getLessonCode } from "./lesson.service.js";
import { AppError } from "../middleware/errorHandler.js";

describe("getLessonContent", () => {
  it("throws 400 on path traversal in slug", () => {
    expect(() => getLessonContent("python", "../etc/passwd")).toThrow(AppError);
    expect(() => getLessonContent("python", "foo/bar")).toThrow(AppError);
  });

  it("throws 404 for a non-existent lesson", () => {
    expect(() => getLessonContent("python", "does-not-exist-xyz")).toThrow(AppError);
    try {
      getLessonContent("python", "does-not-exist-xyz");
    } catch (e) {
      expect((e as AppError).statusCode).toBe(404);
    }
  });

  it("returns content for a real lesson", () => {
    const result = getLessonContent("python", "booleans");
    expect(result).toHaveProperty("content");
    expect(result.content.length).toBeGreaterThan(0);
  });
});

describe("getLessonCode", () => {
  it("throws 400 on path traversal", () => {
    expect(() => getLessonCode("python", "../server.ts")).toThrow(AppError);
  });

  it("throws 404 for missing file", () => {
    expect(() => getLessonCode("python", "nonexistent.py")).toThrow(AppError);
  });
});
