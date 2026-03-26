import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Bekliyor", PICKED_UP: "Teslim Edildi", CANCELLED: "İptal",
};
const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PICKED_UP: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};
const BOX_LABEL: Record<string, string> = {
  BAKERY: "Fırın", PATISSERIE: "Pastane", CAFE: "Kafe",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: {
      ...(status && ["PENDING", "PICKED_UP", "CANCELLED"].includes(status)
        ? { status: status as "PENDING" | "PICKED_UP" | "CANCELLED" }
        : {}),
      ...(q ? { OR: [
        { pickupCode: { contains: q.toUpperCase() } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { box: { business: { name: { contains: q, mode: "insensitive" } } } },
      ]} : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { name: true, email: true } },
      box: { include: { business: { select: { name: true } } } },
    },
  });

  const total = await prisma.order.count();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">Siparişler</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Son {orders.length} / {total.toLocaleString("tr-TR")} sipariş
          </p>
        </div>

        <form method="GET" className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7" cy="7" r="5" /><path d="M12 12l2.5 2.5" />
            </svg>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Kod, müşteri veya işletme..."
              className="h-10 w-56 rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-700 focus:border-emerald-400 focus:outline-none"
          >
            <option value="">Tüm Durumlar</option>
            <option value="PENDING">Bekliyor</option>
            <option value="PICKED_UP">Teslim Edildi</option>
            <option value="CANCELLED">İptal</option>
          </select>
          <button type="submit" className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            Ara
          </button>
          {(q || status) && (
            <a href="/admin/orders" className="flex h-10 items-center rounded-xl border border-stone-200 px-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors">
              ✕
            </a>
          )}
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl">📋</p>
            <p className="mt-2 text-sm text-stone-400">
              {q || status ? "Eşleşen sipariş bulunamadı." : "Henüz sipariş yok."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Kod</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Tüketici</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">İşletme / Kutu</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">Adet</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">Tutar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Durum</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id} className={`hover:bg-stone-50 transition-colors ${o.status === "CANCELLED" ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-bold tracking-widest text-stone-700">
                        {o.pickupCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-stone-800">{o.user.name ?? "—"}</div>
                      <div className="mt-0.5 text-xs text-stone-400">{o.user.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-stone-800">{o.box?.business?.name ?? "—"}</div>
                      <div className="mt-0.5 text-xs text-stone-400">
                        {BOX_LABEL[o.box?.category ?? ""] ?? o.box?.category ?? ""}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-stone-600">
                      {o.quantity}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-stone-800">
                      ₺{o.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[o.status] ?? "bg-stone-100 text-stone-600"}`}>
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-stone-400">
                      {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
