"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { reassignGenre } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Notice } from "./ui";

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
      <Button type="button" variant="outline" size="sm" disabled={!ready || pending} onClick={() => dialog.current?.showModal()} className="min-h-11">
        Move games
      </Button>
      <dialog ref={dialog} aria-labelledby="move-title" className="m-auto w-[min(28rem,calc(100vw-2rem))] border border-gold-dark/70 bg-[#100d0a] p-0 text-parchment backdrop:bg-black/70" onCancel={(e) => pending && e.preventDefault()}>
        <div className="px-6 py-6">
          <h2 id="move-title" className="font-display text-xl">Move {count} game{count === 1 ? "" : "s"}?</h2>
          <p className="mt-2 text-parchment-muted">Every game in <span className="text-parchment">{from}</span> will be listed under <span className="text-parchment">{to}</span> instead. The shop&apos;s filters update at once.</p>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-iron px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" disabled={pending} onClick={() => dialog.current?.close()} className="min-h-11 border border-iron px-5 font-display-ui text-[0.68rem] hover:border-aged-gold">Cancel</button>
          <button type="button" disabled={pending} onClick={run} className="min-h-11 bg-gold-light px-5 font-display-ui text-[0.68rem] text-ink hover:bg-[#cfab68] disabled:opacity-60">{pending ? "Moving…" : "Move games"}</button>
        </div>
      </dialog>
    </div>
  );
}
