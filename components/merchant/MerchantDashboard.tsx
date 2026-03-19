"use client";

import Link from "next/link";

interface WeeklyDay {
  label: string; // e.g. "Pzt"
  orders: number;
  revenue: number;
}

interface DashboardProps {
  businessName: string;
  isApproved: boolean;
  activeBoxes: number;
  pendingOrders: number;
  pickedUpToday: number;
  foodRescuedKg: number;
  weeklyData?: WeeklyDay[];
}

function WeeklyChart({ data }: { data: WeeklyDay[] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders), 1);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
      <h2 className="mb-3 text-sm font-bold text-stone-800">📈 Son 7 Günlük Siparişler</h2>
      <div className="flex items-end gap-1.5 h-24">
        {data.map((day) => {
          const heightPct = (day.orders / maxOrders) * 100;
          return (
            <div key={day.label} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-semibold text-stone-700">{day.orders > 0 ? day.orders : ""}</span>
              <div className="w-full rounded-t-lg bg-emerald-100 relative" style={{ height: "64px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-emerald-500 transition-all"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-xs text-stone-400">{day.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MerchantDashboard({
  businessName,
  isApproved,
  activeBoxes,
  pendingOrders,
  pickedUpToday,
  foodRescuedKg,
  weeklyData,
}: DashboardProps) {
  const statCards = [
    {
      label: "Aktif Kutular",
      value: activeBoxes,
      emoji: "📦",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
    },
    {
      label: "Bekleyen Siparişler",
      value: pendingOrders,
      emoji: "⏳",
      color: "text-amber-700",
      bg: "bg-amber-50",
      ring: "ring-amber-100",
    },
    {
      label: "Bugün Teslim Edilen",
      value: pickedUpToday,
      emoji: "✅",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
    },
    {
      label: "Bugün Kurtarılan Yemek",
      value: `${foodRescuedKg.toFixed(1)} kg`,
      emoji: "🌍",
      color: "text-stone-700",
      bg: "bg-stone-100",
      ring: "ring-stone-200",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-stone-900">
          Hoş geldin, {businessName} 👋
        </h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Bugünün özetini aşağıda görebilirsin.
        </p>
      </div>

      {/* Approval status */}
      {!isApproved ? (
        <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
          <p className="text-sm font-semibold text-amber-800">⏳ Hesabınız onay bekliyor</p>
          <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
            Ekibimiz işletmenizi inceliyor. Onaylandıktan sonra kutu yayınlayabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
          🎉 Üyelik ücretsiz. Kullanım ücretsiz.
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl ${card.bg} px-4 py-4 ring-1 ${card.ring}`}
          >
            <div className="text-2xl leading-none">{card.emoji}</div>
            <div className={`mt-2 text-2xl font-extrabold ${card.color}`}>
              {card.value}
            </div>
            <div className="mt-0.5 text-xs text-stone-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      {weeklyData && weeklyData.length > 0 && (
        <WeeklyChart data={weeklyData} />
      )}

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/merchant/publish"
            aria-disabled={!isApproved}
            className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-5 text-center shadow-sm transition ${
              isApproved
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "pointer-events-none bg-stone-200 text-stone-400"
            }`}
          >
            <span className="text-3xl">➕</span>
            <span className="text-sm font-semibold">Yeni Kutu Yayınla</span>
          </Link>
          <Link
            href="/merchant/orders"
            className="flex flex-col items-center gap-2 rounded-2xl bg-white px-4 py-5 text-center text-stone-700 ring-1 ring-stone-200 shadow-sm transition hover:bg-stone-50"
          >
            <span className="text-3xl">📋</span>
            <span className="text-sm font-semibold">Siparişleri Gör</span>
          </Link>
        </div>
      </div>

      {/* No-fee reminder */}
      <div className="rounded-xl bg-stone-100 px-4 py-3 text-xs text-stone-500">
        💡 İşletmenizi listelemek ve sipariş almak tamamen ücretsizdir.
        Komisyon veya ücret alınmaz.
      </div>
    </div>
  );
}
