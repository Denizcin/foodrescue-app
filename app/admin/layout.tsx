import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const NAV = [
  { href: "/admin",              label: "📊 Panel" },
  { href: "/admin/businesses",   label: "🏪 İşletmeler" },
  { href: "/admin/users",        label: "👥 Kullanıcılar" },
  { href: "/admin/orders",       label: "📋 Siparişler" },
  { href: "/admin/nominations",  label: "💡 Öneriler" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") redirect("/giris");

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-indigo-900 bg-indigo-800 px-4 py-3 shadow-md">
        <Link href="/admin" className="text-base font-extrabold text-white">
          🌍 FoodRescue
        </Link>
        <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-indigo-100">
          Admin Paneli
        </span>
        <div className="ml-auto text-xs text-indigo-300">{session.user.email}</div>
      </header>

      {/* Horizontal sub-nav */}
      <nav className="flex gap-1 overflow-x-auto border-b border-indigo-200 bg-indigo-700 px-3 py-1.5 scrollbar-none">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-100 hover:bg-indigo-600 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
