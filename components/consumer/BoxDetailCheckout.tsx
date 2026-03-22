"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryBadge from "@/components/shared/CategoryBadge";
import PaymentCheckout from "@/components/consumer/PaymentCheckout";
import { createOrder } from "@/lib/actions";
import { initiatePayment } from "@/lib/payment-actions";
import type { SurpriseBox } from "@/lib/types";

const CATEGORY_GRADIENT: Record<string, string> = {
  BAKERY:        "from-amber-400 to-amber-300",
  SUSHI:         "from-pink-400 to-rose-300",
  GROCERY:       "from-blue-400 to-sky-300",
  DELI:          "from-red-400 to-orange-300",
  CAFE:          "from-stone-400 to-stone-300",
  PREPARED_MEAL: "from-orange-400 to-amber-300",
  PRODUCE:       "from-green-400 to-emerald-300",
  MIXED:         "from-purple-400 to-violet-300",
};

const BOX_EMOJI: Record<string, string> = {
  BAKERY: "🥐", SUSHI: "🍣", GROCERY: "🛒", DELI: "🥩",
  CAFE: "☕", PREPARED_MEAL: "🍱", PRODUCE: "🥕", MIXED: "🎁",
};

const CONFETTI = ["🎉", "🎊", "✨", "🌟", "🎁", "💚", "🥳", "🍀"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

export default function BoxDetailCheckout({ box }: { box: SurpriseBox | null }) {
  const [quantity, setQuantity] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [pickupCode, setPickupCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [checkoutFormContent, setCheckoutFormContent] = useState<string | null>(null);

  if (!box) {
    return (
      <div className="flex flex-col items-center py-24 text-stone-400">
        <p className="text-5xl">😕</p>
        <p className="mt-4 text-base font-semibold text-stone-600">Kutu bulunamadı.</p>
        <p className="mt-1 text-sm text-stone-400">Bu kutu artık mevcut değil.</p>
        <Link
          href="/consumer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
        >
          ← Kutulara Dön
        </Link>
      </div>
    );
  }

  const now = new Date();
  const expired = now > new Date(box.pickupTimeEnd);
  const soldOut = box.stockQuantity === 0;
  const unavailable = expired || soldOut;
  const maxQty = Math.min(3, box.stockQuantity);
  const savings = box.originalPrice - box.discountedPrice;
  const total = box.discountedPrice * quantity;
  const gradient = CATEGORY_GRADIENT[box.category] ?? "from-emerald-400 to-emerald-300";
  const emoji = BOX_EMOJI[box.category] ?? "🎁";
  const stockRatio = Math.min(1, box.stockQuantity / 10);
  const stockLow = box.stockQuantity > 0 && box.stockQuantity <= 3;

  async function handleBuy() {
    if (unavailable || !box) return;
    setLoading(true);
    setBuyError(null);

    const payResult = await initiatePayment(box.id, quantity);

    if (payResult.success) {
      setLoading(false);
      setCheckoutFormContent(payResult.data.checkoutFormContent);
      return;
    }

    if (payResult.error !== "IYZICO_NOT_CONFIGURED") {
      setLoading(false);
      setBuyError(payResult.error);
      return;
    }

    const result = await createOrder({ boxId: box.id, quantity });
    setLoading(false);
    if (result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const order = result.data as any;
      setPickupCode(order.pickupCode);
      setShowModal(true);
    } else {
      setBuyError(result.error);
    }
  }

  return (
    <>
      {/* Extra bottom padding so sticky buy bar doesn't overlap content */}
      <div className="mx-auto max-w-lg pb-32">

        {/* ── Header ── */}
        <div className={`relative flex h-52 items-center justify-center bg-gradient-to-br ${gradient} overflow-hidden`}>
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

          <span className="relative text-8xl drop-shadow-sm">{emoji}</span>

          {/* Unavailable overlay */}
          {unavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <span className="rounded-xl bg-white px-5 py-2 text-base font-extrabold text-stone-800">
                {soldOut ? "Tükendi" : "Süre Doldu"}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 py-5 space-y-4">

          {/* ── Business info ── */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 leading-tight">
                {box.business?.name ?? "İşletme"}
              </h1>
              <p className="mt-1 text-sm text-stone-500 truncate">{box.business?.address}</p>
            </div>
            {box.business && <CategoryBadge category={box.business.category} />}
          </div>

          {/* Category badge */}
          <CategoryBadge category={box.category} />

          {/* ── Price block ── */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-stone-100 shadow-sm">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-emerald-600 leading-none">
                ₺{box.discountedPrice}
              </span>
              <span className="mb-1 text-lg text-stone-400 line-through">₺{box.originalPrice}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 ring-1 ring-amber-200">
              <span className="text-base">💰</span>
              <span className="text-sm font-bold text-amber-700">
                ₺{savings} tasarruf ediyorsun!
              </span>
            </div>
          </div>

          {/* ── Pickup window ── */}
          <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white">
                📅
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Gel-Al · Teslim Alma Penceresi
                </p>
                <p className="mt-0.5 text-base font-semibold text-stone-800">
                  {formatTime(box.pickupTimeStart)} – {formatTime(box.pickupTimeEnd)}
                </p>
                <p className="text-xs text-stone-400">{formatDate(box.pickupTimeStart)}</p>
              </div>
            </div>
          </div>

          {/* ── Directions link ── */}
          {box.business?.locationLat && box.business?.locationLng && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${box.business.locationLat},${box.business.locationLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 ring-1 ring-blue-100 hover:bg-blue-100 active:scale-95 transition-all"
            >
              🗺️ Yol Tarifi Al
            </a>
          )}

          {/* ── Stock indicator ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={`font-semibold ${stockLow ? "text-amber-600" : soldOut ? "text-red-500" : "text-stone-600"}`}>
                {soldOut
                  ? "⛔ Stok tükendi"
                  : stockLow
                  ? `⚠️ Son ${box.stockQuantity} kutu!`
                  : `📦 ${box.stockQuantity} kutu mevcut`}
              </span>
              <span className="text-xs text-stone-400">{box.stockQuantity} / 10</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  soldOut ? "bg-stone-300" : stockLow ? "bg-amber-400" : "bg-emerald-500"
                }`}
                style={{ width: `${stockRatio * 100}%` }}
              />
            </div>
          </div>

          {/* ── Surprise disclaimer (required) ── */}
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <p className="text-sm leading-relaxed text-amber-800">
              <strong>⚠️ Sürpriz Kutu!</strong> İçindeki ürünler garanti edilmez ve işletmenin
              günün sonunda kalan ürünlerine göre değişiklik gösterir. Kutunun içeriği
              sürprizdir — bu deneyimin bir parçası!
            </p>
          </div>

          {/* ── Allergen warning ── */}
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
            <p className="text-sm leading-relaxed text-red-800">
              <strong>🚨 Alerjen Uyarısı:</strong> Sürpriz kutular gluten, süt, yumurta, fındık,
              fıstık, susam, soya, balık ve diğer alerjenleri içerebilir. Gıda alerjisi veya
              intoleransı olan kişilerin satın alma öncesinde işletme ile iletişime geçmesi önerilir.
            </p>
          </div>

          {/* ── Merchant description ── */}
          {box.description && (
            <div className="rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
                İşletme Notu
              </p>
              <p className="text-sm italic text-stone-600">&ldquo;{box.description}&rdquo;</p>
            </div>
          )}

          {/* ── Quantity selector ── */}
          {!unavailable && (
            <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 ring-1 ring-stone-100 shadow-sm">
              <div>
                <p className="text-sm font-bold text-stone-800">Adet</p>
                <p className="text-xs text-stone-400">Maks. 3 kutu</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-xl font-bold text-stone-600 hover:bg-stone-200 active:scale-90 disabled:opacity-30 transition-all"
                >
                  −
                </button>
                <span className="w-6 text-center text-xl font-extrabold text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-xl font-bold text-stone-600 hover:bg-stone-200 active:scale-90 disabled:opacity-30 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* ── Mesafeli satış checkbox ── */}
          {!unavailable && (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-stone-100">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
              />
              <span className="text-xs leading-relaxed text-stone-600">
                <a
                  href="/mesafeli-satis-sozlesmesi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-700 underline hover:text-emerald-800"
                >
                  Mesafeli Satış Sözleşmesi
                </a>
                &apos;ni okudum ve kabul ediyorum. Sürpriz kutu niteliğini ve cayma hakkının
                gıda ürünleri için geçerli olmadığını anlıyorum.
              </span>
            </label>
          )}

          {buyError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
              <p className="text-sm font-medium text-red-700">{buyError}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky buy bar (above consumer nav) ── */}
      {!checkoutFormContent && !showModal && (
        <div className="fixed bottom-[60px] left-0 right-0 z-30 mx-auto max-w-lg border-t border-stone-100 bg-white/95 px-4 py-3 backdrop-blur-md shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-stone-400">Toplam tutar</p>
              <p className="text-2xl font-black text-stone-900 leading-none tabular-nums">
                ₺{total.toFixed(2)}
              </p>
            </div>
            {!unavailable && quantity > 1 && (
              <p className="text-xs text-amber-600 font-semibold">
                {quantity} × ₺{box.discountedPrice}
              </p>
            )}
          </div>
          <button
            onClick={handleBuy}
            disabled={unavailable || loading || !agreedToTerms}
            className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-md shadow-emerald-200/60 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
          >
            {loading
              ? "İşleniyor..."
              : soldOut
              ? "⛔ Tükendi"
              : expired
              ? "⏱ Teslim alma süresi doldu"
              : unavailable
              ? "Mevcut Değil"
              : "Satın Al ve Rezerve Et →"}
          </button>
        </div>
      )}

      {/* ── iyzico payment form overlay ── */}
      {checkoutFormContent && (
        <PaymentCheckout
          checkoutFormContent={checkoutFormContent}
          onCancel={() => setCheckoutFormContent(null)}
        />
      )}

      {/* ── Success modal ── */}
      {showModal && pickupCode && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 sm:items-center">
          <div className="w-full max-w-sm animate-scale-in rounded-3xl bg-white p-6 shadow-2xl">

            {/* Confetti row */}
            <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
              {CONFETTI.map((c, i) => (
                <span
                  key={i}
                  className="text-xl animate-bounce"
                  style={{ animationDelay: `${i * 80}ms`, animationDuration: "800ms" }}
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                ✅
              </div>
              <h2 className="text-xl font-extrabold text-stone-900">Siparişin alındı!</h2>
              <p className="mt-1 text-sm text-stone-500">
                {box.business?.name} · {formatTime(box.pickupTimeStart)} – {formatTime(box.pickupTimeEnd)}
              </p>
            </div>

            {/* Pickup code */}
            <div className="mt-5 rounded-2xl bg-emerald-50 py-5 text-center ring-1 ring-emerald-200">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Teslim Alma Kodun
              </p>
              <p className="mt-2 font-mono text-4xl font-extrabold tracking-[0.3em] text-stone-900">
                {pickupCode}
              </p>
              <p className="mt-1 text-xs text-stone-400">Bu kodu kasada göster</p>
            </div>

            <p className="mt-4 text-center text-xs text-stone-400">
              ⚠️ Ödeme bu ekranda gerçekleşti. Mağazada tekrar ödeme yapma.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-700 active:scale-95 transition-all"
            >
              Tamam, gidiyorum! 🚶
            </button>
          </div>
        </div>
      )}
    </>
  );
}
