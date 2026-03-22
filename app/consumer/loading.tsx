// Skeleton shown instantly while /consumer page data loads (React Suspense streaming)
export default function ConsumerLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
      {/* Search / filter bar skeleton */}
      <div className="flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-xl bg-stone-200" />
        <div className="h-10 w-20 animate-pulse rounded-xl bg-stone-200" />
      </div>

      {/* Category pill row skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-stone-200" />
        ))}
      </div>

      {/* Box cards skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 space-y-3"
        >
          {/* Business name + distance */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 animate-pulse rounded bg-stone-200" />
            <div className="h-4 w-12 animate-pulse rounded bg-stone-200" />
          </div>
          {/* Category badge + price */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-stone-200" />
            <div className="h-6 w-16 animate-pulse rounded bg-stone-200" />
          </div>
          {/* Pickup time */}
          <div className="h-3 w-40 animate-pulse rounded bg-stone-200" />
          {/* CTA */}
          <div className="h-10 w-full animate-pulse rounded-xl bg-emerald-100" />
        </div>
      ))}
    </div>
  );
}
