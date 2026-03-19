"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createBoxSchema,
  createOrderSchema,
  verifyPickupSchema,
  createNominationSchema,
} from "@/lib/validations";
import { ERROR_MESSAGES } from "@/lib/errors";
import type { ActionResult } from "@/lib/types";
import { refundPayment } from "@/lib/payment-actions";
import { calcCommission } from "@/lib/utils";
import {
  sendOrderConfirmation,
  sendOrderCancellation,
  sendMerchantNewOrder,
  sendMerchantOrderCancelled,
} from "@/lib/email";

function generatePickupCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── publishBox ──────────────────────────────────────────────────────────────

export async function publishBox(input: unknown): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }
    if (session.user.role !== "MERCHANT" && session.user.role !== "ADMIN") {
      return { success: false, error: ERROR_MESSAGES.FORBIDDEN };
    }

    const validated = createBoxSchema.parse(input);

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id, isActive: true },
    });

    if (!business) {
      return { success: false, error: "Aktif bir işletmeniz bulunamadı" };
    }

    const box = await prisma.surpriseBox.create({
      data: {
        businessId: business.id,
        category: validated.category,
        description: validated.description,
        originalPrice: validated.originalPrice,
        discountedPrice: validated.discountedPrice,
        stockQuantity: validated.stockQuantity,
        pickupTimeStart: new Date(validated.pickupTimeStart),
        pickupTimeEnd: new Date(validated.pickupTimeEnd),
      },
    });

    return { success: true, data: box };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("publishBox failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}

// ─── createOrder ─────────────────────────────────────────────────────────────

export async function createOrder(input: unknown): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }

    const { boxId, quantity } = createOrderSchema.parse(input);

    const order = await prisma.$transaction(async (tx) => {
      // Look up by email — stable across sessions and re-seeds.
      const dbUser = await tx.user.findUnique({ where: { email: session.user!.email! } });
      if (!dbUser) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

      const box = await tx.surpriseBox.findUnique({ where: { id: boxId } });

      if (!box || !box.isActive) {
        throw new Error(ERROR_MESSAGES.BOX_NOT_FOUND);
      }
      if (box.stockQuantity < quantity) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_STOCK);
      }
      if (new Date(box.pickupTimeEnd) < new Date()) {
        throw new Error(ERROR_MESSAGES.BOX_EXPIRED);
      }

      const newStock = box.stockQuantity - quantity;
      await tx.surpriseBox.update({
        where: { id: boxId },
        data: {
          stockQuantity: newStock,
          isActive: newStock > 0,
        },
      });

      // Generate unique pickup code
      let pickupCode = generatePickupCode();
      let collision = await tx.order.findUnique({ where: { pickupCode } });
      while (collision) {
        pickupCode = generatePickupCode();
        collision = await tx.order.findUnique({ where: { pickupCode } });
      }

      const totalPrice = box.discountedPrice * quantity;
      const { commissionRate, commissionAmount, merchantAmount } = calcCommission(totalPrice);

      return tx.order.create({
        data: {
          userId: dbUser.id,
          boxId,
          quantity,
          totalPrice,
          pickupCode,
          status: "PENDING",
          commissionRate,
          commissionAmount,
          merchantAmount,
        },
        include: { box: { include: { business: true } } },
      });
    });

    // Fire-and-forget emails — must never block or throw to the caller
    void (async () => {
      try {
        const business = order.box?.business;
        if (!business) return;

        const customerEmail = session.user!.email!;
        const customerName = session.user!.name ?? "Müşteri";

        // Consumer confirmation
        await sendOrderConfirmation({
          to: customerEmail,
          customerName,
          pickupCode: order.pickupCode,
          businessName: business.name,
          businessAddress: business.address,
          pickupStart: order.box!.pickupTimeStart.toString(),
          pickupEnd: order.box!.pickupTimeEnd.toString(),
          quantity: order.quantity,
          totalPrice: order.totalPrice,
        });

        // Merchant notification — look up the business owner's email
        const merchant = await prisma.user.findUnique({ where: { id: business.ownerId } });
        if (merchant?.email) {
          await sendMerchantNewOrder({
            to: merchant.email,
            businessName: business.name,
            customerName,
            quantity: order.quantity,
            boxCategory: order.box!.category,
            pickupCode: order.pickupCode,
            pickupStart: order.box!.pickupTimeStart.toString(),
            pickupEnd: order.box!.pickupTimeEnd.toString(),
            merchantAmount: order.merchantAmount ?? order.totalPrice,
          });
        }
      } catch (e) {
        console.error("[email] createOrder notification failed:", e);
      }
    })();

    return { success: true, data: order };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    console.error("createOrder failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}

// ─── cancelOrder ─────────────────────────────────────────────────────────────

export async function cancelOrder(orderId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { box: { include: { business: true } } },
    });

    if (!order || order.userId !== session.user.id) {
      return { success: false, error: ERROR_MESSAGES.ORDER_NOT_FOUND };
    }
    if (order.status === "PICKED_UP") {
      return { success: false, error: ERROR_MESSAGES.ORDER_ALREADY_COMPLETED };
    }
    if (order.status === "CANCELLED") {
      return { success: false, error: ERROR_MESSAGES.ORDER_ALREADY_CANCELLED };
    }

    // If payment was taken via iyzico, issue a refund (which also updates DB + stock).
    if (order.paymentId) {
      return refundPayment(orderId, session.user.id);
    }

    // No payment recorded — directly cancel and restore stock.
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      const newStock = order.box.stockQuantity + order.quantity;
      await tx.surpriseBox.update({
        where: { id: order.boxId },
        data: {
          stockQuantity: newStock,
          isActive: true,
        },
      });
    });

    // Fire-and-forget emails
    void (async () => {
      try {
        const business = order.box?.business;
        const customerEmail = session.user!.email;
        const customerName = session.user!.name ?? "Müşteri";

        if (customerEmail) {
          await sendOrderCancellation({
            to: customerEmail,
            customerName,
            businessName: business?.name ?? "İşletme",
            pickupCode: order.pickupCode,
            totalPrice: order.totalPrice,
            refunded: false,
          });
        }

        if (business?.ownerId) {
          const merchant = await prisma.user.findUnique({ where: { id: business.ownerId } });
          if (merchant?.email) {
            await sendMerchantOrderCancelled({
              to: merchant.email,
              businessName: business.name,
              boxCategory: order.box.category,
              quantity: order.quantity,
              pickupCode: order.pickupCode,
            });
          }
        }
      } catch (e) {
        console.error("[email] cancelOrder notification failed:", e);
      }
    })();

    return { success: true, data: { orderId } };
  } catch (error) {
    console.error("cancelOrder failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}

// ─── verifyPickupCode ─────────────────────────────────────────────────────────

export async function verifyPickupCode(input: unknown): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }

    const { pickupCode } = verifyPickupSchema.parse(input);

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id, isActive: true },
    });

    if (!business) {
      return { success: false, error: "Aktif bir işletmeniz bulunamadı" };
    }

    const order = await prisma.order.findFirst({
      where: {
        pickupCode: pickupCode.toUpperCase(),
        status: "PENDING",
        box: { businessId: business.id },
      },
      include: {
        box: { include: { business: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      return { success: false, error: ERROR_MESSAGES.INVALID_PICKUP_CODE };
    }

    return { success: true, data: order };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("verifyPickupCode failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}

// ─── completeOrder ───────────────────────────────────────────────────────────

export async function completeOrder(orderId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { box: true },
    });

    if (!order) {
      return { success: false, error: ERROR_MESSAGES.ORDER_NOT_FOUND };
    }
    if (order.status !== "PENDING") {
      return { success: false, error: ERROR_MESSAGES.ORDER_ALREADY_COMPLETED };
    }

    const CO2_SAVED_PER_BOX = 2.5;
    const FOOD_SAVED_PER_BOX = 1.0;
    const moneySaved =
      (order.box.originalPrice - order.box.discountedPrice) * order.quantity;

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PICKED_UP" },
      });

      await tx.user.update({
        where: { id: order.userId },
        data: {
          impactSavedMoney: { increment: moneySaved },
          impactCo2: { increment: CO2_SAVED_PER_BOX * order.quantity },
          impactFood: { increment: FOOD_SAVED_PER_BOX * order.quantity },
        },
      });
    });

    return { success: true, data: { orderId } };
  } catch (error) {
    console.error("completeOrder failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}

// ─── nominateBusiness ────────────────────────────────────────────────────────

export async function nominateBusiness(input: unknown): Promise<ActionResult> {
  try {
    const session = await auth();
    const validated = createNominationSchema.parse(input);

    const nomination = await prisma.businessNomination.create({
      data: {
        userId: session?.user?.id ?? null,
        nominatorName: validated.nominatorName,
        nominatorPhone: validated.nominatorPhone,
        nominatorEmail: validated.nominatorEmail || null,
        nominatedBusinessName: validated.nominatedBusinessName,
        nominatedAddress: validated.nominatedAddress,
        reason: validated.reason,
      },
    });

    return { success: true, data: nomination };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("nominateBusiness failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}

// ─── toggleFavorite ───────────────────────────────────────────────────────────

export async function toggleFavorite(businessId: string): Promise<ActionResult<{ favorited: boolean }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }

    const userId = session.user.id;
    const existing = await prisma.favorite.findUnique({
      where: { userId_businessId: { userId, businessId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { success: true, data: { favorited: false } };
    } else {
      await prisma.favorite.create({ data: { userId, businessId } });
      return { success: true, data: { favorited: true } };
    }
  } catch (error) {
    console.error("toggleFavorite failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}

// ─── updateNotificationPreferences ───────────────────────────────────────────

export async function updateNotificationPreferences(prefs: {
  orderEmails: boolean;
  newBoxAlerts: boolean;
  promotionalEmails: boolean;
}): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { notificationPreferences: prefs },
    });

    return { success: true, data: null };
  } catch (error) {
    console.error("updateNotificationPreferences failed:", error);
    return { success: false, error: ERROR_MESSAGES.GENERIC_ERROR };
  }
}
