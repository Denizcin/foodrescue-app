"use client";

import { useState } from "react";
import { approveAllPending, refreshBetaBoxes } from "@/lib/admin-actions";

export default function AdminBetaActions({ pendingCount }: { pendingCount: number }) {
  const [approveState, setApproveState] = useState<"idle" | "loading" | "done">("idle");
  const [refreshState, setRefreshState] = useState<"idle" | "loading" | "done">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function handleApproveAll() {
    if (!confirm(`${pendingCount} bekleyen işletmenin tamamı onaylanacak. Devam?`)) return;
    setApproveState("loading");
    setMsg(null);
    const res = await approveAllPending();
    setApproveState("done");
    setMsg(res.success
      ? `✅ ${(res.data as { count: number }).count} işletme onaylandı.`
      : `❌ ${res.error}`);
    setTimeout(() => { setApproveState("idle"); setMsg(null); }, 4000);
  }

  async function handleRefreshBoxes() {
    if (!confirm("Tüm mevcut aktif kutular kapatılacak ve her onaylı işletme için yeni kutular oluşturulacak. Devam?")) return;
    setRefreshState("loading");
    setMsg(null);
    const res = await refreshBetaBoxes();
    setRefreshState("done");
    if (res.success) {
      const d = res.data as { businesses: number; boxes: number };
      setMsg(`✅ ${d.businesses} işletme için ${d.boxes} yeni kutu oluşturuldu.`);
    } else {
      setMsg(`❌ ${res.error}`);
    }
    setTimeout(() => { setRefreshState("idle"); setMsg(null); }, 4000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pendingCount > 0 && (
        <button
          onClick={handleApproveAll}
          disabled={approveState === "loading"}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
        >
          {approveState === "loading" ? "Onaylanıyor…" : `✓ Tümünü Onayla (${pendingCount})`}
        </button>
      )}
      <button
        onClick={handleRefreshBoxes}
        disabled={refreshState === "loading"}
        className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-60 transition-colors"
      >
        {refreshState === "loading" ? "Yenileniyor…" : "🔄 Beta Kutularını Yenile"}
      </button>
      {msg && (
        <span className="text-xs font-medium text-stone-600">{msg}</span>
      )}
    </div>
  );
}
