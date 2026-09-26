"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/use-cart";

export function CartView() {
  const { items, total, setQuantity, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="border border-iron bg-surface px-6 py-16 text-center">
        <p className="text-parchment-muted">Coșul este gol.</p>
        <ButtonLink href="/produse" className="mt-6">
          Vezi jocurile
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <ul className="border-t border-iron">
        {items.map((item) => (
          <li key={item.slug} className="flex gap-4 border-b border-iron py-5">
            <div className="relative aspect-[3/4] w-20 shrink-0 border border-iron">
              <Image src={item.coverImage} alt="" fill sizes="80px" className="object-cover saturate-[0.85]" />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <Link href={`/produse/${item.slug}`} className="font-display text-sm font-semibold tracking-[0.1em] uppercase hover:text-aged-gold">
                  {item.title}
                </Link>
                <p className="text-sm text-aged-gold">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  aria-label={`Scade cantitatea pentru ${item.title}`}
                  onClick={() => setQuantity(item.slug, item.quantity - 1)}
                  className="border border-iron p-2 hover:border-aged-gold"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center" aria-label="Cantitate">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Crește cantitatea pentru ${item.title}`}
                  onClick={() => setQuantity(item.slug, item.quantity + 1)}
                  className="border border-iron p-2 hover:border-aged-gold"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-iron bg-surface p-6">
        <p className="font-display-ui text-[0.7rem] text-parchment-muted">Total</p>
        <p className="mt-1 font-display text-2xl text-aged-gold">{formatPrice(total)}</p>
        <Divider className="my-6" />
        <Button className="w-full" disabled title="Plata online nu este încă disponibilă">
          Finalizează comanda
        </Button>
        <p className="mt-3 text-sm text-parchment-muted">Plata online va fi disponibilă în curând.</p>
        <button type="button" onClick={clear} className="mt-6 font-display-ui text-[0.65rem] text-parchment-muted hover:text-parchment">
          Golește coșul
        </button>
      </aside>
    </div>
  );
}
