import type { Metadata } from "next";
import QuickListBox from "@/components/merchant/QuickListBox";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Kutu Yayınla",
  robots: { index: false, follow: false },
};

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

  if (!business.isApproved) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="text-5xl">⏳</div>
        <h1 className="mt-4 text-xl font-bold text-stone-900">Onay Bekleniyor</h1>
        <p className="mt-2 text-sm text-stone-500 leading-relaxed">
          İşletmeniz henüz onaylanmadı. Ekibimiz başvurunuzu inceliyor.
          Onaylandıktan sonra kutu yayınlayabileceksiniz.
        </p>
        <p className="mt-4 text-xs text-stone-400">
          Sorularınız için{" "}
          <a href="mailto:destek@foodrescue.com.tr" className="text-emerald-600 underline">
            destek@foodrescue.com.tr
          </a>
        </p>
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
