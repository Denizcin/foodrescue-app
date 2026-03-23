import { prisma } from "@/lib/prisma";
import BusinessActions from "@/components/admin/BusinessActions";

const CATEGORY_LABEL: Record<string, string> = {
  BAKERY: "Fırın", RESTAURANT: "Restoran", CAFE: "Kafe", GROCERY: "Market",
  GREENGROCER: "Manav", MARKET: "Market", PATISSERIE: "Pastane",
  DELI: "Şarküteri", FLORIST: "Çiçekçi", OTHER: "Diğer",
};

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const businesses = await prisma.business.findMany({
    where: {
      ...(q ? { OR: [
        { name: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ]} : {}),
      ...(status === "pending" ? { isApproved: false } : {}),
      ...(status === "approved" ? { isApproved: true } : {}),
    },
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { surpriseBoxes: true } },
    },
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  const total = await prisma.business.count();
  const pendingCount = await prisma.business.count({ where: { isApproved: false } });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">İşletmeler</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            {total} kayıtlı işletme
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                {pendingCount} bekliyor
              </span>
            )}
          </p>
        </div>

        {/* Search + filter */}
        <form method="GET" className="flex gap-2 sm:w-auto w-full">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7" cy="7" r="5" /><path d="M12 12l2.5 2.5" />
            </svg>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="İşletme adı veya adres..."
              className="h-10 w-full min-w-[200px] rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-700 focus:border-emerald-400 focus:outline-none"
          >
            <option value="">Tümü</option>
            <option value="pending">Bekliyor</option>
            <option value="approved">Onaylı</option>
          </select>
          <button
            type="submit"
            className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Ara
          </button>
          {(q || status) && (
            <a
              href="/admin/businesses"
              className="flex h-10 items-center rounded-xl border border-stone-200 px-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors"
            >
              ✕
            </a>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
        {businesses.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl">🔍</p>
            <p className="mt-2 text-sm text-stone-400">
              {q || status ? "Eşleşen işletme bulunamadı." : "Henüz kayıtlı işletme yok."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    İşletme
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Sahip
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Kutular
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-900">{b.name}</div>
                      <div className="mt-0.5 text-xs text-stone-400 max-w-[200px] truncate">
                        {b.address}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">
                      {CATEGORY_LABEL[b.category] ?? b.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-stone-700">{b.owner.name}</div>
                      <div className="mt-0.5 text-xs text-stone-400">{b.owner.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                        {b._count.surpriseBoxes}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {b.isApproved ? (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Onaylı
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Bekliyor
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <BusinessActions businessId={b.id} isApproved={b.isApproved} />
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
