import { Skeleton } from "@/components/ui/Skeleton";

/** The shape of a panel page (title, figures, a large panel) while its data loads. */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-64 max-w-full" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-5 h-px bg-gold-dark/30" />
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 border border-gold-dark/20" />
        ))}
      </div>
      <Skeleton className="mt-6 h-96 border border-gold-dark/20" />
    </div>
  );
}
