import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8" aria-busy="true" aria-label="Se încarcă jocurile">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="mt-3 h-5 w-24" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="border border-iron">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
