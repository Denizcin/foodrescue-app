import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sipariş Detayı",
  robots: { index: false, follow: false },
};

const BOX_LABELS: Record<string, string> = {
  BAKERY: "Fırın", SUSHI: "Suşi", GROCERY: "Market", DELI: "Şarküteri",
  CAFE: "Kafe", PREPARED_MEAL: "Hazır Yemek", PRODUCE: "Manav", MIXED: "Karışık",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Bekliyor", color: "bg-amber-100 text-amber-800" },
  PICKED_UP: { label: "Teslim Alındı", color: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "İptal", color: "bg-red-100 text-red-800" },
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      box: { include: { business: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: "bg-stone-100 text-stone-700" };
  const boxLabel = BOX_LABELS[order.box.category] ?? order.box.category;
  const discount = ((order.box.originalPrice - order.box.discountedPrice) / order.box.originalPrice) * 100;
  const savedAmount = (order.box.originalPrice - order.box.discountedPrice) * order.quantity;

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto pb-8 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/consumer/orders" className="text-sm text-stone-500 hover:text-stone-700">
          ← Siparişlerim
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h1 className="text-lg font-extrabold text-stone-900">{boxLabel} Kutusu</h1>
            <p className="text-sm text-stone-500">{order.box.business.name}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Pickup code — show for pending orders */}
        {order.status === "PENDING" && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center mb-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-1">
              Teslim Alma Kodun
            </p>
            <p className="font-mono text-4xl font-extrabold tracking-widest text-stone-900">
              {order.pickupCode}
            </p>
            <p className="text-xs text-stone-500 mt-1">Bu kodu işletmeye göster</p>
          </div>
        )}

        {/* Order details */}
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-stone-50">
              <td className="py-2 text-stone-500">Sipariş No</td>
              <td className="py-2 font-mono text-xs text-stone-700 text-right">{order.id.slice(-10).toUpperCase()}</td>
            </tr>
            <tr className="border-b border-stone-50">
              <td className="py-2 text-stone-500">Tarih</td>
              <td className="py-2 font-medium text-stone-800 text-right">{fmtDate(order.createdAt)}</td>
            </tr>
            <tr className="border-b border-stone-50">
              <td className="py-2 text-stone-500">Adet</td>
              <td className="py-2 font-medium text-stone-800 text-right">{order.quantity} kutu</td>
            </tr>
            <tr className="border-b border-stone-50">
              <td className="py-2 text-stone-500">Teslim Penceresi</td>
              <td className="py-2 font-medium text-stone-800 text-right">
                {fmtTime(order.box.pickupTimeStart)} – {fmtTime(order.box.pickupTimeEnd)}
              </td>
            </tr>
            <tr className="border-b border-stone-50">
              <td className="py-2 text-stone-500">Orijinal Fiyat</td>
              <td className="py-2 text-stone-500 text-right line-through">
                ₺{(order.box.originalPrice * order.quantity).toFixed(2)}
              </td>
            </tr>
            <tr className="border-b border-stone-50">
              <td className="py-2 text-stone-500">İndirim</td>
              <td className="py-2 font-medium text-emerald-600 text-right">
                %{Math.round(discount)} · ₺{savedAmount.toFixed(2)} tasarruf
              </td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-stone-900">Ödenen Tutar</td>
              <td className="py-2.5 font-extrabold text-emerald-700 text-right text-base">
                ₺{order.totalPrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Business info */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-2">
        <h2 className="text-sm font-bold text-stone-800">İşletme Bilgileri</h2>
        <div className="text-sm space-y-1">
          <p className="font-medium text-stone-800">{order.box.business.name}</p>
          <p className="text-stone-500">{order.box.business.address}</p>
          {order.box.business.phone && (
            <p className="text-stone-500">{order.box.business.phone}</p>
          )}
          <p className="text-stone-500">{order.box.business.operatingHours}</p>
        </div>
      </div>

      {/* Payment info */}
      {order.paymentId && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-2">
          <h2 className="text-sm font-bold text-stone-800">Ödeme Bilgileri</h2>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500">Ödeme ID</span>
              <span className="font-mono text-xs text-stone-700">{order.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Durum</span>
              <span className={`text-xs font-semibold ${order.paymentStatus === "SUCCESS" ? "text-emerald-600" : "text-stone-600"}`}>
                {order.paymentStatus === "SUCCESS" ? "Ödendi" : order.paymentStatus ?? "—"}
              </span>
            </div>
            {order.refundId && (
              <div className="flex justify-between">
                <span className="text-stone-500">İade ID</span>
                <span className="font-mono text-xs text-stone-700">{order.refundId}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Impact */}
      <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100 text-center">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Bu Siparişin Etkisi</p>
        <p className="text-sm text-emerald-800">
          🌍 <strong>₺{savedAmount.toFixed(2)}</strong> tasarruf ·{" "}
          🌱 <strong>{(order.quantity * 2.5).toFixed(1)} kg</strong> CO₂ azalması ·{" "}
          🥗 <strong>{order.quantity} kg</strong> kurtarılan gıda
        </p>
      </div>

      <p className="text-center text-xs text-stone-400 pb-4">
        Gıda israfını önlediğin için teşekkürler! · FoodRescue
      </p>
    </div>
  );
}
