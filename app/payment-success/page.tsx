// Public page — no auth required.
// iyzico's POST callback cannot carry the session cookie (cross-site SameSite=Lax),
// so it redirects here first. This page is outside the /consumer/* middleware matcher
// and is therefore accessible without a session. The user clicks through to their orders.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ödeme Başarılı — FoodRescue",
  robots: { index: false, follow: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const params = await searchParams;
  const code = params.code ?? null;
  const hasError = params.error != null;

  if (hasError || !code) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg ring-1 ring-stone-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-4xl">
            ❌
          </div>
          <h1 className="text-xl font-extrabold text-stone-900">Ödeme başarısız</h1>
          <p className="mt-2 text-sm text-stone-500 leading-relaxed">
            Ödeme işlemi tamamlanamadı. Kartınızdan herhangi bir ücret alınmadı.
          </p>
          <Link
            href="/consumer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            Kutulara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg ring-1 ring-stone-100">
        <div className="mx-auto mb-1 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-5xl">
          ✅
        </div>

        <h1 className="mt-4 text-xl font-extrabold text-stone-900">Ödemen alındı!</h1>
        <p className="mt-1 text-sm text-stone-500">
          Siparişin oluşturuldu. İşletmeye gidip aşağıdaki kodu göster.
        </p>

        <div className="mt-6 rounded-2xl bg-emerald-50 py-5 ring-1 ring-emerald-200">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Teslim Alma Kodun
          </p>
          <p className="mt-2 font-mono text-4xl font-extrabold tracking-[0.3em] text-stone-900">
            {code}
          </p>
          <p className="mt-1 text-xs text-stone-400">Bu kodu kasada göster</p>
        </div>

        <p className="mt-4 text-xs text-stone-400">
          ⚠️ Mağazada tekrar ödeme yapma — işlem bu ekranda tamamlandı.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/consumer/orders"
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            Siparişlerime Git →
          </Link>
          <Link
            href="/consumer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 py-3.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
