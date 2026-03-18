"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth-actions";

export default function SifreSifirlaPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await requestPasswordReset(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100 text-center space-y-4">
        <div className="text-5xl">📬</div>
        <h1 className="text-xl font-bold text-stone-900">E-posta Gönderildi</h1>
        <p className="text-sm text-stone-500">
          Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama linki gönderildi.
          Gelen kutunuzu kontrol edin.
        </p>
        <Link
          href="/giris"
          className="inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Giriş Sayfasına Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
      <h1 className="text-xl font-bold text-stone-900">Şifre Sıfırla</h1>
      <p className="mt-1 text-sm text-stone-500">
        E-posta adresinizi girin, sıfırlama linki gönderelim.
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
          {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
        </button>

        <div className="text-center">
          <Link href="/giris" className="text-sm text-emerald-600 hover:underline">
            Giriş sayfasına dön
          </Link>
        </div>
      </form>
    </div>
  );
}
