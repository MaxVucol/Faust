"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { reassignGenre } from "@/app/admin/actions";
import { Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useI18n } from "@/components/i18n/I18nProvider";
import { genreLabel } from "@/lib/catalog";
import { useAdminI18n } from "./AdminI18n";
import { btn, dialogActions, dialogBody, dialogFrame, DialogTitle, Notice } from "./ui";

/** Moves every game of one genre to another, after a confirmation that names how many games change. */
export function GenreReassign({ from: fromOptions, to: toOptions }: { from: { name: string; games: number }[]; to: string[] }) {
  const { t } = useAdminI18n();
  const { t: shop } = useI18n();
  const C = t.categories;
  const label = (name: string) => genreLabel(shop.genres, name);
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);
  const count = fromOptions.find((o) => o.name === from)?.games ?? 0;
  const ready = from && to && from !== to && count > 0;

  const run = () =>
    start(async () => {
      const r = await reassignGenre(from, to);
      dialog.current?.close();
      setMessage(r.ok ? { tone: "success", text: r.message ?? t.common.notices.saved } : { tone: "error", text: r.error });
      if (r.ok) {
        setFrom("");
        setTo("");
        router.refresh();
      }
    });

  return (
    <div className="space-y-4 px-5 py-5">
      <p className="text-sm text-parchment-muted">{C.moveHelp}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="genre-from">{C.from}</Label>
          <Select id="genre-from" value={from} disabled={pending} onChange={(e) => setFrom(e.target.value)}>
            <option value="">{t.common.choose}</option>
            {fromOptions.map((o) => <option key={o.name} value={o.name} disabled={o.games === 0}>{label(o.name)} ({o.games})</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="genre-to">{C.to}</Label>
          <Select id="genre-to" value={to} disabled={pending} onChange={(e) => setTo(e.target.value)}>
            <option value="">{t.common.choose}</option>
            {toOptions.filter((n) => n !== from).map((n) => <option key={n} value={n}>{label(n)}</option>)}
          </Select>
        </div>
      </div>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <button type="button" disabled={!ready || pending} onClick={() => dialog.current?.showModal()} className={btn("secondary", "md")}>
        {C.move}
      </button>
      <dialog ref={dialog} aria-labelledby="move-title" className={dialogFrame} onCancel={(e) => pending && e.preventDefault()}>
        <div className={dialogBody}>
          <DialogTitle id="move-title">{C.moveTitle(count)}</DialogTitle>
          <p className="mt-3 text-parchment-muted">{C.moveText(label(from), label(to))}</p>
        </div>
        <div className={dialogActions}>
          <button type="button" disabled={pending} onClick={() => dialog.current?.close()} className={btn("ghost", "md")}>{t.common.cancel}</button>
          <button type="button" disabled={pending} onClick={run} className={btn("primary", "md")}>{pending ? C.moving : C.move}</button>
        </div>
      </dialog>
    </div>
  );
}
