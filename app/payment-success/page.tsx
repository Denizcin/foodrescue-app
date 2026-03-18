"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code") ?? "";

  useEffect(() => {
    // Small delay lets the browser re-associate the session cookie before
    // navigating to the auth-protected /consumer/orders route.
    const timer = setTimeout(() => {
      router.replace(`/consumer/orders?payment=success&code=${code}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [code, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-5xl">
          ✅
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900">Ödeme Başarılı!</h1>
        <p className="text-sm text-stone-500">Siparişiniz oluşturuldu, yönlendiriliyorsunuz…</p>
        {code && (
          <div className="mt-2 rounded-xl bg-emerald-50 px-6 py-4 ring-1 ring-emerald-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Teslim Alma Kodun
            </p>
            <p className="mt-1 font-mono text-3xl font-extrabold tracking-[0.3em] text-stone-900">
              {code}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
