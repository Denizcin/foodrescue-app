import { verifyEmail } from "@/lib/auth-actions";
import Link from "next/link";

export const metadata = { title: "E-posta Doğrulama" };

export default async function EmailVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="max-w-sm w-full mx-auto p-8 text-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-lg font-bold text-stone-900">Geçersiz Link</h1>
          <p className="mt-2 text-sm text-stone-500">Doğrulama linki eksik veya hatalı.</p>
          <Link href="/giris" className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const result = await verifyEmail(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="max-w-sm w-full mx-auto p-8 text-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
        {result.success ? (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-lg font-bold text-stone-900">E-posta Doğrulandı!</h1>
            <p className="mt-2 text-sm text-stone-500">
              Hesabınız başarıyla doğrulandı. Artık tüm özellikleri kullanabilirsiniz.
            </p>
            <Link href="/consumer" className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Keşfetmeye Başla →
            </Link>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">⏰</div>
            <h1 className="text-lg font-bold text-stone-900">Link Geçersiz</h1>
            <p className="mt-2 text-sm text-stone-500">{result.error}</p>
            <Link href="/giris" className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Giriş Yap
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
