import { prisma } from "@/lib/prisma";

const ROLE_LABEL: Record<string, string> = {
  CONSUMER: "Tüketici", MERCHANT: "İşletme", ADMIN: "Admin",
};
const ROLE_BADGE: Record<string, string> = {
  CONSUMER: "bg-indigo-100 text-indigo-700",
  MERCHANT: "bg-emerald-100 text-emerald-700",
  ADMIN: "bg-red-100 text-red-700",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, phone: true,
      createdAt: true, impactSavedMoney: true,
      _count: { select: { orders: true } },
    },
  });

  const total = await prisma.user.count();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">Kullanıcılar</h1>
          <p className="mt-0.5 text-sm text-stone-500">{total} kullanıcı kayıtlı</p>
        </div>

        <form method="GET" className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7" cy="7" r="5" /><path d="M12 12l2.5 2.5" />
            </svg>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Ad veya e-posta ara..."
              className="h-10 w-64 rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button type="submit" className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            Ara
          </button>
          {q && (
            <a href="/admin/users" className="flex h-10 items-center rounded-xl border border-stone-200 px-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors">
              ✕
            </a>
          )}
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
        {users.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl">🔍</p>
            <p className="mt-2 text-sm text-stone-400">
              {q ? "Eşleşen kullanıcı bulunamadı." : "Henüz kayıtlı kullanıcı yok."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Ad Soyad</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">E-posta</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Rol</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">Siparişler</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">Tasarruf</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">Kayıt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-900">{u.name ?? "—"}</div>
                      {u.phone && <div className="mt-0.5 text-xs text-stone-400">{u.phone}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[u.role] ?? "bg-stone-100 text-stone-600"}`}>
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                        {u._count.orders}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-600">
                      ₺{u.impactSavedMoney.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-stone-400">
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
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
