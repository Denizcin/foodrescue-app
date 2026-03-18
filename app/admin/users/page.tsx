import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      impactSavedMoney: true,
      _count: { select: { orders: true } },
    },
  });

  const roleLabel: Record<string, string> = {
    CONSUMER: "Tüketici",
    MERCHANT: "İşletme",
    ADMIN: "Admin",
  };

  const roleBadge: Record<string, string> = {
    CONSUMER: "bg-indigo-100 text-indigo-700",
    MERCHANT: "bg-emerald-100 text-emerald-700",
    ADMIN: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-900">Kullanıcılar</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {users.length} kullanıcı kayıtlı
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-stone-200">
        <table className="min-w-full divide-y divide-stone-200 bg-white text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Ad Soyad
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                E-posta
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Siparişler
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Tasarruf
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Kayıt Tarihi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">{u.name ?? "—"}</div>
                  <div className="text-xs text-stone-400">{u.phone ?? ""}</div>
                </td>
                <td className="px-4 py-3 text-stone-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      roleBadge[u.role] ?? "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {roleLabel[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {u._count.orders}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  ₺{u.impactSavedMoney.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="py-12 text-center text-sm text-stone-400">
            Henüz kayıtlı kullanıcı yok.
          </div>
        )}
      </div>
    </div>
  );
}
