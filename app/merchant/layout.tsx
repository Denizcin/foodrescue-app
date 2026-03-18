import MerchantNav from "@/components/merchant/MerchantNav";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  let businessName = "İşletme";

  if (session?.user?.id) {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id, isActive: true },
      select: { name: true },
    });
    if (business) businessName = business.name;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-stone-100 bg-white px-4 py-3 shadow-sm">
        <span className="text-base font-extrabold text-emerald-600">🌍 FoodRescue</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-sm font-medium text-stone-700 sm:block">
            {businessName}
          </span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            İşletme Portalı
          </span>
        </div>
      </header>

      <div className="flex flex-1 md:overflow-hidden">
        <MerchantNav />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
