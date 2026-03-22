// Skeleton shown instantly while merchant dashboard loads
export default function MerchantLoading() {
  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-stone-200" />
            <div className="h-7 w-10 animate-pulse rounded bg-stone-200" />
          </div>
        ))}
      </div>

      {/* Weekly chart skeleton */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
        <div className="flex items-end gap-2 h-16">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 animate-pulse rounded-t bg-emerald-100"
              style={{ height: `${30 + Math.random() * 50}%` }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-3 animate-pulse rounded bg-stone-200" />
          ))}
        </div>
      </div>

      {/* Quick-publish box skeleton */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-3">
        <div className="h-4 w-40 animate-pulse rounded bg-stone-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-emerald-100" />
      </div>
    </div>
  );
}
