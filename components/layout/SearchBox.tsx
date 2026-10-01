"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { SearchSuggestion } from "@/app/api/search/route";
import { useI18n } from "@/components/i18n/I18nProvider";
import { genreLabel, platformShort } from "@/lib/catalog";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";

/**
 * Header search with live suggestions (an ARIA combobox). Typing two or more characters asks
 * /api/search for up to six games — by title, genre or platform. Arrow keys move through the
 * suggestions, Enter opens the highlighted game or the full results page, Escape closes the list
 * and then the search bar. `onClose(returnFocus)`: true when closed from the keyboard, so the caller can
 * put focus back on the button that opened it; false when a result is opened (the page changes).
 */
export function SearchBox({ onClose }: { onClose: (returnFocus: boolean) => void }) {
  const { t, currency } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [active, setActive] = useState(-1);
  const [listOpen, setListOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const query = q.trim();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced fetch; an aborted request never overwrites a newer one.
  useEffect(() => {
    if (query.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!res.ok) throw new Error(String(res.status));
        const data: { results: SearchSuggestion[] } = await res.json();
        setResults(data.results);
        setActive(-1);
        setStatus("done");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const showList = listOpen && query.length >= 2 && status !== "idle";
  const go = (href: string) => {
    onClose(false);
    router.push(href);
  };
  const allResultsHref = `/produse?q=${encodeURIComponent(query)}`;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setListOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) go(`/produse/${results[active].slug}`);
      else if (query) go(allResultsHref);
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (showList) setListOpen(false);
      else onClose(true);
    }
  };

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="flex items-center gap-3 border border-iron bg-base px-4 transition-colors duration-200 focus-within:border-aged-gold">
        <Search aria-hidden className="size-4 shrink-0 text-parchment-muted" />
        <label htmlFor="q-nav" className="sr-only">
          {t.nav.searchLabel}
        </label>
        <input
          ref={inputRef}
          id="q-nav"
          type="search"
          role="combobox"
          autoComplete="off"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setListOpen(true);
            if (e.target.value.trim().length < 2) {
              setResults([]);
              setStatus("idle");
            }
          }}
          onKeyDown={onKeyDown}
          placeholder={t.nav.searchPlaceholder}
          className="h-12 w-full bg-transparent text-base text-parchment outline-none placeholder:text-parchment-muted/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button
            type="button"
            aria-label={t.nav.searchClear}
            onClick={() => {
              setQ("");
              setResults([]);
              setStatus("idle");
              inputRef.current?.focus();
            }}
            className="text-parchment-muted hover:text-gold-light"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showList && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 border border-gold-dark/40 bg-[#0a0907] shadow-[0_10px_24px_rgb(0_0_0/0.55)]">
          <ul id={listId} role="listbox" aria-label={t.nav.searchSuggestions}>
            {results.map((r, i) => (
              <li
                key={r.slug}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(`/produse/${r.slug}`)}
                className={cn(
                  "flex cursor-pointer items-center gap-4 border-b border-iron/60 px-4 py-3 last:border-b-0",
                  i === active && "bg-white/[0.04]",
                )}
              >
                <span className="relative aspect-[3/4] w-10 shrink-0 overflow-hidden border border-iron">
                  <Image src={r.coverImage} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate font-display text-base", i === active ? "text-gold-light" : "text-parchment")}>
                    {r.title}
                  </span>
                  <span className="block truncate text-sm text-parchment-muted">
                    {r.genres.map((g) => genreLabel(t.genres, g)).join(" · ")}
                    <span aria-hidden className="px-2">
                      |
                    </span>
                    {r.platforms.map(platformShort).join(" · ")}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  {r.oldPrice !== null && <s className="block text-xs text-parchment-muted">{formatMoney(r.oldPrice, currency)}</s>}
                  <span className="text-aged-gold">{formatMoney(r.price, currency)}</span>
                </span>
              </li>
            ))}
          </ul>

          {status === "loading" && results.length === 0 && (
            <p role="status" className="px-4 py-5 text-parchment-muted">
              {t.nav.searchLoading}
            </p>
          )}
          {status === "done" && results.length === 0 && (
            <div className="px-4 py-5" role="status">
              <p className="text-parchment">{t.nav.searchNoResults(query)}</p>
              <p className="mt-1 text-sm text-parchment-muted">{t.nav.searchNoResultsHint}</p>
            </div>
          )}
          {status === "error" && (
            <p role="alert" className="px-4 py-5 text-stock-out">
              {t.nav.searchError}
            </p>
          )}
          {results.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(allResultsHref)}
              className="flex w-full items-center justify-between border-t border-iron px-4 py-3 font-display-ui text-[0.72rem] text-aged-gold hover:text-gold-light"
            >
              {t.nav.searchSeeAll(query)}
              <ArrowRight aria-hidden className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
