"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl tracking-[0.15em] uppercase">{t.errors.title}</h1>
      <p className="mt-4 text-parchment-muted">
        {t.errors.text}
      </p>
      <Button className="mt-8" onClick={reset}>
        {t.errors.retry}
      </Button>
    </div>
  );
}
