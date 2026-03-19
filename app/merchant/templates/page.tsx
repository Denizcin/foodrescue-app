import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BoxTemplateManager from "@/components/merchant/BoxTemplateManager";

export const metadata: Metadata = {
  title: "Kutu Şablonları",
  robots: { index: false, follow: false },
};

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id, isActive: true },
    select: { id: true },
  });

  if (!business) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <p className="text-stone-500">Aktif işletmeniz bulunamadı.</p>
      </div>
    );
  }

  const templates = await prisma.boxTemplate.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = templates.map((t) => ({
    id: t.id,
    label: t.label,
    category: t.category,
    description: t.description,
    originalPrice: t.originalPrice,
    discountedPrice: t.discountedPrice,
  }));

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto pb-8">
      <BoxTemplateManager initialTemplates={serialized} />
    </div>
  );
}
