"use client";

import { useLocation } from "@/contexts/LocationContext";

export default function LocationHeader() {
  const { granted, loading, requestLocation } = useLocation();

  if (loading) {
    return (
      <span className="flex items-center gap-1 text-sm text-stone-400 animate-pulse">
        <span>📍</span>
        <span>Konum alınıyor…</span>
      </span>
    );
  }

  if (!granted) {
    return (
      <button
        onClick={requestLocation}
        className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        <span>📍</span>
        <span>Konum izni ver</span>
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
      <span>📍</span>
      <span>Konumunuz</span>
    </span>
  );
}
