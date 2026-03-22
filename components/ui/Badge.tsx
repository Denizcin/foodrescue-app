type BadgeVariant =
  | "category"
  | "status-pending"
  | "status-completed"
  | "status-cancelled"
  | "savings"
  | "low-stock"
  | "sold-out";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  "category":
    "bg-stone-100 text-stone-700 ring-1 ring-stone-200",
  "status-pending":
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "status-completed":
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "status-cancelled":
    "bg-red-50 text-red-600 ring-1 ring-red-200",
  "savings":
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 font-bold",
  "low-stock":
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "sold-out":
    "bg-stone-100 text-stone-500 ring-1 ring-stone-200",
};

export function Badge({ variant = "category", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

export default Badge;
