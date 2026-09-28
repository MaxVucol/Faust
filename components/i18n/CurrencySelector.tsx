"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { HeaderDropdown } from "@/components/ui/HeaderDropdown";
import { CURRENCIES, type Currency } from "@/lib/currency";
import { setCurrency } from "@/lib/i18n/actions";
import { useI18n } from "./I18nProvider";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; align?: "left" | "right" };

export function CurrencySelector({ open, onOpenChange, align }: Props) {
  const { currency, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const choose = (next: Currency) =>
    startTransition(async () => {
      await setCurrency(next);
      router.refresh();
    });

  return (
    <HeaderDropdown
      value={currency}
      options={CURRENCIES.map((code) => ({ value: code, label: `${code} — ${t.currencies[code]}` }))}
      onChange={choose}
      buttonLabel={currency}
      ariaLabel={`${t.nav.currency}: ${t.currencies[currency]}`}
      listLabel={t.nav.currency}
      open={open}
      onOpenChange={onOpenChange}
      pending={pending}
      align={align}
    />
  );
}
