"use client";

import { Notice } from "@/components/admin/ui";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-xl space-y-5">
      <h1 className="font-display text-2xl tracking-[0.1em] uppercase">Something went wrong</h1>
      <Notice tone="error">This section couldn&apos;t be loaded. Nothing was changed.</Notice>
      <button type="button" onClick={reset} className="min-h-11 border border-gold-dark/80 px-5 font-display-ui text-[0.68rem] text-gold-light hover:border-gold-light">
        Try again
      </button>
    </div>
  );
}
