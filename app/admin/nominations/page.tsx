import { prisma } from "@/lib/prisma";

export default async function AdminNominationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const nominations = await prisma.businessNomination.findMany({
    where: q
      ? {
          OR: [
            { nominatedBusinessName: { contains: q, mode: "insensitive" } },
            { nominatorName: { contains: q, mode: "insensitive" } },
            { nominatedAddress: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const total = await prisma.businessNomination.count();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">İşletme Önerileri</h1>
          <p className="mt-0.5 text-sm text-stone-500">{total} öneri alındı</p>
        </div>

        <form method="GET" className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7" cy="7" r="5" /><path d="M12 12l2.5 2.5" />
            </svg>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="İşletme adı veya öneren..."
              className="h-10 w-60 rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button type="submit" className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            Ara
          </button>
          {q && (
            <a href="/admin/nominations" className="flex h-10 items-center rounded-xl border border-stone-200 px-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors">
              ✕
            </a>
          )}
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
        {nominations.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl">💡</p>
            <p className="mt-2 text-sm text-stone-400">
              {q ? "Eşleşen öneri bulunamadı." : "Henüz öneri gelmedi."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Öneren</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Önerilen İşletme</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Adres</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Neden?</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {nominations.map((n) => (
                  <tr key={n.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-900">{n.nominatorName}</div>
                      {n.nominatorEmail && (
                        <div className="mt-0.5 text-xs text-stone-400">{n.nominatorEmail}</div>
                      )}
                      {n.nominatorPhone && (
                        <div className="mt-0.5 text-xs text-stone-400">{n.nominatorPhone}</div>
                      )}
                      {n.user && (
                        <div className="mt-0.5 text-xs text-indigo-500">
                          Kayıtlı: {n.user.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-900">{n.nominatedBusinessName}</div>
                    </td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="text-xs text-stone-500 leading-relaxed truncate">
                        {n.nominatedAddress}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 max-w-[220px]">
                      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                        {n.reason ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-stone-400 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleDateString("tr-TR")}
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
