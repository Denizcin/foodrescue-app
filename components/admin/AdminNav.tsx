"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/shared/SignOutButton";

/* ─── SVG icons ─────────────────────────────────────────────────────────── */

function IconPanel() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" />
      <path d="M5 9v11a1 1 0 001 1h4V15h4v6h4a1 1 0 001-1V9" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M19 7a3 3 0 010 6M23 21v-1.5a3 3 0 00-2-2.83" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21h6M12 3a6 6 0 016 6c0 2.5-1.5 4.5-3 5.5V17H9v-2.5C7.5 13.5 6 11.5 6 9a6 6 0 016-6z" />
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

/* ─── Nav data ───────────────────────────────────────────────────────────── */

const NAV = [
  { href: "/admin",             label: "Panel",       Icon: IconPanel },
  { href: "/admin/businesses",  label: "İşletmeler",  Icon: IconStore },
  { href: "/admin/users",       label: "Kullanıcılar", Icon: IconUsers },
  { href: "/admin/orders",      label: "Siparişler",  Icon: IconOrders },
  { href: "/admin/nominations", label: "Öneriler",    Icon: IconLightbulb },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden md:flex md:w-64 md:flex-col md:bg-stone-900 md:text-white"
      aria-label="Admin sidebar"
    >
      {/* Logo / brand */}
      <div className="flex items-center gap-3 border-b border-stone-800 px-5 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl">🌍</span>
          <span className="text-base font-extrabold tracking-tight text-white">FoodRescue</span>
        </Link>
        <span className="ml-auto shrink-0 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-300 ring-1 ring-indigo-500/30">
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                "min-h-[44px]",
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-100",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <span className={[
                "shrink-0 transition-colors",
                active ? "text-indigo-200" : "text-stone-500 group-hover:text-stone-300",
              ].join(" ")}>
                <Icon />
              </span>
              <span className="flex-1">{label}</span>
              {active && (
                <span className="h-4 w-1 rounded-full bg-indigo-300" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + sign out */}
      <div className="border-t border-stone-800 px-3 pb-4 pt-3 space-y-1">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-700 text-xs font-bold text-stone-300">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <p className="truncate text-xs text-stone-400">{userEmail}</p>
        </div>
        <SignOutButton className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-red-900/40 hover:text-red-400 transition-all duration-150 min-h-[44px]">
          <span className="shrink-0 text-stone-600 group-hover:text-red-400 transition-colors">
            <IconSignOut />
          </span>
          <span>Çıkış Yap</span>
        </SignOutButton>
      </div>
    </aside>
  );
}
