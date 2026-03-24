import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "FoodRescue Sürpriz Kutusu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BOX_META: Record<string, { emoji: string; label: string; bg: string; accent: string }> = {
  BAKERY:        { emoji: "🥐", label: "Fırın Kutusu",      bg: "#fef9ee", accent: "#d97706" },
  SUSHI:         { emoji: "🍣", label: "Suşi Kutusu",       bg: "#fff0f6", accent: "#db2777" },
  GROCERY:       { emoji: "🛒", label: "Market Kutusu",     bg: "#eff6ff", accent: "#2563eb" },
  DELI:          { emoji: "🥩", label: "Şarküteri Kutusu",  bg: "#fef2f2", accent: "#dc2626" },
  CAFE:          { emoji: "☕", label: "Kafe Kutusu",        bg: "#fafaf9", accent: "#78716c" },
  PREPARED_MEAL: { emoji: "🍱", label: "Hazır Yemek",       bg: "#fff7ed", accent: "#ea580c" },
  PRODUCE:       { emoji: "🥕", label: "Manav Kutusu",      bg: "#f0fdf4", accent: "#16a34a" },
  MIXED:         { emoji: "🎁", label: "Karışık Kutu",      bg: "#faf5ff", accent: "#9333ea" },
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const box = await prisma.surpriseBox
    .findUnique({
      where: { id },
      include: { business: { select: { name: true, address: true } } },
    })
    .catch(() => null);

  const meta = BOX_META[box?.category ?? "MIXED"] ?? BOX_META.MIXED;
  const savings = box ? (box.originalPrice - box.discountedPrice).toFixed(0) : "0";

  return new ImageResponse(
    (
      <div
        style={{
          background: meta.bg,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#059669",
            padding: "22px 56px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 30 }}>🌿</span>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            FoodRescue
          </span>
          <span style={{ marginLeft: "auto", fontSize: 22, color: "#a7f3d0", fontWeight: 500 }}>
            Sürpriz Kutu
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "48px 56px",
            gap: 52,
            alignItems: "center",
          }}
        >
          {/* Emoji card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 210,
              height: 210,
              borderRadius: 36,
              background: "rgba(255,255,255,0.85)",
              flexShrink: 0,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <span style={{ fontSize: 120, lineHeight: 1 }}>{meta.emoji}</span>
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 14 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: meta.accent }}>{meta.label}</span>
            <span
              style={{
                fontSize: 58,
                fontWeight: 900,
                color: "#111827",
                lineHeight: 1.05,
                letterSpacing: "-1.5px",
              }}
            >
              {box?.business?.name ?? "İşletme"}
            </span>
            <span style={{ fontSize: 24, color: "#6b7280" }}>
              📍 {box?.business?.address ?? ""}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  color: "#059669",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                ₺{box?.discountedPrice ?? "–"}
              </span>
              <span
                style={{
                  fontSize: 38,
                  color: "#9ca3af",
                  textDecoration: "line-through",
                  lineHeight: 1,
                }}
              >
                ₺{box?.originalPrice ?? ""}
              </span>
              <div
                style={{
                  display: "flex",
                  background: "#fef3c7",
                  borderRadius: 99,
                  padding: "10px 28px",
                  marginLeft: 8,
                }}
              >
                <span style={{ fontSize: 26, fontWeight: 700, color: "#92400e" }}>
                  💰 ₺{savings} tasarruf
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
