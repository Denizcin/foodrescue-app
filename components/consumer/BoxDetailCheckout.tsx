"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryBadge from "@/components/shared/CategoryBadge";
import PaymentCheckout from "@/components/consumer/PaymentCheckout";
import { createOrder } from "@/lib/actions";
import { initiatePayment } from "@/lib/payment-actions";
import type { SurpriseBox } from "@/lib/types";

// Box category gradient colours for the header placeholder
const CATEGORY_GRADIENT: Record<string, string> = {
  BAKERY:        "from-amber-100 to-amber-50",
  SUSHI:         "from-pink-100 to-pink-50",
  GROCERY:       "from-blue-100 to-blue-50",
  DELI:          "from-red-100 to-red-50",
  CAFE:          "from-stone-100 to-stone-50",
  PREPARED_MEAL: "from-orange-100 to-orange-50",
  PRODUCE:       "from-green-100 to-green-50",
  MIXED:         "from-purple-100 to-purple-50",
};

const BOX_EMOJI: Record<string, string> = {
  BAKERY: "🥐", SUSHI: "🍣", GROCERY: "🛒", DELI: "🥩",
  CAFE: "☕", PREPARED_MEAL: "🍱", PRODUCE: "🥕", MIXED: "🎁",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
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
        <p className="text-2xl">😕</p>
        <p className="mt-2 text-sm">Kutu bulunamadı.</p>
        <Link href="/consumer" className="mt-4 text-sm text-emerald-600 underline">
          Ana sayfaya dön
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
  const gradient = CATEGORY_GRADIENT[box.category] ?? "from-emerald-100 to-emerald-50";
  const emoji = BOX_EMOJI[box.category] ?? "🎁";

  async function handleBuy() {
    if (unavailable || !box) return;
    setLoading(true);
    setBuyError(null);

    // Try iyzico first; fall back to direct order if keys are not configured (dev mode).
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

    // iyzico not configured — fall back to mock order creation (dev/sandbox without keys)
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
    <div className="mx-auto max-w-lg">
      {/* Header image placeholder */}
      <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-7xl">{emoji}</span>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Business info */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-stone-900">
              {box.business?.name ?? "İşletme"}
            </h1>
            <p className="mt-0.5 text-sm text-stone-500">{box.business?.address}</p>
          </div>
          {box.business && <CategoryBadge category={box.business.category} />}
        </div>

        {/* Box category badge */}
        <div>
          <CategoryBadge category={box.category} />
        </div>

        {/* Price block */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-100 space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-base text-stone-400 line-through">₺{box.originalPrice}</span>
            <span className="text-3xl font-extrabold text-emerald-600">₺{box.discountedPrice}</span>
          </div>
          <p className="text-sm font-semibold text-amber-600">
            💰 ₺{savings} tasarruf ediyorsun!
          </p>
        </div>

        {/* Pickup window */}
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
          <span className="text-2xl">🕐</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Gel-Al · Teslim Alma Penceresi
            </p>
            <p className="text-sm text-stone-700">
              {formatTime(box.pickupTimeStart)} – {formatTime(box.pickupTimeEnd)}
            </p>
          </div>
        </div>

        {/* Directions link — uses business coordinates, no API key needed */}
        {box.business?.locationLat && box.business?.locationLng && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${box.business.locationLat},${box.business.locationLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 ring-1 ring-blue-100 hover:bg-blue-100 transition-colors"
          >
            🗺️ Yol Tarifi Al
          </a>
        )}

        {/* Stock */}
        <p className={`text-sm font-medium ${box.stockQuantity <= 3 ? "text-amber-500" : "text-stone-500"}`}>
          {box.stockQuantity <= 3 && box.stockQuantity > 0
            ? `⚠️ Son ${box.stockQuantity} kutu!`
            : `📦 ${box.stockQuantity} kutu kaldı`}
        </p>

        {/* ⚠️ Required surprise disclaimer */}
        <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>⚠️ Sürpriz Kutu!</strong> Bu bir Sürpriz Kutu! İçindeki ürünler garanti
            edilmez ve işletmenin günün sonunda kalan ürünlerine göre değişiklik gösterir.
            Sürpriz olan da bu zaten!
          </p>
        </div>

        {/* Allergen warning */}
        <div className="rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
          <p className="text-sm text-red-800 leading-relaxed">
            <strong>🚨 Alerjen Uyarısı:</strong> Sürpriz kutular gluten, süt, yumurta, fındık,
            fıstık, susam, soya, balık ve diğer alerjenleri içerebilir. İçerik önceden
            bilinmediğinden gıda alerjisi veya intoleransı olan kişilerin satın alma öncesinde
            işletme ile doğrudan iletişime geçmesi önerilir.
          </p>
        </div>

        {/* Merchant description (if present) */}
        {box.description && (
          <p className="text-sm italic text-stone-500">
            &ldquo;{box.description}&rdquo;
          </p>
        )}

        {/* Quantity selector */}
        <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-stone-100">
          <span className="text-sm font-medium text-stone-700">Adet</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg font-bold text-stone-600 hover:bg-stone-200 disabled:opacity-30"
            >
              −
            </button>
            <span className="w-4 text-center text-lg font-bold text-stone-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg font-bold text-stone-600 hover:bg-stone-200 disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        {/* Total + buy button */}
        <div className="space-y-3">
          <p className="text-right text-sm text-stone-500">
            Toplam:{" "}
            <span className="text-xl font-extrabold text-stone-900">₺{total.toFixed(2)}</span>
          </p>

          {/* Mesafeli Satış Sözleşmesi checkbox */}
          {!unavailable && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-stone-100">
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
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-200">
              {buyError}
            </p>
          )}
          <button
            onClick={handleBuy}
            disabled={unavailable || loading || (!unavailable && !agreedToTerms)}
            className="w-full rounded-full bg-emerald-600 py-4 text-base font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
          >
            {loading
              ? "İşleniyor..."
              : soldOut
              ? "Tükendi"
              : expired
              ? "Teslim alma süresi doldu"
              : "Satın Al ve Rezerve Et"}
          </button>
        </div>
      </div>

      {/* iyzico payment form overlay */}
      {checkoutFormContent && (
        <PaymentCheckout
          checkoutFormContent={checkoutFormContent}
          onCancel={() => setCheckoutFormContent(null)}
        />
      )}

      {/* Success modal with pickup code */}
      {showModal && pickupCode && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                ✅
              </div>
              <h2 className="text-xl font-extrabold text-stone-900">Siparişin alındı!</h2>
              <p className="mt-1 text-sm text-stone-500">
                {box.business?.name} · {formatTime(box.pickupTimeStart)} – {formatTime(box.pickupTimeEnd)}
              </p>
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-50 py-5 text-center ring-1 ring-emerald-200">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Teslim Alma Kodun
              </p>
              <p className="mt-2 font-mono text-4xl font-extrabold tracking-[0.3em] text-stone-900">
                {pickupCode}
              </p>
              <p className="mt-1 text-xs text-stone-400">Bu kodu işletmeye göster</p>
            </div>

            <p className="mt-4 text-center text-xs text-stone-400">
              ⚠️ Ödeme bu ekranda gerçekleşti. Mağazada tekrar ödeme yapma.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full rounded-full bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Tamam, gidiyorum!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
