const examples = [
  {
    emoji: "🥐",
    label: "Fırın Kutusu",
    description: "Sabahtan kalan kruvasanlar, poğaçalar ve taze ekmekler.",
    tag: "Fırın",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    emoji: "🍱",
    label: "Hazır Yemek Kutusu",
    description: "Günün sonunda kalan pilav, sebze yemekleri ve ana yemekler.",
    tag: "Restoran",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    emoji: "🥕",
    label: "Manav Kutusu",
    description: "Görünüşü farklı ama lezzetli; eğri salatalık, çürük olmayan domates.",
    tag: "Manav",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    emoji: "☕",
    label: "Kafe Kutusu",
    description: "Kapanış öncesi kalan sandviçler, dilim kekler ve soğuk içecekler.",
    tag: "Kafe",
    tagColor: "bg-stone-100 text-stone-600",
  },
  {
    emoji: "🛒",
    label: "Market Kutusu",
    description: "Son kullanma tarihi yaklaşan konserveler, atıştırmalıklar ve içecekler.",
    tag: "Market",
    tagColor: "bg-blue-100 text-blue-700",
  },
];

export default function ProductExamples() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Kutunuzda Ne Olabilir?
          </h2>
        </div>

        {/* Surprise disclaimer — required by skill spec */}
        <div className="mb-10 mx-auto max-w-xl rounded-xl bg-amber-50 border border-amber-200 px-5 py-3 text-center text-sm text-amber-800">
          🎁 <strong>Her kutu bir sürpriz!</strong> İçinde ne olacağını bilmemek, deneyimin bir parçası.
          Listeler günden güne değişir — sürpriz olan da bu zaten.
        </div>

        {/* Example cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex) => (
            <div
              key={ex.label}
              className="flex items-start gap-4 rounded-xl border border-stone-100 bg-stone-50 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                {ex.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-stone-900 text-sm">{ex.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ex.tagColor}`}>
                    {ex.tag}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">{ex.description}</p>
              </div>
            </div>
          ))}

          {/* "And more" card */}
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-4 text-center">
            <div>
              <p className="text-2xl mb-1">✨</p>
              <p className="text-sm font-medium text-emerald-700">Ve çok daha fazlası…</p>
              <p className="text-xs text-emerald-600 mt-0.5">Her gün yeni kutular ekleniyor</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
