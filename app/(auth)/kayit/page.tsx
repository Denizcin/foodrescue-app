"use client";

import { useState } from "react";
import Link from "next/link";
import { registerConsumer } from "@/lib/auth-actions";

export default function KayitPage() {
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
      const result = await registerConsumer(formData);
      if (result?.error) setError(result.error);
    } catch {
      // redirect throws — expected
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
      <h1 className="text-xl font-bold text-stone-900">Hesap Oluştur</h1>
      <p className="mt-1 text-sm text-stone-500">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-medium text-emerald-600 hover:underline">
          Giriş Yap
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Adınız Soyadınız</label>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="Ayşe Yılmaz"
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
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Telefon <span className="text-stone-400">(isteğe bağlı)</span>
          </label>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="0532 000 00 00"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Şifre</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
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
            autoComplete="new-password"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="Şifreyi tekrar girin"
          />
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
          {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
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
