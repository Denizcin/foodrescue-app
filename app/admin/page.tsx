import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") redirect("/giris");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    approvedBusinesses,
    pendingBusinesses,
    todayOrders,
    totalRevenue,
    totalPickedUp,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CONSUMER" } }),
    prisma.business.count({ where: { isApproved: true } }),
    prisma.business.count({ where: { isApproved: false } }),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.aggregate({
      where: { status: "PICKED_UP" },
      _sum: { totalPrice: true },
    }),
    prisma.order.count({ where: { status: "PICKED_UP" } }),
  ]);

  const revenue = totalRevenue._sum.totalPrice ?? 0;
  const foodRescuedKg = totalPickedUp * 1.0;

  const stats = [
    {
      label: "Toplam Tüketici",
      value: totalUsers.toLocaleString("tr-TR"),
      icon: "👥",
      bg: "bg-indigo-50",
      ring: "ring-indigo-100",
      color: "text-indigo-700",
      iconBg: "bg-indigo-100",
    },
    {
      label: "Onaylı İşletme",
      value: approvedBusinesses.toLocaleString("tr-TR"),
      icon: "🏪",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      color: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Onay Bekleyen",
      value: pendingBusinesses.toLocaleString("tr-TR"),
      icon: "⏳",
      bg: pendingBusinesses > 0 ? "bg-amber-50" : "bg-stone-50",
      ring: pendingBusinesses > 0 ? "ring-amber-100" : "ring-stone-200",
      color: pendingBusinesses > 0 ? "text-amber-700" : "text-stone-500",
      iconBg: pendingBusinesses > 0 ? "bg-amber-100" : "bg-stone-100",
    },
    {
      label: "Bugünün Siparişleri",
      value: todayOrders.toLocaleString("tr-TR"),
      icon: "📋",
      bg: "bg-indigo-50",
      ring: "ring-indigo-100",
      color: "text-indigo-700",
      iconBg: "bg-indigo-100",
    },
    {
      label: "Toplam Ciro",
      value: `₺${revenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
      icon: "💰",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      color: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Kurtarılan Yemek",
      value: `${foodRescuedKg.toFixed(1)} kg`,
      icon: "🌍",
      bg: "bg-teal-50",
      ring: "ring-teal-100",
      color: "text-teal-700",
      iconBg: "bg-teal-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Platform Özeti</h1>
        <p className="mt-0.5 text-sm text-stone-500">Gerçek zamanlı istatistikler</p>
      </div>

      {/* Pending alert */}
      {pendingBusinesses > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">⚠️</span>
            <div>
              <p className="text-sm font-bold text-amber-800">
                {pendingBusinesses} işletme onay bekliyor
              </p>
              <p className="text-xs text-amber-600">Hemen incele ve onayla veya reddet</p>
            </div>
          </div>
          <Link
            href="/admin/businesses"
            className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors"
          >
            İncele →
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl ${s.bg} p-5 ring-1 ${s.ring} shadow-sm`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg} text-xl`}>
              {s.icon}
            </div>
            <div className={`mt-3 text-2xl font-extrabold tabular-nums ${s.color}`}>
              {s.value}
            </div>
            <div className="mt-0.5 text-xs font-medium text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: "/admin/businesses", label: "İşletmeler", icon: "🏪" },
          { href: "/admin/users", label: "Kullanıcılar", icon: "👥" },
          { href: "/admin/orders", label: "Siparişler", icon: "📋" },
          { href: "/admin/nominations", label: "Öneriler", icon: "💡" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-stone-200 shadow-sm hover:bg-stone-50 hover:ring-stone-300 transition-all"
          >
            <span className="text-xl" aria-hidden="true">{link.icon}</span>
            <span className="text-sm font-semibold text-stone-700">{link.label}</span>
            <svg className="ml-auto h-4 w-4 shrink-0 text-stone-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
