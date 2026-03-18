import { prisma } from "@/lib/prisma";

/**
 * Deactivates SurpriseBoxes whose pickup window has expired and cancels any
 * PENDING orders that are still open on those boxes.
 *
 * This is called on every consumer page load as an MVP substitute for a cron
 * job. In production this should run as a scheduled task (e.g. Vercel Cron).
 *
 * Cancelled orders here are NOT automatically refunded — they are logged for
 * manual review because they represent an exceptional state (payment taken but
 * window passed without pickup or merchant action).
 */
export async function deactivateExpiredBoxes(): Promise<void> {
  const now = new Date();

  // Find active boxes whose pickup window has closed
  const expiredBoxes = await prisma.surpriseBox.findMany({
    where: {
      isActive: true,
      pickupTimeEnd: { lt: now },
    },
    select: { id: true },
  });

  if (expiredBoxes.length === 0) return;

  const expiredIds = expiredBoxes.map((b) => b.id);

  // Find any still-open orders on expired boxes
  const pendingOrders = await prisma.order.findMany({
    where: {
      boxId: { in: expiredIds },
      status: "PENDING",
    },
    select: { id: true, pickupCode: true, paymentId: true, totalPrice: true, boxId: true },
  });

  if (pendingOrders.length > 0) {
    // Log for manual review — these may need a manual refund if paymentId is set
    console.warn(
      `[cleanup] Cancelling ${pendingOrders.length} PENDING order(s) on expired boxes. ` +
        `Manual refund review required for orders with paymentId:`,
      pendingOrders
        .filter((o) => o.paymentId)
        .map((o) => ({ id: o.id, pickupCode: o.pickupCode, paymentId: o.paymentId, totalPrice: o.totalPrice }))
    );

    await prisma.order.updateMany({
      where: {
        id: { in: pendingOrders.map((o) => o.id) },
        status: "PENDING",
      },
      data: { status: "CANCELLED" },
    });
  }

  // Deactivate all expired boxes in one query
  await prisma.surpriseBox.updateMany({
    where: { id: { in: expiredIds } },
    data: { isActive: false },
  });

  console.log(`[cleanup] Deactivated ${expiredIds.length} expired box(es).`);
}
