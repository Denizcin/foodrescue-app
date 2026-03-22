import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { after } from "next/server";
import DiscoveryFeed from "@/components/consumer/DiscoveryFeed";
import { prisma } from "@/lib/prisma";
import { deactivateExpiredBoxes } from "@/lib/cleanup";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Kutuları Keşfet",
  description:
    "Yakınındaki işletmelerin bugünkü sürpriz kutularını keşfet. İndirimli fiyatlarla sipariş ver, gel-al.",
};

/**
 * Public box listing — cached for 60 seconds.
 * Only fetches fields actually used by DiscoveryFeed.
 */
const getCachedBoxes = unstable_cache(
  async () => {
    const rawBoxes = await prisma.surpriseBox.findMany({
      where: {
        pickupTimeEnd: { gt: new Date() },
        business: { isApproved: true, isActive: true },
        OR: [
          { isActive: true },
          { stockQuantity: 0 }, // sold-out within window — shown with "Tükendi" overlay
        ],
      },
      select: {
        id: true,
        businessId: true,
        category: true,
        description: true,
        originalPrice: true,
        discountedPrice: true,
        stockQuantity: true,
        pickupTimeStart: true,
        pickupTimeEnd: true,
        isActive: true,
        business: {
          select: {
            id: true,
            name: true,
            category: true,
            description: true,
            address: true,
            locationLat: true,
            locationLng: true,
            operatingHours: true,
            imageUrl: true,
            phone: true,
            isActive: true,
          },
        },
      },
      orderBy: { pickupTimeStart: "asc" },
    });

    return rawBoxes.map((b) => ({
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
  },
  ["consumer-boxes"],
  { revalidate: 60, tags: ["boxes"] },
);

export default async function ConsumerPage() {
  // Cleanup fires AFTER the response is sent — no blocking
  after(() => deactivateExpiredBoxes());

  const [session, boxes] = await Promise.all([auth(), getCachedBoxes()]);
  const userId = session?.user?.id;

  // Favorites are user-specific — not cached
  const favoriteBusinessIds = userId
    ? (
        await prisma.favorite.findMany({
          where: { userId },
          select: { businessId: true },
        })
      ).map((f) => f.businessId)
    : [];

  return (
    <DiscoveryFeed
      boxes={boxes}
      favoriteBusinessIds={favoriteBusinessIds}
      isLoggedIn={!!userId}
    />
  );
}
