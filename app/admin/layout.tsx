export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") redirect("/giris");

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Dark sidebar */}
      <AdminNav userEmail={session.user.email ?? ""} />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar (sidebar is hidden on mobile, replaced by this) */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-stone-900 bg-stone-900 px-4 py-3 shadow-md md:hidden">
          <Link href="/admin" className="text-base font-extrabold text-white">
            🌍 FoodRescue
          </Link>
          <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-indigo-100">
            Admin
          </span>
          <div className="ml-auto text-xs text-stone-400 truncate">
            {session.user.email}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
