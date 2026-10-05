export default function ArtworkSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
        >
          <div className="aspect-[4/5] animate-pulse bg-white/[0.08]" />

          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.08]" />

            <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />

            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-14 animate-pulse rounded bg-white/[0.08]" />

              <div className="h-8 w-20 animate-pulse rounded-full bg-white/[0.06]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}