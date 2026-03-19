import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hesap",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="mb-8 text-center">
        <span className="text-3xl font-extrabold text-emerald-600">🌍 FoodRescue</span>
        <p className="mt-1 text-sm text-stone-500">Gıda israfını birlikte önleyelim</p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
