"use client";

import { useEffect, useRef, useState } from "react";
import { maskPickupCode } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { verifyPickupCode, completeOrder } from "@/lib/actions";

interface OrderWithDetails extends Order {
  user?: { name: string } | null;
}

const BOX_LABELS: Record<string, string> = {
  BAKERY: "Fırın", PATISSERIE: "Pastane", CAFE: "Kafe",
};

const STATUS_BADGE: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: "Bekliyor",       className: "bg-amber-100 text-amber-700" },
  PICKED_UP: { label: "Teslim Edildi ✓",className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "İptal Edildi",   className: "bg-red-100 text-red-600" },
};

export default function OrderHandover({
  initialOrders,
}: {
  initialOrders: OrderWithDetails[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState<OrderWithDetails[]>(initialOrders);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [matchedOrder, setMatchedOrder] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleVerify() {
    if (code.length < 6) return;
    setVerifying(true);
    const res = await verifyPickupCode({ pickupCode: code });
    setVerifying(false);
    if (res.success) {
      setMatchedOrder(res.data);
      setResult("success");
    } else {
      setMatchedOrder(null);
      setResult("error");
    }
  }

  async function handleConfirm() {
    if (!matchedOrder) return;
    setConfirming(true);
    const res = await completeOrder(matchedOrder.id);
    setConfirming(false);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === matchedOrder.id ? { ...o, status: "PICKED_UP" as OrderStatus } : o
        )
      );
      setMatchedOrder(null);
      setResult("idle");
      setCode("");
      inputRef.current?.focus();
    }
  }

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const pickedUpCount = orders.filter((o) => o.status === "PICKED_UP").length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900">Teslim Alma Doğrulama</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Müşterinin gösterdiği 6 haneli kodu girin ve siparişi tamamlayın.
        </p>
      </div>

      {/* Code input card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 text-center">
          Teslim Alma Kodu
        </p>

        <input
          ref={inputRef}
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
            setResult("idle");
            setMatchedOrder(null);
          }}
          className="w-full rounded-2xl border-2 border-stone-200 bg-stone-50 px-4 py-5 text-center font-mono text-4xl font-black tracking-[0.5em] text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 uppercase placeholder-stone-300 transition-all"
          placeholder="——————"
          autoComplete="off"
          spellCheck={false}
        />

        <button
          onClick={handleVerify}
          disabled={code.length < 6 || verifying}
          className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {verifying ? "Doğrulanıyor..." : "Doğrula ve Tamamla →"}
        </button>

        {/* Success result */}
        {result === "success" && matchedOrder && (
          <div className="rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-lg">
                ✅
              </div>
              <div>
                <p className="text-sm font-extrabold text-emerald-800">Sipariş bulundu!</p>
                <p className="text-xs text-emerald-600">Aşağıdaki bilgileri doğrulayın</p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 ring-1 ring-emerald-100 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Müşteri</span>
                <span className="font-semibold text-stone-800">
                  {matchedOrder.user?.name ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Kutu</span>
                <span className="font-semibold text-stone-800">
                  {BOX_LABELS[matchedOrder.box?.category] ?? matchedOrder.box?.category ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Adet</span>
                <span className="font-semibold text-stone-800">{matchedOrder.quantity}</span>
              </div>
              <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                <span className="text-stone-500 font-medium">Toplam</span>
                <span className="text-base font-extrabold text-emerald-700">
                  ₺{matchedOrder.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {confirming ? "Onaylanıyor..." : "Teslimi Onayla ✓"}
            </button>
          </div>
        )}

        {/* Error result */}
        {result === "error" && (
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg">
              ❌
            </div>
            <div>
              <p className="text-sm font-bold text-red-800">Sipariş bulunamadı</p>
              <p className="mt-0.5 text-xs text-red-600">
                Bu koda ait aktif bir sipariş yok. Kodu tekrar kontrol edin.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Today's orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Bugünün Siparişleri
          </h2>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                {pendingCount} bekliyor
              </span>
            )}
            {pickedUpCount > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {pickedUpCount} teslim edildi
              </span>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white py-12 text-center shadow-sm ring-1 ring-stone-100">
            <p className="text-2xl">📋</p>
            <p className="mt-2 text-sm text-stone-400">Henüz bugün sipariş yok.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
            <table className="min-w-full divide-y divide-stone-100 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Kod
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Müşteri
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Kutu
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Adet
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => {
                  const badge = STATUS_BADGE[order.status];
                  const displayCode =
                    order.status === "PICKED_UP"
                      ? order.pickupCode
                      : maskPickupCode(order.pickupCode);
                  return (
                    <tr
                      key={order.id}
                      className={[
                        "transition-colors hover:bg-stone-50",
                        order.status === "CANCELLED" ? "opacity-40" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "font-mono text-sm font-bold tracking-widest",
                            order.status === "CANCELLED"
                              ? "line-through text-stone-400"
                              : "text-stone-800",
                          ].join(" ")}
                        >
                          {displayCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {order.user?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {BOX_LABELS[order.box?.category ?? ""] ?? order.box?.category ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-stone-700">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
