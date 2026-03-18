"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_NAME = "foodrescue_cookie_consent";
const COOKIE_MAX_AGE_DAYS = 365;

function readConsent(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  return match?.split("=")[1];
}

function writeConsent(value: "all" | "essential") {
  const expires = new Date(
    Date.now() + COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show the banner if no consent has been recorded yet
    if (!readConsent()) setVisible(true);
  }, []);

  function acceptAll() {
    writeConsent("all");
    setVisible(false);
  }

  function acceptEssential() {
    writeConsent("essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-2xl rounded-2xl bg-stone-900 px-5 py-4 shadow-2xl ring-1 ring-stone-700">
        <p className="text-sm leading-relaxed text-stone-300">
          Bu web sitesi, daha iyi bir deneyim sunmak için çerezler kullanmaktadır.{" "}
          <Link
            href="/cerez-politikasi"
            className="text-emerald-400 underline hover:text-emerald-300 transition-colors"
          >
            Çerez Politikamız
          </Link>
          &apos;nı inceleyebilirsiniz.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={acceptAll}
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Kabul Et
          </button>
          <button
            onClick={acceptEssential}
            className="flex-1 rounded-xl border border-stone-600 py-2.5 text-sm font-semibold text-stone-300 transition-colors hover:bg-stone-800"
          >
            Sadece Gerekli Çerezler
          </button>
        </div>
      </div>
    </div>
  );
}
