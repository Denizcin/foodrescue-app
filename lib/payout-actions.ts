"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ─── calculateMerchantPayout ──────────────────────────────────────────────────
// Computes payout totals for a business over a period and records a
// MerchantPayout row. For MVP, status is "PENDING" — admin processes manually.

export async function calculateMerchantPayout(
  businessId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<
  | { success: true; data: { id: string; netPayout: number } }
  | { success: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Oturum açmanız gerekiyor" };
  }

  // Verify the caller owns this business or is ADMIN.
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return { success: false, error: "İşletme bulunamadı" };
  }
  if (
    business.ownerId !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    return { success: false, error: "Bu işlemi yapmaya yetkiniz yok" };
  }

  const completedOrders = await prisma.order.findMany({
    where: {
      box: { businessId },
      status: "PICKED_UP",
      paymentStatus: "SUCCESS",
      createdAt: { gte: periodStart, lte: periodEnd },
    },
  });

  const totalSales = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalCommission = completedOrders.reduce(
    (sum, o) => sum + (o.commissionAmount ?? 0),
    0
  );
  const netPayout = Math.round((totalSales - totalCommission) * 100) / 100;

  const payout = await prisma.merchantPayout.create({
    data: {
      businessId,
      periodStart,
      periodEnd,
      totalSales: Math.round(totalSales * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
      netPayout,
      status: "PENDING",
    },
  });

  return { success: true, data: { id: payout.id, netPayout } };
}
