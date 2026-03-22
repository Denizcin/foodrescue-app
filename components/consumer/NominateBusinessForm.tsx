"use client";

import { useState } from "react";
import { nominateBusiness } from "@/lib/actions";

interface FormState {
  nominatorName: string;
  nominatorPhone: string;
  nominatorEmail: string;
  nominatedBusinessName: string;
  nominatedAddress: string;
  reason: string;
}

const EMPTY: FormState = {
  nominatorName: "",
  nominatorPhone: "",
  nominatorEmail: "",
  nominatedBusinessName: "",
  nominatedAddress: "",
  reason: "",
};

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100";

export default function NominateBusinessForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.nominatorName.trim()) newErrors.nominatorName = "Adınız gereklidir.";
    if (!form.nominatedBusinessName.trim()) newErrors.nominatedBusinessName = "İşletme adı gereklidir.";
    if (!form.nominatedAddress.trim()) newErrors.nominatedAddress = "İşletme adresi gereklidir.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const result = await nominateBusiness(form);
    if (result.success) {
      setSubmitted(true);
    }
  }

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
        {/* Animated checkmark */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Ripple ring */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-30" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-200">
            <svg
              className="h-12 w-12 text-white animate-scale-in"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12l5 5L20 7" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-stone-900">Teşekkürler!</h2>
          <p className="mt-2 max-w-xs text-sm text-stone-500 leading-relaxed">
            Önerinizi aldık ve en kısa sürede değerlendireceğiz.
            Önerdiğin işletme aramıza katılırsa seni haberdar edeceğiz!
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 ring-1 ring-emerald-100">
          <span className="text-lg">🌍</span>
          <p className="text-xs font-semibold text-emerald-700">
            Her öneri, daha az gıda israfı demek!
          </p>
        </div>

        <button
          onClick={() => { setForm(EMPTY); setSubmitted(false); }}
          className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all"
        >
          Yeni Öneri Gönder
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-stone-900">Bir İşletme Öner</h1>
        <p className="mt-1 text-sm text-stone-500 leading-relaxed">
          Sevdiğin bir işletmenin burada olmasını ister misin?
          Bize bildir, biz onlarla iletişime geçelim!
        </p>
      </div>

      {/* Value message */}
      <div className="mb-5 flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
        <span className="text-xl">💡</span>
        <p className="text-xs text-emerald-700">
          Önerdiğin işletme platforma katılırsa hem o işletme hem de mahalle sakinleri kazanır.
          Her kutu kurtarılan bir adım.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nominator name */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">
            Adınız Soyadınız <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.nominatorName}
            onChange={set("nominatorName")}
            placeholder="ör. Ayşe Kaya"
            className={inputClass}
          />
          {errors.nominatorName && (
            <p className="mt-1 text-xs text-red-500">{errors.nominatorName}</p>
          )}
        </div>

        {/* Phone (optional) */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">
            Telefon Numaranız{" "}
            <span className="text-stone-400 font-normal">(isteğe bağlı)</span>
          </label>
          <input
            type="tel"
            value={form.nominatorPhone}
            onChange={set("nominatorPhone")}
            placeholder="+90 5XX XXX XX XX"
            className={inputClass}
          />
        </div>

        {/* Email (optional) */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">
            E-posta Adresiniz{" "}
            <span className="text-stone-400 font-normal">(isteğe bağlı)</span>
          </label>
          <input
            type="email"
            value={form.nominatorEmail}
            onChange={set("nominatorEmail")}
            placeholder="ornek@mail.com"
            className={inputClass}
          />
        </div>

        <hr className="border-stone-100" />

        {/* Business name */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">
            İşletme Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.nominatedBusinessName}
            onChange={set("nominatedBusinessName")}
            placeholder="ör. Çiçek Pastanesi"
            className={inputClass}
          />
          {errors.nominatedBusinessName && (
            <p className="mt-1 text-xs text-red-500">{errors.nominatedBusinessName}</p>
          )}
        </div>

        {/* Business address */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">
            İşletme Adresi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.nominatedAddress}
            onChange={set("nominatedAddress")}
            placeholder="ör. Bağdat Caddesi No:120, Kadıköy"
            className={inputClass}
          />
          {errors.nominatedAddress && (
            <p className="mt-1 text-xs text-red-500">{errors.nominatedAddress}</p>
          )}
        </div>

        {/* Reason (optional) */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-600">
            Neden öneriyorsunuz?{" "}
            <span className="text-stone-400 font-normal">(isteğe bağlı)</span>
          </label>
          <textarea
            value={form.reason}
            onChange={set("reason")}
            rows={3}
            placeholder="Bu işletmenin burada olması gerektiğini düşünüyorum çünkü…"
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95"
        >
          Öner 💡
        </button>
      </form>
    </div>
  );
}
