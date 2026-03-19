export const dynamic = "force-dynamic";

import ConsumerNav from "@/components/consumer/ConsumerNav";
import LocationHeader from "@/components/consumer/LocationHeader";
import SignOutButton from "@/components/shared/SignOutButton";
import PickupReminderBanner from "@/components/consumer/PickupReminderBanner";
import { LocationProvider } from "@/contexts/LocationContext";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ConsumerLayout({ children }: { children: React.ReactNode }) {
  // Fetch PENDING orders with pickup ending within 30 minutes
  const session = await auth();
  let urgentOrders: { id: string; pickupEnd: string; businessName: string; pickupCode: string }[] = [];

  if (session?.user?.id) {
    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * 60_000);
    const pending = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
        box: { pickupTimeEnd: { gte: now, lte: in30 } },
      },
      include: { box: { include: { business: { select: { name: true } } } } },
    });
    urgentOrders = pending.map((o) => ({
      id: o.id,
      pickupEnd: o.box.pickupTimeEnd.toISOString(),
      businessName: o.box.business.name,
      pickupCode: o.pickupCode,
    }));
  }

  return (
    <LocationProvider>
      <div className="flex min-h-screen flex-col bg-stone-50">
        {/* Location header */}
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-stone-100 bg-white px-4 py-3 shadow-sm">
          <span className="text-base font-extrabold text-emerald-600">🌍 FoodRescue</span>
          <LocationHeader />
          <SignOutButton className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 ring-1 ring-stone-200 hover:bg-stone-50 hover:text-stone-700 transition-colors" />
        </header>

        {/* Pickup reminder — appears when a PENDING order is expiring soon */}
        <PickupReminderBanner urgentOrders={urgentOrders} />

        {/* Page content — padded above bottom nav */}
        <main className="flex-1 pb-20">{children}</main>

        {/* Bottom nav */}
        <ConsumerNav />
      </div>
    </LocationProvider>
  );
}
