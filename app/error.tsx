"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl mb-6" aria-hidden="true">😕</span>
      <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-3">
        Bir şeyler yanlış gitti
      </h1>
      <p className="text-stone-500 mb-8 max-w-sm leading-relaxed">
        Beklenmedik bir hata oluştu. Sayfayı yenilemeyi ya da ana sayfaya dönmeyi dene.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Ana Sayfa
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-stone-400 font-mono">Hata kodu: {error.digest}</p>
      )}
    </div>
  );
}
