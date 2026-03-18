import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-100 opacity-40 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-32 text-center">
        {/* Pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
          <span>🌍</span>
          <span>Türkiye&apos;nin Gıda Kurtarma Platformu</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl md:text-6xl leading-tight">
          Hem cüzdanını hem{" "}
          <span className="text-emerald-600">dünyayı</span> koru
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 leading-relaxed">
          Yerel işletmelerin günün sonunda kalan lezzetleri{" "}
          <strong className="text-amber-600">%50&apos;ye varan indirimle</strong> sende.
          Sürpriz kutunu al, israfı önle, yeni işletmeler keşfet.
        </p>

        {/* Value props */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-stone-600">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-500">💰</span> Para biriktir
          </span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">📍</span> Yerel keşfet
          </span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-600">🌱</span> İsrafı önle
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95"
          >
            📱 Uygulamayı İndir
          </a>
          <Link
            href="/consumer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 px-8 py-3.5 text-base font-semibold text-emerald-700 transition hover:bg-emerald-50 active:scale-95"
          >
            Kutuları Keşfet →
          </Link>
        </div>

        {/* Social proof nudge */}
        <p className="mt-8 text-sm text-stone-400">
          İstanbul&apos;da 150+ işletme · 5.000+ kurtarılan kutu · Ücretsiz kayıt
        </p>
      </div>
    </section>
  );
}
