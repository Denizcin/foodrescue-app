import { NextRequest, NextResponse } from "next/server";
import iyzico from "@/lib/iyzico";
import { prisma } from "@/lib/prisma";
import { generatePickupCode, calcCommission } from "@/lib/utils";
import { sendOrderConfirmation, sendMerchantNewOrder } from "@/lib/email";

// iyzico sends the callback as a POST with form-encoded body
export async function POST(request: NextRequest) {
  const body = await request.formData();
  const token = body.get("token") as string | null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(new URL("/consumer?payment=error", appUrl));
  }

  if (!iyzico) {
    return NextResponse.redirect(new URL("/consumer?payment=error", appUrl));
  }
  const client = iyzico;

  return new Promise<NextResponse>((resolve) => {
    client.checkoutForm.retrieve(
      { token },
      async (
        err: unknown,
        result: {
          status: string;
          paymentStatus?: string;
          paymentId?: string;
          paidPrice?: string;
          basketId?: string;
          buyer?: { email?: string };
          itemTransactions?: Array<{ paymentTransactionId?: string }>;
        }
      ) => {
        // Verify both the API call and the payment itself succeeded
        if (err || result.status !== "success" || result.paymentStatus !== "SUCCESS") {
          console.error("iyzico callback — payment not successful:", err ?? result);
          resolve(
            NextResponse.redirect(new URL("/consumer?payment=failed", appUrl))
          );
          return;
        }

        try {
          const paymentId = result.paymentId!;
          const totalPrice = parseFloat(result.paidPrice ?? "0");
          const { commissionRate, commissionAmount, merchantAmount } =
            calcCommission(totalPrice);

          // Parse basketId: "box-{boxId}-{quantity}-{userId}-{timestamp}"
          // cuid IDs are purely alphanumeric (no hyphens), so the split is deterministic.
          const parts = (result.basketId ?? "").split("-");
          // parts[0]="box", parts[1]=boxId, parts[2]=quantity, parts[3]=userId, parts[4]=timestamp
          const boxId = parts[1] ?? "";
          const quantity = parseInt(parts[2] ?? "1", 10);
          const userIdFromBasket = parts[3] ?? "";

          if (!boxId) {
            throw new Error(`Invalid basketId: ${result.basketId}`);
          }

          const buyerEmail = result.buyer?.email ?? "";

          const { order, txBox, txUser } = await prisma.$transaction(async (tx) => {
            // Prefer userId encoded in basketId; fall back to buyer email from iyzico response.
            const userQuery = userIdFromBasket
              ? tx.user.findUnique({ where: { id: userIdFromBasket } })
              : tx.user.findUnique({ where: { email: buyerEmail } });

            const [box, user] = await Promise.all([
              tx.surpriseBox.findUnique({ where: { id: boxId }, include: { business: true } }),
              userQuery,
            ]);

            if (!box) throw new Error(`Box not found: ${boxId}`);
            if (!user) throw new Error(`User not found — basketUserId: ${userIdFromBasket}, email: ${buyerEmail}`);
            if (box.stockQuantity < quantity) throw new Error("Stock unavailable");

            const newStock = box.stockQuantity - quantity;
            await tx.surpriseBox.update({
              where: { id: boxId },
              data: { stockQuantity: newStock, isActive: newStock > 0 },
            });

            // Generate a unique pickup code
            let pickupCode = generatePickupCode();
            let collision = await tx.order.findUnique({ where: { pickupCode } });
            while (collision) {
              pickupCode = generatePickupCode();
              collision = await tx.order.findUnique({ where: { pickupCode } });
            }

            const createdOrder = await tx.order.create({
              data: {
                userId: user.id,
                boxId,
                quantity,
                totalPrice,
                pickupCode,
                status: "PENDING",
                paymentId,
                paymentStatus: "SUCCESS",
                commissionRate,
                commissionAmount,
                merchantAmount,
              },
            });
            return { order: createdOrder, txBox: box, txUser: user };
          });

          // Fire-and-forget emails — failures must never block the payment redirect
          void (async () => {
            try {
              if (txUser.email) {
                await sendOrderConfirmation({
                  to: txUser.email,
                  customerName: txUser.name ?? "Müşteri",
                  pickupCode: order.pickupCode,
                  businessName: txBox.business?.name ?? "İşletme",
                  businessAddress: txBox.business?.address ?? "",
                  pickupStart: txBox.pickupTimeStart.toISOString(),
                  pickupEnd: txBox.pickupTimeEnd.toISOString(),
                  quantity: order.quantity,
                  totalPrice: order.totalPrice,
                });
              }
              if (txBox.business?.ownerId) {
                const merchant = await prisma.user.findUnique({ where: { id: txBox.business.ownerId } });
                if (merchant?.email) {
                  await sendMerchantNewOrder({
                    to: merchant.email,
                    businessName: txBox.business.name,
                    customerName: txUser.name ?? "Müşteri",
                    quantity: order.quantity,
                    boxCategory: txBox.category,
                    pickupCode: order.pickupCode,
                    pickupStart: txBox.pickupTimeStart.toISOString(),
                    pickupEnd: txBox.pickupTimeEnd.toISOString(),
                    merchantAmount,
                  });
                }
              }
            } catch (e) {
              console.error("[email] callback order notification failed:", e);
            }
          })();

          // Redirect to a public intermediate page — the iyzico POST callback arrives
          // without the session cookie (cross-site SameSite=Lax exclusion), so redirecting
          // directly to /consumer/orders would get blocked by the auth middleware.
          // /payment-success is public and client-side redirects once the session is restored.
          resolve(
            NextResponse.redirect(
              new URL(
                `/payment-success?code=${order.pickupCode}`,
                appUrl
              )
            )
          );
        } catch (error) {
          // CRITICAL: Payment was charged but order creation failed.
          // Log for manual review — do not silently swallow this.
          console.error(
            "CRITICAL — payment taken but order creation failed:",
            {
              paymentId: result.paymentId,
              basketId: result.basketId,
              error,
            }
          );
          resolve(
            NextResponse.redirect(new URL("/consumer?payment=error", appUrl))
          );
        }
      }
    );
  });
}
