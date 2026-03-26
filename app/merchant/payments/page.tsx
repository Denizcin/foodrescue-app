import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gelir & Ödemeler",
  robots: { index: false, follow: false },
};

const BOX_LABELS: Record<string, string> = {
  BAKERY: "Fırın", PATISSERIE: "Pastane", CAFE: "Kafe",
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function MerchantPaymentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id, isActive: true },
    select: { id: true, name: true },
  });

  if (!business) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <p className="text-stone-500">Aktif işletmeniz bulunamadı.</p>
      </div>
    );
  }

  const [orders, payouts] = await Promise.all([
    prisma.order.findMany({
      where: {
        box: { businessId: business.id },
        status: "PICKED_UP",
      },
      include: { box: { select: { category: true } }, user: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.merchantPayout.findMany({
      where: { businessId: business.id },
      orderBy: { periodStart: "desc" },
    }),
  ]);

  const totalRevenue = orders.reduce((s, o) => s + (o.merchantAmount ?? o.totalPrice * 0.85), 0);
  const totalCommission = orders.reduce((s, o) => s + (o.commissionAmount ?? o.totalPrice * 0.15), 0);
  const paidOut = payouts.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.netPayout, 0);
  const pending = totalRevenue - paidOut;

  return (
    <div className="px-4 pt-5 max-w-2xl mx-auto pb-8 space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900">💰 Gelir & Ödemeler</h1>
        <p className="mt-1 text-sm text-stone-500">{business.name}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Toplam Gelir", value: `₺${totalRevenue.toFixed(2)}`, color: "text-stone-900" },
          { label: "Komisyon", value: `₺${totalCommission.toFixed(2)}`, color: "text-stone-500" },
          { label: "Ödenen", value: `₺${paidOut.toFixed(2)}`, color: "text-emerald-700" },
          { label: "Bekleyen", value: `₺${pending.toFixed(2)}`, color: "text-amber-700" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 text-center">
            <p className={`text-xl font-extrabold ${card.color}`}>{card.value}</p>
            <p className="mt-0.5 text-xs text-stone-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-50">
          <h2 className="text-sm font-bold text-stone-800">Son İşlemler</h2>
        </div>
        {orders.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-stone-400">Henüz tamamlanan sipariş yok.</p>
        ) : (
          <div className="divide-y divide-stone-50">
            {orders.slice(0, 30).map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {BOX_LABELS[order.box.category] ?? order.box.category} · {order.user.name}
                  </p>
                  <p className="text-xs text-stone-400">{fmtDate(order.updatedAt)} · {order.quantity} kutu</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-emerald-700">
                    ₺{(order.merchantAmount ?? order.totalPrice * 0.85).toFixed(2)}
                  </p>
                  <p className="text-xs text-stone-400">
                    -₺{(order.commissionAmount ?? order.totalPrice * 0.15).toFixed(2)} kom.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout history */}
      {payouts.length > 0 && (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-50">
            <h2 className="text-sm font-bold text-stone-800">Ödeme Transferleri</h2>
          </div>
          <div className="divide-y divide-stone-50">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800">
                    {fmtDate(payout.periodStart)} – {fmtDate(payout.periodEnd)}
                  </p>
                  <p className="text-xs text-stone-400">
                    Satış: ₺{payout.totalSales.toFixed(2)} · Kom: ₺{payout.totalCommission.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-700">₺{payout.netPayout.toFixed(2)}</p>
                  <span className={`text-xs font-medium ${
                    payout.status === "COMPLETED" ? "text-emerald-600" :
                    payout.status === "PROCESSING" ? "text-amber-600" : "text-stone-500"
                  }`}>
                    {payout.status === "COMPLETED" ? "Ödendi" :
                     payout.status === "PROCESSING" ? "İşlemde" : "Bekliyor"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
