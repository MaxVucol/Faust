"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/app/admin/actions";
import { useAdminI18n } from "./AdminI18n";
import { btn, dialogActions, dialogBody, dialogFrame, DialogTitle } from "./ui";

/**
 * A delete button that asks first ("Are you sure you want to delete this?") in a modal dialog, then runs
 * `action`. While it runs both buttons are disabled; a refusal or error is shown in the dialog. On
 * success it goes to `redirectTo` (or refreshes the page).
 */
export function ConfirmDelete({
  action,
  name,
  redirectTo,
  label,
  compact = false,
}: {
  action: () => Promise<ActionResult>;
  name: string;
  redirectTo?: string;
  label?: string;
  compact?: boolean;
}) {
  const { t } = useAdminI18n();
  const text = label ?? t.common.delete;
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
        aria-label={compact ? `${text}: ${name}` : undefined}
        className={btn("danger", compact ? "icon" : "sm")}
      >
        <Trash2 aria-hidden className="size-4" strokeWidth={1.75} />
        {!compact && text}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="confirm-title"
        className={dialogFrame}
        onCancel={(e) => pending && e.preventDefault()}
      >
        <div className={dialogBody}>
          <DialogTitle id="confirm-title">{t.confirmDelete.title}</DialogTitle>
          <p className="mt-3 text-parchment-muted">{t.confirmDelete.text(name)}</p>
          {error && (
            <p role="alert" className="mt-4 border-l-2 border-blood-text pl-3 text-blood-text">
              {error}
            </p>
          )}
        </div>
        <div className={dialogActions}>
          <button type="button" disabled={pending} onClick={() => ref.current?.close()} className={btn("ghost", "md")}>
            {t.common.cancel}
          </button>
          <button type="button" disabled={pending} onClick={confirm} className={btn("danger-solid", "md")}>
            {pending ? t.common.deleting : t.common.delete}
          </button>
        </div>
      </dialog>
    </>
  );
}
