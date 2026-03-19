"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/consumer",           label: "Ana Sayfa",   emoji: "🏠" },
  { href: "/consumer/orders",    label: "Siparişlerim",emoji: "📦" },
  { href: "/consumer/favorites", label: "Favoriler",   emoji: "❤️" },
  { href: "/consumer/settings",  label: "Ayarlar",     emoji: "⚙️" },
];

export default function ConsumerNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-stone-100 bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
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
    </nav>
  );
}
