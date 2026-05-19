import { describe, it, expect, vi, beforeEach } from "vitest";
import { api, ApiClientError } from "./apiClient";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => vi.clearAllMocks());

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  };
}

describe("apiClient", () => {
  it("GET returns parsed JSON", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ data: 42 }));
    const result = await api.get<{ data: number }>("/api/test");
    expect(result.data).toBe(42);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("POST sends JSON body", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.post("/api/test", { name: "Ada" });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        method: "POST",
        body: '{"name":"Ada"}',
      }),
    );
  });

  it("throws ApiClientError on non-2xx with error message", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: "Not found" }, 404));
    try {
      await api.get("/api/missing");
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).status).toBe(404);
      expect((e as ApiClientError).message).toBe("Not found");
    }
  });

  it("throws ApiClientError with fallback message on non-JSON error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers(),
      json: () => Promise.reject(new Error("not json")),
    });
    try {
      await api.get("/api/broken");
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).message).toBe("Something went wrong");
    }
  });

  it("PUT sends body", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.put("/api/test", { code: "x" });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("DELETE sends request", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api.delete("/api/test");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
