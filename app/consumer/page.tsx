import type { Metadata } from "next";
import DiscoveryFeed from "@/components/consumer/DiscoveryFeed";
import { prisma } from "@/lib/prisma";
import { deactivateExpiredBoxes } from "@/lib/cleanup";

export const metadata: Metadata = {
  title: "Kutuları Keşfet",
  description:
    "Yakınındaki işletmelerin bugünkü sürpriz kutularını keşfet. İndirimli fiyatlarla sipariş ver, gel-al.",
};

export default async function ConsumerPage() {
  // Run cleanup on every page load (MVP substitute for a cron job)
  await deactivateExpiredBoxes();

  const rawBoxes = await prisma.surpriseBox.findMany({
    where: {
      pickupTimeEnd: { gt: new Date() },
      business: { isApproved: true },   // only show boxes from approved businesses
      OR: [
        { isActive: true },
        { stockQuantity: 0 }, // sold out within window — shown with "Tükendi" overlay
      ],
    },
    include: { business: true },
    orderBy: { pickupTimeStart: "asc" },
  });

  const boxes = rawBoxes.map((b) => ({
    id: b.id,
    businessId: b.businessId,
    category: b.category,
    description: b.description ?? undefined,
    originalPrice: b.originalPrice,
    discountedPrice: b.discountedPrice,
    stockQuantity: b.stockQuantity,
    pickupTimeStart: b.pickupTimeStart.toISOString(),
    pickupTimeEnd: b.pickupTimeEnd.toISOString(),
    isActive: b.isActive,
    business: b.business
      ? {
          id: b.business.id,
          name: b.business.name,
          category: b.business.category,
          description: b.business.description ?? undefined,
          address: b.business.address,
          locationLat: b.business.locationLat,
          locationLng: b.business.locationLng,
          operatingHours: b.business.operatingHours,
          imageUrl: b.business.imageUrl ?? undefined,
          phone: b.business.phone ?? undefined,
          isActive: b.business.isActive,
        }
      : undefined,
  }));

  return <DiscoveryFeed boxes={boxes} />;
}
