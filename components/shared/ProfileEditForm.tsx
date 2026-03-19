"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/profile-actions";

interface Props {
  initialName: string;
  initialPhone: string;
  emailVerified: boolean;
  email: string;
}

export default function ProfileEditForm({ initialName, initialPhone, emailVerified, email }: Props) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      const res = await updateProfile({ name, phone });
      if (res.success) {
        setStatus("success");
        setMessage("Profil güncellendi.");
      } else {
        setStatus("error");
        setMessage(res.error ?? "Bir hata oluştu.");
      }
    });
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-stone-800">Hesap Bilgileri</h2>
        {!emailVerified && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            ⚠️ E-posta doğrulanmamış
          </span>
        )}
      </div>

      <div className="text-sm">
        <span className="text-stone-500">E-posta: </span>
        <span className="font-medium text-stone-800 break-all">{email}</span>
        {emailVerified && <span className="ml-2 text-xs text-emerald-600">✓ Doğrulandı</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Ad Soyad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
            minLength={2}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Telefon (opsiyonel)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 5XX XXX XXXX"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {status !== "idle" && (
          <p className={`text-xs font-medium ${status === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
