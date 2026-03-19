"use client";

import { useState, useTransition } from "react";
import { createBoxTemplate, deleteBoxTemplate } from "@/lib/profile-actions";

const BOX_LABELS: Record<string, string> = {
  BAKERY: "Fırın", SUSHI: "Suşi", GROCERY: "Market", DELI: "Şarküteri",
  CAFE: "Kafe", PREPARED_MEAL: "Hazır Yemek", PRODUCE: "Manav", MIXED: "Karışık",
};

const CATEGORIES = Object.entries(BOX_LABELS);

interface Template {
  id: string;
  label: string;
  category: string;
  description: string | null;
  originalPrice: number;
  discountedPrice: number;
}

interface Props {
  initialTemplates: Template[];
}

export default function BoxTemplateManager({ initialTemplates }: Props) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("BAKERY");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setLabel(""); setCategory("BAKERY"); setDescription("");
    setOriginalPrice(""); setDiscountedPrice(""); setFormError("");
    setShowForm(false);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    startTransition(async () => {
      const res = await createBoxTemplate({
        label,
        category,
        description,
        originalPrice: parseFloat(originalPrice),
        discountedPrice: parseFloat(discountedPrice),
      });
      if (res.success) {
        setTemplates((prev) => [res.data as Template, ...prev]);
        resetForm();
      } else {
        setFormError(res.error ?? "Şablon oluşturulamadı.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteBoxTemplate(id);
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      }
    });
  }

  const discount = (orig: number, disc: number) =>
    orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">📝 Kutu Şablonları</h1>
          <p className="mt-0.5 text-sm text-stone-500">Hızlı kutu yayınlamak için şablonlarını kaydet.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          + Yeni Şablon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-200 space-y-3">
          <h2 className="text-sm font-bold text-stone-800">Yeni Şablon</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Şablon Adı</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="ör. Sabah Fırın Kutusu"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {CATEGORIES.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Açıklama (opsiyonel)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Orijinal Fiyat (₺)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">İndirimli Fiyat (₺)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
            {formError && <p className="text-xs text-red-600 font-medium">{formError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
              >
                {isPending ? "Kaydediliyor…" : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Template list */}
      {templates.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-100">
          <p className="text-stone-400 text-sm">Henüz şablonun yok. Yukarıdan ekle!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900 truncate">{t.label}</p>
                <p className="text-xs text-stone-500">
                  {BOX_LABELS[t.category] ?? t.category} ·{" "}
                  <span className="line-through">₺{t.originalPrice.toFixed(2)}</span>{" "}
                  <span className="text-emerald-700 font-medium">₺{t.discountedPrice.toFixed(2)}</span>{" "}
                  <span className="text-emerald-600">(%{discount(t.originalPrice, t.discountedPrice)} indirim)</span>
                </p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-stone-400 truncate">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={isPending}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
