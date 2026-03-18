import BoxDetailCheckout from "@/components/consumer/BoxDetailCheckout";
import { prisma } from "@/lib/prisma";

export default async function BoxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raw = await prisma.surpriseBox.findUnique({
    where: { id },
    include: { business: true },
  });

  const box = raw
    ? {
        id: raw.id,
        businessId: raw.businessId,
        category: raw.category,
        description: raw.description ?? undefined,
        originalPrice: raw.originalPrice,
        discountedPrice: raw.discountedPrice,
        stockQuantity: raw.stockQuantity,
        pickupTimeStart: raw.pickupTimeStart.toISOString(),
        pickupTimeEnd: raw.pickupTimeEnd.toISOString(),
        isActive: raw.isActive,
        business: raw.business
          ? {
              id: raw.business.id,
              name: raw.business.name,
              category: raw.business.category,
              description: raw.business.description ?? undefined,
              address: raw.business.address,
              locationLat: raw.business.locationLat,
              locationLng: raw.business.locationLng,
              operatingHours: raw.business.operatingHours,
              imageUrl: raw.business.imageUrl ?? undefined,
              phone: raw.business.phone ?? undefined,
              isActive: raw.business.isActive,
            }
          : undefined,
      }
    : null;

  return <BoxDetailCheckout box={box} />;
}
