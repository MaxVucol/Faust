"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { PanelOffer } from "@/lib/purchase";
import { cn } from "@/lib/utils";

export const offerLabel = (o: Pick<PanelOffer, "platform" | "edition">) => (o.edition ? `${o.platform} · ${o.edition}` : o.platform);

/**
 * Version (platform) choice, shared by the product page's purchase card and the home cards' "Add to
 * cart" dialog. Native radios: arrow keys move between versions, and the choice is announced.
 */
export function PlatformPicker({ offers, index, onChange }: { offers: PanelOffer[]; index: number; onChange: (index: number) => void }) {
  const { t } = useI18n();
  const g = t.game;
  const groupId = useId();
  return (
    <fieldset>
      <legend id={groupId} className="mb-3 font-display-ui text-[0.7rem] text-parchment-muted">
        {offers.length > 1 ? g.choosePlatform : g.platform}
      </legend>
      <div className="flex flex-wrap gap-2">
        {offers.map((o, i) => (
          <label
            key={offerLabel(o)}
            className={cn(
              "relative flex min-h-11 cursor-pointer items-center gap-2 border px-4 text-base transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-parchment",
              i === index ? "border-aged-gold bg-aged-gold/10 text-gold-light" : "border-iron text-parchment hover:border-parchment-muted",
              !o.inStock && "text-parchment-muted",
            )}
          >
            <input type="radio" name={`${groupId}-platform`} checked={i === index} onChange={() => onChange(i)} className="sr-only" />
            {i === index && <Check aria-hidden className="size-4" />}
            {offerLabel(o)}
            {!o.inStock && <span className="text-sm">({g.outOfStock.toLowerCase()})</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
