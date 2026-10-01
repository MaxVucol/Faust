"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { PanelOffer } from "@/lib/purchase";
import { cn } from "@/lib/utils";

export const offerLabel = (o: Pick<PanelOffer, "platform" | "edition">) => (o.edition ? `${o.platform} · ${o.edition}` : o.platform);

type PlatformPickerProps = {
  offers: PanelOffer[];
  index: number;
  onChange: (index: number) => void;
  /**
   * "inline" (product page): options side by side. "stacked" (purchase dialog): one full-width row per
   * version with a square check box, the chosen one framed in antique gold.
   */
  layout?: "inline" | "stacked";
};

/**
 * Version (platform) choice, shared by the product page's purchase card and the "Add to cart" dialog
 * of the home and catalogue cards. Native radios: arrow keys move between versions, and the choice is
 * announced.
 */
export function PlatformPicker({ offers, index, onChange, layout = "inline" }: PlatformPickerProps) {
  const { t } = useI18n();
  const g = t.game;
  const groupId = useId();
  const stacked = layout === "stacked";
  return (
    <fieldset>
      <legend id={groupId} className={cn("mb-3 font-display-ui text-[0.7rem]", stacked ? "text-aged-gold" : "text-parchment-muted")}>
        {offers.length > 1 ? g.choosePlatform : g.platform}
      </legend>
      <div className={stacked ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
        {offers.map((o, i) => {
          const chosen = i === index;
          return (
            <label
              key={offerLabel(o)}
              className={cn(
                "relative flex cursor-pointer items-center border text-base transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-parchment",
                stacked ? "min-h-12 w-full gap-3.5 px-4" : "min-h-11 gap-2 px-4",
                chosen
                  ? stacked
                    ? "border-gold-light bg-gold-light/[0.07] text-gold-light"
                    : "border-aged-gold bg-aged-gold/10 text-gold-light"
                  : stacked
                    ? "border-iron bg-[#100d0a] text-parchment hover:border-parchment-muted"
                    : "border-iron text-parchment hover:border-parchment-muted",
                !o.inStock && "text-parchment-muted",
              )}
            >
              <input type="radio" name={`${groupId}-platform`} checked={chosen} onChange={() => onChange(i)} className="sr-only" />
              {stacked ? (
                // A square box, ticked when chosen: the state reads from the frame, the tick and the colour.
                <span aria-hidden className={cn("flex size-4 shrink-0 items-center justify-center border", chosen ? "border-gold-light" : "border-parchment-muted/50")}>
                  {chosen && <Check strokeWidth={3} className="size-3" />}
                </span>
              ) : (
                chosen && <Check aria-hidden className="size-4" />
              )}
              <span className={cn(stacked && "tracking-[0.02em]")}>{offerLabel(o)}</span>
              {!o.inStock && <span className={cn("text-sm", stacked && "ml-auto")}>({g.outOfStock.toLowerCase()})</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
