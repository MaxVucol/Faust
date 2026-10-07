"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSuggestions, type Suggestion } from "@/app/cos/actions";
import { GameImage } from "@/components/games/GameImage";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Diamond } from "@/components/ui/Ornaments";
import { formatMoney } from "@/lib/currency";
import { useCart } from "@/lib/use-cart";

/**
 * "You may also like", under the cart ledger: up to four related games (app/cos/actions.ts), asked for
 * once per change of the cart's games. Nothing is shown for an empty cart or when there is nothing to
 * suggest; a failed request just leaves it out.
 */
export function CartSuggestions() {
  const { t, currency } = useI18n();
  const { items } = useCart();
  const slugs = [...new Set(items.map((i) => i.slug))].sort().join(" ");
  const [result, setResult] = useState<{ for: string; list: Suggestion[] }>({ for: "", list: [] });

  useEffect(() => {
    if (!slugs) return;
    let cancelled = false;
    getSuggestions(slugs.split(" "))
      .then((list) => !cancelled && setResult({ for: slugs, list }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slugs]);

  const list = result.for === slugs ? result.list : [];
  if (!slugs || list.length === 0) return null;
  return (
    <section aria-labelledby="poate-iti-place" className="mt-10">
      <h2 id="poate-iti-place" className="flex items-center gap-2.5 border-b border-gold-dark/50 pb-3 font-display-ui text-[0.72rem] text-gold-light">
        <Diamond className="size-1.5 bg-gold-dark" />
        {t.cart.alsoLike}
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {list.map((g) => (
          <li key={g.slug}>
            <Link prefetch={false} href={`/produse/${g.slug}`} className="group flex h-full gap-3 border border-iron bg-[#0d0b09] p-3 transition-colors duration-200 hover:border-gold-dark">
              <span className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden border border-iron sm:w-16">
                <GameImage src={g.coverImage} alt="" sizes="64px" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="line-clamp-2 font-display text-sm tracking-[0.06em] uppercase transition-colors duration-200 group-hover:text-gold-light">{g.title}</span>
                <span className="mt-1 text-xs text-parchment-muted">{g.platforms.join(" · ")}</span>
                <span className="mt-auto pt-2 font-display text-base font-semibold text-gold-light tabular-nums">
                  {g.oldPrice !== null && (
                    <s className="mr-2 text-xs font-normal text-parchment-muted">
                      <span className="sr-only">{t.game.oldPrice} </span>
                      {formatMoney(g.oldPrice, currency)}
                    </s>
                  )}
                  {formatMoney(g.price, currency)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
