import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CategoryBadge from "@/components/shared/CategoryBadge";

export const metadata: Metadata = {
  title: "Favorilerim",
  description: "Favori işletmelerini ve aktif kutularını görüntüle.",
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      business: {
        include: {
          surpriseBoxes: {
            where: {
              isActive: true,
              pickupTimeEnd: { gt: new Date() },
            },
            orderBy: { discountedPrice: "asc" },
            take: 3,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto">
      <h1 className="text-xl font-extrabold text-stone-900">❤️ Favorilerim</h1>
      <p className="mt-1 text-sm text-stone-500">
        Favori işletmelerini ve aktif kutularını burada takip et.
      </p>

      {favorites.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <span className="text-5xl">🤍</span>
          <p className="text-sm text-stone-500 max-w-xs">
            Henüz favori işletmen yok. Ana sayfada kutu kartlarındaki ❤️ simgesine
            dokunarak işletmeleri favorilerine ekleyebilirsin.
          </p>
          <Link
            href="/consumer"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Kutuları Keşfet
          </Link>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {favorites.map(({ business }) => {
            const activeBoxes = business.surpriseBoxes;
            const hasBoxes = activeBoxes.length > 0;
            const lowestPrice = hasBoxes
              ? Math.min(...activeBoxes.map((b) => b.discountedPrice))
              : null;

            return (
              <div
                key={business.id}
                className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 overflow-hidden"
              >
                {/* Business header */}
                <div className="flex items-start justify-between gap-3 p-4 pb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-stone-900 text-sm truncate">
                        {business.name}
                      </p>
                      <CategoryBadge category={business.category} />
                    </div>
                    <p className="mt-0.5 text-xs text-stone-400 truncate">{business.address}</p>
                    <p className="mt-0.5 text-xs text-stone-400">🕐 {business.operatingHours}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {hasBoxes ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        {activeBoxes.length} kutu aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                        Kutu yok
                      </span>
                    )}
                    {lowestPrice !== null && (
                      <span className="text-xs font-bold text-emerald-600">₺{lowestPrice}&apos;den başlayan</span>
                    )}
                  </div>
                </div>

                {/* Active boxes preview */}
                {hasBoxes && (
                  <div className="border-t border-stone-50 px-4 pb-4 pt-3 space-y-2">
                    {activeBoxes.map((box) => {
                      const savings = box.originalPrice - box.discountedPrice;
                      const pickupStart = new Date(box.pickupTimeStart).toLocaleTimeString("tr-TR", {
                        hour: "2-digit", minute: "2-digit",
                      });
                      const pickupEnd = new Date(box.pickupTimeEnd).toLocaleTimeString("tr-TR", {
                        hour: "2-digit", minute: "2-digit",
                      });
                      return (
                        <Link
                          key={box.id}
                          href={`/consumer/box/${box.id}`}
                          className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2.5 hover:bg-emerald-50 hover:ring-1 hover:ring-emerald-200 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-semibold text-stone-700">
                              🎁 Sürpriz Kutu
                            </p>
                            <p className="text-xs text-stone-400">
                              🕐 {pickupStart} – {pickupEnd} · {box.stockQuantity} kaldı
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-extrabold text-emerald-600">
                              ₺{box.discountedPrice}
                            </p>
                            <p className="text-xs text-stone-400 line-through">₺{box.originalPrice}</p>
                            <p className="text-xs font-medium text-amber-600">💰 ₺{savings} tasarruf</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* No active boxes fallback */}
                {!hasBoxes && (
                  <div className="border-t border-stone-50 px-4 py-3">
                    <p className="text-xs text-stone-400 text-center">
                      Bugün aktif kutu yok. Yarın tekrar kontrol et!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
