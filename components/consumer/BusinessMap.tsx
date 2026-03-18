"use client";

// This component is always loaded via `dynamic(..., { ssr: false })` — Leaflet
// requires the browser's `window` object and cannot be server-rendered.

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { SurpriseBox, Business } from "@/lib/types";

// Fix Leaflet's broken default icon paths when bundled with Webpack/Turbopack
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface Props {
  boxes: SurpriseBox[];
  userLat: number;
  userLng: number;
}

export default function BusinessMap({ boxes, userLat, userLng }: Props) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Aggregate active box count per business
  const businessMap = new Map<string, { business: Business; activeBoxes: number }>();
  for (const box of boxes) {
    if (!box.business) continue;
    const b = box.business;
    const entry = businessMap.get(b.id);
    if (entry) {
      entry.activeBoxes++;
    } else {
      businessMap.set(b.id, { business: b, activeBoxes: 1 });
    }
  }

  return (
    <div className="h-[58vh] w-full overflow-hidden rounded-2xl ring-1 ring-stone-200">
      <MapContainer
        center={[userLat, userLng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {Array.from(businessMap.values()).map(({ business, activeBoxes }) => (
          <Marker
            key={business.id}
            position={[business.locationLat, business.locationLng]}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{business.name}</p>
                <p className="text-stone-500 text-xs">{business.address}</p>
                <p className="mt-1 font-semibold text-emerald-700">
                  {activeBoxes} aktif kutu
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
