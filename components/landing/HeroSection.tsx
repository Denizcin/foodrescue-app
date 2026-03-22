"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ROTATING_WORDS = [
  { text: "para biriktir",  color: "text-amber-500" },
  { text: "yerel keşfet",   color: "text-emerald-500" },
  { text: "israfı önle",    color: "text-emerald-700" },
];

const VALUE_CARDS = [
  {
    icon: "💰",
    title: "Para Biriktir",
    desc: "%50'ye varan indirimle sürpriz kutular",
    bg:   "bg-amber-50 ring-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: "📍",
    title: "Yerel Keşfet",
    desc: "Mahallenin gizli kalmış lezzetleri",
    bg:   "bg-emerald-50 ring-emerald-100",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "🌍",
    title: "İsrafı Önle",
    desc: "Her kutu kurtarılan bir fırsat",
    bg:   "bg-stone-50 ring-stone-100",
    iconBg: "bg-stone-100",
  },
];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setWordVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const current = ROTATING_WORDS[wordIdx];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 pt-28 pb-20 md:pt-40 md:pb-28">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-100 opacity-60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-amber-100 opacity-50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50 opacity-80 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        {/* Pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs">🌍</span>
          Türkiye&apos;nin Gıda Kurtarma Platformu
        </div>

        {/* Main headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15]">
          Hem cüzdanını{" "}
          <br className="hidden sm:block" />
          hem dünyayı{" "}
          <span className="relative inline-block">
            koru
            <span
              className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full bg-emerald-400 opacity-50"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* Rotating tagline */}
        <p className="mt-5 text-xl text-stone-500 font-medium sm:text-2xl">
          Yerel işletmelerle birlikte{" "}
          <span
            className={[
              "inline-block font-bold transition-all duration-300",
              wordVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
              current.color,
            ].join(" ")}
            aria-live="polite"
            aria-atomic="true"
          >
            {current.text}
          </span>
        </p>

        {/* Subtext */}
        <p className="mx-auto mt-4 max-w-xl text-base text-stone-500 leading-relaxed">
          Günün sonunda kalan lezzetler sürpriz kutularda,{" "}
          <strong className="text-stone-700">%50&apos;ye varan indirimle</strong> sende.
          Gel-al, israfı önle, yeni lezzetler keşfet.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all duration-150"
          >
            <span aria-hidden="true">📱</span>
            Uygulamayı İndir
          </a>
          <Link
            href="/consumer"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-200 bg-white px-7 py-3.5 text-base font-semibold text-stone-800 hover:border-emerald-300 hover:bg-emerald-50 active:scale-95 transition-all duration-150 shadow-sm"
          >
            Kutuları Keşfet
            <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-sm text-stone-400 font-medium">
          <span className="text-stone-600 font-bold">150+</span> işletme
          {" · "}
          <span className="text-stone-600 font-bold">10.000+</span> kullanıcı
          {" · "}
          <span className="text-stone-600 font-bold">5.000+</span> kurtarılan kutu
        </p>

        {/* Value proposition cards */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {VALUE_CARDS.map((card) => (
            <div
              key={card.title}
              className={[
                "flex flex-col items-center gap-3 rounded-2xl px-5 py-5 text-center ring-1",
                "transition-transform duration-150 hover:-translate-y-1",
                card.bg,
              ].join(" ")}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${card.iconBg}`}>
                {card.icon}
              </span>
              <p className="font-bold text-stone-900">{card.title}</p>
              <p className="text-sm text-stone-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
