export const dynamic = "force-dynamic";

import ConsumerNav from "@/components/consumer/ConsumerNav";
import LocationHeader from "@/components/consumer/LocationHeader";
import SignOutButton from "@/components/shared/SignOutButton";
import { LocationProvider } from "@/contexts/LocationContext";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <div className="flex min-h-screen flex-col bg-stone-50">
        {/* Location header */}
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-stone-100 bg-white px-4 py-3 shadow-sm">
          <span className="text-base font-extrabold text-emerald-600">🌍 FoodRescue</span>
          <LocationHeader />
          <SignOutButton className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 ring-1 ring-stone-200 hover:bg-stone-50 hover:text-stone-700 transition-colors" />
        </header>

        {/* Page content — padded above bottom nav */}
        <main className="flex-1 pb-20">{children}</main>

        {/* Bottom nav */}
        <ConsumerNav />
      </div>
    </LocationProvider>
  );
}
