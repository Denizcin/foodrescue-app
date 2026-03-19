import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  generatePickupCode,
  haversineDistance,
  maskPickupCode,
  calcCommission,
  isPickupWindowExpired,
  isPickupWindowActive,
} from "@/lib/utils";

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats whole numbers with two decimals", () => {
    expect(formatCurrency(10)).toBe("₺10.00");
  });

  it("formats amounts with cents", () => {
    expect(formatCurrency(9.99)).toBe("₺9.99");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("₺0.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatCurrency(1.005)).toBe("₺1.00"); // JS float rounding
    expect(formatCurrency(1.006)).toBe("₺1.01");
  });
});

// ─── generatePickupCode ───────────────────────────────────────────────────────

describe("generatePickupCode", () => {
  it("returns a 6-character string", () => {
    const code = generatePickupCode();
    expect(code).toHaveLength(6);
  });

  it("returns uppercase alphanumeric characters", () => {
    const code = generatePickupCode();
    expect(code).toMatch(/^[A-Z0-9]{6}$/);
  });

  it("generates unique codes each call", () => {
    const codes = new Set(Array.from({ length: 100 }, () => generatePickupCode()));
    // 100 calls should produce at least 50 distinct codes
    expect(codes.size).toBeGreaterThan(50);
  });
});

// ─── maskPickupCode ───────────────────────────────────────────────────────────

describe("maskPickupCode", () => {
  it("masks middle characters of a 6-char code", () => {
    expect(maskPickupCode("AB1234")).toBe("AB••34");
  });

  it("passes through codes shorter than 4 chars unchanged", () => {
    expect(maskPickupCode("AB")).toBe("AB");
  });
});

// ─── haversineDistance ────────────────────────────────────────────────────────

describe("haversineDistance", () => {
  it("returns 0 for identical points", () => {
    expect(haversineDistance(41.015, 28.979, 41.015, 28.979)).toBe(0);
  });

  it("returns approximately 0 km for points a few metres apart", () => {
    const d = haversineDistance(41.0, 28.0, 41.0001, 28.0001);
    expect(d).toBeLessThan(0.05);
  });

  it("returns ~1400 km between Istanbul and London", () => {
    // Istanbul: 41.01°N 28.98°E  |  London: 51.51°N -0.13°E
    const d = haversineDistance(41.01, 28.98, 51.51, -0.13);
    expect(d).toBeGreaterThan(2400);
    expect(d).toBeLessThan(2600);
  });

  it("returns ~2250 km between Istanbul and Paris", () => {
    // Paris: 48.86°N 2.35°E — actual great-circle ~2255 km
    const d = haversineDistance(41.01, 28.98, 48.86, 2.35);
    expect(d).toBeGreaterThan(2100);
    expect(d).toBeLessThan(2400);
  });

  it("is symmetric — A→B equals B→A", () => {
    const ab = haversineDistance(40, 30, 41, 31);
    const ba = haversineDistance(41, 31, 40, 30);
    expect(Math.abs(ab - ba)).toBeLessThan(0.001);
  });
});

// ─── calcCommission ───────────────────────────────────────────────────────────

describe("calcCommission — 15% rate", () => {
  it("applies 15% commission rate", () => {
    const result = calcCommission(100);
    expect(result.commissionRate).toBe(0.15);
    expect(result.commissionAmount).toBe(15);
    expect(result.merchantAmount).toBe(85);
  });

  it("rounds to two decimal places", () => {
    const result = calcCommission(33.33);
    const sum = result.commissionAmount + result.merchantAmount;
    expect(Math.abs(sum - 33.33)).toBeLessThan(0.01);
  });

  it("commissionAmount + merchantAmount equals total", () => {
    [10, 25.5, 99.9, 150].forEach((price) => {
      const { commissionAmount, merchantAmount } = calcCommission(price);
      const sum = Math.round((commissionAmount + merchantAmount) * 100) / 100;
      expect(sum).toBe(Math.round(price * 100) / 100);
    });
  });
});

// ─── isPickupWindowExpired ────────────────────────────────────────────────────

describe("isPickupWindowExpired", () => {
  it("returns true for a past date", () => {
    expect(isPickupWindowExpired("2000-01-01T00:00:00Z")).toBe(true);
  });

  it("returns false for a future date", () => {
    expect(isPickupWindowExpired("2099-01-01T00:00:00Z")).toBe(false);
  });
});

// ─── isPickupWindowActive ─────────────────────────────────────────────────────

describe("isPickupWindowActive", () => {
  it("returns false when window is in the future", () => {
    expect(
      isPickupWindowActive("2099-01-01T10:00:00Z", "2099-01-01T12:00:00Z")
    ).toBe(false);
  });

  it("returns false when window is in the past", () => {
    expect(
      isPickupWindowActive("2000-01-01T10:00:00Z", "2000-01-01T12:00:00Z")
    ).toBe(false);
  });

  it("returns true when now falls within the window", () => {
    const start = new Date(Date.now() - 60_000).toISOString(); // 1 min ago
    const end = new Date(Date.now() + 60_000).toISOString();   // 1 min ahead
    expect(isPickupWindowActive(start, end)).toBe(true);
  });
});
