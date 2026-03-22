"use client";

import { useEffect, useRef, useState } from "react";

const VALUE_CARDS = [
  {
    icon: "💰",
    title: "Tasarruf Et",
    desc: "Restoran kalitesinde yemekler, süpermarket fiyatlarının çok altında. Aylık yüzlerce lira biriktir.",
    highlight: "%50'ye varan indirim",
    bg:   "bg-amber-50",
    ring: "ring-amber-100",
    iconBg: "bg-amber-100",
    badge: "text-amber-700 bg-amber-100",
  },
  {
    icon: "📍",
    title: "Yerel Keşfet",
    desc: "Mahallenin gizli kalmış fırınları, kafeleri, restoranlarını keşfet. Her kutu yeni bir sürpriz.",
    highlight: "Yeni işletmeler",
    bg:   "bg-emerald-50",
    ring: "ring-emerald-100",
    iconBg: "bg-emerald-100",
    badge: "text-emerald-700 bg-emerald-100",
  },
  {
    icon: "🌍",
    title: "İsrafı Önle",
    desc: "Kurtardığın her kutu çöpe gitmeyecek bir öğün, daha az CO₂ ve daha az israf demek.",
    highlight: "İklim dostu alışveriş",
    bg:   "bg-stone-50",
    ring: "ring-stone-100",
    iconBg: "bg-stone-100",
    badge: "text-stone-700 bg-stone-100",
  },
];

function useCountUp(end: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const step = 16;
    const increment = (end / duration) * step;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, end);
      setCount(Math.floor(current));
      if (current >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
}

export default function WhySection() {
  const { count, ref } = useCountUp(93);

  return (
    <section id="why-us" className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section header */}
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-600 ring-1 ring-stone-200">
            Neden FoodRescue?
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Sorun büyük. Çözüm basit.
          </h2>
        </div>

        {/* Big statistic */}
        <div className="mt-10 mb-14 flex flex-col items-center rounded-3xl bg-white px-6 py-10 shadow-sm ring-1 ring-stone-100 text-center sm:flex-row sm:gap-10 sm:text-left">
          <div className="shrink-0">
            <span
              ref={ref}
              className="block text-7xl font-black tracking-tighter text-emerald-600 sm:text-8xl leading-none tabular-nums"
              aria-label="93 kilogram"
            >
              {count}
            </span>
            <span className="mt-1 block text-xl font-bold text-stone-400">kg / yıl / kişi</span>
          </div>
          <div className="mt-6 sm:mt-0">
            <p className="text-xl font-bold text-stone-900 sm:text-2xl leading-snug">
              Türkiye&apos;de her kişi yılda ortalama{" "}
              <span className="text-emerald-600">93 kg gıdayı</span> israf ediyor.
            </p>
            <p className="mt-3 text-base text-stone-500 leading-relaxed">
              Bu rakam bir insanın 3 aylık temel gıda ihtiyacına eşit. FoodRescue,
              işletmelerin artakalan ürünlerini çöpe gitmeden sana ulaştırıyor —
              hem seni hem dünyayı koruyor.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                🌱 Daha az CO₂
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 ring-1 ring-amber-100">
                💧 Daha az su tüketimi
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700 ring-1 ring-stone-200">
                🗑️ Daha az çöp
              </span>
            </div>
          </div>
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {VALUE_CARDS.map((card) => (
            <div
              key={card.title}
              className={[
                "group flex flex-col gap-4 rounded-2xl p-6 ring-1 transition-all duration-200",
                "hover:shadow-md hover:-translate-y-1",
                card.bg,
                card.ring,
              ].join(" ")}
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${card.iconBg}`}>
                {card.icon}
              </span>
              <div>
                <p className="text-lg font-bold text-stone-900">{card.title}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${card.badge}`}>
                  {card.highlight}
                </span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
