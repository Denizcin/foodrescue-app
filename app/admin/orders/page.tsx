import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { name: true, email: true } },
      box: {
        include: { business: { select: { name: true } } },
      },
    },
  });

  const statusLabel: Record<string, string> = {
    PENDING: "Bekliyor",
    PICKED_UP: "Teslim Edildi",
    CANCELLED: "İptal",
  };

  const statusBadge: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PICKED_UP: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-900">Siparişler</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Son {orders.length} sipariş
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-stone-200">
        <table className="min-w-full divide-y divide-stone-200 bg-white text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Kod
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Tüketici
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                İşletme / Kutu
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Adet
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Tutar
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Durum
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Tarih
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono text-xs text-stone-700">
                  {o.pickupCode}
                </td>
                <td className="px-4 py-3">
                  <div className="text-stone-700">{o.user.name ?? "—"}</div>
                  <div className="text-xs text-stone-400">{o.user.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-stone-700">
                    {o.box?.business?.name ?? "—"}
                  </div>
                  <div className="text-xs text-stone-400">
                    {o.box?.category ?? ""}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {o.quantity}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  ₺{o.totalPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      statusBadge[o.status] ?? "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {statusLabel[o.status] ?? o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-stone-400">
                  {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-12 text-center text-sm text-stone-400">
            Henüz sipariş yok.
          </div>
        )}
      </div>
    </div>
  );
}
