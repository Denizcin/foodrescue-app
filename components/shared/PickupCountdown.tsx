"use client";

import { useEffect, useState } from "react";

function getRemaining(targetTime: string): number {
  return Math.max(0, new Date(targetTime).getTime() - Date.now());
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}s ${minutes}dk kaldı`;
  if (minutes > 0) return `${minutes}dk kaldı`;
  return "Az kaldı";
}

export default function PickupCountdown({
  targetTime,
  label,
}: {
  targetTime: string;
  label?: string;
}) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemaining(targetTime));
    }, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, [targetTime]);

  const isExpired = remaining === 0;
  const isUrgent = remaining > 0 && remaining < 30 * 60 * 1000; // < 30 min

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-red-500">
        ⏰ Teslim alma süresi doldu
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        isUrgent ? "text-red-500" : "text-emerald-600"
      }`}
    >
      ⏱ {label && <span>{label} · </span>}
      {formatRemaining(remaining)}
    </span>
  );
}
