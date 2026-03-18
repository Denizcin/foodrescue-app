import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
  // 10% platform commission (display only — no actual payout system yet)
  const commission = revenue * 0.1;
  const foodRescuedKg = totalPickedUp * 1.0;

  const stats = [
    {
      label: "Toplam Tüketici",
      value: totalUsers.toLocaleString("tr-TR"),
      emoji: "👥",
      bg: "bg-indigo-50",
      ring: "ring-indigo-100",
      color: "text-indigo-700",
    },
    {
      label: "Onaylı İşletme",
      value: approvedBusinesses.toLocaleString("tr-TR"),
      emoji: "🏪",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      color: "text-emerald-700",
    },
    {
      label: "Onay Bekleyen",
      value: pendingBusinesses.toLocaleString("tr-TR"),
      emoji: "⏳",
      bg: pendingBusinesses > 0 ? "bg-amber-50" : "bg-stone-50",
      ring: pendingBusinesses > 0 ? "ring-amber-100" : "ring-stone-200",
      color: pendingBusinesses > 0 ? "text-amber-700" : "text-stone-500",
    },
    {
      label: "Bugünün Siparişleri",
      value: todayOrders.toLocaleString("tr-TR"),
      emoji: "📋",
      bg: "bg-indigo-50",
      ring: "ring-indigo-100",
      color: "text-indigo-700",
    },
    {
      label: "Toplam Ciro",
      value: `₺${revenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
      emoji: "💰",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      color: "text-emerald-700",
    },
    {
      label: "Platform Komisyonu",
      value: `₺${commission.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
      emoji: "📊",
      bg: "bg-stone-50",
      ring: "ring-stone-200",
      color: "text-stone-700",
    },
    {
      label: "Teslim Edilen Sipariş",
      value: totalPickedUp.toLocaleString("tr-TR"),
      emoji: "✅",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      color: "text-emerald-700",
    },
    {
      label: "Kurtarılan Yemek",
      value: `${foodRescuedKg.toFixed(1)} kg`,
      emoji: "🌍",
      bg: "bg-stone-50",
      ring: "ring-stone-200",
      color: "text-stone-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-900">Platform Özeti</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Gerçek zamanlı istatistikler
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl ${s.bg} px-4 py-4 ring-1 ${s.ring}`}
          >
            <div className="text-2xl leading-none">{s.emoji}</div>
            <div className={`mt-2 text-xl font-extrabold ${s.color}`}>
              {s.value}
            </div>
            <div className="mt-0.5 text-xs text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {pendingBusinesses > 0 && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
          <p className="text-sm font-semibold text-amber-800">
            ⚠️ {pendingBusinesses} işletme onay bekliyor
          </p>
          <p className="mt-0.5 text-xs text-amber-700">
            <a href="/admin/businesses" className="underline hover:no-underline">
              İşletmeler sayfasına git →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
