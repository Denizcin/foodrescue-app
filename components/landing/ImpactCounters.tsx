"use client";

import { useEffect, useRef, useState } from "react";

interface Counter {
  end: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: string;
}

const COUNTERS: Counter[] = [
  {
    end:      150,
    suffix:   "+",
    label:    "İşletme",
    sublabel: "Platform üzerinde aktif",
    icon:     "🏪",
  },
  {
    end:      10000,
    suffix:   "+",
    label:    "Kullanıcı",
    sublabel: "Mutlu müşteri",
    icon:     "👥",
  },
  {
    end:      5000,
    suffix:   "+",
    label:    "Kurtarılan Kutu",
    sublabel: "Çöpe gitmeyen öğün",
    icon:     "🎁",
  },
];

function AnimatedCounter({ counter }: { counter: Counter }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    const duration = 1800;
    const step = 16;
    const increment = (counter.end / duration) * step;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, counter.end);
      setCount(Math.floor(current));
      if (current >= counter.end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [started, counter.end]);

  function formatNumber(n: number) {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "B";
    return n.toString();
  }

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 px-6 py-8 text-center ring-1 ring-white/20 backdrop-blur-sm"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
        {counter.icon}
      </span>
      <div>
        <p className="text-4xl font-black tabular-nums text-white sm:text-5xl leading-none">
          {formatNumber(count)}
          <span className="text-emerald-300">{counter.suffix}</span>
        </p>
        <p className="mt-1 text-lg font-bold text-white/90">{counter.label}</p>
        <p className="mt-0.5 text-sm text-emerald-200/80">{counter.sublabel}</p>
      </div>
    </div>
  );
}

export default function ImpactCounters() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 py-20 md:py-28">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-600 opacity-30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-900 opacity-50 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-200 ring-1 ring-white/20">
          Etkimiz
        </span>
        <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
          Birlikte yarattığımız fark
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-emerald-200">
          Her sipariş, hem bir öğünü kurtarır hem de israfı azaltır.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {COUNTERS.map((counter) => (
            <AnimatedCounter key={counter.label} counter={counter} />
          ))}
        </div>

        <p className="mt-8 text-sm text-emerald-300/70">
          * Rakamlar anlık olup sürekli artmaktadır.
        </p>
      </div>
    </section>
  );
}
