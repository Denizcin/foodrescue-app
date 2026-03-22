import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import BoxDetailCheckout from "@/components/consumer/BoxDetailCheckout";
import { prisma } from "@/lib/prisma";

/** Cache box detail for 60 seconds — stock changes propagate within a minute. */
const getCachedBox = (id: string) =>
  unstable_cache(
    async () => {
      const raw = await prisma.surpriseBox.findUnique({
        where: { id },
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
      });

      if (!raw) return null;
      return {
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
      };
    },
    [`box-${id}`],
    { revalidate: 60, tags: ["boxes", `box-${id}`] },
  )();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const box = await getCachedBox(id);
  if (!box) return { title: "Kutu Bulunamadı" };
  const saving = (box.originalPrice - box.discountedPrice).toFixed(0);
  return {
    title: `${box.business?.name ?? "Sürpriz Kutu"} — ₺${box.discountedPrice} (₺${saving} tasarruf)`,
    description: `${box.business?.name ?? "İşletme"} sürpriz kutusunu ₺${box.discountedPrice}'ye al, ₺${saving} tasarruf et.`,
  };
}

export default async function BoxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const box = await getCachedBox(id);
  return <BoxDetailCheckout box={box} />;
}
