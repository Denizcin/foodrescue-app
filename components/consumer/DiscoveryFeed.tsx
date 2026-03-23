"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { BoxCategory, BusinessCategory, SurpriseBox } from "@/lib/types";
import CategoryBadge from "@/components/shared/CategoryBadge";
import { useLocation } from "@/contexts/LocationContext";
import { haversineDistance } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions";

const BusinessMap = dynamic(() => import("@/components/consumer/BusinessMap"), { ssr: false });

const TRIGGERS = [
  "Akşam yemeği yapmaya enerjin mi yok? 🍴",
  "Ne yiyeceğine karar veremedin mi? 🤔",
  "Ay sonu bütçen mi daraldı? 💸",
  "Bugün kendine güzel bir sürpriz yap! 🎁",
];

type FilterKey = "ALL" | BusinessCategory;

const PILLS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: "ALL",         label: "Tümü",     emoji: "✨" },
  { key: "BAKERY",      label: "Fırın",    emoji: "🥐" },
  { key: "RESTAURANT",  label: "Restoran", emoji: "🍽️" },
  { key: "GROCERY",     label: "Market",   emoji: "🛒" },
  { key: "CAFE",        label: "Kafe",     emoji: "☕" },
  { key: "GREENGROCER", label: "Manav",    emoji: "🥕" },
  { key: "PATISSERIE",  label: "Pastane",  emoji: "🎂" },
  { key: "DELI",        label: "Şarküteri",emoji: "🥩" },
];

const BOX_META: Record<BoxCategory, { emoji: string; label: string; gradient: string }> = {
  BAKERY:        { emoji: "🥐", label: "Fırın Kutusu",      gradient: "from-amber-100 to-amber-200" },
  SUSHI:         { emoji: "🍣", label: "Suşi Kutusu",       gradient: "from-pink-100 to-pink-200" },
  GROCERY:       { emoji: "🛒", label: "Market Kutusu",     gradient: "from-sky-100 to-sky-200" },
  DELI:          { emoji: "🥩", label: "Şarküteri Kutusu",  gradient: "from-red-100 to-red-200" },
  CAFE:          { emoji: "☕", label: "Kafe Kutusu",        gradient: "from-stone-100 to-stone-200" },
  PREPARED_MEAL: { emoji: "🍱", label: "Hazır Yemek",       gradient: "from-orange-100 to-orange-200" },
  PRODUCE:       { emoji: "🥕", label: "Manav Kutusu",      gradient: "from-green-100 to-green-200" },
  MIXED:         { emoji: "🎁", label: "Karışık Kutu",      gradient: "from-purple-100 to-purple-200" },
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

/* ── Heart icon ──────────────────────────────────────────── */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-5 w-5 transition-colors ${filled ? "text-red-500" : "text-stone-300"}`}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 018.108-2.7A4.5 4.5 0 0121 8.5c0 6-9 12.5-9 12.5z" />
    </svg>
  );
}

/* ── Filter panel ────────────────────────────────────────── */
// Price-only filter panel; category is handled by the quick pills in the sticky bar.
function FilterPanel({
  initialPriceMax,
  onApply,
  onClose,
}: {
  initialPriceMax: string;
  onApply: (priceMax: string) => void;
  onClose: () => void;
}) {
  const [pendingPriceMax, setPendingPriceMax] = useState(initialPriceMax);

  const hasChanges = pendingPriceMax !== initialPriceMax;

  function handleApply() {
    onApply(pendingPriceMax);
    onClose();
  }

  function handleClear() {
    setPendingPriceMax("");
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-stone-900">Filtrele</p>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100"
          aria-label="Filtreyi kapat"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>

      {/* Price section */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Maksimum Fiyat
        </p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">₺</span>
          <input
            type="number"
            value={pendingPriceMax}
            onChange={(e) => setPendingPriceMax(e.target.value)}
            placeholder="ör. 100"
            min={0}
            className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-3 text-sm text-stone-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleClear}
          disabled={pendingPriceMax === ""}
          className="flex-1 rounded-xl border border-stone-200 py-3 text-xs font-semibold text-stone-600 hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-colors"
        >
          Temizle
        </button>
        <button
          onClick={handleApply}
          className={[
            "flex-1 rounded-xl py-3 text-xs font-bold text-white transition-all",
            hasChanges
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200"
              : "bg-emerald-500 hover:bg-emerald-600",
          ].join(" ")}
        >
          Filtreyi Uygula
        </button>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
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

  const annotated = boxes.map((box) => {
    const bLat = box.business?.locationLat ?? 0;
    const bLng = box.business?.locationLng ?? 0;
    const dist = haversineDistance(userLat, userLng, bLat, bLng);
    return { box, dist };
  });

  const withinRadius = granted && !showAll
    ? annotated.filter((a) => a.dist <= DEFAULT_RADIUS_KM)
    : annotated;

  const filtered = withinRadius
    .filter(({ box }) => activeFilter === "ALL" ? true : box.business?.category === activeFilter)
    .filter(({ box }) => searchQuery.trim() ? box.business?.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) : true)
    .filter(({ box }) => priceMax !== "" && !isNaN(Number(priceMax)) && Number(priceMax) > 0 ? box.discountedPrice <= Number(priceMax) : true);

  const sorted = [...filtered].sort((a, b) => {
    const aOut = a.box.stockQuantity === 0;
    const bOut = b.box.stockQuantity === 0;
    if (aOut !== bOut) return aOut ? 1 : -1;
    return a.dist - b.dist;
  });

  const hasActiveFilters =
    searchQuery.trim() !== "" || priceMax !== "" || activeFilter !== "ALL";

  const activeCategory = PILLS.find((p) => p.key === activeFilter);

  // Filter button is highlighted when filter panel is open OR any filter is active
  const filterButtonActive = showFilters || priceMax !== "" || activeFilter !== "ALL";

  function handleApplyFilters(price: string) {
    setPriceMax(price);
  }

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
    <div className="flex flex-col">
      {/* ── Sticky search + pills bar ──────────────────────── */}
      <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-sm border-b border-stone-100 px-4 pt-3 pb-2 space-y-2">
        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7" cy="7" r="5" />
              <path d="M12 12l2.5 2.5" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İşletme adı ara..."
              className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Aramayı temizle"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Filtrele"
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              filterButtonActive
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-stone-500 ring-1 ring-stone-200 hover:ring-emerald-300",
            ].join(" ")}
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 4h12M4 8h8M6 12h4" />
            </svg>
          </button>
          <button
            onClick={() => setShowMap((v) => !v)}
            aria-label={showMap ? "Liste görünümü" : "Harita görünümü"}
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              showMap
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-stone-500 ring-1 ring-stone-200 hover:ring-emerald-300",
            ].join(" ")}
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12V2l4.5 2L10 2l5 2v10l-5-2-4.5 2L1 12z" />
              <path d="M5.5 4v8M10 2v10" />
            </svg>
          </button>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5">
            {searchQuery.trim() && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                🔍 &quot;{searchQuery.trim()}&quot;
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-0.5 text-emerald-400 hover:text-emerald-700"
                  aria-label="Arama filtreni kaldır"
                >
                  ×
                </button>
              </span>
            )}
            {activeFilter !== "ALL" && activeCategory && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                {activeCategory.emoji} {activeCategory.label}
                <button
                  onClick={() => setActiveFilter("ALL")}
                  className="ml-0.5 text-emerald-400 hover:text-emerald-700"
                  aria-label="Kategori filtreni kaldır"
                >
                  ×
                </button>
              </span>
            )}
            {priceMax && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                ≤ ₺{priceMax}
                <button
                  onClick={() => setPriceMax("")}
                  className="ml-0.5 text-emerald-400 hover:text-emerald-700"
                  aria-label="Fiyat filtreni kaldır"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Category pills (quick filter, applies immediately) */}
        {!showMap && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PILLS.map((pill) => (
              <button
                key={pill.key}
                onClick={() => setActiveFilter(pill.key)}
                className={[
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  activeFilter === pill.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-emerald-300",
                ].join(" ")}
              >
                <span aria-hidden="true">{pill.emoji}</span>
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop inline filter dropdown ─────────────────── */}
      {showFilters && (
        <div className="hidden md:block mx-4 mt-2 rounded-2xl bg-white p-5 ring-1 ring-stone-100 shadow-sm">
          <FilterPanel

            initialPriceMax={priceMax}
            onApply={handleApplyFilters}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* Contextual trigger bar */}
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
          <span className="shrink-0 text-lg" aria-hidden="true">💬</span>
          <p className="text-sm font-medium text-amber-800">{trigger}</p>
        </div>

        {/* Location line */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500">
            {granted && !showAll
              ? `📍 ${sorted.length} kutu ${DEFAULT_RADIUS_KM} km içinde`
              : `📍 İstanbul genelinde ${sorted.length} kutu`}
          </p>
        </div>

        {/* Map view */}
        {showMap && (
          <div className="rounded-2xl overflow-hidden ring-1 ring-stone-100">
            <BusinessMap boxes={sorted.map((a) => a.box)} userLat={userLat} userLng={userLng} />
          </div>
        )}

        {/* Box cards */}
        {!showMap && (
          <div className="flex flex-col gap-3">
            {sorted.length === 0 && (
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-white py-14 text-center ring-1 ring-stone-100">
                <span className="text-5xl" aria-hidden="true">🔍</span>
                <div>
                  <p className="text-sm font-semibold text-stone-700">
                    {hasActiveFilters ? "Eşleşen kutu bulunamadı" : "Bu kategoride kutu yok"}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    {hasActiveFilters ? "Filtreleri değiştirmeyi dene" : "Farklı bir kategori seç"}
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setSearchQuery(""); setPriceMax(""); setActiveFilter("ALL"); }}
                    className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                )}
                {!hasActiveFilters && granted && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Tüm kutuları göster
                  </button>
                )}
              </div>
            )}

            {sorted.map(({ box, dist }) => {
              const soldOut = box.stockQuantity === 0;
              const expired = isExpired(box.pickupTimeEnd);
              const unavailable = soldOut || expired;
              const lowStock = !soldOut && box.stockQuantity <= 3;
              const savings = box.originalPrice - box.discountedPrice;
              const meta = BOX_META[box.category];
              const businessId = box.business?.id ?? "";
              const isFav = favoriteIds.has(businessId);

              return (
                <Link
                  key={box.id}
                  href={unavailable ? "#" : `/consumer/box/${box.id}`}
                  data-testid="box-card"
                  className={[
                    "relative flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100",
                    "transition-all duration-150",
                    unavailable
                      ? "pointer-events-none opacity-50"
                      : "hover:shadow-md hover:ring-stone-200 active:scale-[0.99]",
                  ].join(" ")}
                >
                  {/* Sold out / expired overlay */}
                  {unavailable && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <span className="rounded-full bg-stone-800/75 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                        {soldOut ? "Tükendi" : "Süre Doldu"}
                      </span>
                    </div>
                  )}

                  {/* Left: colored gradient with emoji */}
                  <div className={`flex w-20 shrink-0 items-center justify-center bg-gradient-to-br ${meta.gradient}`}>
                    <span className="text-4xl" aria-hidden="true">{meta.emoji}</span>
                  </div>

                  {/* Right: content */}
                  <div className="flex flex-1 flex-col gap-1.5 p-3 min-w-0">
                    {/* Top row: business name + distance */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-900 leading-tight truncate">
                          {box.business?.name ?? "İşletme"}
                        </p>
                        <p className="text-xs text-stone-400 truncate">{box.business?.address}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
                          📍 {formatDist(dist)}
                        </span>
                        {box.business && <CategoryBadge category={box.business.category} />}
                      </div>
                    </div>

                    {/* Box type */}
                    <p className="text-xs font-medium text-stone-600">{meta.emoji} {meta.label}</p>

                    {/* Price row */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 line-through">₺{box.originalPrice}</span>
                      <span className="text-base font-extrabold text-emerald-600">₺{box.discountedPrice}</span>
                      <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        💰 ₺{savings} tasarruf
                      </span>
                    </div>

                    {/* Bottom row: pickup time + stock + heart */}
                    <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500">
                      <span>🕐 {formatTime(box.pickupTimeStart)}–{formatTime(box.pickupTimeEnd)}</span>
                      <div className="flex items-center gap-2">
                        {lowStock ? (
                          <span className="font-bold text-amber-500">Son {box.stockQuantity} kutu!</span>
                        ) : (
                          <span className="text-emerald-600">{box.stockQuantity} kutu</span>
                        )}
                        {isLoggedIn && businessId && (
                          <button
                            onClick={(e) => handleToggleFavorite(e, businessId)}
                            className={[
                              "flex items-center justify-center h-6 w-6 rounded-full transition-all active:scale-90",
                              isFav ? "bg-red-50 text-red-500" : "bg-stone-100 text-stone-400 hover:text-red-400",
                            ].join(" ")}
                            aria-label={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
                          >
                            <HeartIcon filled={isFav} />
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

        {/* Expand / collapse radius */}
        {granted && !showAll && !showMap && sorted.length > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full rounded-xl border border-dashed border-stone-300 py-3 text-xs font-semibold text-stone-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
          >
            Tüm kutuları göster ({annotated.length} toplam)
          </button>
        )}
        {showAll && granted && (
          <button
            onClick={() => setShowAll(false)}
            className="w-full rounded-xl border border-dashed border-stone-300 py-3 text-xs font-semibold text-stone-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
          >
            Yalnızca yakınımdakileri göster
          </button>
        )}

        {/* Nominate CTA card */}
        <Link
          href="/consumer/nominate"
          className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 px-4 py-4 ring-1 ring-emerald-200 hover:shadow-sm transition-all duration-150"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-sm ring-1 ring-emerald-100" aria-hidden="true">
            💡
          </span>
          <div>
            <p className="text-sm font-bold text-emerald-800">Burada olmayan bir işletme mi var?</p>
            <p className="mt-0.5 text-xs text-emerald-600">Öner — biz onlarla iletişime geçelim!</p>
          </div>
          <svg className="ml-auto h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>

      {/* ── Mobile filter bottom sheet ──────────────────────── */}
      {showFilters && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-5 pb-8 shadow-2xl animate-slide-up">
            <div className="mb-4 mx-auto h-1 w-10 rounded-full bg-stone-200" aria-hidden="true" />
            <FilterPanel
  
              initialPriceMax={priceMax}
              onApply={handleApplyFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
