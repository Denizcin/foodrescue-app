"use client";

import { useState } from "react";
import { approveBusiness, rejectBusiness } from "@/lib/admin-actions";

interface BusinessActionsProps {
  businessId: string;
  isApproved: boolean;
}

export default function BusinessActions({ businessId, isApproved }: BusinessActionsProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"approved" | "rejected" | null>(
    isApproved ? "approved" : null
  );

  async function handleApprove() {
    setLoading(true);
    const result = await approveBusiness(businessId);
    if (result.success) setStatus("approved");
    setLoading(false);
  }

  async function handleReject() {
    if (!confirm("Bu işletmeyi reddetmek istediğinize emin misiniz?")) return;
    setLoading(true);
    const result = await rejectBusiness(businessId);
    if (result.success) setStatus("rejected");
    setLoading(false);
  }

  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        ✓ Onaylı
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
        ✕ Reddedildi
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Onayla
      </button>
      <button
        onClick={handleReject}
        disabled={loading}
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reddet
      </button>
    </div>
  );
}
