"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/shared/SignOutButton";

/* ─── SVG icons ─────────────────────────────────────────────────────────── */

function IconDashboard() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function IconTemplate() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16M4 10h6M4 14h6M4 18h6M14 10h6v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
    </svg>
  );
}

function IconCash() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function IconSignOut() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

/* ─── Nav items ─────────────────────────────────────────────────────────── */

const navItems = [
  { href: "/merchant",           label: "Panel",        Icon: IconDashboard },
  { href: "/merchant/publish",   label: "Kutu Yayınla", Icon: IconPlus },
  { href: "/merchant/orders",    label: "Siparişler",   Icon: IconClipboard },
  { href: "/merchant/templates", label: "Şablonlar",    Icon: IconTemplate },
  { href: "/merchant/payments",  label: "Ödemeler",     Icon: IconCash },
  { href: "/merchant/settings",  label: "Ayarlar",      Icon: IconGear },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function MerchantNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/merchant" ? pathname === "/merchant" : pathname.startsWith(href);
  }

  return (
    <>
      {/* ── Mobile bottom bar ──────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-100 bg-white/95 backdrop-blur-sm shadow-[0_-1px_12px_rgba(0,0,0,0.08)] md:hidden"
        aria-label="Merchant menü"
      >
        <div className="flex items-stretch overflow-x-auto scrollbar-none">
          {navItems.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex min-w-[56px] flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
                  "min-h-[56px]",
                  active ? "text-emerald-600" : "text-stone-400 hover:text-stone-600",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <span className={["flex h-6 w-6 items-center justify-center", active ? "text-emerald-600" : ""].join(" ")}>
                  <Icon />
                </span>
                <span className="leading-tight text-center">{label}</span>
              </Link>
            );
          })}
          <SignOutButton className="flex min-w-[56px] flex-col items-center gap-1 px-2 py-2 text-[10px] font-medium text-stone-400 hover:text-red-500 transition-colors min-h-[56px]">
            <IconSignOut />
            <span>Çıkış</span>
          </SignOutButton>
        </div>
      </nav>

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-stone-100 md:bg-white"
        aria-label="Merchant sidebar"
      >
        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {navItems.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  "min-h-[44px]",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-800",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <span className={[
                  "shrink-0 transition-colors",
                  active ? "text-emerald-600" : "text-stone-400 group-hover:text-stone-600",
                ].join(" ")}>
                  <Icon />
                </span>
                <span className="flex-1">{label}</span>
                {active && (
                  <span className="h-5 w-1 rounded-full bg-emerald-500" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* No-fee badge */}
        <div className="mx-3 mb-3 rounded-xl bg-emerald-50 px-3 py-3 text-center ring-1 ring-emerald-100">
          <p className="text-xs font-semibold text-emerald-700">🎉 Üyelik ücretsiz</p>
          <p className="text-xs text-emerald-600">Kullanım ücretsiz.</p>
        </div>

        {/* Sign out */}
        <SignOutButton className="group mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 min-h-[44px]">
          <span className="shrink-0 text-stone-400 group-hover:text-red-500 transition-colors">
            <IconSignOut />
          </span>
          <span>Çıkış Yap</span>
        </SignOutButton>
      </aside>
    </>
  );
}
