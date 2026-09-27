import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.cart.metaTitle, robots: { index: false } };
}

export default async function CartPage() {
  const t = await getDictionary();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">{t.cart.title}</h1>
      <CartView />
    </div>
  );
}
