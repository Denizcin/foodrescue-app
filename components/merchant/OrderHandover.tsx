"use client";

import { useEffect, useRef, useState } from "react";
import { maskPickupCode } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { verifyPickupCode, completeOrder } from "@/lib/actions";

interface OrderWithDetails extends Order {
  user?: { name: string } | null;
}

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
          o.id === matchedOrder.id
            ? { ...o, status: "PICKED_UP" as OrderStatus }
            : o
        )
      );
      setMatchedOrder(null);
      setResult("idle");
      setCode("");
      inputRef.current?.focus();
    }
  }

  const statusBadge: Record<OrderStatus, { label: string; className: string }> =
    {
      PENDING: { label: "Bekliyor", className: "bg-amber-100 text-amber-700" },
      PICKED_UP: {
        label: "Teslim Edildi ✓",
        className: "bg-emerald-100 text-emerald-700",
      },
      CANCELLED: {
        label: "İptal Edildi",
        className: "bg-red-100 text-red-600",
      },
    };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-xl font-bold text-stone-900">
          Teslim Alma Doğrulama
        </h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Müşterinin gösterdiği 6 haneli kodu girin.
        </p>
      </div>

      {/* Code input */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 space-y-4">
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
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-center font-mono text-3xl font-bold tracking-[0.3em] text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 uppercase"
          placeholder="——————"
          autoComplete="off"
          spellCheck={false}
        />

        <button
          onClick={handleVerify}
          disabled={code.length < 6 || verifying}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {verifying ? "Doğrulanıyor..." : "Doğrula ve Tamamla"}
        </button>

        {/* Success result */}
        {result === "success" && matchedOrder && (
          <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200 space-y-3">
            <p className="text-sm font-semibold text-emerald-800">
              ✅ Sipariş bulundu!
            </p>
            <div className="text-sm text-stone-700 space-y-1">
              <p>
                <span className="text-stone-500">Müşteri:</span>{" "}
                {matchedOrder.user?.name ?? "—"}
              </p>
              <p>
                <span className="text-stone-500">Kutu:</span>{" "}
                {matchedOrder.box?.category ?? "—"}
              </p>
              <p>
                <span className="text-stone-500">Adet:</span>{" "}
                {matchedOrder.quantity}
              </p>
              <p>
                <span className="text-stone-500">Toplam:</span> ₺
                {matchedOrder.totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {confirming ? "Onaylanıyor..." : "Teslimi Onayla"}
            </button>
          </div>
        )}

        {/* Error result */}
        {result === "error" && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
            ❌ Eşleşen sipariş bulunamadı. Lütfen kodu kontrol edin.
          </div>
        )}
      </div>

      {/* Today's orders list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Bugünün Siparişleri
        </h2>

        {orders.length === 0 ? (
          <p className="text-sm text-stone-400">Henüz sipariş yok.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => {
              const badge = statusBadge[order.status];
              const displayCode =
                order.status === "PICKED_UP"
                  ? order.pickupCode
                  : maskPickupCode(order.pickupCode);

              return (
                <div
                  key={order.id}
                  className={`flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-stone-100 ${
                    order.status === "CANCELLED" ? "opacity-50" : ""
                  }`}
                >
                  <div className="space-y-0.5">
                    <p
                      className={`text-sm font-bold font-mono tracking-widest ${
                        order.status === "CANCELLED"
                          ? "line-through text-stone-400"
                          : "text-stone-800"
                      }`}
                    >
                      {displayCode}
                    </p>
                    <p className="text-xs text-stone-500">
                      {order.user?.name ?? "—"} · {order.box?.category ?? "—"}{" "}
                      · {order.quantity} adet
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
