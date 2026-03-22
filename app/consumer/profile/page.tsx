import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProfileEditForm from "@/components/shared/ProfileEditForm";

export const metadata: Metadata = {
  title: "Profilim",
  description: "Profil bilgilerini düzenle.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      emailVerified: true,
      impactSavedMoney: true,
      impactCo2: true,
      impactFood: true,
      createdAt: true,
    },
  });

  const memberSince = user?.createdAt.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900">👤 Profilim</h1>
        <p className="mt-1 text-sm text-stone-500">
          Üyelik: {memberSince}
        </p>
      </div>

      {/* Impact summary */}
      <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-3">
          Toplam Katkım
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-extrabold text-emerald-800">
              ₺{(user?.impactSavedMoney ?? 0).toFixed(0)}
            </p>
            <p className="text-xs text-emerald-600">Tasarruf</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-emerald-800">
              {(user?.impactCo2 ?? 0).toFixed(1)} kg
            </p>
            <p className="text-xs text-emerald-600">CO₂ azalması</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-emerald-800">
              {(user?.impactFood ?? 0).toFixed(1)} kg
            </p>
            <p className="text-xs text-emerald-600">Kurtarılan yemek</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <ProfileEditForm
        initialName={user?.name ?? ""}
        initialPhone={user?.phone ?? ""}
        email={user?.email ?? ""}
        emailVerified={!!user?.emailVerified}
      />

      {/* Quick links */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-2">
        <h2 className="text-sm font-bold text-stone-800">Hızlı Erişim</h2>
        <div className="space-y-1">
          <Link href="/consumer/orders" className="flex items-center justify-between py-2 text-sm text-stone-700 hover:text-emerald-700">
            <span>📦 Siparişlerim</span>
            <span className="text-stone-400">→</span>
          </Link>
          <Link href="/consumer/payments" className="flex items-center justify-between py-2 text-sm text-stone-700 hover:text-emerald-700 border-t border-stone-50">
            <span>💳 Ödeme Geçmişim</span>
            <span className="text-stone-400">→</span>
          </Link>
          <Link href="/consumer/favorites" className="flex items-center justify-between py-2 text-sm text-stone-700 hover:text-emerald-700 border-t border-stone-50">
            <span>❤️ Favorilerim</span>
            <span className="text-stone-400">→</span>
          </Link>
          <Link href="/consumer/settings" className="flex items-center justify-between py-2 text-sm text-stone-700 hover:text-emerald-700 border-t border-stone-50">
            <span>⚙️ Bildirim Ayarları</span>
            <span className="text-stone-400">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
