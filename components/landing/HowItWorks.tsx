"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "1",
    emoji: "📱",
    title: "İndir & Keşfet",
    desc: "Uygulamayı indir ve yakınındaki sürpriz kutuları keşfet.",
    color: "bg-emerald-100 text-emerald-700",
    ring:  "ring-emerald-200",
    numBg: "bg-emerald-600",
  },
  {
    number: "2",
    emoji: "🛒",
    title: "Kutu Seç",
    desc: "%50'ye varan indirimle bir kutu seç ve öde.",
    color: "bg-amber-100 text-amber-700",
    ring:  "ring-amber-200",
    numBg: "bg-amber-500",
  },
  {
    number: "3",
    emoji: "🚶",
    title: "İşletmeye Git",
    desc: "Belirtilen saatte işletmeye gel, kodunu göster.",
    color: "bg-sky-100 text-sky-700",
    ring:  "ring-sky-200",
    numBg: "bg-sky-500",
  },
  {
    number: "4",
    emoji: "🌍",
    title: "Kutunu Al!",
    desc: "Kutunu al, israfı önle ve dünyaya iyilik yap.",
    color: "bg-emerald-100 text-emerald-700",
    ring:  "ring-emerald-200",
    numBg: "bg-emerald-700",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-4">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-100">
            Nasıl Çalışır
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            4 adımda gıda kurtarma
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-stone-500">
            Kayıt olmak ücretsiz. Sipariş vermek kolay. Kutunu almak harika.
          </p>
        </div>

        {/* Steps — vertical on mobile, horizontal on desktop */}
        <div className="relative">
          {/* Horizontal connector line (desktop only) */}
          <div
            className="absolute left-0 right-0 top-[3.25rem] hidden h-0.5 bg-gradient-to-r from-emerald-200 via-amber-200 to-emerald-200 md:block"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-4">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={[
                  "flex flex-col items-center text-center transition-all duration-500",
                  revealed
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6",
                ].join(" ")}
                style={{ transitionDelay: revealed ? `${i * 120}ms` : "0ms" }}
              >
                {/* Number circle */}
                <div className="relative mb-5">
                  {/* Outer ring */}
                  <div className={`flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-full bg-white ring-2 ${step.ring} shadow-sm`}>
                    {/* Inner colored circle */}
                    <div className={`flex h-20 w-20 flex-col items-center justify-center rounded-full ${step.color} ring-1 ${step.ring}`}>
                      <span className="text-3xl leading-none">{step.emoji}</span>
                    </div>
                  </div>
                  {/* Step number badge */}
                  <span className={`absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white ${step.numBg} shadow-sm`}>
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-stone-900">{step.title}</h3>
                <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">{step.desc}</p>

                {/* Vertical connector (mobile only) */}
                {i < STEPS.length - 1 && (
                  <div className="mt-6 h-6 w-0.5 rounded-full bg-stone-200 md:hidden" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all duration-150"
          >
            <span aria-hidden="true">📱</span>
            Hemen Başla — Ücretsiz
          </a>
        </div>
      </div>
    </section>
  );
}
