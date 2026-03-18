const steps = [
  {
    number: "1",
    emoji: "📱",
    title: "İndir & Keşfet",
    description: "Uygulamayı indir ve yakınındaki sürpriz kutuları keşfet.",
  },
  {
    number: "2",
    emoji: "🛒",
    title: "Seç & Satın Al",
    description: "Bir kutu seç ve %50'ye varan indirimle peşin öde.",
  },
  {
    number: "3",
    emoji: "🚶",
    title: "Git & Göster",
    description: "Belirtilen saatte işletmeye git, pickup kodunu göster.",
  },
  {
    number: "4",
    emoji: "🌍",
    title: "Al & Kurtar",
    description: "Kutunu al, israfı önle, dünyayı biraz daha iyi yap!",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Nasıl Çalışır?
          </h2>
          <p className="mt-3 text-stone-500 text-lg">Dört adımda gıda kurtarma</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2.5rem)] hidden h-0.5 w-[calc(100%-5rem)] bg-emerald-100 lg:block" />
              )}

              {/* Circle with emoji */}
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl shadow-sm ring-4 ring-white">
                {step.emoji}
              </div>

              {/* Step number */}
              <span className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600">
                Adım {step.number}
              </span>

              <h3 className="mt-1 text-base font-semibold text-stone-900">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
