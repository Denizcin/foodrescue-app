import { prisma } from "@/lib/prisma";
import BusinessActions from "@/components/admin/BusinessActions";

export default async function AdminBusinessesPage() {
  const businesses = await prisma.business.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { surpriseBoxes: true } },
    },
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  const categoryLabel: Record<string, string> = {
    BAKERY: "Fırın",
    RESTAURANT: "Restoran",
    CAFE: "Kafe",
    GROCERY: "Market",
    GREENGROCER: "Manav",
    MARKET: "Market",
    PATISSERIE: "Pastane",
    DELI: "Şarküteri",
    FLORIST: "Çiçekçi",
    OTHER: "Diğer",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-900">İşletmeler</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {businesses.length} işletme kayıtlı
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-stone-200">
        <table className="min-w-full divide-y divide-stone-200 bg-white text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                İşletme
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Sahip
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Kutular
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Durum
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {businesses.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">{b.name}</div>
                  <div className="text-xs text-stone-400 truncate max-w-[180px]">
                    {b.address}
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {categoryLabel[b.category] ?? b.category}
                </td>
                <td className="px-4 py-3">
                  <div className="text-stone-700">{b.owner.name}</div>
                  <div className="text-xs text-stone-400">{b.owner.email}</div>
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {b._count.surpriseBoxes}
                </td>
                <td className="px-4 py-3">
                  {b.isApproved ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Onaylı
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      Bekliyor
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <BusinessActions
                    businessId={b.id}
                    isApproved={b.isApproved}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {businesses.length === 0 && (
          <div className="py-12 text-center text-sm text-stone-400">
            Henüz kayıtlı işletme yok.
          </div>
        )}
      </div>
    </div>
  );
}
