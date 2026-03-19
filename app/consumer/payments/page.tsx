import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ödeme Geçmişim",
  robots: { index: false, follow: false },
};

const BOX_LABELS: Record<string, string> = {
  BAKERY: "Fırın", SUSHI: "Suşi", GROCERY: "Market", DELI: "Şarküteri",
  CAFE: "Kafe", PREPARED_MEAL: "Hazır Yemek", PRODUCE: "Manav", MIXED: "Karışık",
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ConsumerPaymentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id, paymentStatus: "SUCCESS" },
    include: { box: { include: { business: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalSaved = orders.reduce((sum, o) => {
    return sum + (o.box.originalPrice - o.box.discountedPrice) * o.quantity;
  }, 0);

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto pb-8 space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900">💳 Ödeme Geçmişim</h1>
        <p className="mt-1 text-sm text-stone-500">Tüm ödenen siparişlerin</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 text-center">
          <p className="text-2xl font-extrabold text-stone-900">₺{totalSpent.toFixed(2)}</p>
          <p className="mt-0.5 text-xs text-stone-500">Toplam Ödeme</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100 text-center">
          <p className="text-2xl font-extrabold text-emerald-700">₺{totalSaved.toFixed(2)}</p>
          <p className="mt-0.5 text-xs text-emerald-600">Toplam Tasarruf</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-100">
          <p className="text-stone-400 text-sm">Henüz ödenen siparişin yok.</p>
          <Link href="/consumer" className="mt-3 inline-block text-sm text-emerald-600 font-medium hover:underline">
            Kutu keşfet →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const saved = (order.box.originalPrice - order.box.discountedPrice) * order.quantity;
            return (
              <Link
                key={order.id}
                href={`/consumer/orders/${order.id}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 hover:ring-emerald-200 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 truncate">
                    {BOX_LABELS[order.box.category] ?? order.box.category} — {order.box.business.name}
                  </p>
                  <p className="text-xs text-stone-500">{fmtDate(order.createdAt)} · {order.quantity} kutu</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-stone-900">₺{order.totalPrice.toFixed(2)}</p>
                  <p className="text-xs text-emerald-600">₺{saved.toFixed(2)} tasarruf</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
