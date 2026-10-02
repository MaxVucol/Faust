"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

/**
 * A delete button that asks first ("Are you sure you want to delete this?") in a modal dialog, then runs
 * `action`. While it runs both buttons are disabled; a refusal or error is shown in the dialog. On
 * success it goes to `redirectTo` (or refreshes the page).
 */
export function ConfirmDelete({
  action,
  name,
  redirectTo,
  label = "Delete",
  compact = false,
}: {
  action: () => Promise<ActionResult>;
  name: string;
  redirectTo?: string;
  label?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => setError(null);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const confirm = () =>
    start(async () => {
      setError(null);
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      ref.current?.close();
      if (redirectTo) router.push(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}notice=deleted`);
      else router.refresh();
    });

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={compact ? `${label} ${name}` : undefined}
        className={cn(
          "inline-flex min-h-10 items-center gap-2 border border-blood/70 font-display-ui text-[0.66rem] text-blood-text transition-colors hover:border-blood-text hover:bg-blood/15",
          compact ? "min-w-10 justify-center px-2" : "px-4",
        )}
      >
        <Trash2 aria-hidden className="size-4" strokeWidth={1.75} />
        {!compact && label}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="confirm-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] border border-gold-dark/70 bg-[#100d0a] p-0 text-parchment backdrop:bg-black/70"
        onCancel={(e) => pending && e.preventDefault()}
      >
        <div className="px-6 py-6">
          <h2 id="confirm-title" className="font-display text-xl tracking-[0.06em]">
            Are you sure you want to delete this?
          </h2>
          <p className="mt-2 text-parchment-muted">
            <span className="text-parchment">{name}</span> will be removed permanently. This can&apos;t be undone.
          </p>
          {error && (
            <p role="alert" className="mt-4 border-l-2 border-blood-text pl-3 text-blood-text">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-iron px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" disabled={pending} onClick={() => ref.current?.close()} className="min-h-11 border border-iron px-5 font-display-ui text-[0.68rem] transition-colors hover:border-aged-gold disabled:opacity-50">
            Cancel
          </button>
          <button type="button" disabled={pending} onClick={confirm} className="min-h-11 bg-blood px-5 font-display-ui text-[0.68rem] text-parchment transition-colors hover:bg-blood-hover disabled:cursor-wait disabled:opacity-60">
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
