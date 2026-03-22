import Link from "next/link";
import type { Metadata } from "next";

// No force-dynamic — legal pages are fully static content (no auth, no DB calls).

export const metadata: Metadata = {
  title: "Yasal Bilgiler — FoodRescue",
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Minimal top bar */}
      <header className="border-b border-stone-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-base font-extrabold text-emerald-600">
            🌍 FoodRescue
          </Link>
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Ana Sayfa
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>

      {/* Footer links */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="/kvkk" className="hover:text-stone-700">KVKK Aydınlatma Metni</Link>
          <Link href="/kullanim-sartlari" className="hover:text-stone-700">Kullanım Şartları</Link>
          <Link href="/cerez-politikasi" className="hover:text-stone-700">Çerez Politikası</Link>
          <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-stone-700">Mesafeli Satış Sözleşmesi</Link>
        </nav>
        <p className="mt-3">© {new Date().getFullYear()} FoodRescue. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
