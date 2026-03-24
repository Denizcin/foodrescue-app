"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Yetkisiz erişim");
  }
}

export async function approveBusiness(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.business.update({
      where: { id },
      data: { isApproved: true, isActive: true },
    });
    revalidatePath("/admin/businesses");
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Bir hata oluştu" };
  }
}

export async function rejectBusiness(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.business.update({
      where: { id },
      data: { isApproved: false, isActive: false },
    });
    revalidatePath("/admin/businesses");
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Bir hata oluştu" };
  }
}

// ─── Beta quick actions ────────────────────────────────────────────────────────

/** Approves every pending business in one shot. */
export async function approveAllPending(): Promise<ActionResult> {
  try {
    await requireAdmin();
    const result = await prisma.business.updateMany({
      where: { isApproved: false },
      data: { isApproved: true, isActive: true },
    });
    revalidatePath("/admin/businesses");
    revalidatePath("/consumer");
    return { success: true, data: { count: result.count } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Bir hata oluştu" };
  }
}

/**
 * Deactivates all current boxes and creates fresh ones with future pickup
 * windows for every approved business. Safe to call multiple times.
 */
export async function refreshBetaBoxes(): Promise<ActionResult> {
  try {
    await requireAdmin();

    // Retire every existing active box
    await prisma.surpriseBox.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const businesses = await prisma.business.findMany({
      where: { isApproved: true, isActive: true },
      select: { id: true, category: true },
    });

    if (businesses.length === 0) {
      return { success: false, error: "Onaylı işletme bulunamadı." };
    }

    const now = Date.now();
    const h = (n: number) => new Date(now + n * 3_600_000);

    // Business category → box category mapping
    const CAT_MAP: Record<string, string> = {
      BAKERY: "BAKERY", CAFE: "CAFE", RESTAURANT: "PREPARED_MEAL",
      GROCERY: "GROCERY", GREENGROCER: "PRODUCE", PATISSERIE: "MIXED",
      DELI: "DELI", MARKET: "GROCERY", FLORIST: "MIXED", OTHER: "MIXED",
    };

    // Default prices per box category
    const PRICES: Record<string, [number, number]> = {
      BAKERY: [100, 42], CAFE: [80, 34], PREPARED_MEAL: [120, 50],
      GROCERY: [95, 40], PRODUCE: [70, 29], MIXED: [90, 38], DELI: [110, 45],
    };

    for (const biz of businesses) {
      const boxCat = CAT_MAP[biz.category] ?? "MIXED";
      const [orig, disc] = PRICES[boxCat] ?? [90, 38];

      await prisma.surpriseBox.createMany({
        data: [
          { businessId: biz.id, category: boxCat as never, originalPrice: orig, discountedPrice: disc, stockQuantity: 5, pickupTimeStart: h(2), pickupTimeEnd: h(4),   isActive: true },
          { businessId: biz.id, category: boxCat as never, originalPrice: orig - 20, discountedPrice: disc - 8, stockQuantity: 4, pickupTimeStart: h(20), pickupTimeEnd: h(22), isActive: true },
        ],
      });
    }

    revalidatePath("/admin/businesses");
    revalidatePath("/consumer");
    return { success: true, data: { businesses: businesses.length, boxes: businesses.length * 2 } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Bir hata oluştu" };
  }
}
