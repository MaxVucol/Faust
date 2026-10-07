import { Globe, KeyRound, LifeBuoy, ReceiptText } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

const ICONS = [KeyRound, ReceiptText, Globe, LifeBuoy];

/**
 * "Why The Iron Vault": four short facts about how the shop actually works (keys by email after payment
 * is confirmed, nothing charged on the site, the region shown when known, support within a business day),
 * as a quiet ruled strip under the hero rather than big cards.
 */
export async function WhyVault() {
  const t = await getDictionary();
  return (
    <section aria-labelledby="de-ce" className="border-y border-gold-dark/40 bg-[#0b0907]/90">
      <h2 id="de-ce" className="sr-only">
        {t.home.whyTitle}
      </h2>
      <ul className="grid divide-iron/70 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
        {t.home.why.map((item, i) => {
          const Icon = ICONS[i] ?? KeyRound;
          return (
            <li key={item.title} className="flex gap-4 border-iron/70 px-1 py-5 max-sm:not-last:border-b sm:px-5 sm:max-lg:[&:nth-child(-n+2)]:border-b lg:py-6">
              <Icon aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-gold-light" />
              <div>
                <h3 className="font-display-ui text-[0.68rem] tracking-[0.18em] text-parchment">{item.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-snug text-parchment-muted">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
