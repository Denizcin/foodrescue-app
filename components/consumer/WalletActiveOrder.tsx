"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Order, User } from "@/lib/types";
import ImpactBadge from "@/components/shared/ImpactBadge";
import PickupCountdown from "@/components/shared/PickupCountdown";
import { cancelOrder } from "@/lib/actions";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });
}

function statusBadge(status: Order["status"]) {
  if (status === "PICKED_UP")
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">✓ Teslim Edildi</span>;
  if (status === "CANCELLED")
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">✕ İptal Edildi</span>;
  return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">⏳ Bekliyor</span>;
}

export default function WalletActiveOrder({
  orders: initialOrders,
  user,
}: {
  orders: Order[];
  user: Pick<User, "impactSavedMoney" | "impactCo2" | "impactFood">;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const [pastOpen, setPastOpen] = useState(false);

  const myPending = orders.filter((o) => o.status === "PENDING");
  const myPast = orders.filter((o) => o.status !== "PENDING");

  function handleCopy(code: string) {
    copyToClipboard(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleCancel(orderId: string) {
    setCancelLoading(orderId);
    const result = await cancelOrder(orderId);
    setCancelLoading(null);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "CANCELLED" as const } : o
        )
      );
      router.refresh();
    }
    setConfirmCancel(null);
  }

  return (
    <div className="px-4 pt-5 space-y-5 max-w-lg mx-auto">
      {/* Impact stats at top */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
          Toplam Katkın
        </p>
        <ImpactBadge
          savedMoney={user.impactSavedMoney}
          co2={user.impactCo2}
          food={user.impactFood}
        />
      </div>

      {/* Active orders section */}
      <div>
        <h2 className="text-lg font-extrabold text-stone-900">Aktif Siparişlerin</h2>

        {myPending.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-white py-10 ring-1 ring-stone-100">
            <span className="text-4xl">📭</span>
            <p className="text-sm text-stone-500 text-center px-6">
              Aktif siparişin yok. Kutuları keşfet ve biraz yemek kurtar!
            </p>
            <Link
              href="/consumer"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Kutuları Keşfet
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {myPending.map((order) => {
              const box = order.box;
              const pickupEnd = box?.pickupTimeEnd ?? new Date().toISOString();
              const isExpired = new Date() > new Date(pickupEnd);

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white p-4 ring-1 ring-stone-100 shadow-sm space-y-3"
                >
                  {/* Business + box name */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">
                        {box?.business?.name ?? "İşletme"}
                      </p>
                      <p className="text-xs text-stone-400">{box?.business?.address}</p>
                    </div>
                    {statusBadge(order.status)}
                  </div>

                  {/* Large pickup code */}
                  <div className="rounded-xl bg-emerald-50 py-4 ring-1 ring-emerald-100 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                      Teslim Alma Kodun
                    </p>
                    <p className="mt-1 font-mono text-4xl font-extrabold tracking-[0.3em] text-stone-900">
                      {order.pickupCode}
                    </p>
                    <button
                      onClick={() => handleCopy(order.pickupCode)}
                      className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50 transition-colors"
                    >
                      {copied === order.pickupCode ? "✓ Kopyalandı!" : "Kodu Kopyala"}
                    </button>
                  </div>

                  {/* Pickup window + countdown */}
                  <div className="flex flex-col gap-1 text-sm text-stone-600">
                    <span>
                      🕐{" "}
                      {box
                        ? `${formatTime(box.pickupTimeStart)} – ${formatTime(box.pickupTimeEnd)} kadar teslim al`
                        : "—"}
                    </span>
                    {box && (
                      <PickupCountdown
                        targetTime={box.pickupTimeEnd}
                        label={isExpired ? undefined : undefined}
                      />
                    )}
                  </div>

                  {/* Total price */}
                  <p className="text-xs text-stone-400">
                    {order.quantity} kutu · Toplam{" "}
                    <span className="font-semibold text-stone-700">₺{order.totalPrice}</span>
                  </p>

                  {/* Directions link */}
                  {box?.business?.locationLat && box?.business?.locationLng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${box.business.locationLat},${box.business.locationLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 ring-1 ring-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      🗺️ Yol Tarifi Al
                    </a>
                  )}

                  {/* Cancel button — only for non-expired PENDING orders */}
                  {!isExpired && (
                    <button
                      onClick={() => setConfirmCancel(order.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 underline"
                    >
                      Siparişi İptal Et
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past orders collapsible */}
      {myPast.length > 0 && (
        <div>
          <button
            onClick={() => setPastOpen((o) => !o)}
            className="flex w-full items-center justify-between text-sm font-semibold text-stone-600 hover:text-stone-900"
          >
            <span>Geçmiş Siparişler ({myPast.length})</span>
            <span className="text-lg">{pastOpen ? "▲" : "▼"}</span>
          </button>

          {pastOpen && (
            <div className="mt-3 flex flex-col gap-3">
              {myPast.map((order) => {
                const box = order.box;
                const savings = box
                  ? (box.originalPrice - box.discountedPrice) * order.quantity
                  : 0;
                const BOX_EMOJI: Record<string, string> = {
                  BAKERY: "🥐", SUSHI: "🍣", GROCERY: "🛒", DELI: "🥩",
                  CAFE: "☕", PREPARED_MEAL: "🍱", PRODUCE: "🥕", MIXED: "🎁",
                };
                const boxEmoji = box ? (BOX_EMOJI[box.category] ?? "🎁") : "🎁";
                const steps = [
                  { label: "Sipariş Verildi", done: true },
                  { label: "Teslim Alındı", done: order.status === "PICKED_UP" },
                ];

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-white p-4 ring-1 ring-stone-100 shadow-sm space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">
                          {box?.business?.name ?? "İşletme"}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">{box?.business?.address}</p>
                      </div>
                      {statusBadge(order.status)}
                    </div>

                    {/* Box info */}
                    <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2.5">
                      <span className="text-2xl">{boxEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-700">
                          Sürpriz Kutu · {order.quantity} adet
                        </p>
                        {box && (
                          <p className="text-xs text-stone-400 mt-0.5">
                            🕐 {formatTime(box.pickupTimeStart)} – {formatTime(box.pickupTimeEnd)}{" "}
                            · {new Date(box.pickupTimeStart).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price + savings */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-stone-900">₺{order.totalPrice}</span>
                        {box && (
                          <span className="text-xs text-stone-400 line-through">
                            ₺{(box.originalPrice * order.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {savings > 0 && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          💰 ₺{savings.toFixed(2)} tasarruf
                        </span>
                      )}
                    </div>

                    {/* Status timeline */}
                    {order.status !== "CANCELLED" && (
                      <div className="flex items-center">
                        {steps.map((step, i) => (
                          <div key={step.label} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${step.done ? "bg-emerald-500" : "bg-stone-200"}`}>
                                {step.done ? "✓" : ""}
                              </div>
                              <p className={`mt-1 text-[10px] font-medium whitespace-nowrap ${step.done ? "text-emerald-600" : "text-stone-400"}`}>
                                {step.label}
                              </p>
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`flex-1 h-0.5 mb-4 mx-1 ${steps[i + 1].done ? "bg-emerald-400" : "bg-stone-200"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Code + date */}
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Kod: <span className="font-mono font-semibold text-stone-600">{order.pickupCode}</span></span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Cancel confirmation dialog */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-900 text-center">
              Siparişi iptal et?
            </h3>
            <p className="text-sm text-stone-500 text-center">
              Bu işlem geri alınamaz. Siparişin iptal edilecek.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmCancel(null)}
                className="flex-1 rounded-full border border-stone-200 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                Vazgeç
              </button>
              <button
                onClick={() => handleCancel(confirmCancel)}
                disabled={cancelLoading === confirmCancel}
                className="flex-1 rounded-full bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {cancelLoading === confirmCancel ? "İptal ediliyor..." : "İptal Et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
