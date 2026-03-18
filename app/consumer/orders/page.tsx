import WalletActiveOrder from "@/components/consumer/WalletActiveOrder";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const userId = session.user.id;

  const [rawOrders, dbUser] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { box: { include: { business: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { impactSavedMoney: true, impactCo2: true, impactFood: true },
    }),
  ]);

  const orders = rawOrders.map((o) => ({
    id: o.id,
    userId: o.userId,
    boxId: o.boxId,
    status: o.status,
    pickupCode: o.pickupCode,
    quantity: o.quantity,
    totalPrice: o.totalPrice,
    createdAt: o.createdAt.toISOString(),
    box: o.box
      ? {
          id: o.box.id,
          businessId: o.box.businessId,
          category: o.box.category,
          description: o.box.description ?? undefined,
          originalPrice: o.box.originalPrice,
          discountedPrice: o.box.discountedPrice,
          stockQuantity: o.box.stockQuantity,
          pickupTimeStart: o.box.pickupTimeStart.toISOString(),
          pickupTimeEnd: o.box.pickupTimeEnd.toISOString(),
          isActive: o.box.isActive,
          business: o.box.business
            ? {
                id: o.box.business.id,
                name: o.box.business.name,
                category: o.box.business.category,
                address: o.box.business.address,
                locationLat: o.box.business.locationLat,
                locationLng: o.box.business.locationLng,
                operatingHours: o.box.business.operatingHours,
                isActive: o.box.business.isActive,
              }
            : undefined,
        }
      : undefined,
  }));

  const user = dbUser ?? { impactSavedMoney: 0, impactCo2: 0, impactFood: 0 };

  return <WalletActiveOrder orders={orders} user={user} />;
}
