import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FoodRescue — Sürpriz Kutuları Keşfet, Tasarruf Et, İsrafı Önle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #047857 0%, #059669 55%, #065f46 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Decorative background circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex" }} />
        <div style={{ position: "absolute", top: 60, left: 80, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
          <span style={{ fontSize: 88, lineHeight: 1 }}>🌿</span>
          <span style={{ fontSize: 96, fontWeight: 900, color: "#ffffff", letterSpacing: "-4px", lineHeight: 1 }}>
            FoodRescue
          </span>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 32, color: "#a7f3d0", fontWeight: 500 }}>Sürpriz Kutuları Keşfet</span>
          <span style={{ fontSize: 24, color: "#6ee7b7" }}>·</span>
          <span style={{ fontSize: 32, color: "#a7f3d0", fontWeight: 500 }}>Tasarruf Et</span>
          <span style={{ fontSize: 24, color: "#6ee7b7" }}>·</span>
          <span style={{ fontSize: 32, color: "#a7f3d0", fontWeight: 500 }}>İsrafı Önle</span>
        </div>

        {/* Food emoji row */}
        <div style={{ display: "flex", gap: 32, fontSize: 68 }}>
          <span>🥐</span>
          <span>🍱</span>
          <span>🛒</span>
          <span>☕</span>
          <span>🥕</span>
          <span>🍣</span>
        </div>

        {/* Bottom: domain + badge */}
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.13)", borderRadius: 14, padding: "12px 24px" }}>
            <span style={{ fontSize: 24, color: "#d1fae5", fontWeight: 600 }}>
              Türkiye'nin Gıda Kurtarma Platformu
            </span>
          </div>
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
            foodrescue.com.tr
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
