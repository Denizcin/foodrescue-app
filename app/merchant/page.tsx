import type { Metadata } from "next";
import MerchantDashboard from "@/components/merchant/MerchantDashboard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { deactivateExpiredBoxes } from "@/lib/cleanup";

export const metadata: Metadata = {
  title: "İşletme Paneli",
  robots: { index: false, follow: false },
};

export default async function MerchantPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  // Deactivate expired boxes on each dashboard load — keeps merchant's own view in sync
  await deactivateExpiredBoxes();

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id, isActive: true },
    include: {
      surpriseBoxes: {
        include: {
          orders: true,
        },
      },
    },
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

  const allOrders = business.surpriseBoxes.flatMap((b) => b.orders);
  const activeBoxes = business.surpriseBoxes.filter(
    (b) => b.isActive && b.stockQuantity > 0
  ).length;
  const pendingOrders = allOrders.filter((o) => o.status === "PENDING").length;
  const pickedUpToday = allOrders.filter(
    (o) => o.status === "PICKED_UP" && o.updatedAt >= todayStart
  ).length;
  const foodRescuedKg = pickedUpToday * 1.0;

  // Build weekly chart data (last 7 days)
  const DAY_LABELS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);
    const dayOrders = allOrders.filter(
      (o) => o.status === "PICKED_UP" && o.updatedAt >= d && o.updatedAt < nextD
    );
    return {
      label: DAY_LABELS[d.getDay()],
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + (o.merchantAmount ?? o.totalPrice * 0.85), 0),
    };
  });

  return (
    <MerchantDashboard
      businessName={business.name}
      isApproved={business.isApproved}
      activeBoxes={activeBoxes}
      pendingOrders={pendingOrders}
      pickedUpToday={pickedUpToday}
      foodRescuedKg={foodRescuedKg}
      weeklyData={weeklyData}
    />
  );
}
