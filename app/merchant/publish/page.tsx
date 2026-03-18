import QuickListBox from "@/components/merchant/QuickListBox";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PublishPage() {
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

  const rawBoxes = await prisma.surpriseBox.findMany({
    where: {
      businessId: business.id,
      createdAt: { gte: todayStart },
    },
    orderBy: { createdAt: "desc" },
  });

  const publishedBoxes = rawBoxes.map((b) => ({
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
  }));

  return <QuickListBox publishedBoxes={publishedBoxes} />;
}
