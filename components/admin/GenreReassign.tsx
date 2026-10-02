"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { reassignGenre } from "@/app/admin/actions";
import { Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { btn, dialogActions, dialogBody, dialogFrame, DialogTitle, Notice } from "./ui";

/** Moves every game of one genre to another, after a confirmation that names how many games change. */
export function GenreReassign({ from: fromOptions, to: toOptions }: { from: { name: string; games: number }[]; to: string[] }) {
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
      setMessage(r.ok ? { tone: "success", text: r.message ?? "Done." } : { tone: "error", text: r.error });
      if (r.ok) {
        setFrom("");
        setTo("");
        router.refresh();
      }
    });

  return (
    <div className="space-y-4 px-5 py-5">
      <p className="text-sm text-parchment-muted">Moves the games of one genre into another, e.g. to merge two genres. Games that already have the target genre keep it once.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="genre-from">Move games from</Label>
          <Select id="genre-from" value={from} disabled={pending} onChange={(e) => setFrom(e.target.value)}>
            <option value="">Choose…</option>
            {fromOptions.map((o) => <option key={o.name} value={o.name} disabled={o.games === 0}>{o.name} ({o.games})</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="genre-to">to</Label>
          <Select id="genre-to" value={to} disabled={pending} onChange={(e) => setTo(e.target.value)}>
            <option value="">Choose…</option>
            {toOptions.filter((n) => n !== from).map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
        </div>
      </div>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <button type="button" disabled={!ready || pending} onClick={() => dialog.current?.showModal()} className={btn("secondary", "md")}>
        Move games
      </button>
      <dialog ref={dialog} aria-labelledby="move-title" className={dialogFrame} onCancel={(e) => pending && e.preventDefault()}>
        <div className={dialogBody}>
          <DialogTitle id="move-title">Move {count} game{count === 1 ? "" : "s"}?</DialogTitle>
          <p className="mt-3 text-parchment-muted">Every game in <span className="text-parchment">{from}</span> will be listed under <span className="text-parchment">{to}</span> instead. The shop&apos;s filters update at once.</p>
        </div>
        <div className={dialogActions}>
          <button type="button" disabled={pending} onClick={() => dialog.current?.close()} className={btn("ghost", "md")}>Cancel</button>
          <button type="button" disabled={pending} onClick={run} className={btn("primary", "md")}>{pending ? "Moving…" : "Move games"}</button>
        </div>
      </dialog>
    </div>
  );
}
