"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { BoxCategory, BusinessCategory, SurpriseBox } from "@/lib/types";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { useLocation } from "@/contexts/LocationContext";
import { haversineDistance } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions";

// Leaflet requires `window` — load without SSR
const BusinessMap = dynamic(() => import("@/components/consumer/BusinessMap"), { ssr: false });

const TRIGGERS = [
  "Akşam yemeği yapmaya enerjin mi yok?",
  "Ne yiyeceğine karar veremedin mi?",
  "Ay sonu bütçen mi daraldı?",
];

type FilterKey = "ALL" | BusinessCategory;
const PILLS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: "ALL",        label: "Tümü",    emoji: "✨" },
  { key: "BAKERY",     label: "Fırın",   emoji: "🥐" },
  { key: "RESTAURANT", label: "Restoran",emoji: "🍽️" },
  { key: "GROCERY",    label: "Market",  emoji: "🛒" },
  { key: "CAFE",       label: "Kafe",    emoji: "☕" },
  { key: "GREENGROCER",label: "Manav",   emoji: "🥕" },
];

const BOX_LABEL: Record<BoxCategory, { emoji: string; label: string }> = {
  BAKERY:        { emoji: "🥐", label: "Fırın Kutusu" },
  SUSHI:         { emoji: "🍣", label: "Suşi Kutusu" },
  GROCERY:       { emoji: "🛒", label: "Market Kutusu" },
  DELI:          { emoji: "🥩", label: "Şarküteri Kutusu" },
  CAFE:          { emoji: "☕", label: "Kafe Kutusu" },
  PREPARED_MEAL: { emoji: "🍱", label: "Hazır Yemek" },
  PRODUCE:       { emoji: "🥕", label: "Manav Kutusu" },
  MIXED:         { emoji: "🎁", label: "Karışık Kutu" },
};

const DEFAULT_RADIUS_KM = 50;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function isExpired(pickupTimeEnd: string) {
  return new Date() > new Date(pickupTimeEnd);
}

function formatDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export default function DiscoveryFeed({
  boxes,
  favoriteBusinessIds: initialFavoriteIds = [],
  isLoggedIn = false,
}: {
  boxes: SurpriseBox[];
  favoriteBusinessIds?: string[];
  isLoggedIn?: boolean;
}) {
  const { lat: userLat, lng: userLng, granted } = useLocation();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [showMap, setShowMap] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds));
  const [, startTransition] = useTransition();

  const trigger = TRIGGERS[new Date().getMinutes() % TRIGGERS.length];

  // Annotate each box with distance from the user
  const annotated = boxes.map((box) => {
    const bLat = box.business?.locationLat ?? 0;
    const bLng = box.business?.locationLng ?? 0;
    const dist = haversineDistance(userLat, userLng, bLat, bLng);
    return { box, dist };
  });

  const withinRadius = granted && !showAll
    ? annotated.filter((a) => a.dist <= DEFAULT_RADIUS_KM)
    : annotated;

  const categoryFiltered = withinRadius.filter(({ box }) =>
    activeFilter === "ALL" ? true : box.business?.category === activeFilter
  );

  const searchFiltered = searchQuery.trim()
    ? categoryFiltered.filter(({ box }) =>
        box.business?.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : categoryFiltered;

  const priceFiltered =
    priceMax !== "" && !isNaN(Number(priceMax)) && Number(priceMax) > 0
      ? searchFiltered.filter(({ box }) => box.discountedPrice <= Number(priceMax))
      : searchFiltered;

  // Sort: available first (by distance), sold-out at the bottom
  const sorted = [...priceFiltered].sort((a, b) => {
    const aOut = a.box.stockQuantity === 0;
    const bOut = b.box.stockQuantity === 0;
    if (aOut !== bOut) return aOut ? 1 : -1;
    return a.dist - b.dist;
  });

  const hasActiveFilters = searchQuery.trim() !== "" || priceMax !== "";

  function handleToggleFavorite(e: React.MouseEvent, businessId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) return;
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(businessId)) next.delete(businessId); else next.add(businessId);
      return next;
    });
    startTransition(async () => {
      const result = await toggleFavorite(businessId);
      if (!result.success) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(businessId)) next.delete(businessId); else next.add(businessId);
          return next;
        });
      }
    });
  }

  return (
    <div className="px-4 pt-4">
      {/* Contextual trigger */}
      <div className="mb-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
        💬 {trigger}
      </div>

      {/* Search bar */}
      <div className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İşletme adı ara..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-8 pr-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
            showFilters || priceMax
              ? "bg-emerald-600 text-white"
              : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-emerald-300"
          }`}
        >
          ⚙️ Filtre
        </button>
      </div>

      {/* Price filter panel */}
      {showFilters && (
        <div className="mb-3 rounded-xl bg-white p-4 ring-1 ring-stone-100 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Maksimum Fiyat
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Örn: 100"
              min={0}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <span className="shrink-0 text-sm font-semibold text-stone-500">₺</span>
            {priceMax && (
              <button
                onClick={() => setPriceMax("")}
                className="shrink-0 text-xs font-medium text-red-500 hover:text-red-600"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mb-3 flex flex-wrap gap-2">
          {searchQuery.trim() && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              🔍 &quot;{searchQuery.trim()}&quot;
              <button onClick={() => setSearchQuery("")} className="ml-1 text-emerald-500 hover:text-emerald-700">✕</button>
            </span>
          )}
          {priceMax && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              ≤ ₺{priceMax}
              <button onClick={() => setPriceMax("")} className="ml-1 text-emerald-500 hover:text-emerald-700">✕</button>
            </span>
          )}
        </div>
      )}

      {/* Location summary + map toggle */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-stone-500">
          {granted && !showAll
            ? `📍 ${sorted.length} kutu ${DEFAULT_RADIUS_KM} km içinde`
            : `📍 İstanbul genelinde ${sorted.length} kutu`}
        </p>
        <button
          onClick={() => setShowMap((v) => !v)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            showMap
              ? "bg-emerald-600 text-white"
              : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-emerald-300"
          }`}
        >
          {showMap ? "📋 Liste" : "🗺️ Harita"}
        </button>
      </div>

      {/* Map view */}
      {showMap && (
        <div className="mb-4">
          <BusinessMap boxes={sorted.map((a) => a.box)} userLat={userLat} userLng={userLng} />
        </div>
      )}

      {/* Category pills */}
      {!showMap && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PILLS.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setActiveFilter(pill.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === pill.key
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-emerald-300"
              }`}
            >
              <span>{pill.emoji}</span>
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Box cards */}
      {!showMap && (
        <div className="flex flex-col gap-3">
          {sorted.length === 0 && (
            <div className="py-10 text-center text-stone-400 flex flex-col items-center gap-3">
              <p className="text-3xl">🔍</p>
              <p className="text-sm">
                {hasActiveFilters
                  ? "Filtrelere uyan kutu bulunamadı."
                  : granted && !showAll
                  ? `${DEFAULT_RADIUS_KM} km içinde kutu bulunamadı.`
                  : "Bu kategoride kutu bulunamadı."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={() => { setSearchQuery(""); setPriceMax(""); }}
                  className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              ) : (
                granted && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    Tüm kutuları göster
                  </button>
                )
              )}
            </div>
          )}

          {sorted.map(({ box, dist }) => {
            const soldOut = box.stockQuantity === 0;
            const expired = isExpired(box.pickupTimeEnd);
            const unavailable = soldOut || expired;
            const lowStock = !soldOut && box.stockQuantity <= 3;
            const savings = box.originalPrice - box.discountedPrice;
            const boxLabel = BOX_LABEL[box.category];
            const businessId = box.business?.id ?? "";
            const isFav = favoriteIds.has(businessId);

            return (
              <Link
                key={box.id}
                href={`/consumer/box/${box.id}`}
                data-testid="box-card"
                className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 transition-shadow hover:shadow-md ${
                  unavailable ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {(soldOut || expired) && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <span className="rounded-full bg-stone-800/80 px-4 py-1.5 text-sm font-bold text-white">
                      {soldOut ? "Tükendi" : "Süre Doldu"}
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 text-sm leading-tight">
                        {box.business?.name ?? "İşletme"}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400 truncate max-w-[180px]">
                        {box.business?.address}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {box.business && <CategoryBadge category={box.business.category} />}
                      <span className="text-xs font-semibold text-stone-400">
                        📍 {formatDist(dist)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm font-medium text-stone-700">
                    {boxLabel.emoji} {boxLabel.label}
                  </p>
                  <p className="mt-1 text-xs text-stone-400 italic">
                    Kutunun içeriği sürprizdir! İçindekiler günden güne değişiklik gösterebilir.
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-stone-400 line-through">₺{box.originalPrice}</span>
                    <span className="text-lg font-extrabold text-emerald-600">₺{box.discountedPrice}</span>
                    <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      💰 ₺{savings} tasarruf
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                    <span>🕐 {formatTime(box.pickupTimeStart)} – {formatTime(box.pickupTimeEnd)}</span>
                    <div className="flex items-center gap-2">
                      {lowStock ? (
                        <span className="font-semibold text-amber-500">Son {box.stockQuantity} kutu!</span>
                      ) : (
                        <span className="text-emerald-600">{box.stockQuantity} kutu kaldı</span>
                      )}
                      {isLoggedIn && businessId && (
                        <button
                          onClick={(e) => handleToggleFavorite(e, businessId)}
                          className={`text-lg leading-none transition-transform active:scale-90 ${
                            isFav ? "text-red-500" : "text-stone-300 hover:text-red-400"
                          }`}
                          title={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
                        >
                          {isFav ? "❤️" : "🤍"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Expand beyond radius */}
      {granted && !showAll && !showMap && sorted.length > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 w-full rounded-xl border border-dashed border-stone-300 py-3 text-xs font-semibold text-stone-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          Tüm kutuları göster ({annotated.length} toplam)
        </button>
      )}
      {showAll && granted && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-3 w-full rounded-xl border border-dashed border-stone-300 py-3 text-xs font-semibold text-stone-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          Yalnızca yakınımdakileri göster
        </button>
      )}

      <Link
        href="/consumer/nominate"
        className="mt-6 mb-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 py-3.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
      >
        💡 Burada görmek istediğin bir işletme mi var? Öner!
      </Link>
    </div>
  );
}
