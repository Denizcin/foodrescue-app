const values = [
  {
    emoji: "💰",
    title: "Tasarruf Et",
    description:
      "Lezzetli yiyecekleri normal fiyatın yarısına al. Ay sonunda farkı hisset.",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    iconBg: "bg-amber-100",
    titleColor: "text-amber-700",
  },
  {
    emoji: "📍",
    title: "Yerel İşletmeleri Keşfet",
    description:
      "Köşe başındaki fırını, mahallenin gizli kafesini tanı. Her kutu yeni bir keşif.",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    iconBg: "bg-emerald-100",
    titleColor: "text-emerald-700",
  },
  {
    emoji: "🌍",
    title: "İsrafı Önle",
    description:
      "Kurtardığın her kutu, çöpe gitmeyen yiyecek demek. İklim kriziyle mücadelene ortak ol.",
    bg: "bg-stone-50",
    ring: "ring-stone-200",
    iconBg: "bg-stone-100",
    titleColor: "text-stone-700",
  },
];

export default function WhySection() {
  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Neden FoodRescue?
          </h2>
        </div>

        {/* Statistic banner */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-8 text-center text-white shadow-lg">
          <p className="text-4xl font-extrabold sm:text-5xl">93 kg</p>
          <p className="mt-2 text-lg font-medium text-emerald-100">
            Türkiye&apos;de kişi başı yılda bu kadar gıda israf ediliyor.
          </p>
          <p className="mt-1 text-sm text-emerald-200">
            Kaynak: FAO Türkiye Gıda İsrafı Raporu · Her kurtardığın kutu bu rakamı düşürür.
          </p>
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className={`rounded-2xl ${v.bg} p-6 ring-1 ${v.ring} flex flex-col gap-3`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${v.iconBg} text-2xl`}>
                {v.emoji}
              </div>
              <h3 className={`text-lg font-bold ${v.titleColor}`}>{v.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
