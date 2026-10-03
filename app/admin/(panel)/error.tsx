"use client";

import { TriangleAlert } from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { btn, Notice, Panel } from "@/components/admin/ui";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useAdminI18n();
  return (
    <Panel className="max-w-xl">
      <div className="space-y-5 px-6 py-7">
        <h1 className="flex items-center gap-3 font-display text-2xl tracking-[0.1em] text-parchment uppercase">
          <TriangleAlert aria-hidden className="size-5 text-blood-text" strokeWidth={1.5} />
          {t.error.title}
        </h1>
        <Notice tone="error">{t.error.text}</Notice>
        <button type="button" onClick={reset} className={btn("secondary", "md")}>
          {t.error.retry}
        </button>
      </div>
    </Panel>
  );
}
