"use client";

import { useState } from "react";
import type { BoxCategory, SurpriseBox } from "@/lib/types";
import { publishBox } from "@/lib/actions";
import { analytics } from "@/lib/analytics";

const CATEGORY_OPTIONS: {
  value: BoxCategory;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  { value: "BAKERY",        label: "Fırın",       emoji: "🥐", desc: "Ekmek, börek, unlu mamüller" },
  { value: "SUSHI",         label: "Suşi",        emoji: "🍣", desc: "Japon mutfağı, sushi rolls" },
  { value: "GROCERY",       label: "Market",      emoji: "🛒", desc: "Market, konserve ürünler" },
  { value: "DELI",          label: "Şarküteri",   emoji: "🥩", desc: "Et, peynir, şarküteri" },
  { value: "CAFE",          label: "Kafe",        emoji: "☕", desc: "İçecekler, sandviç, atıştırmalık" },
  { value: "PREPARED_MEAL", label: "Hazır Yemek", emoji: "🍱", desc: "Pişmiş hazır yemekler" },
  { value: "PRODUCE",       label: "Manav",       emoji: "🥕", desc: "Meyve ve sebze" },
  { value: "MIXED",         label: "Karışık",     emoji: "🎁", desc: "Çeşitli ürünler" },
];

interface FormState {
  category: BoxCategory;
  quantity: string;
  originalPrice: string;
  discountedPrice: string;
  pickupStart: string;
  pickupEnd: string;
  description: string;
}

const DEFAULT_FORM: FormState = {
  category: "BAKERY",
  quantity: "5",
  originalPrice: "",
  discountedPrice: "",
  pickupStart: "",
  pickupEnd: "",
  description: "",
};

function toLocalDT(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function getBounds() {
  const now = new Date();
  const min = toLocalDT(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 0, 0);
  const max = toLocalDT(tomorrow);
  return { min, max };
}

function formatPickupTime(isoStr: string) {
  return new Date(isoStr).toLocaleString("tr-TR", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function formatEndTime(isoStr: string) {
  return new Date(isoStr).toLocaleString("tr-TR", {
    hour: "2-digit", minute: "2-digit",
  });
}

const categoryLabel = (cat: BoxCategory) =>
  CATEGORY_OPTIONS.find((o) => o.value === cat)?.emoji + " " +
  (CATEGORY_OPTIONS.find((o) => o.value === cat)?.label ?? cat);

export default function QuickListBox({ publishedBoxes }: { publishedBoxes: SurpriseBox[] }) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [published, setPublished] = useState<SurpriseBox[]>(publishedBoxes);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { min: minDT, max: maxDT } = getBounds();

  function set(field: keyof FormState, value: string) {
    setErrors((e) => ({ ...e, [field]: undefined }));
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "originalPrice" && value) {
        const half = (parseFloat(value) * 0.5).toFixed(2);
        if (!f.discountedPrice || f.discountedPrice === prev50(f.originalPrice)) {
          next.discountedPrice = half;
        }
      }
      return next;
    });
  }

  function prev50(orig: string) {
    const n = parseFloat(orig);
    return isNaN(n) ? "" : (n * 0.5).toFixed(2);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    const orig = parseFloat(form.originalPrice);
    const disc = parseFloat(form.discountedPrice);
    const qty = parseInt(form.quantity, 10);

    if (!form.originalPrice || isNaN(orig) || orig <= 0)
      errs.originalPrice = "Geçerli bir normal fiyat girin";
    if (!form.discountedPrice || isNaN(disc) || disc <= 0)
      errs.discountedPrice = "Geçerli bir indirimli fiyat girin";
    else if (!isNaN(orig) && disc >= orig)
      errs.discountedPrice = "İndirimli fiyat normal fiyattan düşük olmalıdır";
    if (!form.quantity || isNaN(qty) || qty < 1)
      errs.quantity = "Adet en az 1 olmalıdır";
    if (!form.pickupStart)
      errs.pickupStart = "Teslim alma başlangıç tarihi ve saatini seçin";
    if (!form.pickupEnd)
      errs.pickupEnd = "Teslim alma bitiş tarihi ve saatini seçin";

    if (form.pickupStart && form.pickupEnd) {
      const now = new Date();
      const startDt = new Date(form.pickupStart);
      const endDt = new Date(form.pickupEnd);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      if (startDt <= now) errs.pickupStart = "Başlangıç saati şu andan sonra olmalıdır";
      if (!errs.pickupStart && startDt > tomorrow)
        errs.pickupStart = "En fazla yarın için kutu yayınlayabilirsiniz";
      if (endDt <= startDt)
        errs.pickupEnd = "Bitiş saati başlangıç saatinden sonra olmalıdır";
      else if (endDt.getTime() - startDt.getTime() < 30 * 60 * 1000)
        errs.pickupEnd = "Teslim alma penceresi en az 30 dakika olmalıdır";
      else if (endDt > tomorrow)
        errs.pickupEnd = "En fazla yarın için kutu yayınlayabilirsiniz";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    setLoading(true);

    try {
      const toISO = (localDT: string) =>
        new Date(localDT.length === 16 ? localDT + ":00" : localDT).toISOString();

      const payload = {
        category: form.category,
        description: form.description || undefined,
        originalPrice: parseFloat(form.originalPrice),
        discountedPrice: parseFloat(form.discountedPrice),
        stockQuantity: parseInt(form.quantity, 10),
        pickupTimeStart: toISO(form.pickupStart),
        pickupTimeEnd: toISO(form.pickupEnd),
      };

      const result = await publishBox(payload);

      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const box = result.data as any;
        const newBox: SurpriseBox = {
          id: box.id,
          businessId: box.businessId,
          category: box.category,
          description: box.description ?? undefined,
          originalPrice: box.originalPrice,
          discountedPrice: box.discountedPrice,
          stockQuantity: box.stockQuantity,
          pickupTimeStart: String(box.pickupTimeStart),
          pickupTimeEnd: String(box.pickupTimeEnd),
          isActive: box.isActive,
        };
        analytics.boxPublished(form.category, parseInt(form.quantity, 10));
        setPublished((prev) => [newBox, ...prev]);
        setForm(DEFAULT_FORM);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error("[QuickListBox] handleSubmit threw:", err);
      setSubmitError("Bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100";
  const errorCls = "mt-1.5 text-xs font-medium text-red-500";
  const sectionCls = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100";
  const labelCls = "mb-2 block text-sm font-semibold text-stone-700";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900">Kutu Yayınla</h1>
        <p className="mt-1 text-sm text-stone-500">
          Kalan ürünlerinizi listeleyin, müşteriler size gelsin.
        </p>
      </div>

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Kutu başarıyla yayınlandı!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Category — large emoji card grid */}
        <div className={sectionCls}>
          <label className={labelCls}>Kategori</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORY_OPTIONS.map((opt) => {
              const active = form.category === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("category", opt.value)}
                  title={opt.desc}
                  className={[
                    "flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all",
                    active
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400 ring-offset-1"
                      : "bg-stone-50 text-stone-600 ring-1 ring-stone-200 hover:bg-emerald-50 hover:ring-emerald-200",
                  ].join(" ")}
                >
                  <span className="text-2xl leading-none">{opt.emoji}</span>
                  <span className="text-[11px] font-semibold leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className={sectionCls}>
          <label className={labelCls}>Adet</label>
          <input
            type="number"
            min={1}
            max={50}
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className={inputCls}
            placeholder="ör. 5"
          />
          {errors.quantity && <p className={errorCls}>{errors.quantity}</p>}
          <p className="mt-1.5 text-xs text-stone-400">Maks. 50 kutu</p>
        </div>

        {/* Prices */}
        <div className={sectionCls}>
          <label className={labelCls}>Fiyatlandırma</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-stone-500">Normal Fiyat (₺)</p>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                className={inputCls}
                placeholder="ör. 100"
              />
              {errors.originalPrice && <p className={errorCls}>{errors.originalPrice}</p>}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-stone-500">İndirimli Fiyat (₺)</p>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.discountedPrice}
                onChange={(e) => set("discountedPrice", e.target.value)}
                className={inputCls}
                placeholder="ör. 50"
              />
              {errors.discountedPrice && <p className={errorCls}>{errors.discountedPrice}</p>}
            </div>
          </div>
          {form.originalPrice && form.discountedPrice &&
            parseFloat(form.discountedPrice) < parseFloat(form.originalPrice) && (
            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
              <span className="text-sm" aria-hidden="true">💰</span>
              <p className="text-xs font-semibold text-amber-700">
                Müşteri ₺{(parseFloat(form.originalPrice) - parseFloat(form.discountedPrice)).toFixed(2)} tasarruf ediyor
                ({Math.round((1 - parseFloat(form.discountedPrice) / parseFloat(form.originalPrice)) * 100)}% indirim)
              </p>
            </div>
          )}
        </div>

        {/* Pickup times */}
        <div className={sectionCls}>
          <label className={labelCls}>Teslim Alma Saatleri</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-stone-500">
                Başlangıç{" "}
                <span className="font-normal text-stone-400">(bugün/yarın)</span>
              </p>
              <input
                type="datetime-local"
                value={form.pickupStart}
                min={minDT}
                max={maxDT}
                onChange={(e) => set("pickupStart", e.target.value)}
                className={inputCls}
              />
              {errors.pickupStart && <p className={errorCls}>{errors.pickupStart}</p>}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-stone-500">
                Bitiş{" "}
                <span className="font-normal text-stone-400">(min. 30 dk sonra)</span>
              </p>
              <input
                type="datetime-local"
                value={form.pickupEnd}
                min={form.pickupStart || minDT}
                max={maxDT}
                onChange={(e) => set("pickupEnd", e.target.value)}
                className={inputCls}
              />
              {errors.pickupEnd && <p className={errorCls}>{errors.pickupEnd}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={sectionCls}>
          <label className={labelCls}>
            Açıklama{" "}
            <span className="font-normal text-stone-400">(isteğe bağlı)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="ör. Günün kalan unlu mamülleri — ekmek, poğaça, çörek olabilir"
          />
        </div>

        {/* Error */}
        {submitError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
            {submitError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Yayınlanıyor..." : "Kutuyu Yayınla →"}
        </button>

        <p className="text-center text-xs text-stone-400">
          ✅ Üyelik ücretsiz · Kullanım ücretsiz · Komisyon alınmaz
        </p>
      </form>

      {/* Published boxes */}
      {published.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Bugün Yayınlanan Kutular
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {published.length}
            </span>
          </div>
          <div className="space-y-2">
            {published.map((box) => {
              const now = new Date();
              const isExpired = now > new Date(box.pickupTimeEnd);
              return (
                <div
                  key={box.id}
                  className={[
                    "flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1",
                    isExpired ? "opacity-50 ring-stone-100" : "ring-stone-100",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-800">
                      {categoryLabel(box.category)}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {formatPickupTime(box.pickupTimeStart)} – {formatEndTime(box.pickupTimeEnd)}
                      {" · "}
                      <span className={box.stockQuantity === 0 ? "text-red-500 font-semibold" : ""}>
                        {box.stockQuantity} adet
                      </span>
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-base font-extrabold text-emerald-600">
                      ₺{box.discountedPrice.toFixed(0)}
                    </p>
                    <p className="text-xs text-stone-400 line-through">
                      ₺{box.originalPrice.toFixed(0)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
