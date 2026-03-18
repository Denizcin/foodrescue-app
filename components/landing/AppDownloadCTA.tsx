import Link from "next/link";

const impactStats = [
  { value: "150+", label: "İşletme", emoji: "🏪" },
  { value: "10.000+", label: "Kullanıcı", emoji: "👥" },
  { value: "5.000+", label: "Kurtarılan Kutu", emoji: "📦" },
];

const stores = [
  { label: "App Store'dan İndir", emoji: "🍎", sub: "iPhone & iPad için" },
  { label: "Google Play'den İndir", emoji: "▶️", sub: "Android için" },
  { label: "AppGallery'den İndir", emoji: "🌐", sub: "Huawei cihazlar için" },
];

export default function AppDownloadCTA() {
  return (
    <section id="download" className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Impact stats */}
        <div className="mb-12 grid grid-cols-3 gap-4">
          {impactStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-5">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-emerald-100">
                {stat.emoji} {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Download heading */}
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Uygulamayı İndir
        </h2>
        <p className="mt-3 text-emerald-100 text-lg">
          Yakınındaki sürpriz kutuları hemen keşfetmeye başla.
        </p>

        {/* Store badges */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {stores.map((store) => (
            <a
              key={store.label}
              href="#"
              className="flex w-full sm:w-auto items-center gap-3 rounded-xl bg-white/15 border border-white/30 px-5 py-3 text-left hover:bg-white/25 transition-colors"
            >
              <span className="text-2xl">{store.emoji}</span>
              <div>
                <p className="text-xs text-emerald-200">{store.sub}</p>
                <p className="text-sm font-semibold text-white">{store.label}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 flex items-center gap-4 text-emerald-300">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-sm">veya</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        {/* Nomination CTA */}
        <div className="rounded-2xl bg-white/10 px-6 py-6">
          <p className="text-lg font-semibold text-white">
            Görmek istediğin bir işletme mi var? 🏪
          </p>
          <p className="mt-1 text-sm text-emerald-100">
            Bize bildir, biz onlarla iletişime geçelim.
          </p>
          <Link
            href="/consumer/nominate"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Bir İşletme Öner →
          </Link>
        </div>
      </div>
    </section>
  );
}
