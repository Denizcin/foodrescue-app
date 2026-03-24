import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Sayfa Bulunamadı",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl mb-6" aria-hidden="true">🍃</span>
      <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
        Sayfa Bulunamadı
      </h1>
      <p className="text-stone-500 text-lg mb-8 max-w-sm leading-relaxed">
        Aradığın sayfa artık burada değil ya da taşındı. Endişelenme — hâlâ çok güzel kutular seni bekliyor!
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/consumer"
          className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
        >
          🎁 Kutuları Keşfet
        </Link>
        <Link
          href="/"
          className="rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Ana Sayfa
        </Link>
      </div>
      <p className="mt-12 text-xs text-stone-400">Hata kodu: 404</p>
    </div>
  );
}
