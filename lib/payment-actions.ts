"use server";

import iyzico from "@/lib/iyzico";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendOrderCancellation, sendMerchantOrderCancelled } from "@/lib/email";

// ─── initiatePayment ─────────────────────────────────────────────────────────
// Initializes an iyzico checkout form. Returns the HTML snippet to embed.
// basketId encodes boxId + quantity for retrieval in the callback.

export async function initiatePayment(
  boxId: string,
  quantity: number
): Promise<
  | { success: true; data: { checkoutFormContent: string; token: string } }
  | { success: false; error: string }
> {
  if (!iyzico) {
    return { success: false, error: "IYZICO_NOT_CONFIGURED" };
  }

  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "Oturum açmanız gerekiyor" };
  }

  const box = await prisma.surpriseBox.findUnique({
    where: { id: boxId },
    include: { business: true },
  });

  if (!box || !box.isActive || box.stockQuantity < quantity) {
    return { success: false, error: "Bu kutu artık mevcut değil" };
  }

  if (new Date(box.pickupTimeEnd) < new Date()) {
    return { success: false, error: "Teslim alma süresi dolmuş" };
  }

  // Look up by email — more stable than ID across re-seeds and account changes.
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return { success: false, error: "Kullanıcı bulunamadı" };
  }

  const totalPrice = box.discountedPrice * quantity;
  // conversationId: unique per transaction attempt — prevents double charges
  const conversationId = crypto.randomUUID();

  // Encode boxId, quantity, userId in basketId.
  // cuid IDs are purely alphanumeric (no hyphens) so split("-") is deterministic.
  // Format: box-{boxId}-{quantity}-{userId}-{timestamp}
  const basketId = `box-${boxId}-${quantity}-${user.id}-${Date.now()}`;

  const nameParts = user.name.split(" ");
  const firstName = nameParts[0] || "Ad";
  const lastName = nameParts.slice(1).join(" ") || "Soyad";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const request = {
    locale: "tr",
    conversationId,
    price: totalPrice.toFixed(2),
    paidPrice: totalPrice.toFixed(2),
    currency: "TRY",
    basketId,
    paymentGroup: "PRODUCT",
    // Do not force 3D Secure — avoids mdStatus:0 failures in sandbox.
    // Use sandbox test cards (e.g. 5528790000000008) which succeed without 3DS.
    force3ds: 0,
    callbackUrl: `${appUrl}/api/payment/callback`,
    buyer: {
      id: user.id,
      name: firstName,
      surname: lastName,
      email: user.email,
      identityNumber: "11111111111", // TC kimlik — placeholder for sandbox
      registrationAddress: "Istanbul, Turkey",
      ip: "85.34.78.112", // placeholder — use real IP in production
      city: "Istanbul",
      country: "Turkey",
    },
    billingAddress: {
      contactName: user.name,
      city: "Istanbul",
      country: "Turkey",
      address: "Istanbul, Turkey",
    },
    // Pickup-only model — shipping address is the business pickup location.
    shippingAddress: {
      contactName: user.name,
      city: "Istanbul",
      country: "Turkey",
      address: box.business?.address ?? "Istanbul, Turkey",
    },
    basketItems: [
      {
        id: box.id,
        name: `${box.business?.name ?? "İşletme"} - Sürpriz Kutu`,
        category1: "Yiyecek",
        itemType: "PHYSICAL",
        price: totalPrice.toFixed(2),
      },
    ],
  };

  const client = iyzico; // non-null: checked at top of function
  return new Promise((resolve) => {
    client.checkoutFormInitialize.create(
      request,
      (err: unknown, result: { status: string; checkoutFormContent?: string; token?: string }) => {
        if (err || result.status !== "success") {
          console.error("iyzico init error:", err ?? result);
          resolve({
            success: false,
            error: "Ödeme başlatılamadı. Lütfen tekrar deneyin.",
          });
          return;
        }

        resolve({
          success: true,
          data: {
            checkoutFormContent: result.checkoutFormContent!,
            token: result.token!,
          },
        });
      }
    );
  });
}

// ─── refundPayment ────────────────────────────────────────────────────────────
// Calls iyzico refund API then cancels the order and restores stock.

// Cancel the order and restore stock without issuing an iyzico refund.
// Used when iyzico is unavailable or its API call fails — the order is still
// cancelled locally so the consumer is not left in limbo, and the refund is
// flagged for manual review via console.warn.
async function cancelOrderLocally(
  order: Awaited<ReturnType<typeof prisma.order.findUnique>> & {
    box: { id: string; stockQuantity: number };
  },
  paymentStatus: string
) {
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order!.id },
      data: { status: "CANCELLED", paymentStatus },
    });
    const newStock = order!.box.stockQuantity + order!.quantity;
    await tx.surpriseBox.update({
      where: { id: order!.boxId },
      data: { stockQuantity: newStock, isActive: true },
    });
  });
}

export async function refundPayment(
  orderId: string,
  userId: string
): Promise<{ success: true; data: { message: string } } | { success: false; error: string }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { box: { include: { business: true } }, user: { select: { email: true, name: true } } },
  });

  if (!order || order.userId !== userId) {
    return { success: false, error: "Sipariş bulunamadı" };
  }

  if (order.status !== "PENDING") {
    return { success: false, error: "Bu sipariş iptal edilemez" };
  }

  if (!order.paymentId) {
    return { success: false, error: "Ödeme bilgisi bulunamadı" };
  }

  // iyzico not configured (dev / missing keys) — cancel locally, no refund call.
  if (!iyzico) {
    console.warn(
      `[refundPayment] iyzico not configured. Cancelling order ${orderId} locally.` +
        ` Manual refund review needed for paymentId: ${order.paymentId}`
    );
    await cancelOrderLocally(order, "REFUND_PENDING");
    return { success: true, data: { message: "Siparişiniz iptal edildi." } };
  }

  const refundClient = iyzico;

  const refundRequest = {
    locale: "tr",
    conversationId: crypto.randomUUID(),
    paymentTransactionId: order.paymentId,
    price: order.totalPrice.toFixed(2),
    currency: "TRY",
    ip: "85.34.78.112", // placeholder — use real IP in production
  };

  return new Promise((resolve) => {
    refundClient.refund.create(
      refundRequest,
      async (err: unknown, result: { status: string; paymentId?: string }) => {
        if (err || result.status !== "success") {
          // iyzico refund API failed — cancel locally and flag for manual review.
          console.error("[refundPayment] iyzico refund API error:", err ?? result);
          console.warn(
            `[refundPayment] Manual refund required for order ${orderId},` +
              ` paymentId: ${order.paymentId}, amount: ${order.totalPrice}`
          );
          try {
            await cancelOrderLocally(order, "REFUND_PENDING");
            resolve({
              success: true,
              data: { message: "Siparişiniz iptal edildi. İade manuel olarak işlenecektir." },
            });
          } catch (e) {
            console.error("[refundPayment] cancelOrderLocally failed:", e);
            resolve({ success: false, error: "İptal işlemi sırasında hata oluştu." });
          }
          return;
        }

        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "CANCELLED",
              paymentStatus: "REFUNDED",
              refundId: result.paymentId,
            },
          });

          const newStock = order.box.stockQuantity + order.quantity;
          await tx.surpriseBox.update({
            where: { id: order.boxId },
            data: { stockQuantity: newStock, isActive: true },
          });
        });

        // Fire-and-forget emails after successful refund
        void (async () => {
          try {
            const business = order.box?.business;
            const customerEmail = order.user?.email;
            const customerName = order.user?.name ?? "Müşteri";

            if (customerEmail) {
              await sendOrderCancellation({
                to: customerEmail,
                customerName,
                businessName: business?.name ?? "İşletme",
                pickupCode: order.pickupCode,
                totalPrice: order.totalPrice,
                refunded: true,
              });
            }

            if (business?.ownerId) {
              const merchant = await prisma.user.findUnique({ where: { id: business.ownerId } });
              if (merchant?.email) {
                await sendMerchantOrderCancelled({
                  to: merchant.email,
                  businessName: business.name,
                  boxCategory: order.box!.category,
                  quantity: order.quantity,
                  pickupCode: order.pickupCode,
                });
              }
            }
          } catch (e) {
            console.error("[email] refundPayment notification failed:", e);
          }
        })();

        resolve({
          success: true,
          data: { message: "Siparişiniz iptal edildi ve ödemeniz iade edilecektir." },
        });
      }
    );
  });
}

