"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { saveSale } from "@/app/admin/actions";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { issuesByPath, saleSchema } from "@/lib/admin/schemas";
import { fromShopInput, toShopInput } from "@/lib/admin/time";
import { mdl, Notice } from "./ui";

type Sale = { gameId: string; variant: number | null; title: string; label: string; price: number; discountPrice: number | null; startsAt: string | null; endsAt: string | null };

/** Edit one sale (a game's own, or a version's) in a dialog; an empty sale price removes the sale. */
export function SaleEditor({ sale }: { sale: Sale }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const initial = { discountPrice: sale.discountPrice == null ? "" : String(sale.discountPrice), startsAt: toShopInput(sale.startsAt), endsAt: toShopInput(sale.endsAt) };
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const id = `sale-${sale.gameId}-${sale.variant ?? "g"}`;
  const p = Number(v.discountPrice.replace(",", "."));
  const percent = v.discountPrice && p >= 0 && p < sale.price ? Math.round(((sale.price - p) / sale.price) * 100) : null;

  const submit = (remove: boolean) => {
    const input = {
      gameId: sale.gameId,
      variant: sale.variant,
      price: sale.price,
      discountPrice: remove || v.discountPrice.trim() === "" ? null : Number(v.discountPrice.replace(",", ".")),
      discountStartsAt: remove || !v.startsAt ? null : (fromShopInput(v.startsAt) ?? "invalid"),
      discountEndsAt: remove || !v.endsAt ? null : (fromShopInput(v.endsAt) ?? "invalid"),
    };
    const local = saleSchema.safeParse(input);
    if (!local.success) {
      setErrors(issuesByPath(local.error));
      return;
    }
    start(async () => {
      const r = await saveSale(input);
      if (!r.ok) {
        setErrors(r.fieldErrors ?? {});
        setError(r.error);
        return;
      }
      ref.current?.close();
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label={`Edit sale: ${sale.title}, ${sale.label}`}
        onClick={() => {
          setV(initial);
          setErrors({});
          setError(null);
          ref.current?.showModal();
        }}
        className="flex size-10 items-center justify-center border border-iron text-parchment-muted transition-colors hover:border-aged-gold hover:text-gold-light"
      >
        <Pencil aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
      <dialog ref={ref} aria-labelledby={`${id}-title`} className="m-auto w-[min(30rem,calc(100vw-2rem))] border border-gold-dark/70 bg-[#100d0a] p-0 text-parchment backdrop:bg-black/70" onCancel={(e) => pending && e.preventDefault()}>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit(false);
          }}
        >
          <div className="space-y-4 px-6 py-6">
            <div>
              <h2 id={`${id}-title`} className="font-display text-xl">{sale.title}</h2>
              <p className="text-sm text-parchment-muted">{sale.label} · price {mdl(sale.price)}</p>
            </div>
            {error && <Notice tone="error">{error}</Notice>}
            <fieldset disabled={pending} className="space-y-4">
              <div>
                <Label htmlFor={`${id}-price`}>Sale price (MDL)</Label>
                <Input id={`${id}-price`} inputMode="decimal" value={v.discountPrice} onChange={(e) => setV((x) => ({ ...x, discountPrice: e.target.value }))} aria-invalid={errors.discountPrice ? true : undefined} />
                <FieldError id={`${id}-price-error`} errors={errors.discountPrice ? [errors.discountPrice] : undefined} />
                {!errors.discountPrice && percent !== null && <p className="mt-1.5 text-sm text-parchment-muted">−{percent}%</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`${id}-start`}>Starts (Chisinau)</Label>
                  <Input id={`${id}-start`} type="datetime-local" value={v.startsAt} onChange={(e) => setV((x) => ({ ...x, startsAt: e.target.value }))} aria-invalid={errors.discountStartsAt ? true : undefined} />
                  <FieldError id={`${id}-start-error`} errors={errors.discountStartsAt ? [errors.discountStartsAt] : undefined} />
                </div>
                <div>
                  <Label htmlFor={`${id}-end`}>Ends (Chisinau)</Label>
                  <Input id={`${id}-end`} type="datetime-local" value={v.endsAt} onChange={(e) => setV((x) => ({ ...x, endsAt: e.target.value }))} aria-invalid={errors.discountEndsAt ? true : undefined} />
                  <FieldError id={`${id}-end-error`} errors={errors.discountEndsAt ? [errors.discountEndsAt] : undefined} />
                </div>
              </div>
            </fieldset>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-iron px-6 py-4 sm:flex-row sm:items-center">
            {sale.discountPrice != null && (
              <button type="button" disabled={pending} onClick={() => submit(true)} className="min-h-11 px-2 text-left font-display-ui text-[0.66rem] text-blood-text hover:underline sm:mr-auto">
                Remove sale
              </button>
            )}
            <button type="button" disabled={pending} onClick={() => ref.current?.close()} className="min-h-11 border border-iron px-5 font-display-ui text-[0.68rem] hover:border-aged-gold sm:ml-auto">
              Cancel
            </button>
            <button type="submit" disabled={pending} className="min-h-11 bg-gold-light px-5 font-display-ui text-[0.68rem] text-ink hover:bg-[#cfab68] disabled:opacity-60">
              {pending ? "Saving…" : "Save sale"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
