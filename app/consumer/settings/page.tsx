import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NotificationSettings from "@/components/consumer/NotificationSettings";

export const metadata: Metadata = {
  title: "Ayarlar",
  description: "Bildirim tercihlerini yönet.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, notificationPreferences: true },
  });

  const prefs = (user?.notificationPreferences as {
    orderEmails?: boolean;
    newBoxAlerts?: boolean;
    promotionalEmails?: boolean;
  } | null) ?? {};

  const initialPrefs = {
    orderEmails: prefs.orderEmails ?? true,
    newBoxAlerts: prefs.newBoxAlerts ?? true,
    promotionalEmails: prefs.promotionalEmails ?? false,
  };

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900">⚙️ Ayarlar</h1>
        <p className="mt-1 text-sm text-stone-500">Hesap ve bildirim tercihlerini yönet.</p>
      </div>

      {/* Account info (read-only) */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-3">
        <h2 className="text-sm font-bold text-stone-800">Hesap Bilgileri</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Ad</span>
            <span className="font-medium text-stone-800">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">E-posta</span>
            <span className="font-medium text-stone-800 text-right break-all">{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="flex justify-between">
              <span className="text-stone-500">Telefon</span>
              <span className="font-medium text-stone-800">{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notification preferences */}
      <NotificationSettings initialPrefs={initialPrefs} />

      {/* Legal links */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-2">
        <h2 className="text-sm font-bold text-stone-800">Hukuki</h2>
        <div className="space-y-1 text-sm text-emerald-600">
          <a href="/kvkk" className="block hover:underline">KVKK Aydınlatma Metni</a>
          <a href="/kullanim-sartlari" className="block hover:underline">Kullanım Şartları</a>
          <a href="/cerez-politikasi" className="block hover:underline">Çerez Politikası</a>
          <a href="/mesafeli-satis-sozlesmesi" className="block hover:underline">Mesafeli Satış Sözleşmesi</a>
        </div>
      </div>
    </div>
  );
}
