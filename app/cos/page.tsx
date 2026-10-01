import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { Corners, OrnateDivider } from "@/components/ui/Ornaments";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.cart.metaTitle, robots: { index: false } };
}

/**
 * The cart as one "ledger": a solid near-black panel in a double frame of dark gold and iron, so the
 * hall artwork behind the page stays a backdrop around it instead of competing with the order.
 */
export default async function CartPage() {
  const t = await getDictionary();
  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-14 lg:px-8">
      <div className="relative border border-gold-dark/70 bg-[#0b0907] p-1.5 sm:p-2">
        <Corners />
        <div className="border border-iron/80 bg-[#0d0b09]">
          <header className="px-5 pt-9 pb-7 text-center sm:px-10 sm:pt-12 sm:pb-9">
            <h1 className="font-display text-3xl font-semibold tracking-[0.18em] text-parchment uppercase sm:text-[2.6rem]">{t.cart.title}</h1>
            <p className="mt-3 font-editorial text-lg text-parchment-muted italic sm:text-xl">{t.cart.subtitle}</p>
            <OrnateDivider className="mx-auto mt-7 max-w-md" />
          </header>
          <CartView />
        </div>
      </div>
    </div>
  );
}
