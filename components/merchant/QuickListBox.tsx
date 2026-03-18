"use client";

import { useState } from "react";
import type { BoxCategory, SurpriseBox } from "@/lib/types";
import { publishBox } from "@/lib/actions";

const CATEGORY_OPTIONS: { value: BoxCategory; label: string }[] = [
  { value: "BAKERY", label: "🥐 Fırın" },
  { value: "SUSHI", label: "🍣 Suşi" },
  { value: "GROCERY", label: "🛒 Market" },
  { value: "DELI", label: "🥩 Şarküteri" },
  { value: "CAFE", label: "☕ Kafe" },
  { value: "PREPARED_MEAL", label: "🍱 Hazır Yemek" },
  { value: "PRODUCE", label: "🥕 Manav" },
  { value: "MIXED", label: "🎁 Karışık" },
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

export default function QuickListBox({ publishedBoxes }: { publishedBoxes: SurpriseBox[] }) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [published, setPublished] = useState<SurpriseBox[]>(publishedBoxes);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setErrors((e) => ({ ...e, [field]: undefined }));
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Auto-suggest 50% discount when original price changes
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

    if (!form.originalPrice || isNaN(orig) || orig <= 0) {
      errs.originalPrice = "Geçerli bir normal fiyat girin";
    }
    if (!form.discountedPrice || isNaN(disc) || disc <= 0) {
      errs.discountedPrice = "Geçerli bir indirimli fiyat girin";
    } else if (!isNaN(orig) && disc >= orig) {
      errs.discountedPrice = "İndirimli fiyat normal fiyattan düşük olmalıdır";
    }
    if (!form.quantity || isNaN(qty) || qty < 1) {
      errs.quantity = "Adet en az 1 olmalıdır";
    }
    if (!form.pickupStart) {
      errs.pickupStart = "Teslim alma başlangıcı gereklidir";
    }
    if (!form.pickupEnd) {
      errs.pickupEnd = "Teslim alma bitişi gereklidir";
    }

    if (form.pickupStart && form.pickupEnd) {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const startDt = new Date(`${today}T${form.pickupStart}`);
      const endDt = new Date(`${today}T${form.pickupEnd}`);

      if (endDt <= now) {
        errs.pickupEnd = "Teslim alma bitiş saati gelecekte olmalıdır";
      } else if (endDt.getTime() - startDt.getTime() < 30 * 60 * 1000) {
        errs.pickupEnd = "Teslim alma süresi en az 30 dakika olmalıdır";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);

    const today = new Date().toISOString().slice(0, 10);
    const result = await publishBox({
      category: form.category,
      description: form.description || undefined,
      originalPrice: parseFloat(form.originalPrice),
      discountedPrice: parseFloat(form.discountedPrice),
      stockQuantity: parseInt(form.quantity, 10),
      pickupTimeStart: new Date(`${today}T${form.pickupStart}:00`).toISOString(),
      pickupTimeEnd: new Date(`${today}T${form.pickupEnd}:00`).toISOString(),
    });

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
        pickupTimeStart: new Date(box.pickupTimeStart).toISOString(),
        pickupTimeEnd: new Date(box.pickupTimeEnd).toISOString(),
        isActive: box.isActive,
      };
      setPublished((prev) => [newBox, ...prev]);
      setForm(DEFAULT_FORM);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setSubmitError(result.error);
    }
  }

  const categoryLabel = (cat: BoxCategory) =>
    CATEGORY_OPTIONS.find((o) => o.value === cat)?.label ?? cat;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-xl font-bold text-stone-900">Bugünün Kutularını Yayınla</h1>
        <p className="mt-1 text-sm text-stone-500">
          Üyelik ücreti yok. Kullanım ücreti yok. Kalan ürünlerinizi listeleyin, müşteriler size gelsin.
        </p>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          ✅ Kutu başarıyla yayınlandı!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Kategori</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Adet</label>
          <input
            type="number"
            min={1}
            max={50}
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="ör. 5"
          />
          {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Normal Fiyat (₺)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="ör. 100"
            />
            {errors.originalPrice && (
              <p className="mt-1 text-xs text-red-500">{errors.originalPrice}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">İndirimli Fiyat (₺)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.discountedPrice}
              onChange={(e) => set("discountedPrice", e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="ör. 50"
            />
            {errors.discountedPrice && (
              <p className="mt-1 text-xs text-red-500">{errors.discountedPrice}</p>
            )}
          </div>
        </div>

        {/* Pickup times */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Teslim Alma Başlangıcı
            </label>
            <input
              type="time"
              value={form.pickupStart}
              onChange={(e) => set("pickupStart", e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            {errors.pickupStart && (
              <p className="mt-1 text-xs text-red-500">{errors.pickupStart}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Teslim Alma Bitişi
            </label>
            <input
              type="time"
              value={form.pickupEnd}
              onChange={(e) => set("pickupEnd", e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            {errors.pickupEnd && (
              <p className="mt-1 text-xs text-red-500">{errors.pickupEnd}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Açıklama <span className="text-stone-400">(isteğe bağlı)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="ör. Günün kalan unlu mamülleri"
          />
        </div>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-200">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Kutuyu Yayınla
        </button>

        <p className="text-center text-xs text-stone-400">
          🎉 Üyelik ücretsiz. Kullanım ücretsiz.
        </p>
      </form>

      {/* Today's published boxes */}
      {published.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Bugün Yayınlanan Kutular
          </h2>
          <div className="space-y-2">
            {published.map((box) => (
              <div
                key={box.id}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-stone-100"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    {categoryLabel(box.category)}
                  </p>
                  <p className="text-xs text-stone-500">
                    {box.pickupTimeStart.slice(11, 16)} – {box.pickupTimeEnd.slice(11, 16)} ·{" "}
                    {box.stockQuantity} adet
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">₺{box.discountedPrice.toFixed(2)}</p>
                  <p className="text-xs text-stone-400 line-through">₺{box.originalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
