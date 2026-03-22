// Skeleton shown instantly while box detail data loads
export default function BoxDetailLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
      {/* Header image placeholder */}
      <div className="h-48 w-full animate-pulse rounded-2xl bg-stone-200" />

      {/* Business name + address */}
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-stone-200" />
      </div>

      {/* Price block */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-20 animate-pulse rounded bg-stone-200" />
        <div className="h-5 w-16 animate-pulse rounded bg-stone-200" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-emerald-100" />
      </div>

      {/* Pickup time */}
      <div className="h-4 w-52 animate-pulse rounded bg-stone-200" />

      {/* Stock badge */}
      <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-stone-200" />
      </div>

      {/* Order button */}
      <div className="h-12 w-full animate-pulse rounded-2xl bg-emerald-100" />
    </div>
  );
}
