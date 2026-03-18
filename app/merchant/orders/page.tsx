import OrderHandover from "@/components/merchant/OrderHandover";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MerchantOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id, isActive: true },
  });

  if (!business) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <p className="text-stone-500">Henüz aktif işletmeniz yok.</p>
      </div>
    );
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const rawOrders = await prisma.order.findMany({
    where: {
      box: { businessId: business.id },
      createdAt: { gte: todayStart },
    },
    include: {
      box: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const orders = rawOrders.map((o) => ({
    id: o.id,
    userId: o.userId,
    boxId: o.boxId,
    status: o.status,
    pickupCode: o.pickupCode,
    quantity: o.quantity,
    totalPrice: o.totalPrice,
    createdAt: o.createdAt.toISOString(),
    user: o.user ? { name: o.user.name } : null,
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
        }
      : undefined,
  }));

  return <OrderHandover initialOrders={orders} />;
}
