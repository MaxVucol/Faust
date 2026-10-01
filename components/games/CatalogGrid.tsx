"use client";

import { Fragment, useRef, useState, useTransition, type ReactNode } from "react";
import { loadMoreGames } from "@/app/produse/actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";

/**
 * The catalogue grid with "Load more": the first batch comes with the page; each click appends the
 * next one below it (same filters, sort and search, rendered on the server), without changing the URL.
 * The button stays focused while loading (aria-disabled rather than disabled, which would drop focus)
 * and disappears after the last batch.
 */
export function CatalogGrid({ children, query, pages: initialPages }: { children: ReactNode; query: string; pages: number }) {
  const { t } = useI18n();
  const [batches, setBatches] = useState<ReactNode[]>([]);
  const [pages, setPages] = useState(initialPages);
  const [pending, startTransition] = useTransition();
  // Guards against a second request while one is running (fast double clicks, Enter held down).
  const busy = useRef(false);
  const shown = 1 + batches.length;

  const loadMore = () => {
    if (busy.current || shown >= pages) return;
    busy.current = true;
    startTransition(async () => {
      try {
        const next = await loadMoreGames(query, shown + 1);
        setBatches((b) => [...b, next.items]);
        setPages(next.pages);
      } catch (error) {
        // The button stays, so the visitor can simply try again.
        console.error("load more failed", error);
      } finally {
        busy.current = false;
      }
    });
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3 min-[87.5rem]:grid-cols-4 3xl:grid-cols-5">
        {children}
        {batches.map((items, i) => (
          <Fragment key={i}>{items}</Fragment>
        ))}
      </ul>
      {shown < pages && (
        <div className="mt-12 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={loadMore}
            aria-disabled={pending || undefined}
            aria-busy={pending || undefined}
            className="min-w-56 aria-disabled:cursor-wait aria-disabled:opacity-60"
          >
            {pending ? t.catalog.loadingMore : t.catalog.loadMore}
          </Button>
        </div>
      )}
    </>
  );
}
