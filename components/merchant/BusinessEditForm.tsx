"use client";

import { useState, useTransition, useRef } from "react";
import { updateBusiness, updateBusinessImage } from "@/lib/profile-actions";

interface Props {
  initialName: string;
  initialDescription: string;
  initialAddress: string;
  initialPhone: string;
  initialHours: string;
  initialImageUrl: string;
}

export default function BusinessEditForm({
  initialName,
  initialDescription,
  initialAddress,
  initialPhone,
  initialHours,
  initialImageUrl,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [hours, setHours] = useState(initialHours);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const [imagePreview, setImagePreview] = useState(initialImageUrl);
  const [imageStatus, setImageStatus] = useState<"idle" | "success" | "error">("idle");
  const [imageMessage, setImageMessage] = useState("");
  const [isImagePending, startImageTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      const res = await updateBusiness({ name, description, address, phone, operatingHours: hours });
      if (res.success) {
        setStatus("success");
        setMessage("İşletme bilgileri güncellendi.");
      } else {
        setStatus("error");
        setMessage(res.error ?? "Bir hata oluştu.");
      }
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageStatus("error");
      setImageMessage("Lütfen JPEG veya PNG dosyası seçin.");
      return;
    }
    if (file.size > 1_000_000) {
      setImageStatus("error");
      setImageMessage("Dosya 1 MB'dan küçük olmalıdır.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setImageStatus("idle");
      startImageTransition(async () => {
        const res = await updateBusinessImage(dataUrl);
        if (res.success) {
          setImageStatus("success");
          setImageMessage("Fotoğraf güncellendi.");
        } else {
          setImageStatus("error");
          setImageMessage(res.error ?? "Fotoğraf yüklenemedi.");
        }
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-5">
      {/* Image upload */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-3">
        <h2 className="text-sm font-bold text-stone-800">İşletme Fotoğrafı</h2>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
            {imagePreview ? (
              <img src={imagePreview} alt="İşletme" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">🏪</div>
            )}
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isImagePending}
              className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60 transition-colors"
            >
              {isImagePending ? "Yükleniyor…" : "Fotoğraf Seç"}
            </button>
            <p className="mt-1 text-xs text-stone-400">JPEG veya PNG, maks. 1 MB</p>
            {imageStatus !== "idle" && (
              <p className={`mt-1 text-xs font-medium ${imageStatus === "success" ? "text-emerald-600" : "text-red-600"}`}>
                {imageMessage}
              </p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>

      {/* Business info form */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-4">
        <h2 className="text-sm font-bold text-stone-800">İşletme Bilgileri</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">İşletme Adı</label>
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
            <label className="block text-xs font-medium text-stone-600 mb-1">Açıklama (opsiyonel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              placeholder="İşletmenizi kısaca tanıtın…"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Adres</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
              minLength={5}
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
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Çalışma Saatleri</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Pzt-Cmt 09:00-18:00"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
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
            {isPending ? "Kaydediliyor…" : "Bilgileri Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}
