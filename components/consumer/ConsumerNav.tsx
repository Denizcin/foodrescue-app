"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ─── SVG icon helpers ─────────────────────────────────────────────────── */

function IconHome({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V12h6v9" />
      <path d="M3 12v9h18v-9" />
    </svg>
  );
}

function IconHeart({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 018.108-2.7A4.5 4.5 0 0121 8.5c0 6-9 12.5-9 12.5z" />
    </svg>
  );
}

function IconWallet({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconReceipt({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 2v20l2-1.5L8 22l2-1.5L12 22l2-1.5L16 22l2-1.5L20 22V2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function IconSettings({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

/* ─── Nav items ─────────────────────────────────────────────────────────── */

const LEFT_ITEMS = [
  { href: "/consumer",           label: "Ana Sayfa",   Icon: IconHome },
  { href: "/consumer/favorites", label: "Favoriler",   Icon: IconHeart },
];

const RIGHT_ITEMS = [
  { href: "/consumer/orders",    label: "Siparişlerim", Icon: IconReceipt },
  { href: "/consumer/settings",  label: "Ayarlar",      Icon: IconSettings },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ConsumerNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    // Exact match for root consumer, prefix for others
    return href === "/consumer" ? pathname === "/consumer" : pathname.startsWith(href);
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-100 bg-white/95 backdrop-blur-sm shadow-[0_-1px_12px_rgba(0,0,0,0.08)]"
      aria-label="Ana menü"
    >
      <div className="mx-auto flex max-w-lg items-center">
        {/* Left items */}
        {LEFT_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-1 flex-col items-center gap-1 pb-safe pt-2 pb-3 text-[11px] font-medium transition-colors",
                "min-h-[60px]", // 44px touch target + padding
                active ? "text-emerald-600" : "text-stone-400 hover:text-stone-600",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <Icon active={active} />
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-600" />
                )}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Center — prominent wallet/active-orders button */}
        {(() => {
          const active = pathname.startsWith("/consumer/orders");
          return (
            <Link
              href="/consumer/orders"
              className="flex flex-col items-center gap-1 px-4 pb-2 pt-1 text-[11px] font-semibold"
              aria-current={active ? "page" : undefined}
            >
              <span
                className={[
                  "flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full shadow-lg transition-all duration-200",
                  "ring-4 ring-white",
                  active
                    ? "bg-emerald-700 text-white scale-105"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",
                ].join(" ")}
                aria-hidden="true"
              >
                <IconWallet active={active} />
              </span>
              <span
                className={[
                  "-mt-3 transition-colors",
                  active ? "text-emerald-600" : "text-stone-500",
                ].join(" ")}
              >
                Siparişlerim
              </span>
            </Link>
          );
        })()}

        {/* Right items */}
        {RIGHT_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-1 flex-col items-center gap-1 pb-safe pt-2 pb-3 text-[11px] font-medium transition-colors",
                "min-h-[60px]",
                active ? "text-emerald-600" : "text-stone-400 hover:text-stone-600",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <Icon active={active} />
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-600" />
                )}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
