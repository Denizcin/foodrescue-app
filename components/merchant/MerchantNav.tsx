"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/shared/SignOutButton";

const navItems = [
  { href: "/merchant",           label: "Panel",        emoji: "📊" },
  { href: "/merchant/publish",   label: "Kutu Yayınla", emoji: "➕" },
  { href: "/merchant/orders",    label: "Siparişler",   emoji: "📋" },
  { href: "/merchant/templates", label: "Şablonlar",    emoji: "📝" },
  { href: "/merchant/payments",  label: "Ödemeler",     emoji: "💰" },
  { href: "/merchant/settings",  label: "Ayarlar",      emoji: "⚙️" },
];

export default function MerchantNav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Mobile bottom nav ─────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-stone-100 bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.06)] md:hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                active ? "text-emerald-600" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <span className="text-xl leading-none">{item.emoji}</span>
              <span>{item.label}</span>
              {active && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-emerald-600" />
              )}
            </Link>
          );
        })}
        <SignOutButton className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-stone-400 hover:text-red-500 transition-colors">
          <span className="text-xl leading-none">🚪</span>
          <span>Çıkış</span>
        </SignOutButton>
      </nav>

      {/* ── Desktop sidebar ───────────────────────────── */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:gap-1 md:border-r md:border-stone-100 md:bg-white md:px-3 md:py-6">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600" />
              )}
            </Link>
          );
        })}

        {/* No-fee reminder in sidebar */}
        <div className="mt-auto rounded-xl bg-emerald-50 px-3 py-3 text-center text-xs text-emerald-700 ring-1 ring-emerald-100">
          🎉 Üyelik ücretsiz.<br />Kullanım ücretsiz.
        </div>

        <SignOutButton className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <span className="text-lg">🚪</span>
          <span>Çıkış Yap</span>
        </SignOutButton>
      </aside>
    </>
  );
}
