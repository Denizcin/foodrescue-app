interface ImpactBadgeProps {
  savedMoney: number;
  co2: number;
  food: number;
}

const stats = [
  {
    key: "money" as const,
    emoji: "💰",
    label: "Tasarruf",
    format: (v: number) => `₺${v.toFixed(0)}`,
    color: "bg-amber-50 ring-amber-200 text-amber-700",
    valueColor: "text-amber-600",
  },
  {
    key: "co2" as const,
    emoji: "🌍",
    label: "CO₂ Önlendi",
    format: (v: number) => `${v.toFixed(1)} kg`,
    color: "bg-emerald-50 ring-emerald-200 text-emerald-700",
    valueColor: "text-emerald-600",
  },
  {
    key: "food" as const,
    emoji: "🍽️",
    label: "Yemek Kurtarıldı",
    format: (v: number) => `${v.toFixed(1)} kg`,
    color: "bg-stone-50 ring-stone-200 text-stone-600",
    valueColor: "text-stone-700",
  },
];

export default function ImpactBadge({ savedMoney, co2, food }: ImpactBadgeProps) {
  const values = { money: savedMoney, co2, food };

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s) => (
        <div
          key={s.key}
          className={`flex flex-col items-center rounded-xl p-3 ring-1 ${s.color}`}
        >
          <span className="text-xl">{s.emoji}</span>
          <span className={`mt-1 text-sm font-bold ${s.valueColor}`}>
            {s.format(values[s.key])}
          </span>
          <span className="mt-0.5 text-center text-xs leading-tight opacity-80">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
