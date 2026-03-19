import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/components/shared/ProfileEditForm";
import BusinessEditForm from "@/components/merchant/BusinessEditForm";

export const metadata: Metadata = {
  title: "İşletme Ayarları",
  robots: { index: false, follow: false },
};

export default async function MerchantSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const [user, business] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true, emailVerified: true },
    }),
    prisma.business.findFirst({
      where: { ownerId: session.user.id, isActive: true },
      select: {
        name: true, description: true, address: true, phone: true,
        operatingHours: true, imageUrl: true,
      },
    }),
  ]);

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900">⚙️ Ayarlar</h1>
        <p className="mt-1 text-sm text-stone-500">Hesap ve işletme bilgilerini yönet.</p>
      </div>

      {/* Owner profile */}
      <ProfileEditForm
        initialName={user?.name ?? ""}
        initialPhone={user?.phone ?? ""}
        email={user?.email ?? ""}
        emailVerified={!!user?.emailVerified}
      />

      {/* Business info + image */}
      {business && (
        <BusinessEditForm
          initialName={business.name}
          initialDescription={business.description ?? ""}
          initialAddress={business.address}
          initialPhone={business.phone ?? ""}
          initialHours={business.operatingHours}
          initialImageUrl={business.imageUrl ?? ""}
        />
      )}
    </div>
  );
}
