"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/lib/auth-actions";

export default function GirisPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginUser(formData);
      if (result?.error) setError(result.error);
    } catch {
      // redirect throws — this is expected
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
      <h1 className="text-xl font-bold text-stone-900">Giriş Yap</h1>
      <p className="mt-1 text-sm text-stone-500">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="font-medium text-emerald-600 hover:underline">
          Kayıt Ol
        </Link>
        {" · "}
        <Link href="/isletme-kayit" className="font-medium text-emerald-600 hover:underline">
          İşletme Kaydı
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          <label className="mb-1 block text-sm font-medium text-stone-700">Şifre</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="••••••••"
          />
          <div className="mt-1 text-right">
            <Link href="/sifre-sifirla" className="text-xs text-emerald-600 hover:underline">
              Şifremi unuttum
            </Link>
          </div>
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
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
