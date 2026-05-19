import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler.js";

process.env.JWT_SECRET = "test-secret";
process.env.DB_USER = "test";
process.env.DB_HOST = "localhost";
process.env.DB_NAME = "test";
process.env.DB_PASSWORD = "test";

const mockPrisma = {
  supportTicket: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  supportMessage: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("@prisma/client", () => ({
  PrismaClient: class {
    constructor() {
      return mockPrisma;
    }
  },
}));

const mockUserRepo = {
  getRole: vi.fn(),
};
vi.mock("../repositories/user.repository.js", () => mockUserRepo);

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
  getTicketMessages,
  addTicketMessage,
} = await import("./support.controller.js");

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
  return res as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe("createTicket", () => {
  it("returns 400 for invalid type", async () => {
    const next = vi.fn();
    await createTicket(mockReq({ user: { id: 1 } as Request["user"], body: { type: "INVALID", subject: "s", message: "m" } }), mockRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it("returns 400 for missing subject", async () => {
    const next = vi.fn();
    await createTicket(mockReq({ user: { id: 1 } as Request["user"], body: { type: "BUG", subject: "", message: "m" } }), mockRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it("returns 400 for subject too long", async () => {
    const next = vi.fn();
    await createTicket(
      mockReq({ user: { id: 1 } as Request["user"], body: { type: "BUG", subject: "x".repeat(201), message: "m" } }),
      mockRes(), next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it("creates ticket successfully", async () => {
    mockPrisma.supportTicket.create.mockResolvedValue({ id: 10 });
    const res = mockRes();
    await createTicket(
      mockReq({ user: { id: 1 } as Request["user"], body: { type: "BUG", subject: "Bug report", message: "Details" } }),
      res, vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ticketId: 10 });
  });
});

describe("getMyTickets", () => {
  it("returns user tickets as DTOs", async () => {
    const now = new Date();
    mockPrisma.supportTicket.findMany.mockResolvedValue([
      { id: 1, type: "BUG", subject: "s", message: "m", status: "OPEN", createdAt: now, updatedAt: now },
    ]);
    const res = mockRes();
    await getMyTickets(mockReq({ user: { id: 1 } as Request["user"] }), res, vi.fn());
    expect(res.json).toHaveBeenCalledWith([expect.objectContaining({ id: 1, type: "BUG", createdAt: now.toISOString() })]);
  });
});

describe("getAllTickets", () => {
  it("returns 403 for non-admin", async () => {
    mockUserRepo.getRole.mockResolvedValue("USER");
    const next = vi.fn();
    await getAllTickets(mockReq({ user: { id: 1 } as Request["user"] }), mockRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it("returns all tickets for admin", async () => {
    mockUserRepo.getRole.mockResolvedValue("ADMIN");
    const now = new Date();
    mockPrisma.supportTicket.findMany.mockResolvedValue([
      { id: 1, type: "BUG", subject: "s", message: "m", status: "OPEN", createdAt: now, updatedAt: now, user: { name: "Alice", email: "a@t.com" } },
    ]);
    const res = mockRes();
    await getAllTickets(mockReq({ user: { id: 1 } as Request["user"] }), res, vi.fn());
    expect(res.json).toHaveBeenCalledWith([expect.objectContaining({ id: 1, authorName: "Alice" })]);
  });
});

describe("updateTicketStatus", () => {
  it("returns 400 for invalid status", async () => {
    const next = vi.fn();
    await updateTicketStatus(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string>, body: { status: "YOLO" } }),
      mockRes(), next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it("returns 404 for missing ticket", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await updateTicketStatus(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "999" } as Record<string, string>, body: { status: "CLOSED" } }),
      mockRes(), next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it("allows owner to close their ticket", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue("USER");
    mockPrisma.supportTicket.update.mockResolvedValue({});
    const res = mockRes();
    await updateTicketStatus(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string>, body: { status: "CLOSED" } }),
      res, vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("prevents owner from setting status other than CLOSED", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue("USER");
    const next = vi.fn();
    await updateTicketStatus(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string>, body: { status: "IN_PROGRESS" } }),
      mockRes(), next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it("prevents non-owner non-admin from updating", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 99 });
    mockUserRepo.getRole.mockResolvedValue("USER");
    const next = vi.fn();
    await updateTicketStatus(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string>, body: { status: "CLOSED" } }),
      mockRes(), next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it("allows admin to set any status", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 99 });
    mockUserRepo.getRole.mockResolvedValue("ADMIN");
    mockPrisma.supportTicket.update.mockResolvedValue({});
    const res = mockRes();
    await updateTicketStatus(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string>, body: { status: "IN_PROGRESS" } }),
      res, vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe("getTicketMessages", () => {
  it("returns 403 for non-owner non-admin", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 99 });
    mockUserRepo.getRole.mockResolvedValue("USER");
    const next = vi.fn();
    await getTicketMessages(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string> }),
      mockRes(), next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it("returns messages for owner", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue("USER");
    const now = new Date();
    mockPrisma.supportMessage.findMany.mockResolvedValue([
      { id: 1, userId: 1, message: "Hello", createdAt: now, user: { name: "Alice", role: "USER" } },
    ]);
    const res = mockRes();
    await getTicketMessages(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string> }),
      res, vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ id: 1, authorName: "Alice", isAdmin: false }),
    ]);
  });
});

describe("addTicketMessage", () => {
  it("returns 400 for empty message", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    const next = vi.fn();
    await addTicketMessage(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string>, body: { message: "" } }),
      mockRes(), next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it("creates message successfully", async () => {
    mockPrisma.supportTicket.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue("USER");
    mockPrisma.supportMessage.create.mockResolvedValue({});
    const res = mockRes();
    await addTicketMessage(
      mockReq({ user: { id: 1 } as Request["user"], params: { id: "1" } as Record<string, string>, body: { message: "Help!" } }),
      res, vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});
