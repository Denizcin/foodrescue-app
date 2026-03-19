"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  pickupEnd: string;
  businessName: string;
  pickupCode: string;
}

interface Props {
  urgentOrders: Order[];
}

export default function PickupReminderBanner({ urgentOrders }: Props) {
  const [visible, setVisible] = useState(true);

  // Re-hide after user dismisses (resets on next render cycle / navigation)
  if (!visible || urgentOrders.length === 0) return null;

  const order = urgentOrders[0];
  const pickupEnd = new Date(order.pickupEnd);
  const minutesLeft = Math.max(
    0,
    Math.floor((pickupEnd.getTime() - Date.now()) / 60_000)
  );

  return (
    <div className="relative flex items-center gap-3 bg-amber-500 px-4 py-3 text-white">
      <span className="text-xl">⏰</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          {order.businessName} — Teslim alma sona eriyor!
        </p>
        <p className="text-xs opacity-90">
          {minutesLeft} dakika kaldı · Kod: <strong>{order.pickupCode}</strong>
        </p>
      </div>
      <Link
        href={`/consumer/orders/${order.id}`}
        className="shrink-0 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/30 transition-colors"
      >
        Görüntüle
      </Link>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 ml-1 opacity-70 hover:opacity-100"
        aria-label="Kapat"
      >
        ✕
      </button>
    </div>
  );
}
