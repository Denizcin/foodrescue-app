import { describe, it, expect } from "vitest";
import {
  createBoxSchema,
  createOrderSchema,
  verifyPickupSchema,
  createNominationSchema,
  registerConsumerSchema,
  registerBusinessSchema,
  loginSchema,
} from "@/lib/validations";

// ─── helpers ──────────────────────────────────────────────────────────────────

const future = (offsetMinutes = 120) =>
  new Date(Date.now() + offsetMinutes * 60_000).toISOString();

const validBox = () => ({
  category: "BAKERY" as const,
  originalPrice: 100,
  discountedPrice: 60,
  stockQuantity: 5,
  pickupTimeStart: future(60),
  pickupTimeEnd: future(120),
});

// ─── createBoxSchema ──────────────────────────────────────────────────────────

describe("createBoxSchema", () => {
  it("accepts a valid box", () => {
    expect(createBoxSchema.safeParse(validBox()).success).toBe(true);
  });

  it("rejects when discountedPrice >= originalPrice", () => {
    const result = createBoxSchema.safeParse({
      ...validBox(),
      discountedPrice: 100,
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.flatten().fieldErrors.discountedPrice).toBeDefined();
  });

  it("rejects when stockQuantity is 0", () => {
    expect(
      createBoxSchema.safeParse({ ...validBox(), stockQuantity: 0 }).success
    ).toBe(false);
  });

  it("rejects when stockQuantity exceeds 50", () => {
    expect(
      createBoxSchema.safeParse({ ...validBox(), stockQuantity: 51 }).success
    ).toBe(false);
  });

  it("rejects when pickup window is less than 30 minutes", () => {
    const result = createBoxSchema.safeParse({
      ...validBox(),
      pickupTimeStart: future(60),
      pickupTimeEnd: future(75), // only 15 min window
    });
    expect(result.success).toBe(false);
  });

  it("rejects when pickupTimeEnd is in the past", () => {
    const result = createBoxSchema.safeParse({
      ...validBox(),
      pickupTimeStart: new Date(Date.now() - 120 * 60_000).toISOString(),
      pickupTimeEnd: new Date(Date.now() - 60 * 60_000).toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative originalPrice", () => {
    expect(
      createBoxSchema.safeParse({ ...validBox(), originalPrice: -1 }).success
    ).toBe(false);
  });

  it("accepts optional description", () => {
    expect(
      createBoxSchema.safeParse({
        ...validBox(),
        description: "Taze ekmekler",
      }).success
    ).toBe(true);
  });

  it("rejects description over 500 chars", () => {
    expect(
      createBoxSchema.safeParse({
        ...validBox(),
        description: "a".repeat(501),
      }).success
    ).toBe(false);
  });
});

// ─── createOrderSchema ────────────────────────────────────────────────────────

describe("createOrderSchema", () => {
  it("accepts quantity between 1 and 3", () => {
    expect(createOrderSchema.safeParse({ boxId: "abc123", quantity: 1 }).success).toBe(true);
    expect(createOrderSchema.safeParse({ boxId: "abc123", quantity: 3 }).success).toBe(true);
  });

  it("rejects quantity 0", () => {
    expect(
      createOrderSchema.safeParse({ boxId: "abc123", quantity: 0 }).success
    ).toBe(false);
  });

  it("rejects quantity 4", () => {
    expect(
      createOrderSchema.safeParse({ boxId: "abc123", quantity: 4 }).success
    ).toBe(false);
  });

  it("rejects empty boxId", () => {
    expect(
      createOrderSchema.safeParse({ boxId: "", quantity: 1 }).success
    ).toBe(false);
  });
});

// ─── verifyPickupSchema ───────────────────────────────────────────────────────

describe("verifyPickupSchema", () => {
  it("accepts exactly 6-character code", () => {
    expect(verifyPickupSchema.safeParse({ pickupCode: "AB1234" }).success).toBe(true);
  });

  it("rejects codes shorter than 6", () => {
    expect(verifyPickupSchema.safeParse({ pickupCode: "ABC" }).success).toBe(false);
  });

  it("rejects codes longer than 6", () => {
    expect(verifyPickupSchema.safeParse({ pickupCode: "ABCDEFG" }).success).toBe(false);
  });
});

// ─── createNominationSchema ───────────────────────────────────────────────────

describe("createNominationSchema", () => {
  const valid = {
    nominatorName: "Ahmet",
    nominatedBusinessName: "Ekmek Fırını",
    nominatedAddress: "Kadıköy Mah. No:5",
  };

  it("accepts a valid nomination", () => {
    expect(createNominationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects nominatorName shorter than 2 chars", () => {
    expect(
      createNominationSchema.safeParse({ ...valid, nominatorName: "A" }).success
    ).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(
      createNominationSchema.safeParse({
        ...valid,
        nominatorEmail: "not-an-email",
      }).success
    ).toBe(false);
  });

  it("accepts empty string email (optional)", () => {
    expect(
      createNominationSchema.safeParse({
        ...valid,
        nominatorEmail: "",
      }).success
    ).toBe(true);
  });

  it("rejects reason over 500 chars", () => {
    expect(
      createNominationSchema.safeParse({
        ...valid,
        reason: "x".repeat(501),
      }).success
    ).toBe(false);
  });
});

// ─── registerConsumerSchema ───────────────────────────────────────────────────

describe("registerConsumerSchema", () => {
  const valid = {
    name: "Ayşe Kaya",
    email: "ayse@example.com",
    password: "sifre1234",
    confirmPassword: "sifre1234",
  };

  it("accepts valid consumer registration", () => {
    expect(registerConsumerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerConsumerSchema.safeParse({
      ...valid,
      confirmPassword: "baska-sifre",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
  });

  it("rejects password shorter than 8 chars", () => {
    expect(
      registerConsumerSchema.safeParse({
        ...valid,
        password: "1234",
        confirmPassword: "1234",
      }).success
    ).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(
      registerConsumerSchema.safeParse({ ...valid, email: "not-email" }).success
    ).toBe(false);
  });
});

// ─── registerBusinessSchema ───────────────────────────────────────────────────

describe("registerBusinessSchema", () => {
  const valid = {
    ownerName: "Mehmet Demir",
    email: "mehmet@firini.com",
    password: "gizlisifre",
    businessName: "Mehmet Fırını",
    category: "BAKERY" as const,
    address: "İstanbul, Üsküdar",
    operatingHours: "08:00-22:00",
  };

  it("accepts a valid business registration", () => {
    expect(registerBusinessSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid business category", () => {
    expect(
      registerBusinessSchema.safeParse({ ...valid, category: "INVALID" }).success
    ).toBe(false);
  });

  it("rejects address shorter than 5 chars", () => {
    expect(
      registerBusinessSchema.safeParse({ ...valid, address: "İst" }).success
    ).toBe(false);
  });
});

// ─── loginSchema ─────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("rejects empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(loginSchema.safeParse({ email: "not-valid", password: "pass" }).success).toBe(false);
  });
});
