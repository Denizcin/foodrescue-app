"use client";

import { useState, useTransition } from "react";
import { updateNotificationPreferences } from "@/lib/actions";

type Prefs = {
  orderEmails: boolean;
  newBoxAlerts: boolean;
  promotionalEmails: boolean;
};

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-stone-800">{label}</p>
        <p className="text-xs text-stone-500 mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 shrink-0 h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 ${
          checked ? "bg-emerald-500" : "bg-stone-300"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationSettings({ initialPrefs }: { initialPrefs: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initialPrefs);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set(key: keyof Prefs, value: boolean) {
    setPrefs((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateNotificationPreferences(prefs);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-4">
      <h2 className="text-sm font-bold text-stone-800">🔔 Bildirim Tercihleri</h2>

      <div className="space-y-4 divide-y divide-stone-50">
        <Toggle
          label="Sipariş E-postaları"
          description="Sipariş onayı, iptal ve teslim alma bildirimleri"
          checked={prefs.orderEmails}
          onChange={(v) => set("orderEmails", v)}
        />
        <div className="pt-4">
          <Toggle
            label="Yeni Kutu Bildirimleri"
            description="Favori işletmelerinden yeni kutu yayınlandığında"
            checked={prefs.newBoxAlerts}
            onChange={(v) => set("newBoxAlerts", v)}
          />
        </div>
        <div className="pt-4">
          <Toggle
            label="Promosyon E-postaları"
            description="Kampanyalar, haberler ve özel teklifler"
            checked={prefs.promotionalEmails}
            onChange={(v) => set("promotionalEmails", v)}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Kaydediliyor..." : saved ? "✓ Kaydedildi!" : "Tercihleri Kaydet"}
      </button>
    </div>
  );
}
