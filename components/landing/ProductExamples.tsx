const EXAMPLES = [
  {
    emoji: "🥐",
    label: "Fırın Kutusu",
    category: "Fırın",
    desc: "Sabahtan kalan kruvasanlar, poğaçalar ve taze ekmekler.",
    items: ["Kruvasan", "Poğaça", "Ekmek", "Simit"],
    bg: "bg-amber-50",
    ring: "ring-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    emoji: "🍱",
    label: "Hazır Yemek Kutusu",
    category: "Restoran",
    desc: "Günün sonunda kalan hazır yemekler ve tabak yemekler.",
    items: ["Mercimek çorbası", "Pilav", "Ana yemek", "Salata"],
    bg: "bg-orange-50",
    ring: "ring-orange-100",
    iconBg: "bg-orange-100",
  },
  {
    emoji: "🥕",
    label: "Manav Kutusu",
    category: "Manav",
    desc: "Görünüşü farklı ama lezzetli sebze ve meyveler.",
    items: ["Sebzeler", "Mevsim meyveleri", "Yeşillikler"],
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    iconBg: "bg-emerald-100",
  },
  {
    emoji: "🛒",
    label: "Market Kutusu",
    category: "Market",
    desc: "Son kullanma tarihi yaklaşan ama taze market ürünleri.",
    items: ["Süt ürünleri", "Atıştırmalık", "Konserve", "Temel gıdalar"],
    bg: "bg-sky-50",
    ring: "ring-sky-100",
    iconBg: "bg-sky-100",
  },
  {
    emoji: "☕",
    label: "Kafe Kutusu",
    category: "Kafe",
    desc: "Kafe ve pastanelerin günlük artakalan lezzetleri.",
    items: ["Sandviç", "Kek", "Kurabiye", "Muffin"],
    bg: "bg-stone-50",
    ring: "ring-stone-100",
    iconBg: "bg-stone-100",
  },
  {
    emoji: "🍣",
    label: "Suşi Kutusu",
    category: "Japon",
    desc: "Günün son suşi ve maki rulolarından oluşan set.",
    items: ["Maki rulo", "Nigiri", "Suşi seti"],
    bg: "bg-rose-50",
    ring: "ring-rose-100",
    iconBg: "bg-rose-100",
  },
];

export default function ProductExamples() {
  return (
    <section id="for-business" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-stone-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-600 ring-1 ring-stone-200">
            Sürpriz Kutular
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Her kutu farklı, her kutu sürpriz
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-stone-500">
            İçinde ne olacağını bilmemek, deneyimin en güzel parçası!
          </p>
        </div>

        {/* Surprise disclaimer callout */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
          <span className="mt-0.5 shrink-0 text-xl" aria-hidden="true">⚠️</span>
          <div>
            <p className="text-sm font-bold text-amber-900">Sürpriz Kutu Nedir?</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">
              Kutunun içeriği sürprizdir! İçindekiler günden güne değişiklik gösterebilir.
              Satın aldığınız kutunun içeriği, işletmenin o gün kalan ürünlerine göre belirlenir.
              Belirli ürün garantisi verilmez — sürpriz olan da bu zaten!
            </p>
          </div>
        </div>

        {/* Carousel on mobile, 3-col grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.label}
              className={[
                "flex w-64 shrink-0 flex-col gap-3 rounded-2xl p-5 ring-1 md:w-auto",
                "transition-transform duration-150 hover:-translate-y-1 hover:shadow-md",
                ex.bg,
                ex.ring,
              ].join(" ")}
            >
              {/* Icon + category */}
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${ex.iconBg}`}>
                  {ex.emoji}
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
                  {ex.category}
                </span>
              </div>

              {/* Title + desc */}
              <div>
                <p className="font-bold text-stone-900">{ex.label}</p>
                <p className="mt-1 text-sm text-stone-600 leading-relaxed">{ex.desc}</p>
              </div>

              {/* Example items */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {ex.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-stone-500 ring-1 ring-stone-200/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <p className="mt-3 text-center text-xs text-stone-400 md:hidden">
          ← kaydır →
        </p>
      </div>
    </section>
  );
}
