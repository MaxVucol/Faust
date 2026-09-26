import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Coș",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">Coșul tău</h1>
      <CartView />
    </div>
  );
}
