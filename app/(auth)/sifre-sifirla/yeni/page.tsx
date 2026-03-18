"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-actions";

function YeniSifreForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (token) formData.set("token", token);

    try {
      const result = await resetPassword(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100 text-center space-y-4">
        <div className="text-5xl">❌</div>
        <p className="text-sm text-stone-600">Geçersiz veya süresi dolmuş link.</p>
        <Link href="/sifre-sifirla" className="text-sm text-emerald-600 hover:underline">
          Tekrar talep et
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h1 className="text-xl font-bold text-stone-900">Şifre Güncellendi</h1>
        <p className="text-sm text-stone-500">Yeni şifrenizle giriş yapabilirsiniz.</p>
        <Link
          href="/giris"
          className="inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
      <h1 className="text-xl font-bold text-stone-900">Yeni Şifre Belirle</h1>
      <p className="mt-1 text-sm text-stone-500">En az 8 karakter kullanın.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Yeni Şifre</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
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
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
}

export default function YeniSifrePage() {
  return (
    <Suspense fallback={<div className="rounded-2xl bg-white p-8 shadow-sm">Yükleniyor...</div>}>
      <YeniSifreForm />
    </Suspense>
  );
}
