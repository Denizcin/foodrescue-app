import Link from "next/link";

const STORE_BADGES = [
  {
    id: "appstore",
    name: "App Store",
    sub: "iPhone & iPad",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    id: "playstore",
    name: "Google Play",
    sub: "Android",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8zm2-14.15V17.65l10.5-5.65L5 6.35z" />
      </svg>
    ),
  },
  {
    id: "appgallery",
    name: "AppGallery",
    sub: "Huawei",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V8h2v9zm4 0h-2V8h2v9z" />
      </svg>
    ),
  },
];

export default function AppDownloadCTA() {
  return (
    <section
      id="download"
      className="bg-stone-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 md:items-center">
          {/* Left: download */}
          <div>
            <span className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-100">
              Uygulamayı İndir
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Her an, her yerden<br />
              <span className="text-emerald-600">sürpriz kutular</span>
            </h2>
            <p className="mt-4 text-base text-stone-500 leading-relaxed">
              Uygulamamızı indir, yakınındaki kutuları keşfet ve sipariş ver.
              Kayıt tamamen ücretsiz, komisyon yok.
            </p>

            {/* Store badges */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {STORE_BADGES.map((badge) => (
                <a
                  key={badge.id}
                  href="#"
                  className="group flex items-center gap-3 rounded-2xl bg-stone-900 px-4 py-3.5 text-white shadow-sm hover:bg-stone-800 active:scale-95 transition-all duration-150"
                  aria-label={`${badge.name}'dan indir`}
                >
                  <span className="shrink-0 text-stone-300 group-hover:text-white transition-colors">
                    {badge.icon}
                  </span>
                  <span>
                    <span className="block text-[10px] text-stone-400 leading-none">{badge.sub}&apos;dan indir</span>
                    <span className="block text-sm font-bold leading-tight">{badge.name}</span>
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-4 text-xs text-stone-400">
              Yakında yayında. iOS, Android ve Huawei için.
            </p>
          </div>

          {/* Right: nomination CTA */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-7 text-white shadow-lg shadow-emerald-200">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl mb-5">
              💡
            </span>
            <h3 className="text-xl font-extrabold">
              Görmek istediğin bir işletme mi var?
            </h3>
            <p className="mt-3 text-sm text-emerald-100 leading-relaxed">
              Sevdiğin fırın, kafe veya restoran FoodRescue&apos;da olsun istiyorsan,
              bize bildir. Onlarla biz iletişime geçelim!
            </p>
            <Link
              href="/consumer/nominate"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-all duration-150"
            >
              İşletme Öner
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <p className="mt-4 text-xs text-emerald-200">
              150+ işletme zaten aramızda. Senin önerinle 151 olalım.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
