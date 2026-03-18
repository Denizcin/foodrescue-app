import type { BoxCategory, BusinessCategory } from "@/lib/types";

type CategoryInfo = { emoji: string; label: string };

const BOX_MAP: Record<BoxCategory, CategoryInfo> = {
  BAKERY:        { emoji: "🥐", label: "Fırın" },
  SUSHI:         { emoji: "🍣", label: "Suşi" },
  GROCERY:       { emoji: "🛒", label: "Market" },
  DELI:          { emoji: "🥩", label: "Şarküteri" },
  CAFE:          { emoji: "☕", label: "Kafe" },
  PREPARED_MEAL: { emoji: "🍱", label: "Hazır Yemek" },
  PRODUCE:       { emoji: "🥕", label: "Manav" },
  MIXED:         { emoji: "🎁", label: "Karışık" },
};

const BIZ_MAP: Record<BusinessCategory, CategoryInfo> = {
  BAKERY:      { emoji: "🥐", label: "Fırın" },
  RESTAURANT:  { emoji: "🍽️", label: "Restoran" },
  CAFE:        { emoji: "☕", label: "Kafe" },
  GROCERY:     { emoji: "🛒", label: "Market" },
  GREENGROCER: { emoji: "🥕", label: "Manav" },
  MARKET:      { emoji: "🏪", label: "Market" },
  PATISSERIE:  { emoji: "🎂", label: "Pastane" },
  DELI:        { emoji: "🥩", label: "Şarküteri" },
  FLORIST:     { emoji: "🌸", label: "Çiçekçi" },
  OTHER:       { emoji: "📦", label: "Diğer" },
};

function resolve(category: BoxCategory | BusinessCategory): CategoryInfo {
  if (category in BOX_MAP) return BOX_MAP[category as BoxCategory];
  if (category in BIZ_MAP) return BIZ_MAP[category as BusinessCategory];
  return { emoji: "📦", label: category };
}

export default function CategoryBadge({
  category,
}: {
  category: BoxCategory | BusinessCategory;
}) {
  const { emoji, label } = resolve(category);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
