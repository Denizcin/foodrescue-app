/**
 * Integration tests for server actions.
 *
 * We mock Prisma and NextAuth so these tests run without a real database.
 * The goal is to verify the business-logic paths: stock decrement, pickup code
 * generation, commission calculation, status transitions, and error guards.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock NextAuth ────────────────────────────────────────────────────────────

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

const mockTx = {
  user: { findUnique: vi.fn() },
  surpriseBox: { findUnique: vi.fn(), update: vi.fn() },
  order: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  business: { findFirst: vi.fn() },
};

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(async (fn: (tx: typeof mockTx) => Promise<unknown>) =>
      fn(mockTx)
    ),
    order: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    surpriseBox: { update: vi.fn() },
    business: { findFirst: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}));

// ─── Mock email helpers (fire-and-forget — must not throw) ────────────────────

vi.mock("@/lib/email", () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue(undefined),
  sendOrderCancellation: vi.fn().mockResolvedValue(undefined),
  sendMerchantNewOrder: vi.fn().mockResolvedValue(undefined),
  sendMerchantOrderCancelled: vi.fn().mockResolvedValue(undefined),
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import { createOrder, cancelOrder, verifyPickupCode } from "@/lib/actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── Shared fixture factories ────────────────────────────────────────────────

const FUTURE = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2h

const makeBox = (overrides = {}) => ({
  id: "box-1",
  isActive: true,
  stockQuantity: 5,
  discountedPrice: 50,
  pickupTimeEnd: FUTURE,
  businessId: "biz-1",
  ...overrides,
});

const makeOrder = (overrides = {}) => ({
  id: "order-1",
  userId: "user-1",
  boxId: "box-1",
  quantity: 1,
  totalPrice: 50,
  pickupCode: "ABC123",
  status: "PENDING",
  paymentId: null,
  box: {
    ...makeBox(),
    business: { id: "biz-1", name: "Test Fırın", address: "Test Sok.", ownerId: "owner-1" },
  },
  ...overrides,
});

// ─── createOrder ─────────────────────────────────────────────────────────────

describe("createOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns UNAUTHORIZED when no session", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);
    const result = await createOrder({ boxId: "box-1", quantity: 1 });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/giriş|Unauthorized|unauthorized/i);
  });

  it("returns error when box not found", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com", name: "User" },
    } as never);
    mockTx.user.findUnique.mockResolvedValueOnce({ id: "user-1" });
    mockTx.surpriseBox.findUnique.mockResolvedValueOnce(null);

    const result = await createOrder({ boxId: "no-such-box", quantity: 1 });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error when insufficient stock", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com", name: "User" },
    } as never);
    mockTx.user.findUnique.mockResolvedValueOnce({ id: "user-1" });
    mockTx.surpriseBox.findUnique.mockResolvedValueOnce(makeBox({ stockQuantity: 1 }));

    const result = await createOrder({ boxId: "box-1", quantity: 3 });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("decrements stock and creates order with correct commission", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com", name: "User" },
    } as never);

    const box = makeBox({ stockQuantity: 5, discountedPrice: 100 });
    mockTx.user.findUnique.mockResolvedValueOnce({ id: "user-1" });
    mockTx.surpriseBox.findUnique.mockResolvedValueOnce(box);
    mockTx.order.findUnique.mockResolvedValueOnce(null); // no collision
    mockTx.order.create.mockResolvedValueOnce({
      ...makeOrder(),
      totalPrice: 100,
      commissionRate: 0.15,
      commissionAmount: 15,
      merchantAmount: 85,
      box: { ...box, business: { id: "biz-1", name: "Fırın", ownerId: "owner-1" } },
    });

    const result = await createOrder({ boxId: "box-1", quantity: 1 });
    expect(result.success).toBe(true);

    // Stock was decremented
    expect(mockTx.surpriseBox.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stockQuantity: 4 }),
      })
    );

    // Commission is 15%
    const created = mockTx.order.create.mock.calls[0][0].data;
    expect(created.commissionRate).toBe(0.15);
    expect(created.commissionAmount).toBe(15);
    expect(created.merchantAmount).toBe(85);
  });

  it("marks box isActive=false when stock reaches 0", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com", name: "User" },
    } as never);

    const box = makeBox({ stockQuantity: 1, discountedPrice: 50 });
    mockTx.user.findUnique.mockResolvedValueOnce({ id: "user-1" });
    mockTx.surpriseBox.findUnique.mockResolvedValueOnce(box);
    mockTx.order.findUnique.mockResolvedValueOnce(null);
    mockTx.order.create.mockResolvedValueOnce({
      ...makeOrder(),
      box: { ...box, business: { id: "biz-1", name: "Fırın", ownerId: "owner-1" } },
    });

    await createOrder({ boxId: "box-1", quantity: 1 });

    expect(mockTx.surpriseBox.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stockQuantity: 0, isActive: false }),
      })
    );
  });

  it("generates a 6-character pickup code", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com", name: "User" },
    } as never);

    const box = makeBox({ stockQuantity: 5, discountedPrice: 50 });
    mockTx.user.findUnique.mockResolvedValueOnce({ id: "user-1" });
    mockTx.surpriseBox.findUnique.mockResolvedValueOnce(box);
    mockTx.order.findUnique.mockResolvedValueOnce(null); // no collision
    mockTx.order.create.mockResolvedValueOnce({
      ...makeOrder(),
      box: { ...box, business: { id: "biz-1", name: "Fırın", ownerId: "owner-1" } },
    });

    await createOrder({ boxId: "box-1", quantity: 1 });

    const created = mockTx.order.create.mock.calls[0][0].data;
    expect(created.pickupCode).toMatch(/^[A-Z0-9]{6}$/);
  });
});

// ─── cancelOrder ──────────────────────────────────────────────────────────────

describe("cancelOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns UNAUTHORIZED when no session", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);
    const result = await cancelOrder("order-1");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error when order not found", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com" },
    } as never);
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null);

    const result = await cancelOrder("no-such-order");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error when order belongs to another user", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "other-user", email: "other@test.com" },
    } as never);
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      makeOrder({ userId: "user-1" }) as never
    );

    const result = await cancelOrder("order-1");
    expect(result.success).toBe(false);
  });

  it("returns error when order is already PICKED_UP", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com" },
    } as never);
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      makeOrder({ status: "PICKED_UP" }) as never
    );

    const result = await cancelOrder("order-1");
    expect(result.success).toBe(false);
  });

  it("returns error when order is already CANCELLED", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com" },
    } as never);
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      makeOrder({ status: "CANCELLED" }) as never
    );

    const result = await cancelOrder("order-1");
    expect(result.success).toBe(false);
  });

  it("cancels order and re-increments stock for PENDING unpaid order", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user-1", email: "u@test.com" },
    } as never);
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      makeOrder({ quantity: 2, paymentId: null }) as never
    );
    // transaction mock already set up at top
    mockTx.order.update.mockResolvedValueOnce({});
    mockTx.surpriseBox.update.mockResolvedValueOnce({});

    const result = await cancelOrder("order-1");
    expect(result.success).toBe(true);

    // Stock should go from 5 back to 7 (5 + 2)
    expect(mockTx.surpriseBox.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stockQuantity: 7, isActive: true }),
      })
    );
    // Order status should be CANCELLED
    expect(mockTx.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "CANCELLED" },
      })
    );
  });
});

// ─── verifyPickupCode ─────────────────────────────────────────────────────────

describe("verifyPickupCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns UNAUTHORIZED when no session", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);
    const result = await verifyPickupCode({ pickupCode: "ABC123" });
    expect(result.success).toBe(false);
  });

  it("returns error when merchant has no active business", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "merchant-1", email: "m@test.com" },
    } as never);
    vi.mocked(prisma.business.findFirst).mockResolvedValueOnce(null);

    const result = await verifyPickupCode({ pickupCode: "ABC123" });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error when pickup code does not match any PENDING order", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "merchant-1", email: "m@test.com" },
    } as never);
    vi.mocked(prisma.business.findFirst).mockResolvedValueOnce({
      id: "biz-1",
    } as never);
    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(null);

    const result = await verifyPickupCode({ pickupCode: "WRONG1" });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns matching order for a correct pickup code", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "merchant-1", email: "m@test.com" },
    } as never);
    vi.mocked(prisma.business.findFirst).mockResolvedValueOnce({
      id: "biz-1",
    } as never);
    const order = makeOrder({ pickupCode: "ABC123" });
    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(order as never);

    const result = await verifyPickupCode({ pickupCode: "ABC123" });
    expect(result.success).toBe(true);
    expect((result.data as typeof order).pickupCode).toBe("ABC123");
  });

  it("returns validation error for a code not exactly 6 chars", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "merchant-1", email: "m@test.com" },
    } as never);

    const result = await verifyPickupCode({ pickupCode: "AB" });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
