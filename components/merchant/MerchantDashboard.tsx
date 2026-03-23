"use client";

import Link from "next/link";

interface WeeklyDay {
  label: string;
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
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-stone-800">Son 7 Günlük Siparişler</h2>
          <p className="mt-0.5 text-xs text-stone-400">Geçen haftayla kıyasla</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-base font-extrabold text-stone-900">{totalOrders}</p>
            <p className="text-[10px] text-stone-400">Sipariş</p>
          </div>
          {totalRevenue > 0 && (
            <div>
              <p className="text-base font-extrabold text-emerald-600">
                ₺{totalRevenue.toFixed(0)}
              </p>
              <p className="text-[10px] text-stone-400">Ciro</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
        {data.map((day) => {
          const heightPct = (day.orders / maxOrders) * 100;
          return (
            <div key={day.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full rounded-t-md bg-emerald-50" style={{ height: "60px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md bg-emerald-500 transition-all duration-700"
                  style={{ height: `${Math.max(heightPct, day.orders > 0 ? 6 : 0)}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-stone-400">{day.label}</span>
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
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      color: "text-emerald-700",
      iconBg: "bg-emerald-100",
      bg: "bg-white",
      ring: "ring-stone-100",
    },
    {
      label: "Bekleyen Siparişler",
      value: pendingOrders,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-amber-700",
      iconBg: "bg-amber-100",
      bg: "bg-white",
      ring: "ring-stone-100",
    },
    {
      label: "Bugün Teslim Edilen",
      value: pickedUpToday,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-emerald-700",
      iconBg: "bg-emerald-100",
      bg: "bg-white",
      ring: "ring-stone-100",
    },
    {
      label: "Kurtarılan Yemek",
      value: `${foodRescuedKg.toFixed(1)} kg`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-teal-700",
      iconBg: "bg-teal-100",
      bg: "bg-white",
      ring: "ring-stone-100",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">

      {/* Welcome card */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
              İşletme Portalı
            </p>
            <h1 className="mt-1 text-xl font-extrabold leading-tight truncate">
              {businessName}
            </h1>
            <p className="mt-1 text-sm text-emerald-100 opacity-90">
              Bugünün özetini aşağıda görebilirsin.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
            🏪
          </div>
        </div>

        {!isApproved && (
          <div className="mt-4 rounded-xl bg-white/20 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm font-semibold text-white">⏳ Hesabınız onay bekliyor</p>
            <p className="mt-0.5 text-xs text-emerald-100 leading-relaxed">
              Ekibimiz işletmenizi inceliyor. Onaylandıktan sonra kutu yayınlayabilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl ${card.bg} px-4 py-4 ring-1 ${card.ring} shadow-sm`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg} ${card.color}`}>
              {card.icon}
            </div>
            <div className={`mt-3 text-2xl font-extrabold tabular-nums ${card.color}`}>
              {card.value}
            </div>
            <div className="mt-0.5 text-xs font-medium text-stone-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      {weeklyData && weeklyData.length > 0 && (
        <WeeklyChart data={weeklyData} />
      )}

      {/* Quick actions */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Hızlı İşlemler
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/merchant/publish"
            aria-disabled={!isApproved}
            className={[
              "flex flex-col items-center gap-2.5 rounded-2xl px-4 py-5 text-center shadow-sm transition-all",
              isApproved
                ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
                : "pointer-events-none bg-stone-100 text-stone-400",
            ].join(" ")}
          >
            <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold">Yeni Kutu Yayınla</span>
          </Link>
          <Link
            href="/merchant/orders"
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-white px-4 py-5 text-center text-stone-700 ring-1 ring-stone-200 shadow-sm transition-all hover:bg-stone-50 hover:ring-stone-300 active:scale-[0.98]"
          >
            <svg className="h-7 w-7 text-stone-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold">Siparişleri Gör</span>
          </Link>
        </div>
      </div>

      {/* No-fee badge */}
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
        <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="text-sm font-semibold text-emerald-700">
          Üyelik ücretsiz. Kullanım ücretsiz.
        </p>
      </div>
    </div>
  );
}
