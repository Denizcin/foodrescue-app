"use client";

import { useState } from "react";
import Link from "next/link";
import { registerMerchant } from "@/lib/auth-actions";

const CATEGORY_OPTIONS = [
  { value: "BAKERY", label: "🥐 Fırın" },
  { value: "RESTAURANT", label: "🍽️ Restoran" },
  { value: "CAFE", label: "☕ Kafe" },
  { value: "GROCERY", label: "🛒 Market" },
  { value: "GREENGROCER", label: "🥕 Manav" },
  { value: "MARKET", label: "🏪 Süpermarket" },
  { value: "PATISSERIE", label: "🎂 Pastane" },
  { value: "DELI", label: "🥩 Şarküteri" },
  { value: "FLORIST", label: "🌸 Çiçekçi" },
  { value: "OTHER", label: "🏬 Diğer" },
];

export default function IsletmeKayitPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    try {
      const result = await registerMerchant(formData);
      if (result?.error) setError(result.error);
    } catch {
      // redirect throws — expected
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
      <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
        🎉 Üyelik ücretsiz. Kullanım ücretsiz. Komisyon yok.
      </div>

      <h1 className="text-xl font-bold text-stone-900">İşletme Kaydı</h1>
      <p className="mt-1 text-sm text-stone-500">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-medium text-emerald-600 hover:underline">
          Giriş Yap
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          Yetkili Bilgileri
        </p>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Adınız Soyadınız</label>
          <input
            name="ownerName"
            type="text"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="Mehmet Kaya"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">E-posta</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="isletme@email.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Telefon <span className="text-stone-400">(isteğe bağlı)</span>
          </label>
          <input
            name="phone"
            type="tel"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="0212 000 00 00"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Şifre</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="En az 8 karakter"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Şifre Tekrar</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Tekrar girin"
            />
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          İşletme Bilgileri
        </p>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">İşletme Adı</label>
          <input
            name="businessName"
            type="text"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="Altın Başak Fırını"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Kategori</label>
          <select
            name="businessCategory"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Seçiniz...</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Adres</label>
          <input
            name="address"
            type="text"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="Bağdat Caddesi No:42, Kadıköy"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Çalışma Saatleri</label>
          <input
            name="operatingHours"
            type="text"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="ör. Pzt-Cmt 07:00-20:00"
          />
        </div>

        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-100">
          ⚠️ İşletmeniz kayıt sonrası admin onayına gönderilecektir. Onay sonrası kutu yayınlayabilirsiniz.
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? "Kaydediliyor..." : "İşletmeyi Kaydet"}
        </button>

        <p className="text-center text-xs text-stone-400">
          Kayıt olarak{" "}
          <Link href="/kullanim-sartlari" className="underline">Kullanım Şartları</Link>
          {" "}ve{" "}
          <Link href="/kvkk" className="underline">KVKK Politikası</Link>
          {" "}kabul etmiş olursunuz.
        </p>
      </form>
    </div>
  );
}
