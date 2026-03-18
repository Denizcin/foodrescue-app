import { prisma } from "@/lib/prisma";

export default async function AdminNominationsPage() {
  const nominations = await prisma.businessNomination.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-900">İşletme Önerileri</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {nominations.length} öneri alındı
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-stone-200">
        <table className="min-w-full divide-y divide-stone-200 bg-white text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Öneren
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Önerilen İşletme
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Adres
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Neden?
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Tarih
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {nominations.map((n) => (
              <tr key={n.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">
                    {n.nominatorName}
                  </div>
                  {n.nominatorEmail && (
                    <div className="text-xs text-stone-400">
                      {n.nominatorEmail}
                    </div>
                  )}
                  {n.nominatorPhone && (
                    <div className="text-xs text-stone-400">
                      {n.nominatorPhone}
                    </div>
                  )}
                  {n.user && (
                    <div className="text-xs text-indigo-400 mt-0.5">
                      Kayıtlı: {n.user.email}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">
                    {n.nominatedBusinessName}
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600 text-xs max-w-[180px]">
                  {n.nominatedAddress}
                </td>
                <td className="px-4 py-3 text-stone-500 text-xs max-w-[200px]">
                  {n.reason ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-stone-400">
                  {new Date(n.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {nominations.length === 0 && (
          <div className="py-12 text-center text-sm text-stone-400">
            Henüz öneri gelmedi.
          </div>
        )}
      </div>
    </div>
  );
}
